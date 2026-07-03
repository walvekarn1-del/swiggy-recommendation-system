# Swiggy AI Recommendation System User Guide 📖

Welcome to the **Swiggy AI Recommendation System**! This guide will walk you through the key features of the application, explain the mechanics under the hood, and show you how to customize the dining experience.

---

## 🎯 Quick Start: The 3-Step Flow

To experience the full power of the AI system, try this flow in your browser:
1.  **Select a Weather**: In the left sidebar, click **Rainy** 🌧️. You will see dishes like "Ginger Cardamom Chai & Onion Pakora" and "Hot & Sour Chicken Soup" climb to the top of your list with high match percentages (e.g., 95%-98%).
2.  **Adjust Your Persona**: In the sidebar under **Target Persona**, select **Fitness Enthusiast** 🏃‍♂️. Notice that all non-vegetarian/fat-heavy foods now get warnings, and low-calorie salads rise to the top. Toggle **Tune Custom** to decrease your budget to ₹200 and watch dishes priced above ₹200 get flagged or drop out.
3.  **Place an Order**: Add items to your cart, and click **Place Order & Email Summary** in your shopping cart. Click the **Mailbox button** 📬 in the header to open your simulated inbox and inspect your gorgeous HTML invoice, featuring total costs, calorie counters, and weather advice.

---

## 🔍 Detailed Feature Walkthrough

### 1. Weather Simulation
The weather simulator adjusts the scoring of food based on its thermal properties and suited weather tags:
*   **☀️ Sunny / 🌫️ Humid**: Prioritizes cold drinks, detox smoothies, fresh berry gelatos, and salads to keep the customer cool.
*   **🌧️ Rainy / ❄️ Cold / ⛈️ Stormy**: Prioritizes hot, steaming comfort foods like dum biryanis, spicy ramens, chai-pakora combos, and hot soups.
*   **📍 Detect Current Location Weather**: Click this button to run a simulated location hook. It displays a locating state, then synchronizes a randomized weather condition to simulate a real-world production API hook.

### 2. Persona Profile Configurator
Our system matches recommendations to 5 preset customer personas:
1.  **Fitness Enthusiast** 🏃‍♂️: Wants healthy (health score >= 8), high-protein, low-carb, and low-calorie items.
2.  **Late Night Gamer** 🎮: Prefers fast food, burger plates, sweet shakes, and late-night comfort treats.
3.  **Working Professional (Budget)** 💼: Demands vegetarian-only meals costing under ₹200 (e.g., Masala Dosa).
4.  **Spicy Food Lover** 🔥: Seeks out maximum spiciness levels (spice rating >= 4) like Andhra Chili Paneer or Szechuan Ramen.
5.  **Rainy Day Comfort Seeker** ☔: Looks for warm teas, traditional snacks, hot soups, and dal khichdi.

#### 🎛️ Manual Tuning (Create Custom Profiles)
Click **Tune Custom** to open the sliders:
*   **Dietary Preference**: Toggle "Veg Only" to immediately hide all meat-based dishes.
*   **Max Budget Slider**: Setting this updates the price matching filter in real-time.
*   **Spice Tolerance Slider**: Setting this calculates how close each dish's spice level matches your tolerance.
*   **Health Focus Slider**: Setting this compares the health rating (1-10) of dishes to your goal.

### 3. Shopping Cart & Billing
*   **Quantities**: Increment (+) or decrement (-) items inside your cart.
*   **Grand Total**: Recalculates dynamically with every action.
*   **Simulated Dispatch**: Placing an order triggers a success receipt which is instantly dispatched to your simulated inbox.

### 4. Interactive AI Chat Assistant
Click the orange floating action button at the bottom-right of your screen to chat:
*   **Quick Prompts**: Click prompts like "Suggest healthy meal" or "What's good for this weather?" for instant responses.
*   **Natural Language Queries**: Type queries like *"show me something sweet under 250"* or *"something spicy for this cold afternoon"*.
*   **In-Chat Add to Cart**: The bot displays suggested dishes as cards directly inside the chat bubbles. Click the (+) button inside the chat bubble to add them directly to your cart.

### 5. Simulated Inbox 📬
Click the mail envelope in the header to view:
*   **Welcome Newsletters**: Dispatched upon starting a session.
*   **Monsoon/Summer Alerts**: Triggered automatically 2 seconds after the weather changes, displaying tailored weather digests.
*   **Order Receipts**: Includes a full bill, calorie breakdown, and weather safety warning alerts.

---

## 🧮 How the AI Recommendation Engine Works

Every item is scored on a **0 to 100 compatibility scale** using this formula:

$$\text{Match Score} = (\text{Weather Score} \times 35\%) + (\text{Persona Score} \times 45\%) + (\text{Search Score} \times 20\%)$$

### Weight Breakdown
1.  **Weather Score (35%)**:
    *   Direct match with dish's `suitedWeather`: **100 points**
    *   Indirect match (e.g., Hot dish on a cold day): **80 points**
    *   No match: **40 points**
2.  **Persona Score (45%)**:
    *   *Dietary Check*: If Persona is vegetarian and dish is non-vegetarian, final match is forced to **0** (Immediate removal).
    *   *Budget Fit*: If price <= budget, **100 points**. If price > budget, decays by $1.5 \times \Delta\text{Price}$ points.
    *   *Health Fit*: Subtracts 10 points for every unit difference between dish health score and persona health focus.
    *   *Spice Fit*: Subtracts 12 points for every unit difference between dish spiciness and persona spice tolerance.
    *   *Favorite Tags*: Adds 15 bonus points for every matching tag.
    *   *Exclusions*: Subtracts 50 points if a dish contains tags matching persona's `unwantedTags`.
3.  **Search Score (20%)**:
    *   Matches search query keyword: **100 points**
    *   No query active: **100 points** (Defaults to neutral)

---

## ✍️ Customizing Menu Data & Personas

You can easily add new dishes or custom personas to the recommendation database by editing the source files:

### Adding a Dish
Open `src/data/menu.js` and add a new object to the `menuData` array:
```javascript
{
  id: 15,
  name: "Your Custom Food Name",
  restaurant: "Restaurant Name",
  price: 250,
  rating: 4.8,
  prepTime: 15,
  calories: 450,
  isVeg: true,
  image: "https://images.unsplash.com/photo-...", // Image URL
  spiciness: 3,  // 1 to 5
  temperature: "Hot", // Hot, Warm, Cold
  healthScore: 7, // 1 to 10
  suitedWeather: ["Rainy", "Cold"],
  suitedPersonas: ["Comfort Seeker"],
  tags: ["Healthy", "Soup", "Indian"],
  description: "A description of the dish."
}
```

### Adding a Persona Preset
Open `src/data/personas.js` and append to `personasData` array:
```javascript
{
  id: "custom-preset",
  name: "Vegan Gourmet",
  tagline: "Healthy vegan cooking and fine dining",
  avatar: "🥑",
  dietary: "Veg",
  spiceLevel: 2,
  maxBudget: 600,
  healthFocus: 8,
  favoriteTags: ["Vegan", "Healthy", "Salad"],
  unwantedTags: ["Fast Food", "Cheesy"],
  preferredTemp: "All"
}
```
Once saved, Vite will hot-reload the changes instantly in your browser!
