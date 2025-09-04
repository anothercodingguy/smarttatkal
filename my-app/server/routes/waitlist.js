const express = require('express');
const router = express.Router();
const predictor = require('../utils/predictor');

router.post('/', async (req, res) => {
  try {
    const { trainNumber, date, classType, waitlistPosition } = req.body;

    if (!trainNumber || !date || !classType || !waitlistPosition) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prediction = await predictor(trainNumber, date, classType, waitlistPosition);
    res.json({ success: true, prediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
