import { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);

  const [emails, setEmails] = useState({});

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const load = () => {
    api.get('/hackathons')
      .then(res => setHackathons(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    load();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const request = editingId
      ? api.patch(`/hackathons/${editingId}`, form)
      : api.post('/hackathons', form);

    request
      .then(() => {
        setSuccess(
          editingId
            ? 'Хакатон обновлён'
            : 'Хакатон создан'
        );

        load();

        setForm({
          name: '',
          description: '',
        });

        setEditingId(null);
      })
      .catch(() => setError('Ошибка сохранения'));
  };

  // DELETE
  const handleDelete = (id) => {
    setError('');
    setSuccess('');

    if (!window.confirm('Удалить хакатон?')) return;

    api.delete(`/hackathons/${id}`)
      .then(() => {
        setSuccess('Хакатон удалён');
        load();
      })
      .catch(() => setError('Ошибка удаления'));
  };

  // EDIT
  const handleEdit = (h) => {
    setEditingId(h.id);

    setForm({
      name: h.name,
      description: h.description || '',
    });

    setShowForm(true);
  };

  // SELECT
  const selectHackathon = async (id) => {
    const res = await api.post('/auth/select-hackathon', {
      hackathonId: id,
    });

    localStorage.setItem('token', res.data.access_token);

    navigate('/schedule');
  };

  // ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ
  const addUser = (id) => {
    setError('');
    setSuccess('');

    const email = emails[id]?.trim();

    // проверка
    if (!email) {
      setError('Введите email пользователя');
      return;
    }

    api.post(`/hackathons/${id}/add-user`, {
      email: email,
    })
      .then(() => {
        setSuccess('Доступ выдан');

        setEmails({
          ...email,
          [id]: '',
        });

        load();
      })
      .catch(() => setError('Пользователь не найден'));
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Хакатоны
        </h1>

        <p className="text-gray-500 mt-1">
          Управление хакатонами и доступом пользователей
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold">
            {editingId
              ? 'Редактирование хакатона'
              : 'Создание хакатона'}
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
                ? 'Редактировать хакатон'
                : 'Создать хакатон'}
          </button>

        </div>

        {showForm && (
          <div className="mt-6">

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              <input
                className="
                  border rounded-xl
                  px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                placeholder="Название"
                value={form.name}
                onChange={e =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="
                  border rounded-xl
                  px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                placeholder="Описание"
                value={form.description}
                onChange={e =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />

              <div className="md:col-span-2 flex gap-3">

                <button
                  type="submit"
                  className="
                    px-5 py-2 rounded-xl
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    transition
                  "
                >
                  {editingId ? 'Сохранить' : 'Создать'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);

                      setForm({
                        name: '',
                        description: '',
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

      {/* CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {hackathons.map(h => (
          <div
            key={h.id}
            className="
              bg-white rounded-2xl
              border shadow-sm
              p-6
              space-y-4
            "
          >

            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {h.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {h.description || 'Без описания'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">

              <div className="bg-slate-100 px-3 py-2 rounded-xl">
                👥 Участников: {h.participants?.length || 0}
              </div>

              <div className="bg-slate-100 px-3 py-2 rounded-xl">
                🧩 Команд: {h.teams?.length || 0}
              </div>

            </div>

            {/* ACCESS */}
            <div className="space-y-3">

              <h4 className="font-semibold text-gray-700">
                Выдать доступ
              </h4>

              <div className="flex flex-col md:flex-row gap-3">

                <input
                  className="
                    flex-1
                    border rounded-xl
                    px-4 py-2
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                  placeholder="Email пользователя"
                  value={emails[h.id] || ''}
                  onChange={e =>
                    setEmails({
                      ...emails,
                      [h.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => addUser(h.id)}
                  className="
                    px-4 py-2 rounded-xl
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    transition
                  "
                >
                  Дать доступ
                </button>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 pt-2">

              <button
                onClick={() => selectHackathon(h.id)}
                className="
                  px-4 py-2 rounded-xl
                  bg-emerald-600 text-white
                  hover:bg-emerald-700
                  transition
                "
              >
                Открыть
              </button>

              <button
                onClick={() => handleEdit(h)}
                className="
                  px-4 py-2 rounded-xl
                  bg-amber-400
                  hover:bg-amber-500
                  transition
                "
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(h.id)}
                className="
                  px-4 py-2 rounded-xl
                  bg-red-500 text-white
                  hover:bg-red-600
                  transition
                "
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}