// Lokasi: src/components/Sidebar.jsx

import { NavLink } from 'react-router-dom';
 // <-- 1. Ganti Link menjadi NavLink

function Sidebar({ onLogout }) {
  // 2. Kita definisikan style untuk link agar lebih rapi
  const defaultLinkClass = "flex items-center space-x-3 text-gray-500 hover:bg-gray-100 hover:text-gray-800 py-3 px-4 rounded-lg";
  const activeLinkClass = "flex items-center space-x-3 text-blue-600 bg-blue-50 font-semibold py-3 px-4 rounded-lg";

  return (
    <aside className="w-64 bg-white flex flex-col p-4 shadow-lg">
      <div>
        <div className="flex items-center space-x-2 p-4">
          <img src="/img/sigap-logo.png" alt="SIGAP Logo" className="w-8 h-8" />
          <span className="text-2xl font-bold text-gray-800">SIGAP</span>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              {/* 3. Gunakan NavLink dan className dinamis */}
              <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tugas" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <span>Tugas</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dokumentasi" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <span>Dokumentasi</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/update-status" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>
                <span>Update Status</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-auto">
        <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-500 hover:bg-red-100 font-semibold py-3 px-4 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;