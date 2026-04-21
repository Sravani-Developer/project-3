import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../state/AuthContext.jsx';

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function handleEventsClick(event) {
    event.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate('/#events');
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="EventLens home">
          <span className="brand-mark" aria-hidden="true">
            <span></span>
          </span>
          <span>EventLens</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/" onClick={handleEventsClick}>Events</NavLink>
          {user?.role === 'organizer' && <NavLink to="/events/new">Create Event</NavLink>}
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {!user ? (
            <NavLink className="button button--small" to="/login">Login</NavLink>
          ) : (
            <button className="button button--small button--ghost" type="button" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export default AppLayout;
