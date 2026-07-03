/**
 * Calculates a match score (0-100) and list of reasons for a dish
 * based on current weather, customer persona, and optional search query/interests.
 */
export function calculateMatch(dish, weather, persona, searchQuery = "") {
  let weatherScore = 0;
  const weatherReasons = [];
  
  // 1. WEATHER MATCHING (Weight: 35%)
  const isDirectWeatherMatch = dish.suitedWeather.some(
    w => w.toLowerCase() === weather.toLowerCase()
  );

  if (isDirectWeatherMatch) {
    weatherScore = 100;
    weatherReasons.push(`Perfect choice for ${weather} weather`);
  } else {
    // Check temperature matching fallback
    const isHotWeather = ["sunny", "humid"].includes(weather.toLowerCase());
    const isColdWeather = ["rainy", "cold", "stormy"].includes(weather.toLowerCase());
    
    if (isHotWeather && dish.temperature === "Cold") {
      weatherScore = 80;
      weatherReasons.push("Cool and refreshing for warm weather");
    } else if (isColdWeather && ["Hot", "Warm"].includes(dish.temperature)) {
      weatherScore = 80;
      weatherReasons.push("Warm and comforting for chilly/wet weather");
    } else {
      weatherScore = 40;
    }
  }

  // 2. PERSONA MATCHING (Weight: 45%)
  let personaScore = 100;
  const personaReasons = [];

  // Dietary check (Critical)
  if (persona.dietary === "Veg" && !dish.isVeg) {
    return { score: 0, reasons: ["Does not match Veg preference"] };
  }

  // Budget check
  if (dish.price <= persona.maxBudget) {
    // Perfect budget fit
    if (dish.price < persona.maxBudget * 0.6) {
      personaReasons.push("Highly budget-friendly option");
    }
  } else {
    const budgetPenalty = (dish.price - persona.maxBudget) * 1.5;
    personaScore -= budgetPenalty;
    personaReasons.push("Slightly over your set budget limit");
  }

  // Health compatibility
  const healthDiff = Math.abs(dish.healthScore - persona.healthFocus);
  if (healthDiff <= 1) {
    if (persona.healthFocus >= 8) {
      personaReasons.push("Matches your clean/healthy diet goals");
    }
  } else {
    personaScore -= healthDiff * 10;
    if (persona.healthFocus >= 8 && dish.healthScore < 5) {
      personaReasons.push("Slightly less healthy than preferred");
    }
  }

  // Spice level compatibility
  const spiceDiff = Math.abs(dish.spiciness - persona.spiceLevel);
  if (spiceDiff === 0) {
    if (persona.spiceLevel >= 4) {
      personaReasons.push("Satisfies your craving for high heat");
    }
  } else if (spiceDiff > 2) {
    personaScore -= spiceDiff * 12;
    if (dish.spiciness > persona.spiceLevel) {
      personaReasons.push("Might be too spicy for your preference");
    } else {
      personaReasons.push("Milder than your preferred spice level");
    }
  }

  // Tag preferences (Favorites & Exclusions)
  let tagBonus = 0;
  dish.tags.forEach(tag => {
    if (persona.favoriteTags.some(fav => fav.toLowerCase() === tag.toLowerCase())) {
      tagBonus += 15;
    }
    if (persona.unwantedTags.some(unw => unw.toLowerCase() === tag.toLowerCase())) {
      personaScore -= 50;
      personaReasons.push(`Contains ingredients you prefer to avoid (${tag})`);
    }
  });
  personaScore = Math.min(100, Math.max(0, personaScore + tagBonus));
  
  if (tagBonus > 0) {
    personaReasons.push("Matches your favorite cuisine/interests");
  }

  // 3. SEARCH/INTEREST ALIGNMENT (Weight: 20%)
  let searchScore = 100;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const matchesName = dish.name.toLowerCase().includes(q);
    const matchesDesc = dish.description.toLowerCase().includes(q);
    const matchesRest = dish.restaurant.toLowerCase().includes(q);
    const matchesTag = dish.tags.some(t => t.toLowerCase().includes(q));

    if (matchesName || matchesTag) {
      searchScore = 100;
    } else if (matchesDesc || matchesRest) {
      searchScore = 75;
    } else {
      searchScore = 0;
    }
  }

  // Calculate final weighted score
  const finalScore = Math.round(
    (weatherScore * 0.35) + 
    (personaScore * 0.45) + 
    (searchScore * 0.20)
  );

  // Combine and clean up reasons
  let combinedReasons = [];
  if (isDirectWeatherMatch) combinedReasons.push(weatherReasons[0]);
  
  // Pick top positive reasons
  const positivePersonaReasons = personaReasons.filter(r => 
    !r.includes("over your set budget") && 
    !r.includes("less healthy") && 
    !r.includes("too spicy") && 
    !r.includes("Milder") && 
    !r.includes("prefer to avoid")
  );
  
  combinedReasons = [...combinedReasons, ...positivePersonaReasons];
  
  // Add warning messages if any
  const negativeReasons = personaReasons.filter(r => 
    r.includes("over your set budget") || 
    r.includes("less healthy") || 
    r.includes("too spicy") || 
    r.includes("prefer to avoid")
  );
  
  combinedReasons = [...combinedReasons, ...negativeReasons];

  // Fallback reason if empty
  if (combinedReasons.length === 0) {
    combinedReasons.push("A good general recommendation");
  }

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    reasons: combinedReasons.slice(0, 3) // Limit to top 3 reasons
  };
}

