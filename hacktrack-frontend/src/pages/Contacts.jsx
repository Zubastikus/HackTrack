import { useEffect, useState } from 'react';
import api from '../api/api';
import ImportButton from '../components/ImportButton';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    responsibleFor: '',
    organization: '',
    position: '',
  });

  const [filters, setFilters] = useState({
    search: '',
    responsibleFor: '',
  });

  // 📥 загрузка
  const loadContacts = () => {
    api.get('/contacts')
      .then(res => setContacts(res.data))
      .catch(err => {
        console.error(err);
        setError('Ошибка загрузки контактов');
      });
  };

  const fetchContacts = () => {
    api.get('/contacts', {
      params: {
        search: filters.search || undefined,
        responsibleFor: filters.responsibleFor || undefined,
      },
    })
      .then(res => setContacts(res.data))
      .catch(err => {
        console.error(err);
        setError('Ошибка фильтрации');
      });
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // ✏️ изменения формы
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔄 reset
  const resetForm = () => {
    setForm({
      fullName: '',
      email: '',
      phone: '',
      responsibleFor: '',
      organization: '',
      position: '',
    });

    setEditingId(null);
  };

  // ➕ / ✏️ submit
  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const request = editingId
      ? api.patch(`/contacts/${editingId}`, form)
      : api.post('/contacts', form);

    request
      .then(() => {
        loadContacts();
        resetForm();

        setSuccess(
          editingId
            ? 'Контакт обновлён'
            : 'Контакт добавлен'
        );
      })
      .catch(err => {
        console.error(err);

        if (err.response?.status === 409) {
          setError('Контакт с таким email уже существует');
        } else {
          setError('Ошибка сохранения');
        }
      });
  };

  // ✏️ edit
  const handleEdit = (c) => {
    setEditingId(c.id);

    setForm({
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      responsibleFor: c.responsibleFor || '',
      organization: c.organization || '',
      position: c.position || '',
    });

    setShowForm(true);
  };

  // ❌ delete
  const handleDelete = (id) => {
    setError('');
    setSuccess('');

    if (!window.confirm('Удалить контакт?')) return;

    api.delete(`/contacts/${id}`)
      .then(() => {
        loadContacts();
        setSuccess('Контакт удалён');
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
            Контакты
          </h1>

          <p className="text-gray-500 mt-1">
            Управление контактами хакатона
          </p>
        </div>

        <ImportButton
          endpoint="/import/contacts"
          onSuccess={loadContacts}
        />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingId
              ? 'Редактирование контакта'
              : 'Добавление контакта'}
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
                ? 'Редактировать контакт'
                : 'Добавить контакт'}
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
                name="fullName"
                placeholder="ФИО"
                value={form.fullName}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="phone"
                placeholder="Телефон"
                value={form.phone}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="responsibleFor"
                placeholder="Ответственен за"
                value={form.responsibleFor}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="organization"
                placeholder="Организация"
                value={form.organization}
                onChange={handleChange}
              />

              <input
                className="
                  border rounded-xl px-4 py-2
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
                name="position"
                placeholder="Должность"
                value={form.position}
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

          <input
            className="
              h-10 border rounded-lg px-3
              bg-white text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
            placeholder="Поиск по ФИО"
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />

          <input
            className="
              h-10 border rounded-lg px-3
              bg-white text-sm
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
            placeholder="Ответственен за"
            value={filters.responsibleFor}
            onChange={(e) =>
              setFilters({
                ...filters,
                responsibleFor: e.target.value,
              })
            }
          />

          <button
            onClick={fetchContacts}
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
                ФИО
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Email
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Телефон
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Ответственен за
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Организация
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Должность
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Телеграм подключен /
                <br></br>Получает сообщения
              </th>

              <th className="text-left p-3 font-semibold text-gray-700">
                Действия
              </th>
            </tr>
          </thead>

          <tbody>

            {contacts.map(c => (
              <tr
                key={c.id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="p-3 font-medium">
                  {c.fullName}
                </td>

                <td className="p-3">
                  {c.email}
                </td>

                <td className="p-3">
                  {c.phone}
                </td>

                <td className="p-3">
                  {c.responsibleFor}
                </td>

                <td className="p-3">
                  {c.organization}
                </td>

                <td className="p-3">
                  {c.position}
                </td>

                <td className="p-3 text-center pr-5">
                  {c.telegramId ? "✅" : "❌"}
                  {c.wantsOrganizerMessages ? "✅" : "❌"}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">

                    <button
                      onClick={() => handleEdit(c)}
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
                      onClick={() => handleDelete(c.id)}
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