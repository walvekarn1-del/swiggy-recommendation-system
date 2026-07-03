import React from "react";

export default function EmailInbox({ isOpen, onClose, emails, activeEmailId, setActiveEmailId }) {
  const activeEmail = emails.find(e => e.id === activeEmailId) || emails[0];

  const handleEmailClick = (id) => {
    setActiveEmailId(id);
    // Mark email as read locally
    const email = emails.find(e => e.id === id);
    if (email) email.read = true;
  };

  return (
    <div className={`email-drawer ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="email-drawer-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.4rem" }}>📬</span>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-title)", margin: 0 }}>Simulated Email Inbox</h3>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>Simulating push email notifications to customers</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontWeight: "700"
          }}
        >
          ✕
        </button>
      </div>

      {/* Main Mail Container */}
      <div className="email-list-container">
        {/* Sidebar */}
        <div className="email-sidebar">
          {emails.length > 0 ? (
            emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`email-item ${activeEmailId === email.id ? "active" : ""}`}
                style={{
                  border: "1px solid var(--border-color)",
                  position: "relative"
                }}
              >
                {!email.read && (
                  <span style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--swiggy-orange)"
                  }} />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--swiggy-orange)" }}>{email.sender}</span>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{email.time}</span>
                </div>
                <h4 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: email.read ? "600" : "800", 
                  color: "var(--text-title)",
                  margin: 0,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap"
                }}>
                  {email.subject}
                </h4>
                <p style={{ 
                  fontSize: "0.65rem", 
                  color: "var(--text-muted)", 
                  margin: "4px 0 0 0",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap"
                }}>
                  {email.snippet}
                </p>
              </div>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Inbox is currently empty
            </div>
          )}
        </div>

        {/* Content View */}
        <div className="email-content-view">
          {activeEmail ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Meta details */}
              <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "12px", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>{activeEmail.subject}</h2>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                  <span>From: <strong>{activeEmail.sender}</strong> ({activeEmail.senderEmail})</span>
                  <span>Date: {activeEmail.date}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                  To: <strong>Customer</strong> (active-session@user.com)
                </div>
              </div>

              {/* Email Content Frame */}
              <div 
                style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}
                dangerouslySetInnerHTML={{ __html: activeEmail.body }}
              />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Select an email from the list to preview details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
