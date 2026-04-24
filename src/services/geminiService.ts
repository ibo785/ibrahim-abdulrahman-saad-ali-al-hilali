import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function classifyItem(title: string, description: string, imageBase64?: string) {
  let prompt = `Classify this item into a category for a community sharing app.
  Title: ${title}
  Description: ${description}
  
  Possible categories: Furniture, Electronics, Tools, Kitchenware, Clothing, Books, Toys, Others.
  
  Return a JSON object with:
  - category: The best category (one of the above)
  - confidence: A number between 0 and 1
  - alternativeCategories: An array of strings with other possible categories
  - suggestionNotes: A brief note on why this category was chosen.`;

  const contents = imageBase64 
    ? { parts: [{ text: prompt }, { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }] }
    : prompt;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) return { category: "Others", confidence: 0, alternativeCategories: [], suggestionNotes: "No response from AI" };
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    return { category: "Others", confidence: 0, alternativeCategories: [], suggestionNotes: "Error parsing AI response" };
  }
}

export async function getRecommendations(userInterests: string[], recentItems: string[]) {
  const prompt = `Based on these user interests: ${userInterests.join(", ")}
  And these recently viewed items: ${recentItems.join(", ")}
  
  Suggest 5 types of items they might be interested in seeing in a community sharing app.
  Return an array of strings.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });
  
  return response.text || "";
}
