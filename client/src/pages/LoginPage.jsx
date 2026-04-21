import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import FormField from '../components/FormField.jsx';
import { useAuth } from '../state/AuthContext.jsx';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form);
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
        <p>Welcome Back</p>
      </section>
      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          {message && <p className="form-message">{message}</p>}
          <FormField label="Email" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={updateField} required />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input name="password" type="password" value={form.password} onChange={updateField} required />
          </FormField>
          <button className="button" type="submit">Sign in</button>
          <p>New to EventLens? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
