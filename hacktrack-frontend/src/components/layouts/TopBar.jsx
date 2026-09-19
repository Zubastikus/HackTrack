import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/api';
import { parseJwt } from '../../utils/jwt';

export default function TopBar() {
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const token = localStorage.getItem('token');

  let hackathonName = 'Без хакатона';

  if (token) {
    const payload = parseJwt(token);

    if (payload?.hackathonName) {
      hackathonName = payload.hackathonName;
    }
  }

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await api.post('/notifications/send', {
        message,
      });

      setStatus('Отправлено');
      setMessage('');

      setTimeout(() => {
        setStatus('');
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus('Ошибка');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header style={styles.header}>
      
      {/* LEFT */}
      <div style={styles.left}>
        <h2
          style={styles.logo}
          onClick={() => navigate('/hackathons')}
        >
          HackTrack
        </h2>

        <button
          style={styles.hackathonButton}
          onClick={() => navigate('/hackathons')}
        >
          {hackathonName}
        </button>
      </div>

      {/* CENTER */}
      <div style={styles.center}>
        <input
          style={styles.input}
          placeholder="Сообщение организатора..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button style={styles.sendButton} onClick={sendMessage}>
          Отправить
        </button>

        {status && (
          <span style={styles.status}>
            {status}
          </span>
        )}
      </div>

      {/* RIGHT */}
      <div>
        <button style={styles.logoutButton} onClick={logout}>
          Выйти
        </button>
      </div>

    </header>
  );
}

const styles = {
  header: {
    height: 70,
    borderBottom: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    background: 'white',
  },

  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
  },

  center: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    margin: 0,
    cursor: 'pointer',
  },

  hackathonButton: {
    border: '1px solid #ccc',
    background: '#f5f5f5',
    padding: '8px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  input: {
    width: 320,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },

  sendButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },

  logoutButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },

  status: {
    fontSize: 14,
  },
};