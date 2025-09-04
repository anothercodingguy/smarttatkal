const express = require('express');
const router = express.Router();

// Mock train data - in a real app, this would come from a database
const mockTrains = [
  {
    number: "12345",
    name: "Rajdhani Express",
    depart: "06:00",
    arrive: "14:30",
    from: "NDLS",
    to: "LKO",
    duration: "8h 30m"
  },
  {
    number: "12346",
    name: "Shatabdi Express",
    depart: "08:15",
    arrive: "16:45",
    from: "NDLS",
    to: "LKO",
    duration: "8h 30m"
  },
  {
    number: "12347",
    name: "Duronto Express",
    depart: "10:30",
    arrive: "19:00",
    from: "NDLS",
    to: "LKO",
    duration: "8h 30m"
  }
];

router.post('/', (req, res) => {
  try {
    const { from, to, date } = req.body;
    
    if (!from || !to || !date) {
      return res.status(400).json({ 
        error: "Missing required fields: from, to, date" 
      });
    }

    // Filter trains based on from and to stations
    const filteredTrains = mockTrains.filter(train => 
      train.from === from.toUpperCase() && train.to === to.toUpperCase()
    );

    res.json({ 
      success: true, 
      trains: filteredTrains,
      searchCriteria: { from, to, date }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
