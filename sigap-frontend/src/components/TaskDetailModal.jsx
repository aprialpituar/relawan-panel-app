// Lokasi: src/components/TaskDetailModal.jsx

import { Link } from 'react-router-dom';

function TaskDetailModal({ task, isOpen, onClose }) {
  if (!isOpen || !task) return null;

  const priorityClasses = { /* ... (tetap sama) ... */ };
  const statusClasses = { /* ... (tetap sama) ... */ };
  const navigationLink = `http://googleusercontent.com/maps.google.com/6{encodeURIComponent(task.lokasi)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{task.judul_tugas}</h3>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        {/* Body Modal */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* === PERUBAHAN DI SINI === */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">ID Laporan</p>
              <p className="font-mono text-slate-600 font-medium">{task.nomor_laporan || `TUGAS-${task.id}`}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Lokasi</p>
              <p className="font-medium text-gray-800">{task.lokasi}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Prioritas</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityClasses[task.prioritas]}`}>{task.prioritas}</span>
            </div>
             <div>
              <p className="text-gray-500 mb-1">Status</p>
              <span className={`font-semibold px-3 py-1 rounded-md text-xs ${statusClasses[task.status]}`}>{task.status}</span>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Penanggung Jawab (PIC)</p>
              <p className="font-medium text-gray-800">{task.pic_nama || 'Belum Ditugaskan'}</p>
            </div>
          </div>
          {/* === AKHIR PERUBAHAN === */}

          <div>
            <p className="text-sm text-gray-500 mb-1">Deskripsi Tugas</p>
            <div className="text-gray-800 bg-gray-50 p-3 rounded-lg border text-sm">
              {task.deskripsi}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Peta Lokasi</p>
            <div className="w-full h-64 rounded-lg overflow-hidden border">
              <iframe src={task.mapSrc || 'about:blank'} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        {/* Footer Modal dengan Tombol Aksi */}
        <div className="flex justify-end space-x-3 border-t p-4 bg-gray-50 rounded-b-xl">
          <Link to={navigationLink} target="_blank" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700">
            Mulai Navigasi
          </Link>
          <Link to="/update-status" className="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700">
            Update Status
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;