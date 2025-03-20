// app/auth/Menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ShoppingBag, Star } from "lucide-react";
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
import CheckoutForm from "./ CheckoutForm";
import OrderConfirmation from "./OrderConfirmation";
import MenuItemCard from "./MenuItemCard";
import menuItemsData from "./data/menuItems.json";

// Menu item type definition
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

// Assert the type of menuItems as MenuItem[]
const menuItems: MenuItem[] = menuItemsData;

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<{ item: MenuItem; quantity: number }[]>(() => {
    // Initialize cartItems from localStorage if it exists
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "confirmation">("cart");
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter menu items based on search query
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    const existingItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      );
    } else {
      setCartItems([...cartItems, { item, quantity: 1 }]);
    }
  };

  // Remove item from cart with confirmation
  const removeFromCart = (itemId: number) => {
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
      setCartItems(cartItems.filter((cartItem) => cartItem.item.id !== itemId));
    }
  };

  // Update item quantity in cart
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(
      cartItems.map((cartItem) => (cartItem.item.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem)),
    );
  };

  // Clear entire cart
  const clearCart = () => {
    if (cartItems.length === 0) return;
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setCartItems([]);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);

  // Handle checkout form submission
  const handleCheckout = () => {
    if (!checkoutData.name || !checkoutData.email || !checkoutData.address) {
      alert("Please fill in all fields");
      return;
    }
    // Simulate API call delay
    setTimeout(() => {
      setCheckoutStep("confirmation");
    }, 1000);
  };

  // Reset checkout process
  const resetCheckout = () => {
    setCheckoutStep("cart");
    setCartItems([]);
    setCheckoutData({ name: "", email: "", address: "" });
    // Clear localStorage when checkout is complete
    localStorage.removeItem("cartItems");
  };

  return (
    <div className="container mx-auto py-8 px-4">
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
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  setCheckoutStep={setCheckoutStep}
                />
              ) : checkoutStep === "form" ? (
                <CheckoutForm
                  checkoutData={checkoutData}
                  setCheckoutData={setCheckoutData}
                  totalPrice={totalPrice}
                  setCheckoutStep={setCheckoutStep}
                  handleCheckout={handleCheckout}
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
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onViewDetails={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </TabsContent>

        {["coffee-specialties", "traditional-brews", "contemporary-coffees", "south-indian-snacks", "desserts"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    onViewDetails={() => setSelectedItem(item)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Item Details Dialog */}
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
    </div>
  );
}