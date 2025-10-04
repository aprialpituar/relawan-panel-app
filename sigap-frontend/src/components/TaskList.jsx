// Lokasi: src/components/TaskList.jsx

function TaskList({ tasks, onViewDetail, onViewAllTasks }) {
  // Objek untuk mapping style badge, agar lebih rapi
  const priorityClasses = {
    'Mendesak': 'bg-red-500 text-white',
    'Penting': 'bg-yellow-400 text-white',
    'Normal': 'bg-green-500 text-white',
  };
  const statusClasses = {
    'Baru': 'bg-red-100 text-red-600',
    'Proses': 'bg-yellow-100 text-yellow-600',
    'Selesai': 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Tugas Prioritas Anda</h2>
        <button onClick={onViewAllTasks} className="text-sm font-semibold text-blue-600 hover:underline">
          Lihat Semua Tugas
        </button>
      </div>
      
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-gray-100">
            <th className="py-3 px-4 font-semibold text-sm text-gray-400">ID LAPORAN</th>
            <th className="py-3 px-4 font-semibold text-sm text-gray-400">PRIORITAS</th>
            <th className="py-3 px-4 font-semibold text-sm text-gray-400">TUGAS</th>
            <th className="py-3 px-4 font-semibold text-sm text-gray-400">LOKASI</th>
            <th className="py-3 px-4 font-semibold text-sm text-gray-400">STATUS</th>
            <th className="py-3 px-4 font-semibold text-sm text-gray-400">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id} className={index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="py-4 px-4 font-mono text-sm text-slate-500">{task.nomor_laporan || `TUGAS-${task.id}`}</td>
              <td className="py-4 px-4"><span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityClasses[task.prioritas]}`}>{task.prioritas}</span></td>
              <td className="py-4 px-4 font-semibold text-gray-700">{task.judul_tugas}</td>
              <td className="py-4 px-4 text-gray-600">{task.lokasi}</td>
              <td className="py-4 px-4"><span className={`text-sm font-semibold px-3 py-1 rounded-md ${statusClasses[task.status]}`}>{task.status}</span></td>
              <td className="py-4 px-4">
                <button onClick={() => onViewDetail(task)} className="font-bold text-blue-600">
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;