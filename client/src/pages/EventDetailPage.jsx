import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { api } from '../api/client.js';
import { fallbackImage } from '../components/EventCard.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import { formatEventDate } from '../utils/format.js';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');

  const hasRsvp = useMemo(() => {
    if (!user || !event?.attendees) return false;
    return event.attendees.some((attendee) => attendee._id === user.id || attendee === user.id);
  }, [event, user]);
  const organizerId = event?.organizer?._id || event?.organizer;
  const isOwner = user && organizerId === user.id;

  useEffect(() => {
    api
      .getEvent(id)
      .then((data) => {
        setEvent(data.event);
        setStatus('ready');
      })
      .catch((error) => {
        setMessage(error.message);
        setStatus('error');
      });
  }, [id]);

  async function handleRsvp() {
    setMessage('');
    try {
      const data = hasRsvp ? await api.cancelRsvp(id) : await api.rsvp(id);
      setEvent(data.event);
      setMessage(hasRsvp ? 'Your RSVP has been cancelled.' : 'You are registered for this event.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm('Delete this event? This cannot be undone.');
    if (!shouldDelete) return;

    setMessage('');
    try {
      await api.deleteEvent(id);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (status === 'loading') return <main className="content-page">Loading event...</main>;
  if (!event) return <main className="content-page">{message || 'Event not found.'}</main>;

  return (
    <main className="event-detail-page">
      <section className="event-detail-main">
        <div className="event-hero-frame">
          <img className="event-banner" src={event.imageUrl || fallbackImage(event.category)} alt="" />
          <div className="event-hero-label">
            <span>{event.category}</span>
            <strong>{event.city}</strong>
          </div>
        </div>
        <p className="eyebrow">EventLens Detail</p>
        <h1>{event.title}</h1>
        <section className="description-box">
          <h2>Description</h2>
          <p>{event.description}</p>
        </section>
        <section className="host-box">
          <h2>Event Host & Organizer</h2>
          <p>{event.organizer?.fullName || 'EventLens organizer'}</p>
        </section>
      </section>

      <aside className="rsvp-panel">
        {!isOwner && (
          <button className="button" type="button" onClick={handleRsvp} disabled={!user || event.spotsRemaining === 0}>
            {hasRsvp ? 'Cancel RSVP' : 'Register now'}
          </button>
        )}
        {isOwner && (
          <div className="owner-actions">
            <Link className="button button--small button--ghost" to={`/events/${event._id}/edit`}>Edit event</Link>
            <button className="button button--small button--danger" type="button" onClick={handleDelete}>Delete</button>
          </div>
        )}
        {!user && <p>Sign in to register for this event.</p>}
        {message && <p className="form-message">{message}</p>}
        <dl>
          <div>
            <dt>Time</dt>
            <dd>{formatEventDate(event.eventDate)} at {event.startTime}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{event.location}, {event.city}</dd>
          </div>
          <div>
            <dt>Spots</dt>
            <dd>{event.spotsRemaining} of {event.capacity} remaining</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}

export default EventDetailPage;
