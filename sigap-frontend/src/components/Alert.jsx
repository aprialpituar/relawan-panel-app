// Lokasi: src/components/Alert.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT LINK

function Alert() {
  const [urgentTask, setUrgentTask] = useState(null);

  useEffect(() => {
    const fetchUrgentTask = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/laporan/mendesak');
        if (response.data.length > 0) {
          setUrgentTask(response.data[0]);
        } else {
          setUrgentTask(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data alert:", error);
      }
    };
    fetchUrgentTask();
  }, []);

  if (!urgentTask) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="bg-red-100 p-2 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <p className="font-bold">ALERT: LAPORAN BARU MASUK!</p>
          <p className="text-sm">{urgentTask.jenis_bencana} di {urgentTask.lokasi}. Segera respon.</p>
        </div>
      </div>
      {/* 2. GANTI <button> MENJADI <Link> */}
      <Link to="/tugas" className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300">
        Lihat & Respon
      </Link>
    </div>
  );
}

export default Alert;