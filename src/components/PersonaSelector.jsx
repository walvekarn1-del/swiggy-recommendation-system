import React, { useState } from "react";
import { personasData } from "../data/personas";

export default function PersonaSelector({ currentPersona, setCurrentPersona }) {
  const [isEditing, setIsEditing] = useState(false);

  // For custom profile sliders
  const handleCustomChange = (field, value) => {
    const updated = {
      ...currentPersona,
      id: "custom",
      name: currentPersona.id === "custom" ? currentPersona.name : "Custom Profile",
      avatar: "👤",
      [field]: value
    };
    setCurrentPersona(updated);
  };

  return (
    <div className="glass-panel" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-title)" }}>Target Persona</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          style={{
            background: "none",
            border: "none",
            color: "var(--swiggy-orange)",
            fontSize: "0.8rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {isEditing ? "Done Tuning" : "Tune Custom"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
      </div>

      {!isEditing ? (
        // Standard presets list
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {personasData.map((p) => {
            const isActive = currentPersona.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setCurrentPersona(p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  background: isActive ? "var(--bg-app)" : "transparent",
                  borderColor: isActive ? "var(--swiggy-orange)" : "var(--border-color)",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span style={{ fontSize: "1.6rem" }}>{p.avatar}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-title)", margin: 0 }}>{p.name}</h4>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>{p.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Custom sliders tuning panel
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "8px 0" }}>
          {/* Dietary Select */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-title)", display: "block", marginBottom: "6px" }}>Dietary Preference</label>
            <select
              value={currentPersona.dietary}
              onChange={(e) => handleCustomChange("dietary", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-app)",
                color: "var(--text-title)",
                fontSize: "0.8rem",
                fontWeight: "600",
                outline: "none"
              }}
            >
              <option value="All">All Food Types</option>
              <option value="Veg">Vegetarian Only</option>
            </select>
          </div>

          {/* Budget Limit Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-title)", marginBottom: "6px" }}>
              <span>Max Budget Limit</span>
              <span style={{ color: "var(--swiggy-orange)" }}>₹{currentPersona.maxBudget}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={currentPersona.maxBudget}
              onChange={(e) => handleCustomChange("maxBudget", parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--swiggy-orange)" }}
            />
          </div>

          {/* Spice Level Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-title)", marginBottom: "6px" }}>
              <span>Spice Tolerance</span>
              <span style={{ color: "var(--swiggy-orange)" }}>{"🌶️".repeat(currentPersona.spiceLevel)} ({currentPersona.spiceLevel}/5)</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={currentPersona.spiceLevel}
              onChange={(e) => handleCustomChange("spiceLevel", parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--swiggy-orange)" }}
            />
          </div>

          {/* Health Focus Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-title)", marginBottom: "6px" }}>
              <span>Health Focus</span>
              <span style={{ color: "var(--swiggy-orange)" }}>💚 {currentPersona.healthFocus}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={currentPersona.healthFocus}
              onChange={(e) => handleCustomChange("healthFocus", parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--swiggy-orange)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
