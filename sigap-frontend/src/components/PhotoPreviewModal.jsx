// Lokasi: src/components/PhotoPreviewModal.jsx

import { useState, useEffect } from 'react';

function PhotoPreviewModal({ isOpen, onClose, onSubmit, imageSrc, location }) {
  const [description, setDescription] = useState('');

  // Reset deskripsi setiap kali gambar baru muncul
  useEffect(() => {
    if (isOpen) {
      setDescription('');
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Kirim objek berisi deskripsi ke fungsi onSubmit
    onSubmit({ description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Kirim Laporan Dokumentasi</h3>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-red-500">×</button>
        </div>
        
        <div className="overflow-y-auto space-y-4">
          <img src={imageSrc} alt="Pratinjau Foto" className="w-full h-auto rounded-lg border" />
          
          {location && (
            <div>
              <p className="block text-sm font-semibold text-gray-700">Lokasi Terdeteksi (GPS)</p>
              <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md mt-1">
                {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
              </p>
            </div>
          )}

          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Deskripsi Laporan</label>
          <textarea 
            id="description" 
            rows="4" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2" 
            placeholder="Tuliskan deskripsi singkat..."
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end border-t pt-4">
          <button onClick={handleSubmit} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700">
            Kirim Laporan
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhotoPreviewModal;