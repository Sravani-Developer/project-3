const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['Community', 'Education', 'Music', 'Networking', 'Sports', 'Technology', 'Wellness']
    },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    capacity: { type: Number, required: true, min: 1, max: 10000 },
    imageUrl: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'published' },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', city: 'text', category: 'text' });

eventSchema.virtual('spotsRemaining').get(function spotsRemaining() {
  return Math.max(this.capacity - this.attendees.length, 0);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
