// app/menu/page.tsx
"use client";

import { Coffee, Utensils, Cake, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

// Define the shape of a menu item
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  new: boolean;
  chef_special: boolean;
  created_at: string;
  updated_at: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        console.log("Attempting to fetch menu items...");
        
        // Test Supabase connection first
        const { data: testData, error: testError } = await supabase
          .from("menu_items")
          .select("count", { count: "exact", head: true });

        if (testError) {
          console.error("Supabase connection test failed:", testError);
          throw new Error(`Database connection failed: ${testError.message}`);
        }

        console.log("Supabase connection successful, total rows:", testData);

        // Now fetch actual data
        const { data, error } = await supabase
          .from("menu_items")
          .select(`
            id,
            name,
            description,
            price,
            image,
            category,
            popular,
            new,
            chef_special,
            created_at,
            updated_at
          `)
          .order("id", { ascending: true });

        if (error) {
          console.error("Error fetching menu items:", error);
          throw new Error(`Failed to fetch menu items: ${error.message}`);
        }

        console.log("Successfully fetched menu items:", data?.length || 0, "items");
        setMenuItems(data || []);
        
      } catch (err) {
        console.error("Error in fetchMenuItems:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load menu items. Please check your connection and try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-12 w-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-amber-800 text-lg">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Oops!</h2>
          <p className="text-amber-800 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 hover:bg-amber-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Group items by category for display
  const categories = {
    "coffee-specialties": menuItems.filter((item) => item.category === "coffee-specialties"),
    "traditional-brews": menuItems.filter((item) => item.category === "traditional-brews"),
    "contemporary-coffees": menuItems.filter((item) => item.category === "contemporary-coffees"),
    "south-indian-snacks": menuItems.filter((item) => item.category === "south-indian-snacks"),
    "desserts": menuItems.filter((item) => item.category === "desserts"),
    "customer-favorites": menuItems.filter((item) => item.popular), // Example: popular items as favorites
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-amber-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="w-full h-full bg-cover bg-fixed"
            style={{
              backgroundImage: "url('/heromenu.jpeg')",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-block mb-6">
            <Coffee className="h-12 w-12 text-amber-400 mx-auto mb-2" />
            <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white custom-serif mb-6">Our Menu</h1>
          <p className="max-w-2xl mx-auto text-xl text-amber-200 italic">
            Discover our selection of traditional and contemporary coffee preparations
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-20 z-30 bg-amber-900 shadow-md">
        <div className="container px-4 mx-auto">
          <div className="flex overflow-x-auto py-4 gap-4 no-scrollbar">
            {["Coffee Specialties", "Traditional Brews", "Contemporary Coffees", "South Indian Snacks", "Desserts"].map(
              (category, index) => (
                <a
                  key={index}
                  href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-full whitespace-nowrap transition-colors duration-300 flex-shrink-0"
                >
                  {category}
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Helper function to render menu items by category */}
      {Object.entries(categories).map(([categoryKey, items]) => {
        if (categoryKey === "customer-favorites") return null; // Handle separately
        
        const categoryInfo = {
          "coffee-specialties": {
            title: "Coffee Specialties",
            description: "Our signature coffee preparations that have delighted customers for generations",
            icon: Coffee,
            bgClass: "bg-amber-50",
            textClass: "text-amber-900"
          },
          "traditional-brews": {
            title: "Traditional Brews",
            description: "Classic South Indian coffee preparations made with authentic methods",
            icon: Coffee,
            bgClass: "bg-white",
            textClass: "text-amber-900"
          },
          "contemporary-coffees": {
            title: "Contemporary Coffees",
            description: "Modern interpretations of classic coffee with innovative twists",
            icon: Coffee,
            bgClass: "bg-amber-900",
            textClass: "text-white"
          },
          "south-indian-snacks": {
            title: "South Indian Snacks",
            description: "Perfect accompaniments to enhance your coffee experience",
            icon: Utensils,
            bgClass: "bg-amber-50",
            textClass: "text-amber-900"
          },
          "desserts": {
            title: "Desserts",
            description: "Sweet treats to complement your coffee experience",
            icon: Cake,
            bgClass: "bg-white",
            textClass: "text-amber-900"
          }
        };

        const info = categoryInfo[categoryKey as keyof typeof categoryInfo];
        const IconComponent = info.icon;

        return (
          <section key={categoryKey} id={categoryKey} className={`py-20 ${info.bgClass}`}>
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <IconComponent className={`h-10 w-10 ${categoryKey === "contemporary-coffees" ? "text-amber-400" : "text-amber-800"} mx-auto mb-2`} />
                  <div className={`h-1 w-16 ${categoryKey === "contemporary-coffees" ? "bg-amber-400" : "bg-amber-800"} mx-auto`}></div>
                </div>
                <h2 className={`text-3xl md:text-4xl font-bold ${categoryKey === "contemporary-coffees" ? "text-white" : "text-amber-900"} custom-serif mb-4`}>
                  {info.title}
                </h2>
                <p className={`max-w-2xl mx-auto text-lg ${categoryKey === "contemporary-coffees" ? "text-amber-200" : "text-amber-800/80"} italic`}>
                  {info.description}
                </p>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className={`text-lg ${categoryKey === "contemporary-coffees" ? "text-amber-200" : "text-amber-800/60"}`}>
                    No items available in this category yet.
                  </p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 ${["traditional-brews", "south-indian-snacks"].includes(categoryKey) ? "md:grid-cols-3" : "md:grid-cols-2"} gap-8`}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`${["traditional-brews", "south-indian-snacks"].includes(categoryKey) 
                        ? `${categoryKey === "traditional-brews" ? "bg-amber-50" : "bg-white"} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group`
                        : `flex ${categoryKey === "contemporary-coffees" 
                          ? "bg-amber-800/50 backdrop-blur-sm" 
                          : categoryKey === "desserts" 
                            ? "bg-amber-50" 
                            : "bg-white"
                        } rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group`
                      }`}
                    >
                      {["traditional-brews", "south-indian-snacks"].includes(categoryKey) ? (
                        // Card layout for traditional-brews and snacks
                        <>
                          <div className="relative h-48 overflow-hidden group">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-bold text-amber-900">{item.name}</h3>
                              <span className="text-lg font-bold text-amber-700">₹{item.price}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <Button variant="ghost" className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 p-0 h-auto">
                              Order Now <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        // Horizontal layout for other categories
                        <>
                          <div className="w-1/3 relative overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {item.popular && (
                              <div className="absolute top-4 left-0 bg-amber-600 text-amber-50 px-3 py-1 text-sm font-medium">
                                Popular
                              </div>
                            )}
                            {item.new && (
                              <div className="absolute top-4 left-0 bg-amber-500 text-amber-950 px-3 py-1 text-sm font-medium">
                                New
                              </div>
                            )}
                            {item.chef_special && (
                              <div className="absolute top-4 left-0 bg-amber-700 text-amber-50 px-3 py-1 text-sm font-medium">
                                Chef&apos;s Special
                              </div>
                            )}
                          </div>
                          <div className="w-2/3 p-6">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className={`text-xl font-bold ${categoryKey === "contemporary-coffees" ? "text-amber-100" : "text-amber-900"}`}>
                                {item.name}
                              </h3>
                              <span className={`text-lg font-bold ${categoryKey === "contemporary-coffees" ? "text-amber-300" : "text-amber-700"}`}>
                                ₹{item.price}
                              </span>
                            </div>
                            <p className={`mb-4 ${categoryKey === "contemporary-coffees" ? "text-amber-200" : "text-gray-600"}`}>
                              {item.description}
                            </p>
                            <Button
                              variant="ghost"
                              className={categoryKey === "contemporary-coffees" 
                                ? "text-amber-300 hover:text-amber-100 hover:bg-amber-700/50 p-0 h-auto"
                                : "text-amber-700 hover:text-amber-900 hover:bg-amber-100 p-0 h-auto"
                              }
                            >
                              Order Now <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Customer Favorites */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Star className="h-10 w-10 text-amber-400 fill-amber-400 mx-auto mb-2" />
              <div className="h-1 w-16 bg-amber-400 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold custom-serif mb-4">Customer Favorites</h2>
            <p className="max-w-2xl mx-auto text-lg text-amber-200 italic">
              Our most loved menu items as rated by our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Tanjore Degree Coffee",
                rating: 4.9,
                reviews: 245,
                image: "/mp25.jpeg",
              },
              {
                name: "Crispy Masala Dosa",
                rating: 4.8,
                reviews: 189,
                image: "/mp26.jpeg",
              },
              {
                name: "Coffee Jaggery Ice Cream",
                rating: 4.7,
                reviews: 156,
                image: "/mp27.jpeg",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl overflow-hidden shadow-xl hover:shadow-amber-900/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-48 overflow-hidden group">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-amber-600 text-amber-50 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 fill-amber-50 mr-1" /> Top Rated
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-100 mb-2">{item.name}</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.floor(item.rating) ? "fill-amber-400 text-amber-400" : "text-amber-700"}`}
                        />
                      ))}
                    </div>
                    <span className="text-amber-300">
                      {item.rating} ({item.reviews} reviews)
                    </span>
                  </div>
                  <Button className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50">Order Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold custom-serif mb-4">Ready to Order?</h2>
              <p className="text-amber-200 max-w-2xl">
                Visit our cafe to experience these delicious offerings or order online for delivery.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order" passHref>
                <Button className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg">
                  Order Online
                </Button>
              </Link>
              <Link href="/book" passHref>
                <Button
                  variant="outline"
                  className="text-amber-800 bg-white hover:bg-amber-50 hover:text-amber-900 border-amber-400 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-900/20 transform hover:scale-105"
                >
                  Book a Table
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}