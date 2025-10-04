// Lokasi: src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- Import library baru
import LogoutModal from '../components/LogoutModal.jsx';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // <-- State BARU untuk data user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // useEffect untuk mengecek token saat aplikasi pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser); // Set data user dari token
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token tidak valid:", error); // <-- TAMBAHKAN BARIS INI
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser); // <-- Set data user saat login
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null); // <-- Hapus data user saat logout
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Kirim 'user' ke semua komponen yang membutuhkan
  const value = { isAuthenticated, user, login, logout, openLogoutModal: () => setIsLogoutModalOpen(true) };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </AuthContext.Provider>
  );
}; export default AuthProvider;