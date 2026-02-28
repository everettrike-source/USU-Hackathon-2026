const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export type Recipe = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
};

export type MealPlan = {
  totalCalories: number;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snack: Recipe;
};

export async function generateMealPlan(dailyCalories: number, restrictions: string): Promise<MealPlan> {
  const prompt = `You are a nutrition expert. Generate a one-day meal plan with exactly 4 meals (breakfast, lunch, dinner, snack) that totals approximately ${dailyCalories} calories.
The one-day meal plan should hit the recomended daily nutrients and vitamins, with a 10% margin of error. Adhere to ${restrictions}, as dietary restrictions.
It is of upmost importance that none of the recipes violate this dietary restriction. Doing so could cause extreme harm to the person consuming them.

Distribute the calories roughly as:
- Breakfast: 25%
- Lunch: 35%
- Dinner: 30%
- Snack: 10%

For each meal, provide a real, practical recipe with accurate nutrition info.

Respond ONLY with valid JSON in this exact format, no markdown or extra text:
{
  "totalCalories": ${dailyCalories},
  "breakfast": {
    "name": "Recipe Name",
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"]
  },
  "lunch": { same format },
  "dinner": { same format },
  "snack": { same format }
}`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text) as MealPlan;
}

export function recipeToString(recipe: Recipe): string {
  const ingredientList = recipe.ingredients.map((ing) => `  • ${ing}`).join("\n");
  const instructionList = recipe.instructions
    .map((step, i) => `  ${i + 1}. ${step}`)
    .join("\n");

  return `${recipe.name}
  ${"=".repeat(recipe.name.length)}

Nutrition (per serving):
  • Calories: ${recipe.calories}
  • Protein: ${recipe.protein}g
  • Carbs: ${recipe.carbs}g
  • Fat: ${recipe.fat}g

Ingredients:
${ingredientList}

Instructions:
${instructionList}
  `.trim();
}

export function mealPlanToString(plan: MealPlan): string {
  return `
Daily Meal Plan - Total Calories: ${plan.totalCalories}
${"=".repeat(50)}

BREAKFAST
${"-".repeat(50)}
${recipeToString(plan.breakfast)}

LUNCH
${"-".repeat(50)}
${recipeToString(plan.lunch)}

DINNER
${"-".repeat(50)}
${recipeToString(plan.dinner)}

SNACK
${"-".repeat(50)}
${recipeToString(plan.snack)}
  `.trim();
}

