import UserProfile from './UserProfile.jsx'; 
import Alert from './Alert.jsx';
import StatsGrid from './StatsGrid.jsx';
import DisasterChart from './DisasterChart.jsx';

function MainContent() {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Header Konten Utama */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Relawan</h1>
        <UserProfile /> {/* <-- 2. Gunakan komponen di sini */}
      </header>

      {/* Placeholder untuk Alert, Kartu, dan Grafik */}
      <div className="space-y-8">
        <Alert />
        <StatsGrid/>
        <DisasterChart/>
      </div>
    </main>
  );
}

export default MainContent;