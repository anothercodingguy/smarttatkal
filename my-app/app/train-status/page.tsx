"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrainStatus } from "../../types";

export default function TrainStatusPage() {
  const [trainNumber, setTrainNumber] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TrainStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setError(null);
    setStatus(null);

    if (!trainNumber || !date) {
      setError("Please enter train number and date.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/train-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNumber,
          date,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data = await res.json();
      setStatus(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to check train status");
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
          <h1 className="text-3xl md:text-4xl font-semibold">📊 Train Status</h1>
          <p className="text-gray-600 mt-1">Check real-time train running status</p>
        </header>

        {/* Status Form */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-3">Enter Train Details</h2>
          <p className="text-sm text-gray-500 mb-4">Get current running status and delays</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCheckStatus}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Checking…" : "Check Status"}
            </button>

            <button
              onClick={() => {
                setTrainNumber("");
                setDate("");
                setStatus(null);
                setError(null);
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </section>

        {/* Status Result */}
        {status && (
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-blue-800">Train Status</h3>
            <div className="space-y-2 text-blue-700">
              <p><strong>Train Number:</strong> {status.trainNumber || "N/A"}</p>
              <p><strong>Date:</strong> {status.date || "N/A"}</p>
              <p><strong>Status:</strong> {status.status || "N/A"}</p>
              <p><strong>Message:</strong> {status.message || "N/A"}</p>
            </div>
          </section>
        )}

        {/* Help Section */}
        <section className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">💡 Tips</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Enter the exact 5-digit train number</li>
            <li>• Select the journey date</li>
            <li>• Status updates are real-time</li>
            <li>• Check for delays and platform changes</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
