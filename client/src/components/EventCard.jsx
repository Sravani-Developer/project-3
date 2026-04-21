import { Link } from 'react-router-dom';

import { formatEventDate } from '../utils/format.js';

export function fallbackImage(category) {
  const images = {
    Community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    Education: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    Music: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    Networking: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    Sports: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
    Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    Wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80'
  };
  return images[category] || images.Community;
}

function EventCard({ event }) {
  const href = String(event._id).startsWith('sample-') ? '/' : `/events/${event._id}`;
  const eventDate = new Date(event.eventDate);
  const day = Number.isNaN(eventDate.getTime()) ? '--' : eventDate.toLocaleDateString('en-US', { day: '2-digit' });
  const month = Number.isNaN(eventDate.getTime()) ? 'TBD' : eventDate.toLocaleDateString('en-US', { month: 'short' });

  return (
    <article className="event-card">
      <div className="event-card__media">
        <img className="event-card__image" src={event.imageUrl || fallbackImage(event.category)} alt="" loading="lazy" />
        <div className="date-badge" aria-label={formatEventDate(event.eventDate)}>
          <span>{month}</span>
          <strong>{day}</strong>
        </div>
        <span className="lens-tag">EventLens pick</span>
      </div>
      <div className="event-card__body">
        <p className="eyebrow">{event.category}</p>
        <h3>{event.title}</h3>
        <p>{formatEventDate(event.eventDate)} at {event.startTime}</p>
        <div className="event-card__footer">
          <span>{event.city}</span>
          <Link className="text-link" to={href}>View details</Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
