// Lokasi: src/App.jsx

import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tugas from './pages/Tugas.jsx';
import Dokumentasi from './pages/Dokumentasi.jsx';
import UpdateStatus from './pages/UpdateStatus.jsx';
import Login from './pages/Login.jsx';

const ProtectedRoutes = () => {
  const { isAuthenticated, openLogoutModal } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout onLogout={openLogoutModal}>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="tugas" element={<Tugas />} />
          <Route path="dokumentasi" element={<Dokumentasi />} />
          <Route path="update-status" element={<UpdateStatus />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;