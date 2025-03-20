"use client";

import { useState } from "react";
import Image from "next/image";
import { CoffeeIcon, Search, ShoppingBag, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogClose,
} from "@/components/ui/dialog";

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

// Updated menu data
const menuItems: MenuItem[] = [
  // Coffee Specialties
  { id: 1, name: "Tanjore Degree Coffee", description: "Our signature coffee made with traditional decoction and farm-fresh milk heated to the perfect 'degree'.", price: 80, image: "/mp1.jpeg", category: "coffee-specialties", popular: true },
  { id: 2, name: "Royal Mysore Coffee", description: "A special blend inspired by the royal courts of Mysore, with a hint of cardamom and chicory.", price: 90, image: "/mp2.jpeg", category: "coffee-specialties" },
  { id: 3, name: "Kumbakonam Degree Coffee", description: "A tribute to the famous Kumbakonam style, with a stronger decoction and creamy milk.", price: 85, image: "/mp3.jpeg", category: "coffee-specialties", popular: true },
  { id: 4, name: "Temple Town Special", description: "A unique blend that pays homage to the temple towns of Tamil Nadu, with a rich aroma and smooth finish.", price: 95, image: "/mp4.jpeg", category: "coffee-specialties" },

  // Traditional Brews
  { id: 5, name: "Filter Coffee", description: "Classic South Indian filter coffee served in traditional davara-tumbler.", price: 60, image: "/mp5.jpeg", category: "traditional-brews" },
  { id: 6, name: "Chukku Kaapi", description: "Traditional coffee with dry ginger and warming spices.", price: 75, image: "/mp6.jpeg", category: "traditional-brews" },
  { id: 7, name: "Bella Coffee", description: "Coffee sweetened with jaggery instead of sugar for a rich flavor.", price: 70, image: "/mp7.jpeg", category: "traditional-brews" },
  { id: 8, name: "Sukku Coffee", description: "Medicinal coffee with dry ginger, pepper and palm jaggery.", price: 80, image: "/mp8.jpeg", category: "traditional-brews" },
  { id: 9, name: "Paruthi Paal Coffee", description: "A unique coffee made with cotton seed milk, a traditional Tamil delicacy.", price: 85, image: "/mp9.jpeg", category: "traditional-brews" },
  { id: 10, name: "Inji Kaapi", description: "Ginger-infused coffee that's perfect for rainy days.", price: 75, image: "/mp10.jpeg", category: "traditional-brews" },

  // Contemporary Coffees
  { id: 11, name: "Coconut Cold Brew", description: "Cold brewed coffee with coconut water and a hint of cardamom.", price: 120, image: "/mp11.jpeg", category: "contemporary-coffees", new: true },
  { id: 12, name: "Spiced Mocha", description: "Our signature coffee blended with chocolate and traditional Indian spices.", price: 130, image: "/mp12.jpeg", category: "contemporary-coffees" },
  { id: 13, name: "Rose Cardamom Latte", description: "A fragrant latte infused with rose petals and cardamom.", price: 140, image: "/mp13.jpeg", category: "contemporary-coffees", new: true },
  { id: 14, name: "Mango Coffee Smoothie", description: "Seasonal delight with fresh mangoes and our cold brew coffee.", price: 150, image: "/mp14.jpeg", category: "contemporary-coffees" },

  // South Indian Snacks
  { id: 15, name: "Crispy Vada", description: "Traditional savory donut made with urad dal, served with coconut chutney.", price: 60, image: "/mp15.jpeg", category: "south-indian-snacks" },
  { id: 16, name: "Butter Mysore Pak", description: "Melt-in-your-mouth sweet made with gram flour, ghee and sugar.", price: 70, image: "/mp16.jpeg", category: "south-indian-snacks" },
  { id: 17, name: "Mini Idli Sambar", description: "Bite-sized steamed rice cakes served with flavorful lentil soup.", price: 80, image: "/mp17.jpeg", category: "south-indian-snacks" },
  { id: 18, name: "Crispy Masala Dosa", description: "Thin rice crepe filled with spiced potato filling, served with chutneys.", price: 90, image: "/mp18.jpeg", category: "south-indian-snacks" },
  { id: 19, name: "Chettinad Bun Parotta", description: "Flaky layered bread served with aromatic Chettinad curry.", price: 100, image: "/mp19.jpeg", category: "south-indian-snacks" },
  { id: 20, name: "Filter Coffee Cookies", description: "Our signature cookies infused with our special coffee blend.", price: 65, image: "/mp20.jpeg", category: "south-indian-snacks" },

  // Desserts
  { id: 21, name: "Coffee Payasam", description: "Traditional South Indian pudding infused with our signature coffee blend.", price: 110, image: "/mp21.jpeg", category: "desserts", chefSpecial: true },
  { id: 22, name: "Cardamom Coffee Cake", description: "Moist cake with hints of cardamom and our special coffee.", price: 95, image: "/mp22.jpeg", category: "desserts" },
  { id: 23, name: "Coffee Jaggery Ice Cream", description: "Handcrafted ice cream made with our coffee and palm jaggery.", price: 120, image: "/mp23.jpeg", category: "desserts", chefSpecial: true },
  { id: 24, name: "Coconut Coffee Ladoo", description: "Traditional coconut sweet balls infused with our coffee.", price: 85, image: "/mp24.jpeg", category: "desserts" },
];

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<{ item: MenuItem; quantity: number }[]>([]);

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

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.item.id !== itemId));
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

  // Calculate total price
  const totalPrice = cartItems.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Our Menu</h1>
          <p className="text-amber-700 mt-1">Discover the authentic taste of South Indian coffee</p>
        </div>
        {/* ... (rest of the header remains unchanged) */}
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
                <DialogTitle className="text-amber-900">Your Order</DialogTitle>
                <DialogDescription>
                  {cartItems.length === 0
                    ? "Your cart is empty. Add some delicious items!"
                    : "Review your order before checkout."}
                </DialogDescription>
              </DialogHeader>
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-amber-900">{item.name}</p>
                          <p className="text-sm text-amber-700">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full border-amber-300"
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                        >
                          <span>-</span>
                        </Button>
                        <span className="w-6 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full border-amber-300"
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                        >
                          <span>+</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-amber-700 hover:text-amber-900"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-2">
                    <span className="font-medium text-amber-900">Total</span>
                    <span className="font-bold text-amber-900">₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <DialogClose asChild>
                      <Button variant="outline" className="border-amber-300 text-amber-700">
                        Continue Shopping
                      </Button>
                    </DialogClose>
                    <Button className="bg-amber-700 hover:bg-amber-800 text-white">Checkout</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <CoffeeIcon className="h-12 w-12 text-amber-300" />
                  <p className="text-amber-700">Your cart is empty</p>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-amber-300 text-amber-700">
                      Browse Menu
                    </Button>
                  </DialogClose>
                </div>
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

// Menu Item Card Component
function MenuItemCard({
  item,
  onAddToCart,
  onViewDetails,
}: {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onViewDetails: () => void;
}) {
  return (
    <Card className="overflow-hidden border-amber-200 transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between">
          {item.popular && (
            <Badge className="bg-amber-500 hover:bg-amber-600">
              <Star className="h-3 w-3 mr-1 fill-current" /> Popular
            </Badge>
          )}
          {item.new && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
          {item.chefSpecial && <Badge className="bg-purple-500 hover:bg-purple-600">Chef&apos;s Special</Badge>}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-900">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {item.vegan && (
            <Badge variant="outline" className="border-green-500 text-green-600">
              Vegan
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-lg font-bold text-amber-900">₹{item.price}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700" onClick={onViewDetails}>
            Details
          </Button>
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-white" onClick={() => onAddToCart(item)}>
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}