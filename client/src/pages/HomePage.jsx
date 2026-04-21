import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';

const categories = ['Community', 'Education', 'Music', 'Networking', 'Sports', 'Technology', 'Wellness'];
const sampleEvents = [
  {
    _id: 'sample-1',
    title: 'Campus Startup Mixer',
    category: 'Networking',
    eventDate: '2026-05-04',
    startTime: '18:00',
    city: 'Irvine',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    _id: 'sample-2',
    title: 'Community Wellness Morning',
    category: 'Wellness',
    eventDate: '2026-05-11',
    startTime: '09:30',
    city: 'Costa Mesa',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    _id: 'sample-3',
    title: 'AI Career Night',
    category: 'Technology',
    eventDate: '2026-05-14',
    startTime: '18:30',
    city: 'Irvine',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    _id: 'sample-4',
    title: 'Neighborhood Food Truck Night',
    category: 'Community',
    eventDate: '2026-05-18',
    startTime: '17:30',
    city: 'Newport Beach',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'
  },
  {
    _id: 'sample-5',
    title: 'Indie Music Patio Session',
    category: 'Music',
    eventDate: '2026-05-22',
    startTime: '19:00',
    city: 'Laguna Beach',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'
  }
];

function HomePage() {
  const location = useLocation();
  const [filters, setFilters] = useState({ search: '', category: '', city: '', date: '' });
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    api
      .getEvents(query)
      .then((data) => {
        if (!ignore) {
          setEvents(data.events);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!ignore) setStatus('offline');
      });
    return () => {
      ignore = true;
    };
  }, [query]);

  useEffect(() => {
    if (location.hash === '#events') {
      window.requestAnimationFrame(() => {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash]);

  function updateFilter(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  }

  function clearFilters() {
    setFilters({ search: '', category: '', city: '', date: '' });
  }

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const hasNoMatches = status === 'ready' && hasActiveFilters && events.length === 0;
  const displayEvents = status === 'offline' || (!hasActiveFilters && events.length === 0) ? sampleEvents : events;
  const featuredEvent = displayEvents[0];

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Discover - Create - Connect</p>
          <h1>Find the local events that fit your day.</h1>
          <p>Search by category, city, date, or keyword and keep every RSVP in one place.</p>
          <div className="hero-actions">
            <a className="button" href="#events">Explore events</a>
            <Link className="button button--ghost hero-secondary" to="/register">Create account</Link>
          </div>
        </div>
        <aside className="hero-feature">
          <span>Featured this week</span>
          <h2>{featuredEvent?.title || 'Local event discovery'}</h2>
          <p>{featuredEvent ? `${featuredEvent.city} - ${featuredEvent.startTime}` : 'Irvine - Today'}</p>
          <Link
            className="text-link"
            to={featuredEvent && !String(featuredEvent._id).startsWith('sample-') ? `/events/${featuredEvent._id}` : '/'}
          >
            View details
          </Link>
        </aside>
      </section>

      <section className="lens-flow" aria-label="How EventLens works">
        <div>
          <span>01</span>
          <strong>Focus the lens</strong>
          <p>Choose a category, city, date, or keyword.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Check the fit</strong>
          <p>Review time, place, host, and open capacity.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Save your spot</strong>
          <p>RSVP once and track it from your dashboard.</p>
        </div>
      </section>

      <section className="intro-band">
        <p className="eyebrow">Browse by interest</p>
        <h2>Follow one clear path from interest to RSVP.</h2>
        <p>EventLens is built around a focused event lens: pick what matters, compare useful details, and keep attendance organized.</p>
      </section>

      <section className="category-strip" aria-label="Event categories">
        {categories.map((category) => (
          <button
            className={filters.category === category ? 'category-pill category-pill--active' : 'category-pill'}
            key={category}
            type="button"
            onClick={() => setFilters({ ...filters, category: filters.category === category ? '' : category })}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="discover-section" id="events">
        <form className="search-panel">
          <input name="search" placeholder="Search events" value={filters.search} onChange={updateFilter} />
          <input name="city" placeholder="City" value={filters.city} onChange={updateFilter} />
          <input name="date" type="date" value={filters.date} onChange={updateFilter} />
          <select name="category" value={filters.category} onChange={updateFilter}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <button className="button button--ghost" type="button" onClick={clearFilters}>Clear</button>
        </form>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Discover</p>
            <h2>Events open for RSVP</h2>
          </div>
          <p>{status === 'offline' ? 'Sample listings shown while the API is unavailable.' : 'Public events open for RSVP.'}</p>
        </div>

        {hasNoMatches ? (
          <div className="empty-state">
            <p className="eyebrow">No matches</p>
            <h3>No events found for {filters.category || 'these filters'}.</h3>
            <p>Try another category, city, date, or keyword.</p>
            <button className="button button--ghost" type="button" onClick={clearFilters}>Show all events</button>
          </div>
        ) : (
          <div className="event-grid">
            {displayEvents.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <strong>EventLens</strong>
        <span>Discover local events. Create meaningful gatherings. Manage every RSVP.</span>
      </footer>
    </main>
  );
}

export default HomePage;
