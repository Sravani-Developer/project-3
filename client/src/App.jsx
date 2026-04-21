import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CreateEventPage from './pages/CreateEventPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditEventPage from './pages/EditEventPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { useAuth } from './state/AuthContext.jsx';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <main className="loading-screen">Loading EventLens...</main>;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="events/new" element={<ProtectedRoute requireOrganizer><CreateEventPage /></ProtectedRoute>} />
        <Route path="events/:id/edit" element={<ProtectedRoute requireOrganizer><EditEventPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
