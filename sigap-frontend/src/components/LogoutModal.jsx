// Lokasi: src/components/LogoutModal.jsx

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mt-4">Konfirmasi Logout</h3>
        <p className="text-sm text-gray-500 mt-2">Apakah Anda yakin ingin keluar?</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
          <button onClick={onConfirm} className="px-6 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">Ya, Keluar</button>
        </div>
      </div>
    </div>
  );
}
export default LogoutModal;