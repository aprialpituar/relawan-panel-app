// Lokasi: src/components/StatsGrid.jsx

import { useState, useEffect } from 'react'; // <-- 1. Import hooks
import axios from 'axios'; // <-- 2. Import axios
import StatsCard from './StatsCard.jsx';

function StatsGrid() {
  // 3. Siapkan 'state' untuk menyimpan data statistik
  const [stats, setStats] = useState({
    baru: 0,
    proses: 0,
    selesai: 0,
    total: 0,
  });

  // 4. Gunakan 'useEffect' untuk mengambil data dari backend saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Minta data ke backend kita yang berjalan di port 4000
        const response = await axios.get('http://localhost:4000/api/tugas');
        const tasks = response.data; // tasks akan berisi array data tugas dari database

        // Hitung jumlah tugas berdasarkan status
        const baruCount = tasks.filter(task => task.status === 'Baru').length;
        const prosesCount = tasks.filter(task => task.status === 'Proses').length;
        const selesaiCount = tasks.filter(task => task.status === 'Selesai').length;

        // Update state dengan data baru
        setStats({
          baru: baruCount,
          proses: prosesCount,
          selesai: selesaiCount,
          total: tasks.length
        });
        
      } catch (error) {
        console.error("Gagal mengambil data tugas:", error);
      }
    };

    fetchTasks();
  }, []); // Kurung siku kosong berarti "jalankan ini satu kali saja"


  // 5. Gunakan data dari 'state' untuk ditampilkan
  const statsData = [
    {
      title: "Belum Dikerjakan",
      value: stats.baru,
      icon: <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
      colorClass: { bg: "bg-red-100" }
    },
    {
      title: "Sedang Proses",
      value: stats.proses,
      icon: <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>,
      colorClass: { bg: "bg-yellow-100" }
    },
    {
      title: "Selesai",
      value: stats.selesai,
      icon: <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
      colorClass: { bg: "bg-green-100" }
    },
    {
      title: "Total Tugas",
      value: stats.total,
      icon: <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>,
      colorClass: { bg: "bg-indigo-100" }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatsCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}

export default StatsGrid;