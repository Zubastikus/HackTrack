import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { parseJwt } from '../../utils/jwt';

export default function Layout({ children }) {
  const token = localStorage.getItem('token');

  let hasHackathon = false;

  if (token) {
    const payload = parseJwt(token);

    hasHackathon = !!payload?.hackathonId;
  }

  return (
    <div style={styles.wrapper}>

      <TopBar />

      <div style={styles.body}>

        {hasHackathon && <Sidebar />}

        <main style={styles.content}>
          {children}
        </main>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f4f6f9',
  },

  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
};