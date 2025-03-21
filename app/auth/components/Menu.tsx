"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ShoppingBag, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Cart from "./Cart";
import CheckoutForm from "./CheckoutForm";
import OrderConfirmation from "./OrderConfirmation";
import MenuItemCard from "./MenuItemCard";
import menuItems from "./data/menuItems.json";
import { supabase } from "@/lib/supabase/client";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  vegan?: boolean;
  new?: boolean;
  chefSpecial?: boolean;
};

type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  member_since: string;
};

type CartItem = {
  item: MenuItem;
  quantity: number;
};

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "confirmation">("cart");
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          setProfile(data);
          setCheckoutData({
            name: data.full_name || "",
            email: data.email || "",
            address: "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    const existingItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { item, quantity: 1 }]);
    }
  };

  const reduceFromCart = (itemId: number) => {
    const existingItem = cartItems.find((cartItem) => cartItem.item.id === itemId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.item.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
          )
        );
      } else {
        setCartItems(cartItems.filter((cartItem) => cartItem.item.id !== itemId));
      }
    }
  };

  const totalPrice = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!checkoutData.name || !checkoutData.email || !checkoutData.address) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("orders")
        .insert({
          profile_id: profile?.id,
          items: cartItems,
          total_price: totalPrice,
          delivery_address: checkoutData.address,
          name: checkoutData.name,
          email: checkoutData.email,
        })
        .select()
        .single();

      if (error) throw error;

      if (profile) {
        await supabase
          .from("carts")
          .delete()
          .eq("profile_id", profile.id);
      }

      setCheckoutStep("confirmation");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetCheckout = () => {
    setCheckoutStep("cart");
    setCartItems([]);
    setCheckoutData({
      name: profile?.full_name || "",
      email: profile?.email || "",
      address: "",
    });
    localStorage.removeItem("cartItems");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {loading && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Our Menu</h1>
          <p className="text-amber-700 mt-1">Discover the authentic taste of South Indian coffee</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-amber-500" />
            <Input
              type="search"
              placeholder="Search menu..."
              className="pl-8 border-amber-200 focus-visible:ring-amber-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative border-amber-300 text-amber-700">
                <ShoppingBag className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-amber-600 text-xs text-white flex items-center justify-center">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-amber-900">
                  {checkoutStep === "cart" ? "Your Order" : checkoutStep === "form" ? "Checkout" : "Order Confirmed"}
                </DialogTitle>
                <DialogDescription>
                  {checkoutStep === "cart"
                    ? cartItems.length === 0
                      ? "Your cart is empty. Add some delicious items!"
                      : "Review and manage your order below."
                    : checkoutStep === "form"
                    ? "Please enter your delivery details"
                    : "Thank you for your order!"}
                </DialogDescription>
              </DialogHeader>

              {checkoutStep === "cart" ? (
                <Cart
                  initialCartItems={cartItems}
                  profileId={profile?.id || null}
                  setCheckoutStep={setCheckoutStep}
                  onCartUpdate={setCartItems}
                />
              ) : checkoutStep === "form" ? (
                <CheckoutForm
                  checkoutData={checkoutData}
                  setCheckoutData={setCheckoutData}
                  totalPrice={totalPrice}
                  setCheckoutStep={setCheckoutStep}
                  handleCheckout={handleCheckout}
                  loading={loading}
                />
              ) : (
                <OrderConfirmation
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  checkoutData={checkoutData}
                  resetCheckout={resetCheckout}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-amber-100 border border-amber-200 mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            All Items
          </TabsTrigger>
          <TabsTrigger value="coffee-specialties" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Coffee Specialties
          </TabsTrigger>
          <TabsTrigger value="traditional-brews" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Traditional Brews
          </TabsTrigger>
          <TabsTrigger value="contemporary-coffees" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Contemporary Coffees
          </TabsTrigger>
          <TabsTrigger value="south-indian-snacks" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            South Indian Snacks
          </TabsTrigger>
          <TabsTrigger value="desserts" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Desserts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const cartItem = cartItems.find((ci) => ci.item.id === item.id);
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  onReduceFromCart={reduceFromCart}
                  onViewDetails={() => setSelectedItem(item)}
                  quantity={cartItem ? cartItem.quantity : 0}
                />
              );
            })}
          </div>
        </TabsContent>

        {["coffee-specialties", "traditional-brews", "contemporary-coffees", "south-indian-snacks", "desserts"].map(
          (category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems
                  .filter((item) => item.category === category)
                  .map((item) => {
                    const cartItem = cartItems.find((ci) => ci.item.id === item.id);
                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={addToCart}
                        onReduceFromCart={reduceFromCart}
                        onViewDetails={() => setSelectedItem(item)}
                        quantity={cartItem ? cartItem.quantity : 0}
                      />
                    );
                  })}
              </div>
            </TabsContent>
          )
        )}
      </Tabs>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-amber-900">{selectedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                {selectedItem.popular && (
                  <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
                    <Star className="h-3 w-3 mr-1 fill-current" /> Popular
                  </Badge>
                )}
                {selectedItem.new && (
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">New</Badge>
                )}
                {selectedItem.chefSpecial && (
                  <Badge className="absolute top-2 right-2 bg-purple-500 hover:bg-purple-600">Chef&apos;s Special</Badge>
                )}
              </div>

              <p className="text-amber-700">{selectedItem.description}</p>

              {selectedItem.vegan && (
                <Badge variant="outline" className="w-fit border-green-500 text-green-600">
                  Vegan
                </Badge>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-amber-900">₹{selectedItem.price}</span>
                <Button
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  Add to Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-amber-700 text-white p-3 rounded-full shadow-lg hover:bg-amber-800 transition-colors"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}