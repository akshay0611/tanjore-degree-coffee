import { Order } from "./types";
import menuItems from "./data/menuItems.json"; // Adjust path if needed

interface Recommendation {
  name: string;
  category: string;
  description: string;
}

// Convert menuItems to Recommendation type with additional attributes
const allMenuItems: (Recommendation & { popular?: boolean; new?: boolean; chefSpecial?: boolean })[] = 
  menuItems.map((item) => ({
    name: item.name,
    category: item.category,
    description: item.description,
    popular: item.popular,
    new: item.new,
    chefSpecial: item.chefSpecial,
  }));

// Category pairings for complementary suggestions
const categoryPairings: Record<string, string[]> = {
  "coffee-specialties": ["south-indian-snacks", "desserts"],
  "traditional-brews": ["south-indian-snacks"],
  "contemporary-coffees": ["desserts", "south-indian-snacks"],
  "south-indian-snacks": ["coffee-specialties", "traditional-brews"],
  "desserts": ["coffee-specialties", "contemporary-coffees"],
};

// Flavor profile similarity (simulated based on description/category)
const getFlavorProfile = (item: typeof allMenuItems[0]): string[] => {
  const desc = item.description.toLowerCase();
  const profile = [];
  if (desc.includes("sweet") || desc.includes("jaggery") || item.category === "desserts") profile.push("sweet");
  if (desc.includes("spiced") || desc.includes("ginger") || desc.includes("cardamom")) profile.push("spicy");
  if (desc.includes("rich") || desc.includes("chocolate") || desc.includes("mocha")) profile.push("rich");
  if (desc.includes("cold") || desc.includes("smoothie")) profile.push("cold");
  if (desc.includes("traditional") || desc.includes("filter")) profile.push("classic");
  return profile.length > 0 ? profile : ["neutral"];
};

// Calculate similarity between two items (simple cosine-like scoring)
const calculateSimilarity = (itemA: typeof allMenuItems[0], itemB: typeof allMenuItems[0]): number => {
  const flavorsA = getFlavorProfile(itemA);
  const flavorsB = getFlavorProfile(itemB);
  const intersection = flavorsA.filter((f) => flavorsB.includes(f)).length;
  return intersection / Math.sqrt(flavorsA.length * flavorsB.length) || 0;
};

// Default recommendations (popular or new items)
const defaultRecommendations: Recommendation[] = allMenuItems
  .filter((item) => item.popular || item.new)
  .slice(0, 3);

export const getRecommendedItems = (recentOrders: Order[]): Recommendation[] => {
  if (recentOrders.length === 0) {
    return defaultRecommendations;
  }

  // Step 1: Analyze user preferences
  const itemCount: Record<string, number> = {};
  recentOrders.forEach((order) =>
    order.items.forEach(({ item, quantity }) => {
      itemCount[item.name] = (itemCount[item.name] || 0) + quantity;
    })
  );

  const mostOrderedItemName = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!mostOrderedItemName) return defaultRecommendations;

  const mostOrderedItem = allMenuItems.find((item) => item.name === mostOrderedItemName);
  if (!mostOrderedItem) return defaultRecommendations;

  const mostOrderedCategory = mostOrderedItem.category;

  // Step 2: Contextual time-based adjustment (simulated with current time)
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 6 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17;

  // Step 3: Generate recommendations
  const recommendations: Recommendation[] = [];

  // 3.1: Complementary pairing (e.g., coffee with snacks/desserts)
  const pairedCategories = categoryPairings[mostOrderedCategory] || [];
  if (pairedCategories.length > 0) {
    pairedCategories.forEach((category) => {
      const categoryItems = allMenuItems
        .filter((item) => item.category === category && item.name !== mostOrderedItemName)
        .sort((a, b) => {
          const aScore = (a.popular ? 1 : 0) + (a.new ? 1 : 0) + (a.chefSpecial ? 1 : 0);
          const bScore = (b.popular ? 1 : 0) + (b.new ? 1 : 0) + (b.chefSpecial ? 1 : 0);
          return bScore - aScore;
        });
      if (categoryItems.length > 0) {
        // Adjust based on time: prefer snacks in morning, desserts in evening
        const topItem = isMorning && category === "south-indian-snacks" 
          ? categoryItems[0] 
          : isEvening && category === "desserts" 
          ? categoryItems[0] 
          : categoryItems[0];
        recommendations.push(topItem);
      }
    });
  }

  // 3.2: Content-based filtering (similar flavor profiles)
  if (recommendations.length < 3) {
    const similarItems = allMenuItems
      .filter((item) => item.name !== mostOrderedItemName && !recommendations.some((r) => r.name === item.name))
      .map((item) => ({
        item,
        similarity: calculateSimilarity(mostOrderedItem, item),
      }))
      .sort((a, b) => b.similarity - a.similarity || (b.item.popular ? 1 : 0) - (a.item.popular ? 1 : 0))
      .slice(0, 3 - recommendations.length)
      .map((entry) => entry.item);

    // Time-based filter: prefer cold items in afternoon, warm otherwise
    const timeFilteredItems = similarItems.filter((item) =>
      isAfternoon ? getFlavorProfile(item).includes("cold") : !getFlavorProfile(item).includes("cold")
    );
    recommendations.push(...(timeFilteredItems.length > 0 ? timeFilteredItems : similarItems));
  }

  // 3.3: Fallback to popular items if still short
  if (recommendations.length < 3) {
    const fallbackItems = allMenuItems
      .filter((item) => 
        (item.popular || item.new) && 
        item.name !== mostOrderedItemName && 
        !recommendations.some((r) => r.name === item.name)
      )
      .slice(0, 3 - recommendations.length);
    recommendations.push(...fallbackItems);
  }

  return recommendations.slice(0, 3);
};