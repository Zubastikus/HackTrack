import { useEffect, useState } from 'react';
import api from '../api/api';
import ImportButton from '../components/ImportButton';

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    role: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    team: '',
  });

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    team: '',
    noTeam: false,
  });

  const handleEdit = (p) => {
    setForm({
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      middleName: p.middleName || '',
      role: p.role || '',
      school: p.school || '',
      grade: p.grade || '',
      email: p.email || '',
      phone: p.phone || '',
      team: p.team?.id || '',
    });

    setEditingId(p.id);
    setShowForm(true);
  };

  const loadParticipants = () => {
    api.get('/participants')
      .then(res => setParticipants(res.data))
      .catch(err => console.error(err));
  };

  const loadTeams = () => {
    api.get('/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  };

  const fetchParticipants = () => {
    api.get('/participants', {
      params: {
        search: filters.search || undefined,
        role: filters.role || undefined,
        team: filters.team || undefined,
        noTeam: filters.noTeam || undefined,
      },
    })
    .then(res => setParticipants(res.data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    loadParticipants();
    loadTeams();
    fetchParticipants();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
    };

    if (editingId) {
      api.patch(`/participants/${editingId}`, payload)
        .then(() => {
          setEditingId(null);
          loadParticipants();
        })
        .catch(console.error);
    } else {
      api.post('/participants', payload)
        .then(() => {
          loadParticipants();
        })
        .catch(console.error);
    }

    setForm({
      firstName: '',
      lastName: '',
      middleName: '',
      role: '',
      school: '',
      grade: '',
      email: '',
      phone: '',
      team: '',
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Удалить участника?')) return;

    api.delete(`/participants/${id}`)
      .then(() => loadParticipants())
      .catch(console.error);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Участники
          </h1>

          <p className="text-gray-500 mt-1">
            Управление участниками хакатона
          </p>
        </div>

        <ImportButton
          endpoint="/import/participants"
          onSuccess={loadParticipants}
        />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingId ? 'Редактирование участника' : 'Добавление участника'}
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
            {showForm ? 'Скрыть форму' : editingId ? 'Редактировать участника' : 'Добавить участника'}
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
                name="lastName"
                placeholder="Фамилия"
                value={form.lastName}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="firstName"
                placeholder="Имя"
                value={form.firstName}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="middleName"
                placeholder="Отчество"
                value={form.middleName}
                onChange={handleChange}
              />

              <select
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Без роли</option>
                <option value="Менеджер">Менеджер</option>
                <option value="Дизайнер">Дизайнер</option>
                <option value="Разработчик">Разработчик</option>
              </select>

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="school"
                placeholder="Учебное заведение"
                value={form.school}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="grade"
                placeholder="Класс/курс"
                value={form.grade}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="phone"
                placeholder="Телефон"
                value={form.phone}
                onChange={handleChange}
              />

              <select
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                name="team"
                value={form.team}
                onChange={handleChange}
              >
                <option value="">Без команды</option>

                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
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
                        firstName: '',
                        lastName: '',
                        middleName: '',
                        role: '',
                        school: '',
                        grade: '',
                        email: '',
                        phone: '',
                        team: '',
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
            placeholder="Поиск"
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
            value={filters.role}
            onChange={(e) =>
              setFilters({
                ...filters,
                role: e.target.value,
              })
            }
          >
            <option value="">Все роли</option>
            <option value="Менеджер">Менеджер</option>
            <option value="Дизайнер">Дизайнер</option>
            <option value="Разработчик">Разработчик</option>
          </select>

          <select
            className="h-10
              border rounded-lg
              px-3 bg-white
              text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500"
            value={filters.team}
            onChange={(e) =>
              setFilters({
                ...filters,
                team: e.target.value,
              })
            }
          >
            <option value="">Все команды</option>

            {teams.map(team => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.noTeam}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    noTeam: e.target.checked,
                  })
                }
              />

              Без команды
            </label>

            <button
              onClick={fetchParticipants}
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
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700">Имя</th>
              <th className="text-left p-3 font-semibold text-gray-700">Фамилия</th>
              <th className="text-left p-3 font-semibold text-gray-700">Отчество</th>
              <th className="text-left p-3 font-semibold text-gray-700">Роль</th>
              <th className="text-left p-3 font-semibold text-gray-700">Уч. заведение</th>
              <th className="text-left p-3 font-semibold text-gray-700">Класс/курс</th>
              <th className="text-left p-3 font-semibold text-gray-700">Email</th>
              <th className="text-left p-3 font-semibold text-gray-700">Телефон</th>
              <th className="text-left p-3 font-semibold text-gray-700">Команда</th>
              <th className="text-left p-3 font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>

          <tbody>
            {participants.map(p => (
              <tr
                key={p.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-3">{p.firstName}</td>
                <td className="p-3">{p.lastName}</td>
                <td className="p-3">{p.middleName}</td>
                <td className="p-3">{p.role}</td>
                <td className="p-3">{p.school}</td>
                <td className="p-3">{p.grade}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.team?.name || '—'}</td>

                <td className="p-3">
                  <div className="flex gap-2">

                    <button
                      onClick={() => handleEdit(p)}
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
                      onClick={() => handleDelete(p.id)}
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