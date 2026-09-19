import { useEffect, useState } from 'react';
import api from '../api/api';
import ImportButton from '../components/ImportButton';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [tracks, setTracks] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: '',
    projectName: '',
    description: '',
    folderLink: '',
    designLink: '',
    devLink: '',
    managerLink: '',
    track: '',
  });

  const [filters, setFilters] = useState({
    search: '',
    track: '',
  });

  // 📥 загрузка
  const loadTeams = () => {
    api.get('/teams')
      .then(res => setTeams(res.data))
      .catch(console.error);
  };

  const loadTracks = () => {
    api.get('/tracks')
      .then(res => setTracks(res.data))
      .catch(console.error);
  };

  const fetchTeams = () => {
    api.get('/teams', {
      params: {
        search: filters.search || undefined,
        track: filters.track || undefined,
      },
    })
      .then(res => setTeams(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadTeams();
    loadTracks();
    fetchTeams();
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

    const payload = {
      ...form,
      track: form.track ? { id: Number(form.track) } : null,
    };

    const request = editingId
      ? api.patch(`/teams/${editingId}`, payload)
      : api.post('/teams', payload);

    request
      .then(() => {
        setSuccess(editingId ? 'Команда обновлена' : 'Команда создана');
        setEditingId(null);
        loadTeams();
      })
      .catch(err => {
        console.error(err);

        if (err.response?.status === 400) {
          setError('Некорректные данные');
        } else if (err.response?.status === 409) {
          setError('Команда с таким названием уже существует');
        } else {
          setError('Ошибка при сохранении');
        }
      });

    setForm({
      name: '',
      type: '',
      projectName: '',
      description: '',
      folderLink: '',
      designLink: '',
      devLink: '',
      managerLink: '',
      track: '',
    });
  };

  // ✏️ edit
  const handleEdit = (t) => {
    setForm({
      name: t.name || '',
      type: t.type || '',
      projectName: t.projectName || '',
      description: t.description || '',
      folderLink: t.folderLink || '',
      designLink: t.designLink || '',
      devLink: t.devLink || '',
      managerLink: t.managerLink || '',
      track: t.track?.id || '',
    });

    setEditingId(t.id);
    setShowForm(true);
  };

  // ❌ delete
    const handleDelete = (id) => {
    setError('');
    setSuccess('');

    if (!window.confirm('Удалить команду?')) return;

    api.delete(`/teams/${id}`)
      .then(() => {
        setSuccess('Команда удалена');
        loadTeams();
      })
      .catch(err => {
        console.error(err);

        if (err.response?.status === 500) {
          setError('Нельзя удалить команду: в ней есть участники');
        } else if (err.response?.status === 403) {
          setError('Нет доступа');
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
            Команды
          </h1>

          <p className="text-gray-500 mt-1">
            Управление командами хакатона
          </p>
        </div>

        <ImportButton
          endpoint="/import/teams"
          onSuccess={loadTeams}
        />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingId ? 'Редактирование команды' : 'Добавление команды'}
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
            {showForm ? 'Скрыть форму' : editingId ? 'Редактировать команду' : 'Добавить команду'}
          </button>
        </div>

        {showForm && (
          <div className="mt-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="name"
                placeholder="Название команды"
                value={form.name}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="type"
                placeholder="Тип (web/mobile/desktop etc.)"
                value={form.type}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="projectName"
                placeholder="Проект"
                value={form.projectName}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="folderLink"
                placeholder="Ссылка на папку"
                value={form.folderLink}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="designLink"
                placeholder="Ссылка дизайнера"
                value={form.designLink}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="devLink"
                placeholder="Ссылка разработчика"
                value={form.devLink}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="managerLink"
                placeholder="Ссылка менеджера"
                value={form.managerLink}
                onChange={handleChange}
              />

              <select
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="track"
                value={form.track}
                onChange={handleChange}
              >
                <option value="">Без трека</option>

                {tracks.map(track => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>

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
                        type: '',
                        projectName: '',
                        description: '',
                        folderLink: '',
                        designLink: '',
                        devLink: '',
                        managerLink: '',
                        track: '',
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
            className="h-10
              border rounded-lg
              px-3 bg-white
              text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500"
            placeholder="Поиск по названию"
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />

          <select
            className="h-10
              border rounded-lg
              px-3 bg-white
              text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500"
            value={filters.track}
            onChange={(e) =>
              setFilters({
                ...filters,
                track: e.target.value,
              })
            }
          >
            <option value="">Все треки</option>

            {tracks.map(track => (
              <option key={track.id} value={track.name}>
                {track.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchTeams}
            className="
              h-10
              px-4
              rounded-lg
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
              <th className="text-left p-3 font-semibold text-gray-700">Название</th>
              <th className="text-left p-3 font-semibold text-gray-700">Тип</th>
              <th className="text-left p-3 font-semibold text-gray-700">Проект</th>
              <th className="text-left p-3 font-semibold text-gray-700">Описание</th>
              <th className="text-left p-3 font-semibold text-gray-700">Трек</th>
              <th className="text-left p-3 font-semibold text-gray-700">Ссылки</th>
              <th className="text-left p-3 font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>

          <tbody>
            {teams.map(t => (
              <tr
                key={t.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-3 font-medium">{t.name}</td>

                <td className="p-3">{t.type}</td>

                <td className="p-3">{t.projectName}</td>

                <td className="p-3 max-w-[250px]">
                  {t.description}
                </td>

                <td className="p-3">
                  {t.track?.name || '—'}
                </td>

                <td className="p-3">
                  <div className="flex flex-col gap-2">

                    {t.folderLink && (
                      <div className="flex gap-2 items-center">
                        <a
                          href={t.folderLink}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          Команда
                        </a>

                        <button
                          onClick={() => navigator.clipboard.writeText(t.folderLink)}
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {t.designLink && (
                      <div className="flex gap-2 items-center">
                        <a
                          href={t.designLink}
                          target="_blank"
                          className="text-pink-600 hover:underline"
                        >
                          Дизайнер
                        </a>

                        <button
                          onClick={() => navigator.clipboard.writeText(t.designLink)}
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {t.devLink && (
                      <div className="flex gap-2 items-center">
                        <a
                          href={t.devLink}
                          target="_blank"
                          className="text-green-600 hover:underline"
                        >
                          Разработчик
                        </a>

                        <button
                          onClick={() => navigator.clipboard.writeText(t.devLink)}
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {t.managerLink && (
                      <div className="flex gap-2 items-center">
                        <a
                          href={t.managerLink}
                          target="_blank"
                          className="text-amber-600 hover:underline"
                        >
                          Менеджер
                        </a>

                        <button
                          onClick={() => navigator.clipboard.writeText(t.managerLink)}
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                  </div>
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