"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PNRStatus } from "../../types";
import { apiRequest } from "../../lib/api";

export default function PNRPage() {
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PNRStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckPNR = async () => {
    setError(null);
    setStatus(null);

    if (!pnr) {
      setError("Please enter PNR number.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/api/pnr", {
        method: "POST",
        body: JSON.stringify({ pnr }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data = await res.json();
      setStatus(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to check PNR status");
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
          <h1 className="text-3xl md:text-4xl font-semibold">🚂 PNR Status</h1>
          <p className="text-gray-600 mt-1">Check your ticket confirmation status</p>
        </header>

        {/* PNR Form */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-3">Enter PNR Number</h2>
          <p className="text-sm text-gray-500 mb-4">Get real-time status of your booking</p>

          <div className="flex gap-3">
            <input
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              placeholder="Enter 10-digit PNR number"
              className="flex-1 border p-2 rounded"
              maxLength={10}
            />
            <button
              onClick={handleCheckPNR}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Checking…" : "Check Status"}
            </button>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </section>

        {/* PNR Result */}
        {status && (
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-blue-800">PNR Status</h3>
            <div className="space-y-2 text-blue-700">
              <p><strong>PNR:</strong> {status.pnr || "N/A"}</p>
              <p><strong>Status:</strong> {status.status || "N/A"}</p>
              <p><strong>Message:</strong> {status.message || "N/A"}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