/**
 * Ranks and returns recommended dishes based on parameters.
 */
export function getRecommendations(dishes, weather, persona, searchQuery = "") {
  return dishes
    .map(dish => {
      const match = calculateMatch(dish, weather, persona, searchQuery);
      return { ...dish, match };
    })
    // Filter out completely incompatible dishes (e.g. non-veg for vegetarians, or search query non-matches)
    .filter(item => item.match.score > 0)
    // Sort by match score descending, then by rating descending
    .sort((a, b) => b.match.score - a.match.score || b.rating - a.rating);
}

/**
 * High-fidelity Simulated AI Agent response generator.
 * Mimics an LLM recommendation assistant, parsing user input and context.
 */
export function generateAIResponse(userMessage, currentContext, dishes) {
  const msg = userMessage.toLowerCase();
  const { weather, persona } = currentContext;
  
  // Analyze intent
  let matchedDishes = [];
  let responseText = "";
  
  // Get recommendations for ranking context
  const ranked = getRecommendations(dishes, weather, persona);
  
  if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey")) {
    responseText = `Hello! I'm your Swiggy AI Dining Assistant. I've analyzed that it's currently **${weather}** outside, and you are browsing as a **${persona.name}**. 

What are you in the mood for today? I can suggest hot soups, spicy biryani, healthy snacks, or anything matching your taste!`;
    matchedDishes = ranked.slice(0, 2);
  } else if (msg.includes("soup") || msg.includes("warm") || msg.includes("comfort") || msg.includes("tea") || msg.includes("chai")) {
    matchedDishes = ranked.filter(d => 
      d.tags.some(t => ["soup", "tea", "comfort", "snack"].includes(t.toLowerCase()))
    ).slice(0, 3);
    
    responseText = `Looking for comfort? Excellent choice. Given that it is **${weather}**, a warm bowl of soup or hot cup of tea is highly recommended. Here is what matches your profile:`;
  } else if (msg.includes("healthy") || msg.includes("diet") || msg.includes("protein") || msg.includes("salad") || msg.includes("calorie")) {
    matchedDishes = ranked.filter(d => d.healthScore >= 7).slice(0, 3);
    responseText = `Here are some healthy, high-nutrition recommendations matching your profile. These options prioritize fresh ingredients and lean nutrients:`;
  } else if (msg.includes("spicy") || msg.includes("hot") || msg.includes("biryani") || msg.includes("ramen")) {
    matchedDishes = ranked.filter(d => d.spiciness >= 3).slice(0, 3);
    responseText = `Cravings for some heat? 🔥 I've pulled these highly rated spicy favorites that are perfect for your tastebuds:`;
  } else if (msg.includes("cheap") || msg.includes("budget") || msg.includes("under") || msg.includes("price") || msg.includes("cost")) {
    // Extract number if exists, e.g. "under 200"
    const budgetMatch = msg.match(/under\s+(\d+)/) || msg.match(/(\d+)\s*rupees/);
    const limit = budgetMatch ? parseInt(budgetMatch[1]) : persona.maxBudget;
    
    matchedDishes = ranked.filter(d => d.price <= limit).slice(0, 3);
    responseText = `Pocket-friendly dining selected! Here are options priced under **₹${limit}** that match your tastes:`;
  } else if (msg.includes("sweet") || msg.includes("dessert") || msg.includes("chocolate") || msg.includes("shake")) {
    matchedDishes = ranked.filter(d => d.tags.some(t => ["dessert", "chocolate", "sweet"].includes(t.toLowerCase()))).slice(0, 3);
    responseText = `Time for dessert! 🍫 Here are decadent sweets and milkshakes that match your current profile:`;
  } else {
    // General keyword search fallback
    const keywords = msg.split(/\s+/).filter(w => w.length > 3);
    if (keywords.length > 0) {
      const searchQ = keywords[0];
      const searchRanked = getRecommendations(dishes, weather, persona, searchQ);
      matchedDishes = searchRanked.slice(0, 3);
      if (matchedDishes.length > 0) {
        responseText = `I searched our menu for suggestions related to "${searchQ}". Based on your **${persona.name}** profile and the **${weather}** weather, here is what I recommend:`;
      }
    }
    
    if (matchedDishes.length === 0) {
      matchedDishes = ranked.slice(0, 3);
      responseText = `I've analyzed your profile and the current weather (**${weather}**). Here are some top-tier curated recommendations tailored specifically for you:`;
    }
  }

  return {
    text: responseText,
    recommendedDishes: matchedDishes
  };
}
