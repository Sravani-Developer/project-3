import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { api } from '../api/client.js';
import FormField from '../components/FormField.jsx';

const categories = ['Community', 'Education', 'Music', 'Networking', 'Sports', 'Technology', 'Wellness'];

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .getEvent(id)
      .then((data) => {
        const event = data.event;
        setForm({
          title: event.title || '',
          description: event.description || '',
          eventDate: event.eventDate ? event.eventDate.slice(0, 10) : '',
          startTime: event.startTime || '',
          location: event.location || '',
          city: event.city || '',
          category: event.category || 'Technology',
          capacity: event.capacity || '',
          imageUrl: event.imageUrl || '',
          status: event.status || 'published'
        });
      })
      .catch((error) => setMessage(error.message));
  }, [id]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setErrors({});
    try {
      const data = await api.updateEvent(id, form);
      navigate(`/events/${data.event._id}`);
    } catch (error) {
      setMessage(error.message);
      setErrors(error.errors || {});
    }
  }

  if (!form) return <main className="content-page">{message || 'Loading event...'}</main>;

  return (
    <main className="create-page">
      <Link className="text-link" to={`/events/${id}`}>Back to Event</Link>
      <h1>Edit Event</h1>
      {message && <p className="form-message">{message}</p>}
      <form className="event-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Basic Information</legend>
          <FormField label="Title" error={errors.title}><input name="title" value={form.title} onChange={updateField} required /></FormField>
          <FormField label="Description" error={errors.description}><textarea name="description" rows="5" value={form.description} onChange={updateField} required /></FormField>
        </fieldset>
        <fieldset>
          <legend>Date - Time - Location</legend>
          <FormField label="Event Date" error={errors.eventDate}><input name="eventDate" type="date" value={form.eventDate} onChange={updateField} required /></FormField>
          <FormField label="Start Time" error={errors.startTime}><input name="startTime" type="time" value={form.startTime} onChange={updateField} required /></FormField>
          <FormField label="Location Address" error={errors.location}><input name="location" value={form.location} onChange={updateField} required /></FormField>
          <FormField label="City" error={errors.city}><input name="city" value={form.city} onChange={updateField} required /></FormField>
        </fieldset>
        <fieldset>
          <legend>Publishing</legend>
          <FormField label="Category" error={errors.category}>
            <select name="category" value={form.category} onChange={updateField}>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </FormField>
          <FormField label="Capacity" error={errors.capacity}><input name="capacity" type="number" min="1" value={form.capacity} onChange={updateField} required /></FormField>
          <FormField label="Image URL"><input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} /></FormField>
          <FormField label="Status" error={errors.status}>
            <select name="status" value={form.status} onChange={updateField}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormField>
          <button className="button" type="submit">Save Event</button>
        </fieldset>
      </form>
    </main>
  );
}

export default EditEventPage;
