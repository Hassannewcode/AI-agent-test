
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Source } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const browseAndAnswer = async (url: string, task: string): Promise<{ text: string; sources: Source[] }> => {
  const model = 'gemini-2.5-flash';

  const prompt = `You are an advanced AI browser agent. A user has given you a task and an optional URL for context. Your goal is to use your search capabilities to thoroughly investigate and provide a comprehensive, helpful answer.
  
  User's request:
  Task: "${task}"
  Context URL (if provided): "${url || 'Not provided'}"
  
  Please provide your answer based on the information you find. Be clear, concise, and well-structured.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = rawChunks
      .map(chunk => chunk.web)
      .filter((web): web is Source => web !== undefined && web.uri !== '' && web.title !== '');

    return { text, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Handle the specific rate limit error with a user-friendly message.
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
             throw new Error("You've exceeded the request limit. Please wait a moment and try again.");
        }
        // For all other errors, let the UI layer handle them.
        throw error;
    }
    // Handle cases where the caught object is not an Error instance.
    throw new Error("An unknown error occurred.");
  }
};
