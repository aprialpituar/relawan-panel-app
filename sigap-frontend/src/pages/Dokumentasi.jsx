// Lokasi: src/pages/Dokumentasi.jsx

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import UserProfile from '../components/UserProfile.jsx';
import Alert from '../components/Alert.jsx';
import PhotoPreviewModal from '../components/PhotoPreviewModal.jsx';

function Dokumentasi() {
  const { user } = useAuth();
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [location, setLocation] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // 1. useEffect untuk mengambil daftar tugas
 useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tugas');
      const activeTasks = response.data.filter(task => task.status !== 'Selesai');
      setTasks(activeTasks);
    } catch (error) {
      console.error("Gagal mengambil daftar tugas:", error);
    }
  };
  fetchTasks();
}, []);
  // 2. useEffect khusus untuk mengelola kamera
  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const startCamera = async () => {
      setError('');
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        setStream(streamData);
        if (videoRef.current) {
          videoRef.current.srcObject = streamData;
        }
      } catch (err) {
        console.error("Error mengakses kamera:", err);
        setError('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.');
      }
    };

    startCamera();
    
    // Cleanup function
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };
  }, [facingMode]);

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTakePhoto = () => {
    if (!selectedTaskId) {
      alert("Silakan pilih tugas yang akan didokumentasikan terlebih dahulu.");
      return;
    }

    // Ambil lokasi GPS saat foto diambil
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });

        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageDataUrl = canvas.toDataURL('image/jpeg');
          setCapturedImage(imageDataUrl);
          setIsModalOpen(true);
        }
      },
      (err) => {
        console.error("Gagal mendapatkan lokasi:", err);
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi sudah diberikan.");
      }
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCapturedImage(null);
  };

  const handleSubmitReport = async (dataFromModal) => {
    if (!capturedImage || !location) {
      alert("Tidak ada gambar atau lokasi untuk dikirim.");
      return;
    }
    if (!user) {
      alert("Data pengguna tidak ditemukan, silakan coba lagi.");
      return;
    }

    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const imageFile = new File([blob], "laporan.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append('foto', imageFile);
    formData.append('deskripsi', dataFromModal.description);
    formData.append('lokasi_gps', `${location.lat}, ${location.lon}`);
    formData.append('tugas_id', selectedTaskId);
    formData.append('relawan_id', user.id);

    try {
      const result = await axios.post('http://localhost:4000/api/dokumentasi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(result.data.message);
      handleCloseModal();
    } catch (error) {
      alert('Gagal mengunggah laporan.');
      console.error("Error saat upload:", error);
    }
  };

  return (
    
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dokumentasi</h1>
          <UserProfile />
        </header>
        <div className="space-y-8">
          <Alert />
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="mb-6">
              <label htmlFor="pilih-tugas-dokumentasi" className="block text-sm font-semibold text-gray-700 mb-1">
                Pilih Tugas untuk Didokumentasikan
              </label>
              <select
                id="pilih-tugas-dokumentasi"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2.5"
              >
                <option value="">-- Pilih Tugas --</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.judul_tugas} ({task.lokasi})
                  </option>
                ))}
              </select>
            </div>

            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-t pt-6">Ambil Foto Langsung</h2>
            <div className="w-full aspect-video rounded-lg bg-black flex items-center justify-center border-2 border-dashed border-gray-300">
              {error ? (<p className="text-red-500 p-4">{error}</p>) : (<video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg object-cover"></video>)}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>

            <div className="mt-4 flex items-center space-x-4">
              <button onClick={handleTakePhoto} disabled={!stream || !selectedTaskId} className="flex items-center justify-center space-x-2 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 disabled:bg-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Ambil Foto</span>
              </button>
              <button onClick={handleSwitchCamera} disabled={!stream} className="flex items-center justify-center space-x-2 bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-700 disabled:bg-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>
                <span>Ganti Kamera</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Foto dan lokasi anda akan otomatis terekam untuk validasi laporan.</p>
          </div>
        </div>
        <PhotoPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitReport}
          imageSrc={capturedImage}
          location={location}
        />
      </main>
   
  );
}

export default Dokumentasi;