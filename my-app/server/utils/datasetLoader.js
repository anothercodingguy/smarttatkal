// server/utils/datasetLoader.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let scheduleData = [];

/**
 * Load datasets (CSV)
 */
async function loadDatasets() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../data/train_schedule.csv");
    const rows = [];

    if (!fs.existsSync(filePath)) {
      return reject(new Error("train_schedule.csv not found in /data"));
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => {
        scheduleData = rows;
        console.log(`✅ Loaded ${rows.length} train records`);
        resolve();
      })
      .on("error", (err) => reject(err));
  });
}

function getScheduleData() {
  return scheduleData;
}

module.exports = { loadDatasets, getScheduleData };
