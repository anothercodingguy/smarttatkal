"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookingResult } from "../../types";
import { apiRequest } from "../../lib/api";

function BookingForm() {
  const searchParams = useSearchParams();
  const trainNumber = searchParams.get("train") || "";
  
  const [formData, setFormData] = useState({
    trainNumber: trainNumber,
    from: "",
    to: "",
    date: "",
    classType: "",
    passengers: 1,
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBooking(null);

    if (!formData.trainNumber || !formData.from || !formData.to || !formData.date || !formData.classType) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/api/booking", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data = await res.json();
      setBooking(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to book ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold">📱 Book Ticket</h1>
          <p className="text-gray-600 mt-1">Reserve your railway journey</p>
        </header>

        {/* Booking Form */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-3">Journey Details</h2>
          <p className="text-sm text-gray-500 mb-4">Fill in your travel information</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Train Number *</span>
                <input
                  name="trainNumber"
                  value={formData.trainNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 12345"
                  className="border p-2 rounded"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Date *</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">From Station *</span>
                <input
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  placeholder="e.g. NDLS"
                  className="border p-2 rounded"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">To Station *</span>
                <input
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  placeholder="e.g. LKO"
                  className="border p-2 rounded"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Class Type *</span>
                <select
                  name="classType"
                  value={formData.classType}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  required
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
                <span className="text-sm text-gray-700 mb-1">Number of Passengers</span>
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  min="1"
                  max="6"
                />
              </label>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Passenger Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Full Name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="border p-2 rounded"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Age</span>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                    className="border p-2 rounded"
                    min="1"
                    max="120"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Gender</span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Phone Number</span>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    className="border p-2 rounded"
                    maxLength={10}
                  />
                </label>

                <label className="flex flex-col sm:col-span-2">
                  <span className="text-sm text-gray-700 mb-1">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="border p-2 rounded"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 text-lg font-medium"
                disabled={loading}
              >
                {loading ? "Processing…" : "Book Ticket"}
              </button>
            </div>

            {error && <p className="text-red-600 mt-3">{error}</p>}
          </form>
        </section>

        {/* Booking Result */}
        {booking && (
          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-green-800">Booking Confirmed!</h3>
            <div className="space-y-2 text-green-700">
              <p><strong>Message:</strong> {booking.message || "Your ticket has been booked successfully!"}</p>
              <p><strong>Reference:</strong> {booking.reference || "N/A"}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
