const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventlens';
  if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in production.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
}

module.exports = { connectDatabase };
