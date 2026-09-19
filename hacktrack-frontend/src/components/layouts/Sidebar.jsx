import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/api';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState('');

  const exportExcel = async () => {
    try {
      const res = await api.get('import/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');

      link.href = url;
      link.download = 'hackathon.xlsx';
      link.click();
    } catch (err) {
      console.error(err);
      alert('Ошибка экспорта');
    }
  };

  const items = [
    { path: '/schedule', label: 'Расписание' },
    { path: '/participants', label: 'Участники' },
    { path: '/teams', label: 'Команды' },
    { path: '/tracks', label: 'Треки' },
    { path: '/contacts', label: 'Контакты' },
  ];

  return (
    <aside style={styles.sidebar}>

      <div>
        <h3 style={styles.title}>Навигация</h3>

        {items.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}

            onMouseEnter={() => setHovered(item.path)}
            onMouseLeave={() => setHovered(null)}

            style={{
              ...styles.link,

              ...(location.pathname === item.path
                ? styles.active
                : {}),

              ...(hovered === item.path
                ? styles.hover
                : {}),
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        onClick={exportExcel}
        style={styles.exportBtn}
      >
        📤 Экспорт
      </button>

    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    background: '#1e293b',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  title: {
    marginBottom: '20px',
    fontSize: '18px',
  },

  link: {
    width: '100%',
    background: 'transparent',
    color: 'white',
    border: 'none',
    padding: '12px 14px',
    textAlign: 'left',
    borderRadius: '10px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: '0.2s',
  },

  active: {
    background: '#334155',
  },

  exportBtn: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  
  hover: {
    background: '#34495e',
  },
};