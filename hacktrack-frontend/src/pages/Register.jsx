import { useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      setSuccess('Аккаунт успешно создан');

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) {
        setError('Пользователь уже существует');
      } else {
        setError('Ошибка регистрации');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-gradient-to-br
        from-slate-100
        via-blue-50
        to-slate-200
        p-6
      "
    >

      <div
        className="
          w-full max-w-md
          bg-white
          rounded-3xl
          shadow-xl
          border
          p-8
        "
      >

        {/* HEADER */}
        <div className="text-center mb-8">

          <div
            className="
              w-16 h-16 mx-auto mb-4
              rounded-2xl
              bg-emerald-600
              flex items-center justify-center
              text-white text-2xl font-bold
              shadow-lg
            "
          >
            HT
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Регистрация
          </h1>

          <p className="text-gray-500 mt-2">
            Создание аккаунта HackTrack CRM
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ФИО
            </label>

            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Иван Иванов"
              className="
                w-full
                border rounded-xl
                px-4 py-3
                outline-none
                transition
                focus:ring-2 focus:ring-emerald-500
                focus:border-emerald-500
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="
                w-full
                border rounded-xl
                px-4 py-3
                outline-none
                transition
                focus:ring-2 focus:ring-emerald-500
                focus:border-emerald-500
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              className="
                w-full
                border rounded-xl
                px-4 py-3
                outline-none
                transition
                focus:ring-2 focus:ring-emerald-500
                focus:border-emerald-500
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Повторите пароль
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              className="
                w-full
                border rounded-xl
                px-4 py-3
                outline-none
                transition
                focus:ring-2 focus:ring-emerald-500
                focus:border-emerald-500
              "
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                bg-red-100
                border border-red-300
                text-red-700
                px-4 py-3
                rounded-xl
                text-sm
              "
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              className="
                bg-green-100
                border border-green-300
                text-green-700
                px-4 py-3
                rounded-xl
                text-sm
              "
            >
              {success}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3 rounded-xl
              bg-emerald-600 text-white
              font-medium
              hover:bg-emerald-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
              shadow-sm hover:shadow-md
            "
          >
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-1" />

            <span className="text-sm text-gray-400">
              уже есть аккаунт?
            </span>

            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <Link
            to="/login"
            className="
              block text-center
              w-full
              py-3 rounded-xl
              border border-gray-300
              font-medium
              hover:bg-gray-50
              transition
            "
          >
            Войти
          </Link>

        </div>

      </div>

    </div>
  );
}