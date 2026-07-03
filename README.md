# Swiggy AI Recommendation System 🍔🌦️🤖

An intelligent, context-aware food recommendation system that simulates the Swiggy experience. The application dynamically analyzes weather conditions, customer personas, budget limits, spice tolerances, and health goals to rank and suggest dishes in real-time. It features a conversational AI assistant chatbot and a simulated push-notification email inbox.

---

## 🚀 Key Features

*   **🌦️ Real-Time Weather Simulator**: Instantly switch weather conditions (Sunny, Rainy, Cold, Humid, Stormy) or simulate live location weather sync. Watch the menu rearrange itself (e.g., hot teas and soups for monsoon; gelato and cold juices for summer).
*   **👤 Persona Profile Customizer**: Choose from pre-configured profiles (Fitness Enthusiast, Late Night Gamer, Spicy Food Lover, etc.) or dynamically tune sliders for dietary preferences, budgets, spice tolerance, and health focus.
*   **🤖 Conversational AI Assistant**: A floating chat widget representing a smart concierge. Ask for recommendations (e.g., *"Suggest a comfort meal under ₹300"*), ask questions, or click quick prompt chips. Add items to your cart directly from the chat conversation.
*   **📊 Compatibility Score Matching**: Every dish card displays an AI match percentage (0%-100%) and a breakdown of matching reasons (e.g., *"Perfect choice for rainy weather"*, *"Highly budget-friendly option"*, *"Matches Fitness profile"*).
*   **📬 Simulated push Email Inbox**: A bottom tray displaying simulated HTML emails dispatched to the user, including welcome newsletters, weather alerts, and gorgeous order invoice receipts with nutritional logs.
*   **🎨 Premium Glassmorphic Design**: Clean responsive grid layout featuring modern HSL typography, smooth transitions, custom scrollbars, animations, and full Light/Dark mode support.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v19) + Vite (v6)
*   **Styling**: Pure CSS (No tailwind, utilizing CSS variables, animations, and glassmorphism)
*   **Assets & Icons**: Lightweight, custom inline SVGs (Zero external loading delays)
*   **Scoring Engine**: Custom rule-based NLP parser and multi-variable ranking algorithm (`src/utils/recommender.js`)

---

## 📁 Project Structure

```text
├── index.html                  # HTML template with SEO meta tags
├── package.json                # Project dependencies and run scripts
├── vite.config.js              # Vite packaging config
├── src/
│   ├── main.jsx                # React DOM entry point
│   ├── App.jsx                 # Main layout & orchestration logic
│   ├── index.css               # Core styling and theme system
│   ├── data/
│   │   ├── menu.js             # 14-dish food database with metadata
│   │   └── personas.js         # Preset customer profile templates
│   ├── utils/
│   │   └── recommender.js      # Match calculations & AI conversational engine
│   └── components/
│       ├── Header.jsx          # Location, theme, cart & mailbox triggers
│       ├── WeatherControls.jsx # Weather selection & location simulation
│       ├── PersonaSelector.jsx # Presets switching & custom tuning sliders
│       ├── MenuDisplay.jsx     # Card listing, score tags & search query matching
│       ├── AIAssistant.jsx     # Floating chat bot panel with item adding CTAs
│       └── EmailInbox.jsx      # Slide-up mailbox displaying HTML templates
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
Make sure you have **Node.js** (v18+) installed on your computer.

### Step 1: Install Dependencies
Open a command prompt/terminal in the project root directory and run:
```bash
npm install
```

### Step 2: Start Development Server
Run the local Vite server:
```bash
npm run dev
```

### Step 3: View the Application
Open your web browser and navigate to:
```url
http://localhost:5173
```
*(or the local port printed in your console).*
