"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Coffee, Clock, MapPin, Star, Sparkles, ChefHat } from "lucide-react";
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
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  new: boolean;
  chef_special: boolean;
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

  // Enhanced menu search with scoring and synonym support
  const searchMenuItems = async (query: string): Promise<{
    results: MenuItem[];
    suggestions: string[];
  }> => {
    try {
      const { data: menuItems, error } = await supabase
        .from("menu_items")
        .select("*")
        .order('popular', { ascending: false })
        .order('name');

      if (error) {
        console.error("Error fetching menu items:", error);
        return { results: [], suggestions: [] };
      }

      const items = (menuItems as MenuItem[]) || [];
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);

      // Synonym mapping for better query matching
      const synonymMap: { [_key: string]: string[] } = {
        'coffee': ['coffee', 'kaapi', 'brew', 'espresso', 'latte', 'cappuccino'],
        'sweet': ['sweet', 'dessert', 'sugar', 'jaggery', 'payasam', 'ice cream', 'ladoo'],
        'snack': ['snack', 'vada', 'dosa', 'idli', 'parotta'],
        'strong': ['strong', 'bold', 'intense', 'espresso', 'black'],
        'milk': ['milk', 'latte', 'cappuccino', 'macchiato', 'mocha', 'creamy'],
        'traditional': ['traditional', 'classic', 'filter', 'south indian'],
        'contemporary': ['contemporary', 'modern', 'cold brew', 'smoothie'],
      };

      // Expand search terms with synonyms
      const expandedTerms = searchTerms.flatMap(term =>
        Object.values(synonymMap).reduce((acc, synonyms) => {
          if (synonyms.includes(term)) return [...acc, ...synonyms];
          return acc;
        }, [term])
      );
      

      // Scoring function for ranking results
      const scoreItem = (item: MenuItem, terms: string[]): number => {
        let score = 0;
        const itemName = item.name.toLowerCase();
        const itemDescription = item.description.toLowerCase();
        const itemCategory = item.category.toLowerCase();

        // Exact name match: high score
        if (terms.some(term => itemName.includes(term))) {
          score += terms.filter(term => itemName.includes(term)).length * 10;
          if (itemName === query.toLowerCase()) score += 20; // Exact full name match
        }

        // Category match: medium score
        if (terms.some(term => itemCategory.includes(term))) {
          score += terms.filter(term => itemCategory.includes(term)).length * 5;
        }

        // Description match: lower score
        if (terms.some(term => itemDescription.includes(term))) {
          score += terms.filter(term => itemDescription.includes(term)).length * 3;
        }

        // Boost scores for special attributes
        if (item.popular) score += 5;
        if (item.new) score += 3;
        if (item.chef_special) score += 4;

        return score;
      };

      // Calculate scores for all items
      const scoredItems = items.map(item => ({
        item,
        score: scoreItem(item, expandedTerms),
      })).filter(({ score }) => score > 0);

      // Sort by score and limit results
      const sortedItems = scoredItems
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ item }) => item);

      // Generate suggestions for related categories or items
      const suggestions: string[] = [];
      const matchedCategories = [...new Set(items.map(item => item.category))].filter(category =>
        expandedTerms.some(term => category.toLowerCase().includes(term))
      );
      if (matchedCategories.length > 0) {
        suggestions.push(`Explore our ${matchedCategories.join(' or ')} categories`);
      }
      if (sortedItems.length === 0 && expandedTerms.some(term => synonymMap['coffee'].includes(term))) {
        suggestions.push("Try our popular Tanjore Degree Coffee or Kumbakonam Degree Coffee");
      }
      if (sortedItems.length === 0 && expandedTerms.some(term => synonymMap['sweet'].includes(term))) {
        suggestions.push("Check out our desserts like Coffee Payasam or Coconut Coffee Ladoo");
      }

      return { results: sortedItems, suggestions };
    } catch (error) {
      console.error("Error searching menu items:", error);
      return { results: [], suggestions: [] };
    }
  };

  // Advanced search for strength-based coffee queries
  const searchByStrength = async (): Promise<MenuItem[]> => {
    try {
      const { data: menuItems, error } = await supabase
        .from("menu_items")
        .select("*")
        .or('name.ilike.%coffee%,name.ilike.%espresso%,name.ilike.%strong%,description.ilike.%strong%,description.ilike.%decoction%,description.ilike.%bold%,description.ilike.%intense%')
        .order('popular', { ascending: false });

      if (error) {
        console.error("Error searching by strength:", error);
        return [];
      }

      return (menuItems as MenuItem[]) || [];
    } catch (error) {
      console.error("Error searching by strength:", error);
      return [];
    }
  };

  // Search for milk-based drinks with price filter
  const searchMilkBasedDrinks = async (maxPrice?: number): Promise<MenuItem[]> => {
    try {
      let query = supabase
        .from("menu_items")
        .select("*")
        .or('name.ilike.%latte%,name.ilike.%cappuccino%,name.ilike.%milk%,description.ilike.%milk%,description.ilike.%creamy%');

      if (maxPrice) {
        query = query.lte('price', maxPrice);
      }

      const { data: menuItems, error } = await query.order('price', { ascending: true });

      if (error) {
        console.error("Error searching milk-based drinks:", error);
        return [];
      }

      return (menuItems as MenuItem[]) || [];
    } catch (error) {
      console.error("Error searching milk-based drinks:", error);
      return [];
    }
  };

  // Search by price range
  const searchByPriceRange = async (minPrice: number, maxPrice: number, category?: string): Promise<MenuItem[]> => {
    try {
      let query = supabase
        .from("menu_items")
        .select("*")
        .gte('price', minPrice)
        .lte('price', maxPrice);

      if (category) {
        query = query.ilike('category', `%${category}%`);
      }

      const { data: menuItems, error } = await query.order('price', { ascending: true });

      if (error) {
        console.error("Error searching by price range:", error);
        return [];
      }

      return (menuItems as MenuItem[]) || [];
    } catch (error) {
      console.error("Error searching by price range:", error);
      return [];
    }
  };

  // Search for sweet snacks and coffee pairings
  const searchSweetSnacksAndPairings = async (): Promise<{
    sweetSnacks: MenuItem[];
    coffeePairings: MenuItem[];
  }> => {
    try {
      // Get sweet snacks
      const { data: sweetSnacks, error: snacksError } = await supabase
        .from("menu_items")
        .select("*")
        .or('name.ilike.%payasam%,name.ilike.%ice cream%,name.ilike.%ladoo%,name.ilike.%cake%,name.ilike.%cookie%,description.ilike.%sweet%,description.ilike.%jaggery%,description.ilike.%sugar%,category.ilike.%desserts%')
        .order('popular', { ascending: false });

      // Get coffee items that pair well
      const { data: coffeePairings, error: coffeeError } = await supabase
        .from("menu_items")
        .select("*")
        .or('name.ilike.%coffee%,name.ilike.%espresso%,name.ilike.%latte%,category.ilike.%coffee-specialties%,category.ilike.%traditional-brews%')
        .order('popular', { ascending: false })
        .limit(3);

      if (snacksError || coffeeError) {
        console.error("Error searching sweet snacks and pairings:", snacksError || coffeeError);
      }

      return {
        sweetSnacks: (sweetSnacks as MenuItem[]) || [],
        coffeePairings: (coffeePairings as MenuItem[]) || []
      };
    } catch (error) {
      console.error("Error searching sweet snacks and pairings:", error);
      return { sweetSnacks: [], coffeePairings: [] };
    }
  };

  // Extract price from query
  const extractPriceFromQuery = (query: string): { maxPrice?: number; minPrice?: number } => {
    const priceMatches = query.match(/₹?(\d+)/g);
    if (!priceMatches) return {};

    const prices = priceMatches.map(match => parseInt(match.replace('₹', '')));
    
    if (query.includes('under') || query.includes('below') || query.includes('less than')) {
      return { maxPrice: Math.max(...prices) };
    } else if (query.includes('over') || query.includes('above') || query.includes('more than')) {
      return { minPrice: Math.min(...prices) };
    } else if (prices.length === 2) {
      return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
    } else {
      return { maxPrice: prices[0] };
    }
  };

  // Get special items (popular, new, chef's special)
  const getSpecialItems = async (type: 'popular' | 'new' | 'chef_special'): Promise<MenuItem[]> => {
    try {
      const { data: menuItems, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq(type, true)
        .order('name');

      if (error) {
        console.error(`Error fetching ${type} items:`, error);
        return [];
      }

      return (menuItems as MenuItem[]) || [];
    } catch (error) {
      console.error(`Error fetching ${type} items:`, error);
      return [];
    }
  };

  // Get items by category
  const getItemsByCategory = async (category: string): Promise<MenuItem[]> => {
    try {
      const { data: menuItems, error } = await supabase
        .from("menu_items")
        .select("*")
        .ilike('category', `%${category}%`)
        .order('popular', { ascending: false })
        .order('name');

      if (error) {
        console.error("Error fetching items by category:", error);
        return [];
      }

      return (menuItems as MenuItem[]) || [];
    } catch (error) {
      console.error("Error fetching items by category:", error);
      return [];
    }
  };

  // Format menu item response
  const formatMenuItem = (item: MenuItem, showDescription: boolean = true): string => {
    let formatted = `☕ ${item.name} - ₹${item.price}`;
    
    // Add badges
    const badges: string[] = [];
    if (item.popular) badges.push("🌟 Popular");
    if (item.new) badges.push("✨ New");
    if (item.chef_special) badges.push("👨‍🍳 Chef's Special");
    
    if (badges.length > 0) {
      formatted += ` (${badges.join(", ")})`;
    }
    
    if (showDescription && item.description) {
      formatted += `\n   ${item.description}`;
    }
    
    return formatted;
  };

  // Format multiple items response
  const formatMenuItemsResponse = (items: MenuItem[], title: string, showDescription: boolean = true): string => {
    if (items.length === 0) return "";
    
    let response = `${title}\n\n`;
    response += items.map(item => formatMenuItem(item, showDescription)).join("\n\n");
    return response;
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

    // Handle coffee strength queries
    if (message.includes("strong") || message.includes("strongest") || message.includes("bold") || 
        message.includes("intense") || message.includes("double shot") || message.includes("extra shot")) {
      const strongCoffees = await searchByStrength();
      if (strongCoffees.length > 0) {
        return formatMenuItemsResponse(strongCoffees, "💪 Our Strongest Coffee Options:") +
               "\n\n💡 *Tip: For extra strength, you can always ask for an extra shot of espresso!*";
      }
    }

    // Handle milk-based drink queries with price filtering
    if ((message.includes("milk") || message.includes("latte") || message.includes("cappuccino") || 
         message.includes("macchiato") || message.includes("mocha")) && 
        (message.includes("under") || message.includes("below") || message.includes("₹"))) {
      
      const { maxPrice } = extractPriceFromQuery(message);
      const milkDrinks = await searchMilkBasedDrinks(maxPrice);
      
      if (milkDrinks.length > 0) {
        const title = maxPrice ? 
          `🥛 Milk-Based Drinks Under ₹${maxPrice}:` : 
          "🥛 Our Milk-Based Drinks:";
        return formatMenuItemsResponse(milkDrinks, title);
      } else if (maxPrice) {
        return `I couldn't find any milk-based drinks under ₹${maxPrice}. Let me show you our most affordable milk-based options:\n\n` +
               formatMenuItemsResponse(await searchMilkBasedDrinks(), "🥛 Our Milk-Based Drinks:");
      }
    }

    // Handle sweet snacks and coffee pairing queries
    if ((message.includes("sweet") && message.includes("snack")) || 
        (message.includes("dessert") && message.includes("coffee")) ||
        message.includes("pairing") || message.includes("goes well with") ||
        (message.includes("sweet") && message.includes("coffee"))) {
      
      const { sweetSnacks, coffeePairings } = await searchSweetSnacksAndPairings();
      
      let response = "";
      
      if (sweetSnacks.length > 0) {
        response += formatMenuItemsResponse(sweetSnacks, "🍰 Sweet Snacks & Desserts:");
      }
      
      if (coffeePairings.length > 0) {
        response += "\n\n☕ **Perfect Coffee Pairings:**\n\n";
        response += coffeePairings.map(item => formatMenuItem(item, false)).join("\n");
        response += "\n\n💡 *Pro tip: Our baristas recommend pairing sweet treats with a strong espresso or americano to balance the flavors!*";
      }
      
      if (response) {
        return response;
      }
    }

    // Handle price range queries
    if (message.includes("under") || message.includes("below") || message.includes("₹") || 
        message.includes("cheap") || message.includes("affordable") || message.includes("budget")) {
      
      const { maxPrice, minPrice } = extractPriceFromQuery(message);
      
      if (maxPrice || minPrice) {
        const items = await searchByPriceRange(minPrice || 0, maxPrice || 1000);
        if (items.length > 0) {
          const title = maxPrice ? 
            `💰 Items Under ₹${maxPrice}:` : 
            minPrice ? `💰 Items Over ₹${minPrice}:` : "💰 Budget-Friendly Options:";
          return formatMenuItemsResponse(items, title);
        }
      }
    }

    // Handle special collections
    if (message.includes("popular") || message.includes("best seller") || message.includes("recommended")) {
      const popularItems = await getSpecialItems('popular');
      if (popularItems.length > 0) {
        return formatMenuItemsResponse(popularItems, "🌟 Our Most Popular Items:");
      }
    }

    if (message.includes("new") || message.includes("latest") || message.includes("recent")) {
      const newItems = await getSpecialItems('new');
      if (newItems.length > 0) {
        return formatMenuItemsResponse(newItems, "✨ Our Latest Additions:");
      }
    }

    if (message.includes("chef") || message.includes("special") || message.includes("signature")) {
      const chefSpecials = await getSpecialItems('chef_special');
      if (chefSpecials.length > 0) {
        return formatMenuItemsResponse(chefSpecials, "👨‍🍳 Chef's Special Recommendations:");
      }
    }

    // Handle category searches
    const categoryKeywords = {
      'coffee-specialties': ['coffee', 'espresso', 'specialty', 'special'],
      'traditional-brews': ['traditional', 'filter', 'classic', 'south indian'],
      'contemporary-coffees': ['contemporary', 'cold brew', 'latte', 'smoothie'],
      'south-indian-snacks': ['snack', 'vada', 'dosa', 'idli', 'parotta'],
      'desserts': ['dessert', 'sweet', 'payasam', 'ice cream', 'ladoo']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        const categoryItems = await getItemsByCategory(category);
        if (categoryItems.length > 0) {
          return formatMenuItemsResponse(categoryItems, `☕ ${category.replace('-', ' ').charAt(0).toUpperCase() + category.replace('-', ' ').slice(1)} Items:`);
        }
      }
    }

    // Handle menu-related queries with advanced search
    if (message.includes("menu") || message.includes("item") || message.includes("coffee") || 
        message.includes("price") || message.includes("cost") || message.includes("show") ||
        message.includes("available") || message.includes("have")) {
      
      try {
        // If asking for full menu
        if ((message.includes("show") && message.includes("menu")) || 
            message.includes("full menu") || message.includes("all items") ||
            message === "menu") {
          
          const { data: menuItems, error } = await supabase
            .from("menu_items")
            .select("*")
            .order('category')
            .order('popular', { ascending: false })
            .order('name');

          if (error) throw error;

          if (menuItems && menuItems.length > 0) {
            const items = menuItems as MenuItem[];
            
            // Group by category
            const groupedItems = items.reduce((acc, item) => {
              if (!acc[item.category]) {
                acc[item.category] = [];
              }
              acc[item.category].push(item);
              return acc;
            }, {} as Record<string, MenuItem[]>);

            let response = "☕ Our Complete Menu ☕\n\n";
            
            Object.entries(groupedItems).forEach(([category, items]) => {
              response += `${category.replace('-', ' ').toUpperCase()}\n`;
              response += items.map(item => formatMenuItem(item, false)).join("\n");
              response += "\n\n";
            });

            response += "Would you like to know more about any specific item or category? 😊";
            return response;
          }
        }

        // Advanced search for specific items
        const cleanQuery = message
          .replace(/\b(show|me|the|what|is|are|do|you|have|any|price|cost|of|for)\b/g, '')
          .replace(/[?.,!]/g, '')
          .trim();

        if (cleanQuery.length > 2) {
          const { results, suggestions } = await searchMenuItems(cleanQuery);
          
          let response = "";
          
          if (results.length > 0) {
            response += formatMenuItemsResponse(results, "🎯 Found these items for you:");
          } else {
            response += "I couldn't find an exact match for your request. 😔";
          }
          
          if (suggestions.length > 0) {
            response += "\n\n💡 **Suggestions**: " + suggestions.join(" or ") + ".";
          }
          
          response += "\n\nWould you like to know more about any specific item or category? 😊";
          return response;
        }

        // If no specific search results, show popular items
        const popularItems = await getSpecialItems('popular');
        if (popularItems.length > 0) {
          return `I couldn't find exactly what you're looking for, but here are our most popular items:\n\n` +
                 formatMenuItemsResponse(popularItems, "🌟 Customer Favorites:") +
                 "\n\nTry asking about specific coffee types, categories, or use different keywords! ☕";
        }

        return "I'm sorry, I couldn't find specific menu items. Please try asking about 'popular items', 'coffee', 'tea', or 'show full menu'! ☕";

      } catch (error) {
        console.error("Error processing menu query:", error);
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

    // For all other queries, use Gemini AI with enhanced context
    try {
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("name, category, popular, new, chef_special")
        .limit(10);

      const menuContext = menuItems ? 
        `Available menu categories: ${[...new Set(menuItems.map(item => item.category))].join(', ')}. ` +
        `Popular items: ${menuItems.filter(item => item.popular).map(item => item.name).join(', ')}. ` +
        `New items: ${menuItems.filter(item => item.new).map(item => item.name).join(', ')}. ` +
        `Chef specials: ${menuItems.filter(item => item.chef_special).map(item => item.name).join(', ')}.`
        : '';

      const context = `You are a helpful assistant for Tanjore Degree Coffee, a traditional South Indian coffee shop. 
      ${menuContext}
      Store timings: ${storeInfo.timings}
      Store location: ${storeInfo.location}
      Please provide helpful and friendly responses while maintaining a professional tone.
      Keep responses concise and relevant to coffee shop queries.
      If asked about menu items, suggest they ask for specific categories, popular items, or the full menu.`;

      return generateResponse(`${context}\n\nCustomer query: ${message}`);
    } catch {
      const context = `You are a helpful assistant for Tanjore Degree Coffee, a traditional South Indian coffee shop. 
      Store timings: ${storeInfo.timings}
      Store location: ${storeInfo.location}
      Please provide helpful and friendly responses while maintaining a professional tone.`;
    
      return generateResponse(`${context}\n\nCustomer query: ${message}`);
    }    
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
                  placeholder="Ask about menu, timings, location..."
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
            
            {/* Enhanced quick action buttons */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button 
                onClick={() => setInput("What are your timings?")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <Clock className="h-3 w-3" />
                Timings
              </button>
              <button 
                onClick={() => setInput("Show me the full menu")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <Coffee className="h-3 w-3" />
                Full Menu
              </button>
              <button 
                onClick={() => setInput("What are your popular items?")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <Star className="h-3 w-3" />
                Popular
              </button>
              <button 
                onClick={() => setInput("Show me new items")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <Sparkles className="h-3 w-3" />
                New
              </button>
              <button 
                onClick={() => setInput("Chef&apos;s special items")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-xs transition-colors duration-200"
              >
                <ChefHat className="h-3 w-3" />
                Chef&apos;s Special
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