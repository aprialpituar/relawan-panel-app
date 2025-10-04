// Lokasi: src/components/UpdateStatusForm.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateStatusForm() {
  // State untuk menyimpan daftar tugas dari API
  const [tasks, setTasks] = useState([]);
  // State untuk menyimpan input dari form
  const [selectedTask, setSelectedTask] = useState('');
  const [newStatus, setNewStatus] = useState('Proses');
  const [notes, setNotes] = useState('');
  // State untuk pesan sukses/error
  const [message, setMessage] = useState('');

  // Ambil daftar tugas saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/tugas');
        setTasks(response.data.filter(task => task.status !== 'Selesai')); // Hanya tampilkan tugas yang belum selesai
        if (response.data.length > 0) {
          setSelectedTask(response.data[0].id); // Pilih tugas pertama sebagai default
        }
      } catch (error) {
        console.error("Gagal mengambil daftar tugas:", error);
      }
    };
    fetchTasks();
  }, []);

  // Fungsi yang dijalankan saat form di-submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedTask) {
      setMessage('Silakan pilih tugas terlebih dahulu.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/tugas/${selectedTask}/status`, {
        status: newStatus,
        catatan: notes,
      });
      setMessage(response.data.message); // Tampilkan pesan sukses dari backend
    } catch (error) {
      setMessage('Gagal mengupdate status. Coba lagi.');
      console.error("Error saat update status:", error);
    }
  };

  return (
    <div className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="pilih-tugas" className="block text-sm font-semibold text-gray-700 mb-1">Pilih Tugas</label>
            <select id="pilih-tugas" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5">
              <option value="">-- Pilih Tugas --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.judul_tugas} - ({task.lokasi})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="ubah-status" className="block text-sm font-semibold text-gray-700 mb-1">Ubah Status Menjadi</label>
            <select id="ubah-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5">
              <option>Proses</option>
              <option>Selesai</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="catatan" className="block text-sm font-semibold text-gray-700 mb-1">Catatan Lapangan (Opsional)</label>
            <textarea id="catatan" value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" className="w-full border-gray-300 rounded-lg p-2.5" placeholder="Contoh: Ketinggian air naik..."></textarea>
          </div>

          <div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700">
              Kirim Laporan Status
            </button>
          </div>
          
          {message && <p className="text-center text-sm font-semibold text-green-600 mt-4">{message}</p>}
        </div>
      </form>
    </div>
  );
}

export default UpdateStatusForm;