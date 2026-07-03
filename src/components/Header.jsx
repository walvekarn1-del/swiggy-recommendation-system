import React from "react";

export default function Header({ 
  currentPersona, 
  currentWeather, 
  cartCount, 
  onToggleEmailDrawer, 
  unreadEmails,
  theme,
  setTheme
}) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="glass-panel" style={{
      margin: "24px 24px 0 24px",
      padding: "16px 28px",
      display: "flex",
      justifyContent: "space-between",
      alignComponents: "center",
      alignItems: "center",
      borderRadius: "var(--radius-lg)"
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "pulseGlow 2s infinite" }}>
          <rect width="40" height="40" rx="12" fill="var(--swiggy-orange)" />
          <path d="M12 25C15 28 22 29 25 25C28 21 27 15 23 12C19 9 14 11 12 15C10 19 9 22 12 25Z" fill="white" />
          <circle cx="20" cy="18" r="4" fill="var(--swiggy-orange)" />
        </svg>
        <div>
          <h1 style={{ 
            fontSize: "1.4rem", 
            fontWeight: "800", 
            color: "var(--text-title)",
            letterSpacing: "-0.5px"
          }}>
            swiggy<span style={{ color: "var(--swiggy-orange)", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>AI</span>
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500" }}>Recommendation Engine</p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {/* Weather Indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          background: "var(--bg-app)",
          borderRadius: "30px",
          fontSize: "0.85rem",
          fontWeight: "600",
          border: "1px solid var(--border-color)"
        }}>
          <span>
            {currentWeather === "Sunny" && "☀️"}
            {currentWeather === "Rainy" && "🌧️"}
            {currentWeather === "Cold" && "❄️"}
            {currentWeather === "Stormy" && "⛈️"}
            {currentWeather === "Humid" && "🌫️"}
          </span>
          <span style={{ textTransform: "capitalize", color: "var(--text-title)" }}>{currentWeather}</span>
        </div>

        {/* Persona Active Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          background: "var(--bg-app)",
          borderRadius: "30px",
          fontSize: "0.85rem",
          fontWeight: "600",
          border: "1px solid var(--border-color)"
        }}>
          <span>{currentPersona.avatar}</span>
          <span style={{ color: "var(--text-title)" }}>{currentPersona.name}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        {/* Mail Inbox Button */}
        <button 
          onClick={onToggleEmailDrawer}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--bg-app)",
            border: "1px solid var(--border-color)",
            transition: "all var(--transition-fast)"
          }}
          title="Simulated Mailbox"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-title)" }}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {unreadEmails > 0 && (
            <span style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              background: "#EF4444",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: "800",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid var(--bg-card)"
            }}>
              {unreadEmails}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--bg-app)",
            border: "1px solid var(--border-color)",
            transition: "all var(--transition-fast)"
          }}
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-title)" }}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-title)" }}>
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        {/* Cart Panel Button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--swiggy-orange)",
          color: "white",
          padding: "10px 18px",
          borderRadius: "30px",
          fontWeight: "700",
          fontSize: "0.9rem",
          boxShadow: "0 4px 12px rgba(252, 128, 25, 0.2)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span>{cartCount} Items</span>
        </div>
      </div>
    </header>
  );
}
