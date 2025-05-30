import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Chat history to maintain context
let chatHistory: { role: "user" | "model"; parts: Part[] }[] = [];

export async function generateResponse(userMessage: string): Promise<string> {
  try {
    // Add user message to chat history
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

    // Create chat session
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Generate response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    // Add model response to chat history
    chatHistory.push({ role: "model", parts: [{ text }] });

    // Keep only last 10 messages to maintain context without using too much memory
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
  }
}

// Reset chat history
export function resetChatHistory() {
  chatHistory = [];
} 