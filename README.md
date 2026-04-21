# EventLens

EventLens is a full-stack Single Page Application for discovering, creating, and joining local events. It follows the Project 3 requirements: React SPA frontend, Express backend, MongoDB with Mongoose, session/cookie authentication, protected routes, validation, SASS styling, PWA support, GitHub delivery, and live HTTPS deployment.

## Features

- Signup, login, logout with cookie-backed sessions
- Password hashing with bcrypt
- Role-aware accounts for attendees and organizers
- Public event discovery with keyword, category, date, and location filters
- Organizer event CRUD with validation
- RSVP and RSVP cancellation with capacity checks
- Personal dashboard for created and attending events
- Responsive frontend based on the submitted EventLens wireframes
- PWA manifest and service worker
- Security middleware for headers, CORS credentials, sessions, and rate limits
- Unit tests for validation rules

## Tech Stack

- React, React Router, Vite
- SASS and Bootstrap 5
- Node.js, Express
- MongoDB, Mongoose
- express-session, connect-mongo, bcrypt
- Node test runner

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment values:

```bash
copy .env.example .env
```

3. Update `.env` with your MongoDB connection string and session secret.

4. Run the app in development:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000`.

Optional demo data:

```bash
npm run seed
```

Seeded logins use `Password123` for both `organizer@eventlens.test` and `attendee@eventlens.test`.

## Scripts

- `npm run dev` starts the API and React app together
- `npm run server` starts only the Express API
- `npm run client` starts only the React app
- `npm run build` builds the React production bundle
- `npm run seed` creates EventLens demo users and events
- `npm test` runs unit tests

## Deployment Notes

Deploy the client and API behind HTTPS. In production, set `NODE_ENV=production`, provide `MONGO_URI`, `SESSION_SECRET`, and `CLIENT_ORIGIN`, and serve the app from an SSL-enabled hosting provider so secure cookies and encrypted traffic work correctly. Production mode redirects HTTP requests to HTTPS unless `DISABLE_HTTPS_REDIRECT=true` is set for a special hosting environment.
