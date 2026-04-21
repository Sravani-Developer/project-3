import { Navigate } from 'react-router-dom';

import { useAuth } from '../state/AuthContext.jsx';

function ProtectedRoute({ children, requireOrganizer = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requireOrganizer && user.role !== 'organizer') return <Navigate to="/dashboard" replace />;

  return children;
}

export default ProtectedRoute;
