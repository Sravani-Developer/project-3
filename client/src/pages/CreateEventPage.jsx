import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api/client.js';
import FormField from '../components/FormField.jsx';

const categories = ['Community', 'Education', 'Music', 'Networking', 'Sports', 'Technology', 'Wellness'];

function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    location: '',
    city: '',
    category: 'Technology',
    capacity: '',
    imageUrl: '',
    status: 'published'
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setErrors({});
    try {
      const data = await api.createEvent(form);
      navigate(`/events/${data.event._id}`);
    } catch (error) {
      setMessage(error.message);
      setErrors(error.errors || {});
    }
  }

  return (
    <main className="create-page">
      <Link className="text-link" to="/dashboard">Back to Dashboard</Link>
      <h1>Create Your Event</h1>
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
            </select>
          </FormField>
          <button className="button" type="submit">Create Event</button>
        </fieldset>
      </form>
    </main>
  );
}

export default CreateEventPage;
