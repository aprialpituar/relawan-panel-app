// Lokasi: src/components/AllTasksModal.jsx

function AllTasksModal({ isOpen, onClose, tasks }) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-800">Daftar Semua Tugas</h3>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-red-500">×</button>
        </div>
        
        <div className="overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b-2 border-gray-100">
                <th className="py-3 px-4 font-semibold text-sm text-gray-400">ID LAPORAN</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-400">PRIORITAS</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-400">TUGAS</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-400">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className={index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="py-4 px-4 font-mono text-sm text-slate-500">{task.nomor_laporan || `TUGAS-${task.id}`}</td>
                  <td className="py-4 px-4"><span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityClasses[task.prioritas]}`}>{task.prioritas}</span></td>
                  <td className="py-4 px-4 font-semibold text-gray-700">{task.judul_tugas}</td>
                  <td className="py-4 px-4"><span className={`text-sm font-semibold px-3 py-1 rounded-md ${statusClasses[task.status]}`}>{task.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllTasksModal;