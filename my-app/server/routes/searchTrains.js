import React, { useState } from "react";

export default function SearchTrains() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!from || !to) {
      alert("Please enter both From and To stations");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Search failed");
      } else {
        setResults(data.trains || []);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error contacting backend");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚆 Search Trains</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="From (e.g. NDLS)"
          className="border p-2 flex-1 rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="text"
          placeholder="To (e.g. CSMT)"
          className="border p-2 flex-1 rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <div className="mt-6">
        {results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((train, idx) => (
              <li
                key={idx}
                className="border rounded p-3 bg-white shadow-sm flex justify-between"
              >
                <div>
                  <div className="font-semibold">Train {train.number}</div>
                  <div className="text-sm text-gray-600">
                    {train.from} → {train.to}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    Depart: {train.depart || "--"}
                  </div>
                  <div className="text-sm">
                    Arrive: {train.arrive || "--"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-4">No results yet.</p>
        )}
      </div>
    </div>
  );
}
