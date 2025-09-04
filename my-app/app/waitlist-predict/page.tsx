"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WaitlistPrediction } from "../../types";

export default function WaitlistPredictPage() {
  const [trainNumber, setTrainNumber] = useState("");
  const [date, setDate] = useState("");
  const [classType, setClassType] = useState("");
  const [waitlistPosition, setWaitlistPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<WaitlistPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setError(null);
    setPrediction(null);

    if (!trainNumber || !date || !classType || !waitlistPosition) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNumber,
          date,
          classType,
          waitlistPosition: parseInt(waitlistPosition),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold">🎯 Waitlist Prediction</h1>
          <p className="text-gray-600 mt-1">Predict your chances of getting confirmed</p>
        </header>

        {/* Prediction Form */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-3">Enter Details</h2>
          <p className="text-sm text-gray-500 mb-4">Get AI-powered waitlist confirmation predictions</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Train Number</span>
              <input
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g. 12345"
                className="border p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Class Type</span>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Class</option>
                <option value="SL">Sleeper (SL)</option>
                <option value="3A">AC 3 Tier (3A)</option>
                <option value="2A">AC 2 Tier (2A)</option>
                <option value="1A">AC First Class (1A)</option>
                <option value="CC">Chair Car (CC)</option>
                <option value="EC">Executive Class (EC)</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Waitlist Position</span>
              <input
                type="number"
                value={waitlistPosition}
                onChange={(e) => setWaitlistPosition(e.target.value)}
                placeholder="e.g. 15"
                className="border p-2 rounded"
                min="1"
              />
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={handlePredict}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Predicting…" : "Get Prediction"}
            </button>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </section>

        {/* Prediction Result */}
        {prediction && (
          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-green-800">Prediction Result</h3>
            <div className="space-y-2 text-green-700">
              <p><strong>Confirmation Probability:</strong> {prediction.probability || "N/A"}%</p>
              <p><strong>Expected Wait Time:</strong> {prediction.waitTime || "N/A"} days</p>
              <p><strong>Recommendation:</strong> {prediction.recommendation || "N/A"}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
