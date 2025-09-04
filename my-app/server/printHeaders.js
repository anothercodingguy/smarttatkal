// printHeaders.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const filePath = path.join(__dirname, 'data', 'train_schedule.csv');

if (!fs.existsSync(filePath)) {
  console.error("❌ train_schedule.csv not found in /data folder");
  process.exit(1);
}

fs.createReadStream(filePath)
  .pipe(csv())
  .on('headers', (headers) => {
    console.log("✅ CSV Headers Detected:", headers);
    process.exit(0);
  })
  .on('error', (err) => {
    console.error("❌ Error reading CSV:", err);
    process.exit(1);
  });
