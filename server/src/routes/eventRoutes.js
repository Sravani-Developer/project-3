const express = require('express');

const Event = require('../models/Event');
const { attachUser, requireAuth, requireOrganizer } = require('../middleware/authMiddleware');
const { validateEvent, categories } = require('../utils/validation');

const router = express.Router();

router.use(attachUser);

router.get('/meta/categories', (req, res) => {
  res.json({ categories });
});

router.get('/', async (req, res, next) => {
  try {
    const { search, category, city, date } = req.query;
    const query = { status: 'published' };

    if (category && categories.includes(category)) query.category = category;
    if (city) query.city = new RegExp(city, 'i');
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.eventDate = { $gte: start, $lt: end };
    }
    if (search) query.$text = { $search: search };

    const events = await Event.find(query)
      .populate('organizer', 'fullName email')
      .sort({ eventDate: 1, startTime: 1 })
      .limit(60);

    res.json({ events });
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const [createdEvents, attendingEvents] = await Promise.all([
      Event.find({ organizer: req.user._id }).sort({ eventDate: 1 }),
      Event.find({ attendees: req.user._id, status: { $ne: 'cancelled' } })
        .populate('organizer', 'fullName email')
        .sort({ eventDate: 1 })
    ]);

    res.json({ createdEvents, attendingEvents });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'fullName email city')
      .populate('attendees', 'fullName email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    return res.json({ event });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireOrganizer, async (req, res, next) => {
  try {
    const result = validateEvent(req.body);
    if (!result.isValid) {
      return res.status(400).json({ message: 'Please fix the event form.', errors: result.errors });
    }

    const event = await Event.create({ ...result.values, organizer: req.user._id, attendees: [] });
    return res.status(201).json({ event });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireOrganizer, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit events you created.' });
    }

    const result = validateEvent(req.body);
    if (!result.isValid) {
      return res.status(400).json({ message: 'Please fix the event form.', errors: result.errors });
    }

    Object.assign(event, result.values);
    await event.save();
    return res.json({ event });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireOrganizer, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete events you created.' });
    }

    await event.deleteOne();
    return res.json({ message: 'Event deleted.' });
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/rsvp', requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    if (event.status !== 'published') {
      return res.status(400).json({ message: 'This event is not open for RSVP.' });
    }
    if (event.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Organizers are already connected to their own event.' });
    }
    if (event.attendees.some((attendeeId) => attendeeId.toString() === req.user._id.toString())) {
      return res.status(409).json({ message: 'You are already registered for this event.' });
    }
    if (event.attendees.length >= event.capacity) {
      return res.status(409).json({ message: 'This event has reached capacity.' });
    }

    event.attendees.push(req.user._id);
    await event.save();
    return res.json({ event });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id/rsvp', requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    event.attendees = event.attendees.filter((attendeeId) => attendeeId.toString() !== req.user._id.toString());
    await event.save();
    return res.json({ event });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
