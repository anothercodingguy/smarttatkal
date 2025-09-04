"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Train, SearchResult } from "../types";
import { apiRequest } from "../lib/api";

export default function HomePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState<Train[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setTrains(null);

    if (!from || !to || !date) {
      setError("Please fill source, destination and date.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/api/search", {
        method: "POST",
        body: JSON.stringify({
          from,
          to,
          date,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data: SearchResult = await res.json();
      setTrains(data.trains || []);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to search trains");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold">🚆 Smart Tatkal</h1>
          <p className="text-gray-600 mt-1">
            Your intelligent railway booking companion
          </p>
        </header>

        {/* Search panel */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-3">Search Trains</h2>
          <p className="text-sm text-gray-500 mb-4">
            Find available trains between stations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Source Station</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. NDLS or New Delhi"
                className="border p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">
                Destination Station
              </span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. LKO or Lucknow"
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

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Searching…" : "Search Trains"}
            </button>

            <div className="text-sm text-gray-500">or</div>

            <Link href="/waitlist-predict" className="text-blue-600 underline">
              Check Waitlist Prediction
            </Link>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/pnr"
              className="p-3 border rounded text-center text-sm hover:bg-gray-50"
            >
              🚂 Check PNR Status
            </Link>
            <Link
              href="/booking"
              className="p-3 border rounded text-center text-sm hover:bg-gray-50"
            >
              📱 Book Ticket
            </Link>
            <Link
              href="/train-status"
              className="p-3 border rounded text-center text-sm hover:bg-gray-50"
            >
              📊 Train Status
            </Link>
            <Link
              href="/waitlist-predict"
              className="p-3 border rounded text-center text-sm hover:bg-gray-50"
            >
              🎯 Waitlist Prediction
            </Link>
          </div>
        </section>

        {/* Results */}
        <section>
          <h3 className="text-lg font-medium mb-2">Available Trains</h3>

          {!trains && (
            <p className="text-sm text-gray-500">
              Search trains to see available services.
            </p>
          )}

          {trains && trains.length === 0 && (
            <p className="text-sm text-gray-500">
              No trains found for the selected route/date.
            </p>
          )}

          {trains && trains.length > 0 && (
            <ul className="space-y-3">
              {trains.map((t) => (
                <li
                  key={t.number}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm font-semibold">
                      {t.number} • {t.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.depart} → {t.arrive}{" "}
                      {t.duration ? `• ${t.duration}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      {t.from} → {t.to}
                    </div>
                    <Link
                      href={`/booking?train=${t.number}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Book
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
