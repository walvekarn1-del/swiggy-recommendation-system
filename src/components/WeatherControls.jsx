import React, { useState } from "react";

export default function WeatherControls({ currentWeather, setCurrentWeather }) {
  const [isLocating, setIsLocating] = useState(false);

  const weatherOptions = [
    { id: "Sunny", label: "Sunny", emoji: "☀️", color: "#FFB300" },
    { id: "Rainy", label: "Rainy", emoji: "🌧️", color: "#3A88FE" },
    { id: "Cold", label: "Cold", emoji: "❄️", color: "#00E5FF" },
    { id: "Stormy", label: "Stormy", emoji: "⛈️", color: "#7C4DFF" },
    { id: "Humid", label: "Humid", emoji: "🌫️", color: "#00BFA5" }
  ];

  const handleGetLiveWeather = () => {
    setIsLocating(true);
    
    // Simulate real API fetching
    setTimeout(() => {
      // Pick random weather
      const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)].id;
      setCurrentWeather(randomWeather);
      setIsLocating(false);
    }, 1500);
  };

  return (
    <div className="glass-panel" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-title)" }}>Weather Simulator</h2>
        <span style={{ fontSize: "0.75rem", background: "rgba(252, 128, 25, 0.1)", color: "var(--swiggy-orange)", padding: "3px 8px", borderRadius: "10px", fontWeight: "600" }}>Live Sync Ready</span>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.4" }}>
        Change the weather to see how our AI engine dynamically adapts and suggests items (e.g., hot teas for monsoons, cool salads for summer).
      </p>

      {/* Grid of Weather buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {weatherOptions.map((opt) => {
          const isActive = currentWeather === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setCurrentWeather(opt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                background: isActive ? "var(--bg-app)" : "transparent",
                color: "var(--text-title)",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                borderColor: isActive ? opt.color : "var(--border-color)",
                boxShadow: isActive ? `0 0 12px ${opt.color}1c` : "none"
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Get live location weather button */}
      <button
        onClick={handleGetLiveWeather}
        disabled={isLocating}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--swiggy-orange)",
          background: "rgba(252, 128, 25, 0.03)",
          color: "var(--swiggy-orange)",
          fontSize: "0.85rem",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          transition: "all var(--transition-fast)"
        }}
      >
        {isLocating ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span>Locating Weather...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Detect Current Location Weather</span>
          </>
        )}
      </button>

      {/* Inline styles for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
