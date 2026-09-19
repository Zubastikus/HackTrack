import { useEffect, useState } from 'react';
import api from '../api/api';
import ImportButton from '../components/ImportButton';

export default function Tracks() {
  const [tracks, setTracks] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    responsible: '',
  });

  const [filters, setFilters] = useState({
    search: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 📥 загрузка
  const loadTracks = () => {
    api.get('/tracks')
      .then(res => setTracks(res.data))
      .catch(console.error);
  };

  const fetchTracks = () => {
    api.get('/tracks', {
      params: {
        search: filters.search || undefined,
      },
    })
      .then(res => setTracks(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadTracks();
    fetchTracks();
  }, []);

  // 🔧 form change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ➕ submit / edit
  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const request = editingId
      ? api.patch(`/tracks/${editingId}`, form)
      : api.post('/tracks', form);

    request
      .then(() => {
        setSuccess(editingId ? 'Трек обновлён' : 'Трек создан');
        setEditingId(null);

        loadTracks();

        setForm({
          name: '',
          description: '',
          responsible: '',
        });
      })
      .catch(err => {
        console.error(err);

        if (err.response?.status === 409) {
          setError('Трек с таким названием уже существует');
        } else {
          setError('Ошибка при сохранении');
        }
      });
  };

  // ✏️ edit
  const handleEdit = (t) => {
    setForm({
      name: t.name || '',
      description: t.description || '',
      responsible: t.responsible || '',
    });

    setEditingId(t.id);
    setShowForm(true);
  };

  // ❌ delete
  const handleDelete = (id) => {
    setError('');
    setSuccess('');

    if (!window.confirm('Удалить трек?')) return;

    api.delete(`/tracks/${id}`)
      .then(() => {
        setSuccess('Трек удалён');
        loadTracks();
      })
      .catch(err => {
        console.error(err);

        if (err.response?.status === 500) {
          setError('Нельзя удалить трек: он используется в командах');
        } else {
          setError('Ошибка при удалении');
        }
      });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Треки
          </h1>

          <p className="text-gray-500 mt-1">
            Управление треками хакатона
          </p>
        </div>

        <ImportButton
          endpoint="/import/tracks"
          onSuccess={loadTracks}
        />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingId ? 'Редактирование трека' : 'Добавление трека'}
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="
              px-4 py-2 rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700
              transition
            "
          >
            {showForm
              ? 'Скрыть форму'
              : editingId
                ? 'Редактировать трек'
                : 'Добавить трек'}
          </button>
        </div>

        {showForm && (
          <div className="mt-6">

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="name"
                placeholder="Название трека"
                value={form.name}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="responsible"
                placeholder="Представитель (при наличии)"
                value={form.responsible}
                onChange={handleChange}
              />

              <div className="lg:col-span-3 flex gap-3">

                <button
                  type="submit"
                  className="
                    px-5 py-2 rounded-xl
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    transition
                  "
                >
                  {editingId ? 'Сохранить' : 'Добавить'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);

                      setForm({
                        name: '',
                        description: '',
                        responsible: '',
                      });
                    }}
                    className="
                      px-5 py-2 rounded-xl
                      bg-gray-200
                      hover:bg-gray-300
                      transition
                    "
                  >
                    Отмена
                  </button>
                )}

              </div>

            </form>

          </div>
        )}

      </div>

      {/* FILTERS */}
      <div className="px-3 pt-3">

        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">
          Фильтры
        </h2>

        <div className="flex flex-wrap items-center gap-3">

          <input
            className="
              h-10 border rounded-lg px-3
              bg-white text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
            placeholder="Поиск по названию"
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />

          <button
            onClick={fetchTracks}
            className="
              h-10 px-4 rounded-lg
              bg-slate-800 text-white
              text-sm font-medium
              hover:bg-slate-900
              transition
            "
          >
            Применить
          </button>

        </div>

      </div>

      {/* ALERTS */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700">
                Название
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Описание
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Ответственный
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Действия
              </th>
            </tr>
          </thead>

          <tbody>

            {tracks.map(t => (
              <tr
                key={t.id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="p-3 font-medium">
                  {t.name}
                </td>

                <td className="p-3 max-w-[400px]">
                  {t.description}
                </td>

                <td className="p-3">
                  {t.responsible}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">

                    <button
                      onClick={() => handleEdit(t)}
                      className="
                        px-3 py-1 rounded-lg
                        bg-amber-400
                        hover:bg-amber-500
                        transition
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(t.id)}
                      className="
                        px-3 py-1 rounded-lg
                        bg-red-500 text-white
                        hover:bg-red-600
                        transition
                      "
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}