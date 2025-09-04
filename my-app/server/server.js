// server/server.js
const express = require('express');
const cors = require('cors');
const { loadDatasets } = require('./utils/datasetLoader');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ SmartTatkal Backend is running");
});

// Import routes
const bookingRoutes = require('./routes/booking');
const pnrRoutes = require('./routes/pnr');
const trainStatusRoutes = require('./routes/trainStatus');
const waitlistRoutes = require('./routes/waitlist');
const searchRoutes = require('./routes/search');

app.use('/api/booking', bookingRoutes);
app.use('/api/pnr', pnrRoutes);
app.use('/api/train-status', trainStatusRoutes);
app.use('/api/waitlist-predict', waitlistRoutes);
app.use('/api/search', searchRoutes);

// Load dataset before starting server
loadDatasets()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to load dataset:", err);
  });

