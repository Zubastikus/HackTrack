import { useState } from 'react';
import api from '../api/api';

export default function ImportButton({ endpoint, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert('Выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);

      const res = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(`Импортировано: ${res.data.count}`);

      setFile(null);
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      alert('Ошибка импорта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">

      <label
        className="
          inline-flex items-center gap-2
          px-4 py-2 rounded-xl
          border border-slate-300
          bg-white
          hover:bg-slate-50
          cursor-pointer
          transition
          shadow-sm
        "
      >
        📁 Выбрать файл

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      {file && (
        <span className="text-sm text-slate-600">
          {file.name}
        </span>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="
          inline-flex items-center gap-2
          px-5 py-2.5 rounded-xl
          bg-emerald-600 text-white font-medium
          hover:bg-emerald-700
          disabled:bg-slate-300
          disabled:cursor-not-allowed
          shadow-sm hover:shadow
          transition
        "
      >
        {loading ? 'Загрузка...' : 'Импорт'}
      </button>

    </div>
  );
}