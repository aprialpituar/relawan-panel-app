// Lokasi: src/components/Layout.jsx

import Sidebar from './Sidebar.jsx';
import { Outlet } from 'react-router-dom';

// 1. Terima 'onLogout' sebagai props
function Layout({ onLogout }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* 2. Oper 'onLogout' ke komponen Sidebar */}
      <Sidebar onLogout={onLogout} />
      
      {/* Outlet akan merender halaman yang aktif (Dashboard, Tugas, dll) */}
      <Outlet /> 
    </div>
  );
}

export default Layout;