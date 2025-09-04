// server/utils/predictor.js
async function predictor(trainNumber, date, classType, waitlistPosition) {
  // Simple prediction logic - in a real app, this would use ML models
  let probability = 0;
  let waitTime = 0;
  let recommendation = "";

  // Calculate probability based on waitlist position
  if (waitlistPosition <= 5) {
    probability = 95;
    waitTime = 1;
    recommendation = "Very high chance of confirmation";
  } else if (waitlistPosition <= 15) {
    probability = 75;
    waitTime = 2;
    recommendation = "Good chance of confirmation";
  } else if (waitlistPosition <= 30) {
    probability = 50;
    waitTime = 3;
    recommendation = "Moderate chance of confirmation";
  } else if (waitlistPosition <= 50) {
    probability = 25;
    waitTime = 5;
    recommendation = "Low chance, consider alternative trains";
  } else {
    probability = 10;
    waitTime = 7;
    recommendation = "Very low chance, book alternative train";
  }

  // Adjust based on class type
  if (classType === "SL") {
    probability += 5; // Sleeper class has slightly higher chances
  } else if (classType === "1A" || classType === "2A") {
    probability -= 5; // AC classes have slightly lower chances
  }

  // Ensure probability stays within bounds
  probability = Math.min(100, Math.max(0, probability));

  return {
    probability,
    waitTime,
    recommendation,
    trainNumber,
    date,
    classType,
    waitlistPosition
  };
}

module.exports = predictor;
  