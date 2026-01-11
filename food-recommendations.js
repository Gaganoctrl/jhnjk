// ============================================
// FOOD RECOMMENDATIONS MODULE
// Personalized nutrition guidance based on child's status
// ============================================

const FOOD_DATABASE = {
  protein: [
    { food: "Eggs", quantity: "1-2 per day", value: "6g protein/egg", cost: "₹5-8", icon: "🥚" },
    { food: "Milk/Curd", quantity: "200ml daily", value: "6g protein/cup", cost: "₹15-20", icon: "🥛" },
    { food: "Moong Dal", quantity: "1 cup cooked", value: "8g protein", cost: "₹30", icon: "🫘" },
    { food: "Chick Peas (Chana)", quantity: "¾ cup cooked", value: "15g protein", cost: "₹40", icon: "🫘" },
    { food: "Peanut Butter", quantity: "2 tbsp", value: "8g protein", cost: "₹20", icon: "🥜" },
    { food: "Chicken", quantity: "100g cooked", value: "26g protein", cost: "₹60-80", icon: "🍗" }
  ],
  
  calories: [
    { food: "Rice", quantity: "1 cup cooked", value: "206 calories", cost: "₹20/kg", icon: "🍚" },
    { food: "Wheat Roti", quantity: "2-3 per meal", value: "70 cal/roti", cost: "₹1/roti", icon: "🫓" },
    { food: "Jaggery", quantity: "1 tbsp", value: "38 calories", cost: "₹5", icon: "🍯" },
    { food: "Ghee/Oil", quantity: "1 tsp", value: "45 calories", cost: "₹8", icon: "🧈" },
    { food: "Banana", quantity: "1 medium", value: "90 calories", cost: "₹5-10", icon: "🍌" },
    { food: "Sweet Potato", quantity: "1 medium", value: "100 calories", cost: "₹15", icon: "🍠" }
  ],
  
  micronutrients: [
    { food: "Spinach", quantity: "1 cup cooked", value: "Iron, Vit A, Folate", cost: "₹20", icon: "🥬" },
    { food: "Carrots", quantity: "1 medium", value: "Beta-carotene", cost: "₹5", icon: "🥕" },
    { food: "Orange/Citrus", quantity: "1 fruit", value: "Vitamin C, Folate", cost: "₹8", icon: "🍊" },
    { food: "Tomato", quantity: "1 medium", value: "Lycopene, Vit C", cost: "₹5", icon: "🍅" },
    { food: "Fortified Wheat Flour", quantity: "As per roti", value: "Iron, B12, Folate", cost: "₹30/kg", icon: "🌾" },
    { food: "Sesame Seeds", quantity: "2 tbsp", value: "Calcium, Iron", cost: "₹30", icon: "🤎" }
  ]
};

const RECOMMENDATION_MATRIX = {
  "Severely Malnourished": {
    priority: "🔴 CRITICAL - Immediate Intervention Required",
    description: "This child needs urgent medical and nutritional support",
    recommendations: ["protein", "calories", "micronutrients"],
    mealFrequency: "4-5 meals/day + 2 snacks",
    urgency: "high",
    supplementation: "⚠️ CONSULT HEALTH WORKER IMMEDIATELY. Nutritional supplements are REQUIRED.",
    bgColor: "#fee2e2",
    borderColor: "#dc2626",
    followUpDays: 7
  },
  "At Risk": {
    priority: "🟠 HIGH PRIORITY - Close Monitoring Required",
    description: "This child shows signs of malnutrition and needs support",
    recommendations: ["protein", "calories"],
    mealFrequency: "3 meals + 2 snacks/day",
    urgency: "medium",
    supplementation: "✓ Fortified foods strongly recommended. Schedule regular health check-ups.",
    bgColor: "#fef08a",
    borderColor: "#f59e0b",
    followUpDays: 14
  },
  "Borderline": {
    priority: "🟡 MODERATE - Preventive Care Needed",
    description: "This child is borderline; focus on improving nutrition",
    recommendations: ["protein", "micronutrients"],
    mealFrequency: "3 balanced meals/day",
    urgency: "low",
    supplementation: "✓ Focus on diverse food groups. Consider fortified foods.",
    bgColor: "#fed7aa",
    borderColor: "#f97316",
    followUpDays: 30
  },
  "Nourished": {
    priority: "🟢 GOOD - Healthy Status Maintained",
    description: "This child is well-nourished. Continue current practices.",
    recommendations: ["micronutrients"],
    mealFrequency: "3 meals/day with variety",
    urgency: "low",
    supplementation: "✓ Continue balanced, diverse diet. Maintain current healthy habits.",
    bgColor: "#dcfce7",
    borderColor: "#22c55e",
    followUpDays: 60
  }
};

