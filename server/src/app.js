require('dotenv').config();

const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const sessionSecret = process.env.SESSION_SECRET || 'eventlens-development-secret';

  if (isProduction && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is required in production.');
  }

  if (isProduction) {
    app.set('trust proxy', 1);
  }

  if (isProduction && process.env.DISABLE_HTTPS_REDIRECT !== 'true') {
    app.use((req, res, next) => {
      const forwardedProto = req.get('x-forwarded-proto');
      if (req.secure || forwardedProto === 'https') return next();
      return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
    });
  }

  app.use(helmet());
  app.use(compression());
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
  app.use(
    session({
      name: 'eventlens.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventlens',
        collectionName: 'sessions'
      }),
      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'EventLens' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/users', userRoutes);

  if (isProduction) {
    const clientBuildPath = path.resolve(__dirname, '../../dist/client');
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      return res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
