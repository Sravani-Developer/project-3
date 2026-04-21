const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { attachUser, requireAuth } = require('../middleware/authMiddleware');
const { validateSignup, validateLogin } = require('../utils/validation');

const router = express.Router();

router.use(attachUser);

router.get('/me', (req, res) => {
  res.json({ user: req.user ? req.user.toSafeObject() : null });
});

router.post('/signup', async (req, res, next) => {
  try {
    const result = validateSignup(req.body);
    if (!result.isValid) {
      return res.status(400).json({ message: 'Please fix the signup form.', errors: result.errors });
    }

    const existingUser = await User.findOne({ email: result.values.email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(result.values.password, 12);
    const user = await User.create({
      fullName: result.values.fullName,
      email: result.values.email,
      passwordHash,
      role: result.values.role,
      city: result.values.city
    });

    req.session.userId = user._id.toString();
    return res.status(201).json({ user: user.toSafeObject() });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = validateLogin(req.body);
    if (!result.isValid) {
      return res.status(400).json({ message: 'Please fix the login form.', errors: result.errors });
    }

    const user = await User.findOne({ email: result.values.email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    const isMatch = await bcrypt.compare(result.values.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    req.session.userId = user._id.toString();
    return res.json({ user: user.toSafeObject() });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', requireAuth, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('eventlens.sid');
    return res.json({ message: 'Signed out successfully.' });
  });
});

module.exports = router;
