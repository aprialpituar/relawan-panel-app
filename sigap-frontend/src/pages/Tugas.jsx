// Lokasi: src/pages/Tugas.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfile from '../components/UserProfile.jsx';
import Alert from '../components/Alert.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskDetailModal from '../components/TaskDetailModal.jsx';
import AllTasksModal from '../components/AllTasksModal.jsx'; // Modal baru

function Tugas() {
  // State untuk modal detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // State daftar tugas dari backend
  const [tasks, setTasks] = useState([]);

  // State untuk modal "Semua Tugas"
  const [isAllTasksModalOpen, setIsAllTasksModalOpen] = useState(false);

  // Ambil data tugas dari backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/tugas');
        setTasks(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar tugas:", error);
      }
    };
    fetchTasks();
  }, []);

  // Handler untuk modal detail
  const handleViewDetail = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  return (
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tugas</h1>
          <UserProfile />
        </header>

        <div className="space-y-8">
          <Alert />
          <StatsGrid />
          <TaskList
            tasks={tasks.filter(t => t.status !== 'Selesai')} // tampilkan hanya tugas prioritas
            onViewDetail={handleViewDetail}
            onViewAllTasks={() => setIsAllTasksModalOpen(true)} // buka modal "Semua Tugas"
          />
        </div>
        {/* Modal detail tugas */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={selectedTask}
      />

      {/* Modal semua tugas */}
      <AllTasksModal
        isOpen={isAllTasksModalOpen}
        onClose={() => setIsAllTasksModalOpen(false)}
        tasks={tasks}
      />
      </main>

      
  );
}

export default Tugas;
