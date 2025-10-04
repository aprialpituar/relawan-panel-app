// Lokasi: src/components/UserProfile.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/me');
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchUser();
  }, []);

  // Tampilkan loading jika data belum siap
  if (!user) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="font-semibold text-gray-800">{user.nama}</p>
        <p className="text-sm text-gray-500">{user.lokasi}</p>
      </div>
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </div>
    </div>
  );
}

export default UserProfile;