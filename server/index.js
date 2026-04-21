const mongoose = require('mongoose');
const { createApp } = require('./src/app');
const { connectDatabase } = require('./src/config/database');

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    const app = createApp();
    app.listen(port, () => {
      console.log(`EventLens API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start EventLens API:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

startServer();
