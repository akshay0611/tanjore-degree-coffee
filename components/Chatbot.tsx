"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Coffee, Clock, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { generateResponse, resetChatHistory } from "@/lib/gemini";

// Static data for store information
const storeInfo = {
  timings: "Monday - Sunday: 6:00 AM - 10:00 PM",
  location: "123 Temple Street, Thanjavur, Tamil Nadu, India - 613001"
};

interface Message {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface MenuItem {
  id: string | number;
  name: string;
  price: number;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: "Hello! I'm your Tanjore Degree Coffee assistant. How can I help you today? ☕",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat history when component mounts
  useEffect(() => {
    resetChatHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input.trim();
    setInput("");

    // Add user message with animation delay
    const userMessageObj: Message = {
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessageObj]);

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await processMessage(userMessage.toLowerCase());
      
      const botMessage: Message = {
        type: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        type: "bot",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later. 😔",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract specific item from query
  const extractSpecificItem = (query: string, menuItems: MenuItem[]) => {
    const words = query.toLowerCase().split(' ');
    
    // Find the best matching item
    let bestMatch = null;
    let highestScore = 0;
    
    for (const item of menuItems) {
      const itemNameLower = item.name.toLowerCase();
      let score = 0;
      
      // Check for exact phrase match
      if (query.includes(itemNameLower)) {
        score = 100;
      } else {
        // Check for word matches
        const itemWords = itemNameLower.split(' ');
        for (const itemWord of itemWords) {
          if (words.some(queryWord => queryWord.includes(itemWord) || itemWord.includes(queryWord))) {
            score += 10;
          }
        }
      }
      
      if (score > highestScore && score > 5) {
        highestScore = score;
        bestMatch = item;
      }
    }
    
    return {
      found: bestMatch !== null,
      item: bestMatch,
      score: highestScore
    };
  };

  // Helper function to get item description
  const getItemDescription = (itemName: string): string => {
    const descriptions: { [key: string]: string } = {
      'spiced mocha': 'A rich blend of coffee, chocolate, and aromatic spices! ☕🍫',
      'filter coffee': 'Our signature South Indian filter coffee brewed to perfection! ☕',
      'degree coffee': 'Traditional Tanjore-style degree coffee with authentic taste! ☕',
      'coconut cold brew': 'Refreshing cold brew with a tropical coconut twist! 🥥',
      'rose cardamom latte': 'Aromatic latte with the essence of roses and cardamom! 🌹',
      'mango coffee smoothie': 'Tropical mango blended with smooth coffee goodness! 🥭',
    };
    
    const key = itemName.toLowerCase();
    return descriptions[key] || 'Made with love using traditional methods! ';
  };

  const processMessage = async (message: string): Promise<string> => {
    // Handle store timings
    if (message.includes("timing") || message.includes("hours") || message.includes("open")) {
      return `⏰ Our store hours are: ${storeInfo.timings}\n\nWe're open every day to serve you the best coffee in Thanjavur! ☕`;
    }

    // Handle store location
    if (message.includes("location") || message.includes("address") || message.includes("where")) {
      return `📍 We are located at: ${storeInfo.location}\n\nCome visit us for an authentic South Indian coffee experience! 🏪`;
    }

    // Handle menu items with intelligent query processing
    if (message.includes("menu") || message.includes("item") || message.includes("coffee") || message.includes("price") || message.includes("cost")) {
      try {
        const { data: menuItems, error } = await supabase
          .from("menu_items")
          .select("*")
          .order('name');

        if (error) throw error;

        if (menuItems && menuItems.length > 0) {
          // Type assertion to ensure menuItems conforms to MenuItem interface
          const typedMenuItems = menuItems as MenuItem[];
          
          // Check if user is asking for a specific item
          const specificItemQuery = extractSpecificItem(message, typedMenuItems);
          
          if (specificItemQuery.found && specificItemQuery.item) {
            // Return specific item info
            return `☕ ${specificItemQuery.item.name} is ₹${specificItemQuery.item.price}\n\n${getItemDescription(specificItemQuery.item.name)} Would you like to know about any other items? 😊`;
          } else if (message.includes("show") && message.includes("menu") || message.includes("all") || message.includes("full menu")) {
            // Show full menu when explicitly requested
            const menuResponse = "☕ Here are our delicious offerings:\n\n" +
              typedMenuItems.map(item => `• ${item.name} - ₹${item.price}`).join("\n") +
              "\n\nAll our beverages are made with love and traditional methods! 💕\n\nWould you like to know more about any specific item?";
            return menuResponse;
          } else {
            // Use Gemini AI for intelligent menu-related responses
            const menuContext = `Available menu items: ${typedMenuItems.map(item => `${item.name} (₹${item.price})`).join(', ')}`;
            const context = `You are a helpful assistant for Tanjore Degree Coffee, a traditional South Indian coffee shop. 
            ${menuContext}
            Store timings: ${storeInfo.timings}
            Store location: ${storeInfo.location}
            Please provide helpful and friendly responses about menu items, prices, or recommendations.
            Keep responses concise and relevant.`;

            return generateResponse(`${context}\n\nCustomer query: ${message}`);
          }
        } else {
          return "I'm sorry, I couldn't find our menu items at the moment. Please try again later, or feel free to ask about our store timings and location! ☕";
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        return "Sorry, I'm having trouble accessing our menu right now. Please try again in a moment! ☕";
      }
    }

    // Handle greetings
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello there! 👋 Welcome to Tanjore Degree Coffee! How can I make your day better with our delicious coffee? ☕✨";
    }

    // Handle thanks
    if (message.includes("thank") || message.includes("thanks")) {
      return "You're most welcome! 😊 It's our pleasure to help. Is there anything else you'd like to know about our coffee shop? ☕";
    }

    // For all other queries, use Gemini AI with context
    const context = `You are a helpful assistant for Tanjore Degree Coffee, a traditional South Indian coffee shop. 
    You can help customers with information about our store timings, location, and menu items.
    Store timings: ${storeInfo.timings}
    Store location: ${storeInfo.location}
    Please provide helpful and friendly responses while maintaining a professional tone.
    Keep responses concise and relevant to coffee shop queries.`;

    return generateResponse(`${context}\n\nCustomer query: ${message}`);
  };

  return (
    <>
      {/* Floating Chat Button with pulse animation */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
          aria-label="Open chat"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse opacity-75"></div>
          <MessageCircle className="h-7 w-7 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>

      {/* Chat Window with enhanced design */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white/95 backdrop-blur-xl border border-amber-200/50 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Chat Header with gradient */}
          <div className="relative p-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tanjore Coffee</h3>
                  <p className="text-amber-100 text-sm">Your friendly assistant</p>
                </div>
              </div>
              <button
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-600 to-amber-700">
              <svg viewBox="0 0 400 20" className="w-full h-full">
                <path d="M0,10 Q100,0 200,10 T400,10 L400,20 L0,20 Z" fill="white" fillOpacity="0.1"/>
              </svg>
            </div>
          </div>

          {/* Messages Container with custom scrollbar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50/50 to-white/80 custom-scrollbar" style={{height: 'calc(100% - 180px)'}}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex animate-in slide-in-from-${message.type === 'user' ? 'right' : 'left'}-4 fade-in duration-500 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 backdrop-blur-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg"
                      : "bg-gradient-to-r from-white to-amber-50 text-gray-800 shadow-lg border border-amber-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs opacity-60 ${message.type === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {message.type === 'bot' && (
                      <Coffee className="h-3 w-3 text-amber-600 opacity-40" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced loading animation */}
            {isLoading && (
              <div className="flex justify-start animate-in slide-in-from-left-4 fade-in">
                <div className="max-w-[85%] rounded-2xl p-4 bg-gradient-to-r from-white to-amber-50 shadow-lg border border-amber-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-amber-200/50">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-12 rounded-xl border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  disabled={isLoading}
                />
                {input.trim() && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setInput("What are your timings?")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <Clock className="h-3 w-3" />
                Timings
              </button>
              <button 
                onClick={() => setInput("Show me the menu")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <Coffee className="h-3 w-3" />
                Menu
              </button>
              <button 
                onClick={() => setInput("Where are you located?")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <MapPin className="h-3 w-3" />
                Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(245, 158, 11, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }
        
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}