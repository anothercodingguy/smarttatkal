const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: "Booking simulation placeholder" });
});

module.exports = router;
