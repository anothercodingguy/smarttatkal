// server/routes/search.js
const express = require("express");
const router = express.Router();
const { getScheduleData } = require("../utils/datasetLoader");

function norm(s) {
  return (s || "").toString().trim().toUpperCase();
}

router.post("/", (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) {
    return res
      .status(400)
      .json({ success: false, message: "from & to required" });
  }

  const schedule = getScheduleData();
  if (!schedule || schedule.length === 0) {
    return res
      .status(500)
      .json({ success: false, message: "Schedule not loaded" });
  }

  const results = [];

  for (const r of schedule) {
    const trainNo =
      r["Train Number"] || r.TrainNo || r.Train || r["train_number"];
    const src = r["Source Station"] || r.Source || r.src;
    const dest = r["Destination Station"] || r.Destination || r.dest;

    if (!trainNo || !src || !dest) continue;

    if (norm(src) === norm(from) && norm(dest) === norm(to)) {
      results.push({
        number: trainNo,
        from: norm(src),
        to: norm(dest),
        depart: r["Booking Date"] || "",
        arrive: r["Date of Journey"] || "",
      });
    }
  }

  res.json({ success: true, trains: results.slice(0, 30) });
});

module.exports = router;