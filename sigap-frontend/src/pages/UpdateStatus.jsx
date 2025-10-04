// Lokasi: src/pages/UpdateStatus.jsx

import UserProfile from '../components/UserProfile.jsx';
import Alert from '../components/Alert.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import UpdateStatusForm from '../components/UpdateStatusForm.jsx';

function UpdateStatus() {
  return (
    
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Update Status</h1>
          <UserProfile />
        </header>

        <div className="space-y-8">
          <Alert />
          <StatsGrid />
          <UpdateStatusForm />
        </div>
      </main>
    
  );
}

export default UpdateStatus;