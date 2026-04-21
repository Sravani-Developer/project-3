const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['attendee', 'organizer'], default: 'attendee' },
    city: { type: String, trim: true, maxlength: 80 }
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    city: this.city || ''
  };
};

module.exports = mongoose.model('User', userSchema);
