export function formatEventDate(value) {
  if (!value) return 'Date pending';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
