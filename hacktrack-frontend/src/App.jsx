import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Registration from './pages/Register';
import Participants from './pages/Participants';
import Teams from './pages/Teams';
import Tracks from './pages/Tracks';
import Hackathons from './pages/Hackathons';
import Schedule from './pages/Schedule';
import Contacts from './pages/Contacts';
import Layout from './components/layouts/Layout';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      <Route
        path="/hackathons"
        element={
          <PrivateRoute>
            <Layout>
              <Hackathons />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* редирект по умолчанию */}
      <Route path="*" element={<Navigate to="/schedule" />} />

      <Route
        path="/participants"
        element={
          <PrivateRoute>
            <Layout>
              <Participants />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <Layout>
              <Teams />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/tracks"
        element={
          <PrivateRoute>
            <Layout>
              <Tracks />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <PrivateRoute>
            <Layout>
              <Schedule />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/contacts"
        element={
          <PrivateRoute>
            <Layout>
              <Contacts />
            </Layout>
          </PrivateRoute>
        }
      />

      
    </Routes>
  );
}

export default App;