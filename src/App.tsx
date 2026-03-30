import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import InsightsPage from './pages/InsightsPage';
import ActionItemsPage from './pages/ActionItemsPage';
import FeatureRequestsPage from './pages/FeatureRequestsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/action-items" element={<ActionItemsPage />} />
        <Route path="/feature-requests" element={<FeatureRequestsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
