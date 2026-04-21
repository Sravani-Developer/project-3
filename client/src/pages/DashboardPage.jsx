import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../state/AuthContext.jsx';

function DashboardPage() {
  const { user, setUser } = useAuth();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [profile, setProfile] = useState({ fullName: user.fullName, city: user.city || '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getDashboard().then((data) => {
      setCreatedEvents(data.createdEvents);
      setAttendingEvents(data.attendingEvents);
    });
  }, []);

  function updateProfileField(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const data = await api.updateProfile(profile);
      setUser(data.user);
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">EventLens Board</p>
          <h1>Welcome, {user.fullName}</h1>
          <p>
            {user.role === 'organizer'
              ? 'Manage created events, RSVPs, and profile details.'
              : 'Track events you are attending and keep your profile details current.'}
          </p>
        </div>
        {user.role === 'organizer' && <Link className="button" to="/events/new">Create Event</Link>}
      </section>

      <section className="dashboard-grid">
        <form className="profile-panel" onSubmit={handleProfileSubmit}>
          <h2>Edit Profile</h2>
          {message && <p className="form-message">{message}</p>}
          <FormField label="Full Name"><input name="fullName" value={profile.fullName} onChange={updateProfileField} /></FormField>
          <FormField label="City"><input name="city" value={profile.city} onChange={updateProfileField} /></FormField>
          <button className="button button--small" type="submit">Save profile</button>
        </form>

        {user.role === 'organizer' ? (
          <section>
            <h2>My Events</h2>
            <div className="compact-list">
              {createdEvents.map((event) => (
                <div className="compact-list__row" key={event._id}>
                  <Link to={`/events/${event._id}`}>{event.title}</Link>
                  <Link to={`/events/${event._id}/edit`}>Edit</Link>
                </div>
              ))}
              {createdEvents.length === 0 && <p>No created events yet.</p>}
            </div>
          </section>
        ) : (
          <section>
            <h2>Attendee Account</h2>
            <div className="compact-list">
              <p>Browse events and register for the ones you want to attend. Your RSVPs appear below.</p>
              <Link className="text-link" to="/">Find events</Link>
            </div>
          </section>
        )}
      </section>

      <section>
        <h2>Events I'm Attending</h2>
        <div className="event-grid">
          {attendingEvents.map((event) => <EventCard key={event._id} event={event} />)}
          {attendingEvents.length === 0 && <p>No RSVPs yet.</p>}
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
