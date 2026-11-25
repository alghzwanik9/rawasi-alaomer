import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

export const DEFAULT_AI_MODEL = "gemini-3.5-flash-lite";
export const BACKUP_AI_MODELS = ["gemini-3.1-flash-lite", "gemini-4-hydrogen"];

/**
 * Checks whether GEMINI_API_KEY is configured in the environment.
 */
export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(
    key &&
      key.trim().length > 0 &&
      !key.includes("your_gemini_api_key")
  );
}

/**
 * Returns a singleton instance of the GoogleGenAI client if configured,
 * or null if no valid key is provided.
 */
export function getGeminiClient(): GoogleGenAI | null {
  if (!isGeminiConfigured()) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }
  return cachedClient;
}
