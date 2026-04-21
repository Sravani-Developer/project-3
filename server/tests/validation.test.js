const test = require('node:test');
const assert = require('node:assert/strict');

const { validateSignup, validateLogin, validateEvent } = require('../src/utils/validation');

test('validateSignup accepts organizer accounts from the wireframe', () => {
  const result = validateSignup({
    fullName: 'Ava Organizer',
    email: 'ava@example.com',
    password: 'password123',
    role: 'organizer'
  });

  assert.equal(result.isValid, true);
  assert.equal(result.values.email, 'ava@example.com');
  assert.equal(result.values.role, 'organizer');
});

test('validateLogin rejects malformed credentials', () => {
  const result = validateLogin({ email: 'not-email', password: '' });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, 'Enter a valid email address.');
  assert.equal(result.errors.password, 'Password is required.');
});

test('validateEvent enforces key Project 3 form validation rules', () => {
  const result = validateEvent({
    title: 'AI Career Night',
    description: 'A practical meetup for students and professionals exploring AI careers.',
    category: 'Technology',
    eventDate: '2026-05-14',
    startTime: '18:30',
    location: 'Westcliff University',
    city: 'Irvine',
    capacity: '80',
    status: 'published'
  });

  assert.equal(result.isValid, true);
  assert.equal(result.values.capacity, 80);
});

test('validateEvent rejects invalid capacity and category', () => {
  const result = validateEvent({
    title: 'AI',
    description: 'Too short',
    category: 'Invalid',
    eventDate: 'bad-date',
    startTime: '9pm',
    location: '',
    city: '',
    capacity: '0'
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.title);
  assert.ok(result.errors.description);
  assert.ok(result.errors.category);
  assert.ok(result.errors.capacity);
});
