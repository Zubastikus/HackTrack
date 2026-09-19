import { useEffect, useState } from 'react';
import api from '../api/api';
import ImportButton from '../components/ImportButton';

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [now, setNow] = useState(new Date());
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    objective: '',
    track: '',
  });

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      objective: '',
      track: '',
    });
  };

  const [filters, setFilters] = useState({
    track: '',
    common: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // загрузка данных
  const loadData = () => {
    api.get('/schedule', {
      params: {
        track: filters.track || undefined,
        common: filters.common || undefined,
      },
    })
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error(err);
        setError('Ошибка загрузки расписания');
      });

    api.get('/tracks')
      .then(res => setTracks(res.data))
      .catch(err => console.error(err));
  };

  function parseDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;

    const [day, month] = dateStr.split('.');
    const [hours, minutes] = timeStr.split(':');

    const year = new Date().getFullYear();

    return new Date(year, month - 1, day, hours, minutes);
  }

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseDateTime(a.date, a.startTime);
    const dateB = parseDateTime(b.date, b.startTime);

    return dateA - dateB;
  });

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // форма
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (editingId) {
      api.patch(`/schedule/${editingId}`, form)
        .then(() => {
          setSuccess('Событие обновлено');
          loadData();
          setEditingId(null);
          resetForm();
        })
        .catch(err => {
          console.error(err);
          setError('Ошибка при обновлении события');
        });
    } else {
      api.post('/schedule', {
        ...form,
        track: form.track ? { id: Number(form.track) } : null,
      })
        .then(() => {
          setSuccess('Событие создано');
          loadData();
          resetForm();
        })
        .catch(err => {
          console.error(err);
          setError('Ошибка при создании события');
        });
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);

    setForm({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      objective: event.objective,
      track: event.track?.id ?? '',
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    setError('');
    setSuccess('');

    if (!window.confirm('Удалить событие?')) return;

    api.delete(`/schedule/${id}`)
      .then(() => {
        setSuccess('Событие удалено');
        loadData();
      })
      .catch(err => {
        console.error(err);
        setError('Ошибка удаления');
      });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Расписание
          </h1>

          <p className="text-gray-500 mt-1">
            Управление событиями хакатона
          </p>
        </div>

        <ImportButton
          endpoint="/import/schedule"
          onSuccess={loadData}
        />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingId ? 'Редактирование события' : 'Добавление события'}
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
                ? 'Редактировать событие'
                : 'Добавить событие'}
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
                name="title"
                placeholder="Название"
                value={form.title}
                onChange={handleChange}
                required
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="date"
                placeholder="Дата (DD.MM)"
                value={form.date}
                onChange={handleChange}
                required
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="startTime"
                placeholder="Начало (10:00)"
                value={form.startTime}
                onChange={handleChange}
                required
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="endTime"
                placeholder="Конец (12:00)"
                value={form.endTime}
                onChange={handleChange}
                required
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="objective"
                placeholder="Задача"
                value={form.objective}
                onChange={handleChange}
              />

              <select
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="track"
                value={form.track}
                onChange={handleChange}
              >
                <option value="">Без трека (общее)</option>

                {tracks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
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
                      resetForm();
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

          <select
            className="
              h-10 border rounded-lg
              px-3 bg-white text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
            value={filters.track}
            onChange={(e) =>
              setFilters({
                ...filters,
                track: e.target.value,
              })
            }
          >
            <option value="">Все треки</option>

            {tracks.map(t => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.common}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  common: e.target.checked,
                })
              }
            />

            Общие события
          </label>

          <button
            onClick={loadData}
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
              <th className="text-left p-3 font-semibold text-gray-700">Дата</th>
              <th className="text-left p-3 font-semibold text-gray-700">Время</th>
              <th className="text-left p-3 font-semibold text-gray-700">Название</th>
              <th className="text-left p-3 font-semibold text-gray-700">Задача</th>
              <th className="text-left p-3 font-semibold text-gray-700">Трек</th>
              <th className="text-left p-3 font-semibold text-gray-700">Статус</th>
              <th className="text-left p-3 font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>

          <tbody>
            {sortedEvents.map(e => {
              const start = parseDateTime(e.date, e.startTime);
              const end = parseDateTime(e.date, e.endTime);

              let rowClass = 'border-t hover:bg-slate-50';
              let status = 'Запланировано';

              if (start && end) {
                const diffMs = start - now;
                const diffMinutes = diffMs / (1000 * 60);

                if (now >= start && now <= end) {
                  rowClass = 'border-t bg-green-50 hover:bg-green-100';
                  status = 'Сейчас идёт';
                } else if (diffMinutes > 0 && diffMinutes <= 30) {
                  rowClass = 'border-t bg-yellow-50 hover:bg-yellow-100';
                  status = 'Скоро начнётся';
                } else if (now > end) {
                  rowClass = 'border-t bg-gray-100 hover:bg-gray-200';
                  status = 'Завершено';
                }
              }

              return (
                <tr
                  key={e.id}
                  className={`${rowClass} transition`}
                >

                  <td className="p-3">
                    {e.date}
                  </td>

                  <td className="p-3">
                    {e.startTime} - {e.endTime}
                  </td>

                  <td className="p-3 font-medium">
                    {e.title}
                  </td>

                  <td className="p-3">
                    {e.objective}
                  </td>

                  <td className="p-3">
                    {e.track?.name || 'Общее'}
                  </td>

                  <td className="p-3">
                    {status}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(e)}
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
                        onClick={() => handleDelete(e.id)}
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
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}