/**
 * Generate personalized food recommendations
 * @param {Object} childData - Child's nutritional data
 * @param {String} status - Nutritional status (Nourished, Borderline, At Risk, Severely Malnourished)
 * @returns {Object} Recommendations object
 */
function generateRecommendations(childData, status) {
  const rec = RECOMMENDATION_MATRIX[status];
  const foods = [];
  
  if (rec.recommendations.includes("protein")) {
    foods.push(...FOOD_DATABASE.protein.slice(0, 3));
  }
  if (rec.recommendations.includes("calories")) {
    foods.push(...FOOD_DATABASE.calories.slice(0, 3));
  }
  if (rec.recommendations.includes("micronutrients")) {
    foods.push(...FOOD_DATABASE.micronutrients.slice(0, 3));
  }
  
  return {
    status: status,
    priority: rec.priority,
    description: rec.description,
    urgency: rec.urgency,
    bgColor: rec.bgColor,
    borderColor: rec.borderColor,
    mealFrequency: rec.mealFrequency,
    foods: foods,
    supplementation: rec.supplementation,
    followUpDays: rec.followUpDays
  };
}

/**
 * Generate daily meal plan based on status
 * @param {String} status - Nutritional status
 * @returns {Object} Meal plan with meals for each time
 */
function generateMealPlan(status) {
  const plans = {
    "Severely Malnourished": {
      breakfast: "Fortified cereal with milk and egg",
      midMorning: "Banana with peanut butter",
      lunch: "Rice with moong dal, carrots, and ghee",
      afternoon: "Milk with jaggery",
      dinner: "Wheat roti with vegetable curry",
      notes: "Include fortified foods. Add extra ghee/oil."
    },
    "At Risk": {
      breakfast: "Wheat roti with curd and banana",
      midMorning: "Orange or local fruit",
      lunch: "Rice with chana, spinach, and oil",
      afternoon: "Milk or buttermilk",
      dinner: "Moong dal with roti",
      notes: "Include 2 protein sources daily."
    },
    "Borderline": {
      breakfast: "Rice porridge with jaggery and ghee",
      midMorning: "Fruit or nuts",
      lunch: "Roti with dal and seasonal vegetable",
      afternoon: "Milk or curd",
      dinner: "Rice or roti with curry",
      notes: "Ensure food variety."
    },
    "Nourished": {
      breakfast: "Varied - roti, rice, eggs, or porridge",
      midMorning: "Seasonal fruit",
      lunch: "Balanced meal with protein, carb, vegetable",
      afternoon: "Milk or yogurt",
      dinner: "Varied dinner maintaining balance",
      notes: "Continue healthy eating."
    }
  };
  
  return plans[status] || plans["Borderline"];
}

/**
 * Get quick food suggestions by category
 * @param {String} category - Category (protein, calories, micronutrients)
 * @returns {Array} Array of food items
 */
function getFoodsByCategory(category) {
  return FOOD_DATABASE[category] || [];
}

/**
 * Search for a specific food
 * @param {String} foodName - Name of food to search
 * @returns {Object} Food object or null
 */
function searchFood(foodName) {
  const name = foodName.toLowerCase().trim();
  
  for (const [category, foods] of Object.entries(FOOD_DATABASE)) {
    const found = foods.find(f => f.food.toLowerCase() === name);
    if (found) {
      return { food: found, category: category };
    }
  }
  
  return null;
}

// Export functions for use in other scripts
window.generateRecommendations = generateRecommendations;
window.generateMealPlan = generateMealPlan;
window.getFoodsByCategory = getFoodsByCategory;
window.searchFood = searchFood;
window.FOOD_DATABASE = FOOD_DATABASE;
