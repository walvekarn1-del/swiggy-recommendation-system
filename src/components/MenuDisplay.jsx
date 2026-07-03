import React, { useState } from "react";
import { getRecommendations } from "../utils/recommender";

export default function MenuDisplay({ 
  dishes, 
  currentWeather, 
  currentPersona, 
  onAddToCart,
  searchQuery,
  setSearchQuery
}) {
  const [activeTab, setActiveTab] = useState("recommended");

  // Get ranked recommendations from utility
  const rankedDishes = getRecommendations(dishes, currentWeather, currentPersona, searchQuery);

  // Apply sub-filters based on tabs
  const getFilteredDishes = () => {
    switch (activeTab) {
      case "veg":
        return rankedDishes.filter(d => d.isVeg);
      case "budget":
        return rankedDishes.filter(d => d.price <= 250);
      case "popular":
        return rankedDishes.filter(d => d.rating >= 4.6);
      case "recommended":
      default:
        return rankedDishes;
    }
  };

  const filteredDishes = getFilteredDishes();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Search and Navigation Bar */}
      <div className="glass-panel" style={{ 
        padding: "16px 24px", 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {[
            { id: "recommended", label: "🎯 AI Recommendations" },
            { id: "veg", label: "🥦 Veg Only" },
            { id: "budget", label: "₹ Budget Friendly" },
            { id: "popular", label: "⭐ Top Rated" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "30px",
                border: "none",
                background: activeTab === tab.id ? "var(--swiggy-orange)" : "var(--bg-app)",
                color: activeTab === tab.id ? "white" : "var(--text-body)",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                boxShadow: activeTab === tab.id ? "0 4px 10px rgba(252, 128, 25, 0.2)" : "none"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search menu or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              borderRadius: "30px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-app)",
              color: "var(--text-body)",
              fontSize: "0.85rem",
              fontWeight: "600",
              outline: "none",
              transition: "border-color var(--transition-fast)"
            }}
          />
          <svg 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: "16px", top: "12px", color: "var(--text-muted)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {/* Recommended Category Section Title */}
      <div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-title)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          {activeTab === "recommended" && "AI Personalizations Curated for You"}
          {activeTab === "veg" && "Fresh Vegetarian Delicacies"}
          {activeTab === "budget" && "Pocket-Friendly Deals under ₹250"}
          {activeTab === "popular" && "Crowd Favorites & Bestsellers"}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>
          Showing {filteredDishes.length} matches optimized for current weather and profile
        </p>
      </div>

      {/* Menu Cards Grid */}
      {filteredDishes.length > 0 ? (
        <div className="restaurant-grid">
          {filteredDishes.map((dish) => {
            const matchScore = dish.match ? dish.match.score : 0;
            const matchReasons = dish.match ? dish.match.reasons : [];
            
            // Get color coding based on score
            let scoreColor = "#10B981"; // high match
            if (matchScore < 70) scoreColor = "#F59E0B"; // medium match
            if (matchScore < 50) scoreColor = "#EF4444"; // low match

            return (
              <div 
                key={dish.id} 
                className="dish-card glass-panel anim-fade-in-up" 
                style={{ 
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  {/* Card Image and Match Badge */}
                  <div className="card-image-wrapper">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="card-image"
                      loading="lazy"
                    />
                    
                    {/* Match Percentage Badge overlay */}
                    {matchScore > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(4px)",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        zIndex: 2
                      }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: scoreColor }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#1F2937" }}>
                          {matchScore}% Match
                        </span>
                      </div>
                    )}

                    {/* Preptime / rating overlay */}
                    <div style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(4px)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      display: "flex",
                      gap: "8px"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>⭐ {dish.rating}</span>
                      <span>•</span>
                      <span>⏱️ {dish.prepTime}m</span>
                    </div>
                  </div>

                  {/* Title and Diet marker */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span className={dish.isVeg ? "diet-dot diet-dot-veg" : "diet-dot diet-dot-nonveg"} style={{ marginTop: "4px" }}>
                      <span className="diet-dot-inner" />
                    </span>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-title)", lineHeight: "1.3" }}>
                        {dish.name}
                      </h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500", marginTop: "2px" }}>
                        by {dish.restaurant}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ 
                    fontSize: "0.75rem", 
                    color: "var(--text-muted)", 
                    lineHeight: "1.4", 
                    marginBottom: "12px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {dish.description}
                  </p>

                  {/* Calories / Info */}
                  <div style={{ display: "flex", gap: "12px", fontSize: "0.7rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "14px" }}>
                    <span>🔥 {dish.calories} kcal</span>
                    <span>•</span>
                    <span>🥣 Temp: {dish.temperature}</span>
                    <span>•</span>
                    <span>🌶️ Spice: {dish.spiciness}/5</span>
                  </div>
                </div>

                {/* Match Reasons and Bottom Actions */}
                <div>
                  {/* Bullet points explaining match logic */}
                  {matchReasons.length > 0 && (
                    <div style={{ 
                      background: "var(--bg-app)", 
                      padding: "10px 12px", 
                      borderRadius: "var(--radius-sm)", 
                      marginBottom: "14px",
                      borderLeft: `3px solid ${scoreColor}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}>
                      {matchReasons.map((reason, idx) => {
                        const isWarning = reason.includes("over your") || reason.includes("too spicy") || reason.includes("avoid") || reason.includes("less healthy");
                        return (
                          <div key={idx} style={{ 
                            fontSize: "0.7rem", 
                            color: isWarning ? "#DC2626" : "var(--text-body)", 
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            {isWarning ? "⚠️" : "💡"} {reason}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pricing and Add buttons */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Price</span>
                      <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-title)" }}>₹{dish.price}</span>
                    </div>
                    <button 
                      onClick={() => onAddToCart(dish)}
                      className="orange-btn"
                      style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.8rem" }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <span style={{ fontSize: "2rem" }}>🔍</span>
          <h4 style={{ color: "var(--text-title)", marginTop: "12px", fontWeight: "700" }}>No matching items found</h4>
          <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>Try adjusting your search query, weather, or increasing your persona budget sliders!</p>
        </div>
      )}
    </div>
  );
}
