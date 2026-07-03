import React, { useState, useRef, useEffect } from "react";
import { generateAIResponse } from "../utils/recommender";

export default function AIAssistant({ currentWeather, currentPersona, dishes, onAddToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Set initial assistant greeting when persona or weather changes
  useEffect(() => {
    const greetingText = `Hello! 🤖 I am your **Swiggy AI Assistant**. 

I see it's currently **${currentWeather}** outside, and you are browsing as a **${currentPersona.name}**. 

Ask me things like *"Suggest something warm under ₹300"* or *"Recommend a healthy high-protein dinner"* and I'll find the perfect match!`;
    
    setMessages([
      { id: "greeting", sender: "bot", text: greetingText, dishes: [] }
    ]);
  }, [currentWeather, currentPersona]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const val = textToSend || inputVal;
    if (!val.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text: val, dishes: [] };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal("");

    // Simulate thinking
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAIResponse(
        val, 
        { weather: currentWeather, persona: currentPersona },
        dishes
      );
      
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.text,
        dishes: response.recommendedDishes
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const quickPrompts = [
    { text: "Suggest healthy meal", label: "🥗 Healthy" },
    { text: "What's good for this weather?", label: "🌧️ Weather Pick" },
    { text: "Cheap snacks under 200", label: "₹ Budget Snacks" },
    { text: "Piping hot spicy dishes", label: "🔥 Spicy Cravings" }
  ];

  return (
    <div className="chat-widget">
      {/* Floating Button */}
      <button 
        className="chat-bubble-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Swiggy AI Dining Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass-panel" style={{ display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#10B981",
                animation: "pulseGlow 1.5s infinite"
              }} />
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "white", margin: 0 }}>swiggyAI Agent</h3>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>Personalized Food Assistant</span>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", background: "var(--swiggy-orange)", color: "white", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>v1.0</span>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`chat-msg-bubble ${m.sender === "bot" ? "chat-msg-bot" : "chat-msg-user"}`}
              >
                <div style={{ fontSize: "0.85rem", whiteSpace: "pre-line" }}>
                  {m.text}
                </div>
                
                {/* Render recommended dishes inline in bot bubble */}
                {m.dishes && m.dishes.length > 0 && (
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "8px", 
                    marginTop: "12px", 
                    borderTop: "1px solid var(--border-color)", 
                    paddingTop: "10px" 
                  }}>
                    {m.dishes.map((d) => (
                      <div 
                        key={d.id} 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          background: "var(--bg-card)",
                          padding: "8px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)"
                        }}
                      >
                        <img 
                          src={d.image} 
                          alt={d.name} 
                          style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "4px" }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className={d.isVeg ? "diet-dot diet-dot-veg" : "diet-dot diet-dot-nonveg"} style={{ width: "10px", height: "10px", padding: "1px" }}>
                              <span className="diet-dot-inner" style={{ width: "4px", height: "4px" }} />
                            </span>
                            <h5 style={{ fontSize: "0.75rem", fontWeight: "700", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: "var(--text-title)" }}>{d.name}</h5>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--swiggy-orange)" }}>₹{d.price}</span>
                            <span style={{ fontSize: "0.65rem", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>{d.match ? `${d.match.score}% Match` : ""}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onAddToCart(d)}
                          style={{
                            background: "var(--swiggy-orange)",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(252, 128, 25, 0.2)"
                          }}
                          title="Add to Cart"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-msg-bubble chat-msg-bot" style={{ display: "flex", gap: "4px", padding: "12px 16px" }}>
                <span className="typing-dot" style={{ animationDelay: "0s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Panel */}
          <div style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            padding: "8px 16px",
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border-color)",
            scrollbarWidth: "none"
          }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-app)",
                  color: "var(--text-body)",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask the AI for food recommendations..."
              className="chat-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--swiggy-orange)",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(252, 128, 25, 0.2)"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Typing dots CSS */}
      <style>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
