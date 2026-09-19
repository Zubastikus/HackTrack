import { useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.access_token);

      navigate('/hackathons');

    } catch (err) {
      console.error(err);

      setError('Неверный email или пароль');

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
              bg-blue-600
              flex items-center justify-center
              text-white text-2xl font-bold
              shadow-lg
            "
          >
            HT
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            HackTrack CRM
          </h1>

          <p className="text-gray-500 mt-2">
            Вход в систему управления хакатонами
          </p>

        </div>

        {/* FORM */}
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              className="
                w-full
                border rounded-xl
                px-4 py-3
                outline-none
                transition
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
              "
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">

              <label className="text-sm font-medium text-gray-700">
                Пароль
              </label>

              <button
                type="button"
                className="
                  text-sm text-blue-600
                  hover:text-blue-700
                  hover:underline
                "
              >
                Забыли пароль?
              </button>

            </div>

            <input
              className="
                w-full
                border rounded-xl
                px-4 py-3
                outline-none
                transition
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
              "
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              py-3 rounded-xl
              bg-blue-600 text-white
              font-medium
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
              shadow-sm hover:shadow-md
            "
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-sm text-gray-400">
              или
            </span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <Link
            to="/register"
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
            Создать аккаунт
          </Link>

          <div className="text-center text-sm text-gray-500">
            © 2026 HackTrack CRM
          </div>

        </div>

      </div>

    </div>
  );
}