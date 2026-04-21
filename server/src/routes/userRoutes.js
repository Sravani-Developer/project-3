const express = require('express');

const { attachUser, requireAuth } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.use(attachUser);

router.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : '';
    const city = typeof req.body.city === 'string' ? req.body.city.trim() : '';

    if (fullName.length < 2) {
      return res.status(400).json({ message: 'Full name must be at least 2 characters.' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { fullName, city }, { new: true, runValidators: true });
    return res.json({ user: user.toSafeObject() });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
