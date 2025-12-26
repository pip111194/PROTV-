
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize with process.env.API_KEY directly as per senior engineer guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export class QuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

export const searchGrounding = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    /* Ensure text is always a string to prevent issues with .split() or other string methods in UI */
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    const msg = error.message || "";
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      throw new QuotaError("Search Quota Exhausted");
    }
    throw error;
  }
};

export const complexReasoning = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    /* Ensure response text is a string to safely map over results in the frontend */
    return response.text || "";
  } catch (error: any) {
    const msg = error.message || "";
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      throw new QuotaError("Reasoning Quota Exhausted");
    }
    throw error;
  }
};
