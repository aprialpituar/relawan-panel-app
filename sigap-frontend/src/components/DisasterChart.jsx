// Lokasi: src/components/DisasterChart.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DisasterChart() {
  const [filter, setFilter] = useState('bulanan'); // Filter aktif: bulanan, tahunan, mingguan
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartTitle, setChartTitle] = useState('Laporan per Jenis Bencana');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/chart/${filter}`);
        const dataFromApi = response.data;
        
        let labels = [];
        let dataValues = [];
        let newTitle = 'Laporan Bencana';

        if (filter === 'bulanan') {
          labels = dataFromApi.map(item => item.jenis_bencana);
          dataValues = dataFromApi.map(item => item.total);
          newTitle = 'Laporan per Jenis Bencana - Bulan Ini';
        } else if (filter === 'tahunan') {
          labels = dataFromApi.map(item => item.bulan);
          dataValues = dataFromApi.map(item => item.total);
          newTitle = 'Laporan per Bulan - Tahun Ini';
        } else if (filter === 'mingguan') {
          labels = dataFromApi.map(item => item.hari);
          dataValues = dataFromApi.map(item => item.total);
          newTitle = 'Laporan per Hari - Minggu Ini';
        }

        setChartTitle(newTitle);
        setChartData({
          labels: labels,
          datasets: [{
            label: 'Jumlah Laporan',
            data: dataValues,
            backgroundColor: ['#60A5FA', '#F472B6', '#FBBF24', '#34D399', '#A78BFA', '#F87171'],
            borderRadius: 8,
            barThickness: 40,
          }]
        });
      } catch (error) {
        console.error(`Gagal mengambil data grafik (${filter}):`, error);
      }
    };

    fetchChartData();
  }, [filter]); // useEffect ini akan berjalan lagi setiap kali 'filter' berubah

  const options = { /* ... Opsi grafik tetap sama ... */ };

  const getButtonClass = (buttonFilter) => {
    return filter === buttonFilter
      ? "bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-md" // Style aktif
      : "bg-gray-200 text-gray-700 px-3 py-1 text-sm font-semibold rounded-md hover:bg-gray-300"; // Style default
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{chartTitle}</h2>
        <div className="flex items-center space-x-2">
          <button onClick={() => setFilter('mingguan')} className={getButtonClass('mingguan')}>Minggu</button>
          <button onClick={() => setFilter('bulanan')} className={getButtonClass('bulanan')}>Bulan</button>
          <button onClick={() => setFilter('tahunan')} className={getButtonClass('tahunan')}>Tahun</button>
        </div>
      </div>
      <div className="h-80">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}

export default DisasterChart;