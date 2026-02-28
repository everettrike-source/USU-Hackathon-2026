const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type GroceryStore = {
  name: string;
  location: string;
  distance: number;
  totalPrice: number;
  priceBreakdown: {
    ingredient: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
  hasAllIngredients: boolean;
};

export type GrocerySearchResult = {
  location: string;
  stores: GroceryStore[];
};

export async function findGroceryStores(
  location: string,
  ingredients: Ingredient[]
): Promise<GrocerySearchResult> {
  const ingredientsList = ingredients
    .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
    .join(", ");

  const prompt = `You are a grocery store locator assistant. Find grocery stores in or near ${location} within a 20 mile radius.

For the following shopping list, estimate current pricing and availability:
${ingredientsList}

Return ONLY valid JSON with NO markdown or extra text. Use this exact format:
{
  "location": "${location}",
  "stores": [
    {
      "name": "Store Name",
      "location": "Address",
      "distance": 5.2,
      "totalPrice": 45.99,
      "priceBreakdown": [
        {
          "ingredient": "tomatoes",
          "quantity": 3,
          "unit": "lbs",
          "price": 3.99
        }
      ],
      "hasAllIngredients": true
    }
  ]
}

Include at least 3-5 real grocery stores if available (e.g., Walmart, Target, Whole Foods, Kroger, Safeway, Trader Joe's, etc.). Set hasAllIngredients to true only if all items are typically stocked. Prices should be realistic estimates for 2026/2027.`;

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
  return JSON.parse(text) as GrocerySearchResult;
}

export function sortByPrice(result: GrocerySearchResult): GroceryStore[] {
  return [...result.stores]
    .filter((store) => store.hasAllIngredients)
    .sort((a, b) => a.totalPrice - b.totalPrice);
}
