const categories = ['Community', 'Education', 'Music', 'Networking', 'Sports', 'Technology', 'Wellness'];
const roles = ['attendee', 'organizer'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateSignup(input) {
  const errors = {};
  const fullName = cleanString(input.fullName);
  const email = cleanString(input.email).toLowerCase();
  const password = typeof input.password === 'string' ? input.password : '';
  const role = cleanString(input.role) || 'attendee';
  const city = cleanString(input.city);

  if (fullName.length < 2) errors.fullName = 'Full name must be at least 2 characters.';
  if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (!roles.includes(role)) errors.role = 'Choose a valid account type.';

  return { isValid: Object.keys(errors).length === 0, errors, values: { fullName, email, password, role, city } };
}

function validateLogin(input) {
  const errors = {};
  const email = cleanString(input.email).toLowerCase();
  const password = typeof input.password === 'string' ? input.password : '';

  if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';

  return { isValid: Object.keys(errors).length === 0, errors, values: { email, password } };
}

function validateEvent(input) {
  const errors = {};
  const title = cleanString(input.title);
  const description = cleanString(input.description);
  const category = cleanString(input.category);
  const eventDate = cleanString(input.eventDate);
  const startTime = cleanString(input.startTime);
  const location = cleanString(input.location);
  const city = cleanString(input.city);
  const imageUrl = cleanString(input.imageUrl);
  const status = cleanString(input.status) || 'published';
  const capacity = Number(input.capacity);

  if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
  if (description.length < 20) errors.description = 'Description must be at least 20 characters.';
  if (!categories.includes(category)) errors.category = 'Choose a valid category.';
  if (!eventDate || Number.isNaN(Date.parse(eventDate))) errors.eventDate = 'Choose a valid date.';
  if (!timePattern.test(startTime)) errors.startTime = 'Start time must use HH:MM format.';
  if (location.length < 3) errors.location = 'Location address is required.';
  if (city.length < 2) errors.city = 'City is required.';
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000) {
    errors.capacity = 'Capacity must be a whole number from 1 to 10000.';
  }
  if (!['draft', 'published', 'cancelled'].includes(status)) errors.status = 'Choose a valid status.';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: { title, description, category, eventDate, startTime, location, city, capacity, imageUrl, status }
  };
}

module.exports = { categories, validateSignup, validateLogin, validateEvent };
