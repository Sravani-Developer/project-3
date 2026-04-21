import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import FormField from '../components/FormField.jsx';
import { useAuth } from '../state/AuthContext.jsx';

function RegisterPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'organizer', city: '' });
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
      await signup(form);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message);
      setErrors(error.errors || {});
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel--intro">
        <h1>EventLens</h1>
        <p>Create your account</p>
      </section>
      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          {message && <p className="form-message">{message}</p>}
          <FormField label="Full Name" error={errors.fullName}>
            <input name="fullName" value={form.fullName} onChange={updateField} required />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={updateField} required />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input name="password" type="password" value={form.password} onChange={updateField} minLength="8" required />
          </FormField>
          <FormField label="City" error={errors.city}>
            <input name="city" value={form.city} onChange={updateField} />
          </FormField>
          <fieldset className="radio-group">
            <legend>I want to</legend>
            <label><input type="radio" name="role" value="organizer" checked={form.role === 'organizer'} onChange={updateField} />Organize events</label>
            <label><input type="radio" name="role" value="attendee" checked={form.role === 'attendee'} onChange={updateField} />Attend events</label>
            {errors.role && <strong>{errors.role}</strong>}
          </fieldset>
          <button className="button" type="submit">Create account</button>
          <p>Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
