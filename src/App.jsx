import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import WeatherControls from "./components/WeatherControls";
import PersonaSelector from "./components/PersonaSelector";
import MenuDisplay from "./components/MenuDisplay";
import AIAssistant from "./components/AIAssistant";
import EmailInbox from "./components/EmailInbox";
import { menuData } from "./data/menu";
import { personasData } from "./data/personas";
import { getRecommendations } from "./utils/recommender";

export default function App() {
  // Application States
  const [theme, setTheme] = useState("light");
  const [currentWeather, setCurrentWeather] = useState("Sunny");
  const [currentPersona, setCurrentPersona] = useState(personasData[0]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [activeEmailId, setActiveEmailId] = useState(null);

  // Initialize Theme and Welcome Email
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Generate initial welcome email
    const initialWelcomeEmail = {
      id: "welcome",
      sender: "Swiggy Concierge",
      senderEmail: "concierge@swiggy.ai",
      time: "Just Now",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      subject: "Welcome to Swiggy AI: Personalized Dining Activated! 🎯",
      snippet: "Your personal taste profile and local weather intelligence are now synced.",
      read: false,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <div style="background-color: #FC8019; padding: 15px; border-radius: 6px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 20px;">swiggy<span style="font-style: italic; font-weight: bold;">AI</span></h2>
          </div>
          <div style="padding: 20px 0;">
            <p style="font-size: 15px; color: #374151; line-height: 1.5;">Hello Diner,</p>
            <p style="font-size: 15px; color: #374151; line-height: 1.5;">Welcome to the next generation of food discovery! Your profile has been initialized with the following preferences:</p>
            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 5px 0; font-size: 14px; color: #1F2937;"><strong>Active Profile:</strong> ${personasData[0].name}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #1F2937;"><strong>Dietary Restriction:</strong> ${personasData[0].dietary === "All" ? "None" : "Veg Only"}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #1F2937;"><strong>Spice Level Tolerance:</strong> ${"🌶️".repeat(personasData[0].spiceLevel)}</p>
            </div>
            <p style="font-size: 15px; color: #374151; line-height: 1.5;">Whenever your local weather changes, our algorithm automatically recalculates compatibility scores for hundreds of dishes in real-time, sending you immediate recommendations.</p>
            <p style="font-size: 15px; color: #374151; line-height: 1.5;">Bon Appetit,<br/><strong>Swiggy AI Assistant</strong></p>
          </div>
        </div>
      `
    };
    setEmails([initialWelcomeEmail]);
    setActiveEmailId("welcome");
  }, []);

  // Generate automated newsletter when weather changes
  useEffect(() => {
    if (emails.length === 0) return; // wait for initial welcome

    const timer = setTimeout(() => {
      // Get recommendations for the new weather
      const recs = getRecommendations(menuData, currentWeather, currentPersona).slice(0, 3);
      if (recs.length === 0) return;

      const weatherTitles = {
        Sunny: "Beat the Sun! Cool Cravings for a Sunny Day ☀️",
        Rainy: "Rainy Day Comforts: Warm Favourites Just for You! 🌧️",
        Cold: "Chilly Outside? Warm-up with These Hot Delights! ❄️",
        Stormy: "Storm Alert: Cozy Up with Comfort Meals Inside! ⛈️",
        Humid: "Refresh Your Vibe: Light Meals for Humid Weather 🌫️"
      };

      const emailSubject = weatherTitles[currentWeather] || `Curated Menu for ${currentWeather} Weather!`;

      // Build dish items HTML
      const dishesHTML = recs.map(d => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 10px 0;">
            <img src="${d.image}" width="60" height="60" style="object-fit: cover; border-radius: 4px; display: block;" />
          </td>
          <td style="padding: 10px 12px; vertical-align: top;">
            <div style="font-weight: bold; font-size: 14px; color: #1F2937;">${d.name}</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">${d.restaurant} • ${d.calories} kcal</div>
          </td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #FC8019; vertical-align: top;">
            ₹${d.price}
          </td>
        </tr>
      `).join("");

      const newNewsletter = {
        id: `newsletter-${Date.now()}`,
        sender: "Swiggy Digest",
        senderEmail: "digest@swiggy.ai",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        subject: emailSubject,
        snippet: `It's ${currentWeather} outside! Based on your profile, here are top dining suggestions.`,
        read: false,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
            <div style="background-color: #1F2937; padding: 15px; border-radius: 6px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 18px;">swiggy<span style="color: #FC8019; font-style: italic;">AI</span> Recommendation Alert</h2>
            </div>
            <div style="padding: 20px 0;">
              <p style="font-size: 14px; color: #4B5563;">Based on the weather condition: <strong>${currentWeather}</strong> and your preferences, here is a custom-curated select menu:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                ${dishesHTML}
              </table>

              <div style="margin-top: 25px; padding: 12px; background-color: #FFF7ED; border: 1px dashed #FED7AA; border-radius: 6px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #C2410C; font-weight: bold;">Enjoy free delivery on these recommended dishes in the next 30 minutes!</p>
              </div>
            </div>
          </div>
        `
      };

      setEmails(prev => [newNewsletter, ...prev]);
      setActiveEmailId(newNewsletter.id);
      
      // Trigger small UI bounce/glow indicating a new email has arrived
      if (!isEmailDrawerOpen) {
        // play alert sound or trigger indicator visually
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentWeather, currentPersona]);

  // Cart actions
  const handleAddToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (id, change) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleClearCart = () => setCart([]);

  // Place Order Simulation & Send Receipt Email
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // HTML Receipt template
    const itemsHTML = cart.map(item => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 10px 0; font-size: 14px; color: #1F2937;">
          <strong>${item.name}</strong> x ${item.quantity}
          <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">${item.restaurant}</div>
        </td>
        <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1F2937; font-size: 14px;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
    `).join("");

    const orderEmail = {
      id: `order-${Date.now()}`,
      sender: "Swiggy Orders",
      senderEmail: "orders@swiggy.ai",
      time: timeStr,
      date: dateStr,
      subject: `Order Placed Successfully! Receipt #SW-${Math.floor(Math.random() * 900000 + 100000)} 🍔`,
      snippet: `Your food order worth ₹${total} has been confirmed. View receipt and health log.`,
      read: false,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 2px solid #F3F4F6; padding-bottom: 16px;">
            <h2 style="color: #FC8019; margin: 0;">swiggy<span style="font-style: italic;">AI</span> Receipt</h2>
            <p style="color: #9CA3AF; font-size: 12px; margin: 4px 0 0 0;">Order Date: ${dateStr} at ${timeStr}</p>
          </div>
          
          <div style="padding: 16px 0;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Your Meal Items:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHTML}
              <tr>
                <td style="padding: 15px 0 0 0; font-weight: bold; color: #1F2937; font-size: 16px;">Grand Total:</td>
                <td style="padding: 15px 0 0 0; text-align: right; font-weight: bold; color: #FC8019; font-size: 18px;">₹${total}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #ECFDF5; padding: 15px; border-radius: 6px; border: 1px solid #A7F3D0; margin: 10px 0;">
            <h5 style="margin: 0 0 6px 0; color: #065F46; font-size: 13px; font-weight: bold;">🧬 Diet & Health Summary:</h5>
            <p style="margin: 0; font-size: 12px; color: #047857; line-height: 1.4;">
              This order contains approximately <strong>${cart.reduce((acc, item) => acc + (item.calories * item.quantity), 0)} calories</strong>. 
              Aligned with your <strong>${currentPersona.name}</strong> guidelines.
            </p>
          </div>

          <div style="background-color: #EFF6FF; padding: 15px; border-radius: 6px; border: 1px solid #BFDBFE;">
            <h5 style="margin: 0 0 6px 0; color: #1E3A8A; font-size: 13px; font-weight: bold;">☁️ Weather Advice:</h5>
            <p style="margin: 0; font-size: 12px; color: #1D4ED8; line-height: 1.4;">
              Outside condition is <strong>${currentWeather}</strong>. 
              ${currentWeather === "Rainy" || currentWeather === "Stormy" ? "Our riders are wearing safety gear. Please expect mild delays due to road conditions." : "Perfect temperature to enjoy your meal immediately!"}
            </p>
          </div>
        </div>
      `
    };

    setEmails(prev => [orderEmail, ...prev]);
    setActiveEmailId(orderEmail.id);
    setCart([]);
    setIsEmailDrawerOpen(true); // Open simulated inbox to show order success
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const unreadEmailsCount = emails.filter(e => !e.read).length;

  return (
    <div style={{ paddingBottom: "100px", minHeight: "100vh" }}>
      {/* Top Header */}
      <Header 
        currentPersona={currentPersona}
        currentWeather={currentWeather}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onToggleEmailDrawer={() => setIsEmailDrawerOpen(!isEmailDrawerOpen)}
        unreadEmails={unreadEmailsCount}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Dashboard Workspace */}
      <div className="dashboard-grid anim-fade-in">
        {/* Left Side: Controls & Cart Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Weather Simulation Control */}
          <WeatherControls 
            currentWeather={currentWeather} 
            setCurrentWeather={setCurrentWeather} 
          />

          {/* Persona Selection Panel */}
          <PersonaSelector 
            currentPersona={currentPersona} 
            setCurrentPersona={setCurrentPersona} 
          />

          {/* Cart display Panel */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-title)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Shopping Cart</span>
              {cart.length > 0 && (
                <button 
                  onClick={handleClearCart}
                  style={{ background: "none", border: "none", color: "#EF4444", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}
                >
                  Clear
                </button>
              )}
            </h2>

            {cart.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* List of items */}
                <div style={{ 
                  maxHeight: "180px", 
                  overflowY: "auto", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "10px",
                  paddingRight: "4px"
                }}>
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        fontSize: "0.8rem",
                        color: "var(--text-body)"
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, paddingRight: "10px" }}>
                        <div style={{ fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: "var(--text-title)" }}>{item.name}</div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>₹{item.price} each</span>
                      </div>
                      
                      {/* Qty incrementors */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "12px" }}>
                        <button 
                          onClick={() => handleUpdateCartQty(item.id, -1)}
                          style={{ width: "20px", height: "20px", border: "1px solid var(--border-color)", borderRadius: "50%", background: "transparent", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-title)", fontWeight: "bold" }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: "700", minWidth: "12px", textAlign: "center" }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateCartQty(item.id, 1)}
                          style={{ width: "20px", height: "20px", border: "1px solid var(--border-color)", borderRadius: "50%", background: "transparent", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-title)", fontWeight: "bold" }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontWeight: "800", color: "var(--text-title)" }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-title)" }}>Grand Total:</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--swiggy-orange)" }}>₹{totalCartPrice}</span>
                </div>

                {/* Checkout CTA */}
                <button 
                  onClick={handlePlaceOrder}
                  className="orange-btn"
                  style={{ width: "100%", justifyContent: "center", padding: "12px", borderRadius: "var(--radius-md)" }}
                >
                  <span>Place Order & Email Summary</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                <span>🛒</span>
                <p style={{ marginTop: "6px" }}>Your cart is empty. Add personalized dishes from suggestions!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Menu Displays */}
        <div>
          <MenuDisplay 
            dishes={menuData}
            currentWeather={currentWeather}
            currentPersona={currentPersona}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {/* Floating AI Assistant Widget */}
      <AIAssistant 
        currentWeather={currentWeather}
        currentPersona={currentPersona}
        dishes={menuData}
        onAddToCart={handleAddToCart}
      />

      {/* Bottom Email Inbox Drawer overlay */}
      <EmailInbox 
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        emails={emails}
        activeEmailId={activeEmailId}
        setActiveEmailId={setActiveEmailId}
      />
    </div>
  );
}
