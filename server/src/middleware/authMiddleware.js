const User = require('../models/User');

async function attachUser(req, res, next) {
  try {
    if (!req.session?.userId) {
      req.user = null;
      return next();
    }

    req.user = await User.findById(req.session.userId).select('-passwordHash');
    if (!req.user) {
      req.session.destroy(() => {});
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }
  return next();
}

function requireOrganizer(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Organizer access is required.' });
  }
  return next();
}

module.exports = { attachUser, requireAuth, requireOrganizer };
