"use client"

import { useState } from "react"
import Image from "next/image"
import { CoffeeIcon, Search, ShoppingBag, Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

// Menu item type definition
type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  popular?: boolean
  vegan?: boolean
  new?: boolean
}

// Sample menu data
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Tanjore Filter Coffee",
    description: "Traditional South Indian filter coffee with a rich, frothy texture and intense flavor.",
    price: 80,
    image: "/placeholder.svg?height=200&width=200",
    category: "signature",
    popular: true,
  },
  {
    id: 2,
    name: "Kumbakonam Degree Coffee",
    description: "Premium coffee made with pure cow's milk and high-quality coffee beans.",
    price: 90,
    image: "/placeholder.svg?height=200&width=200",
    category: "signature",
    popular: true,
  },
  {
    id: 3,
    name: "Madras Kaapi",
    description: "Strong and aromatic coffee served in a traditional brass tumbler and davara.",
    price: 75,
    image: "/placeholder.svg?height=200&width=200",
    category: "signature",
  },
  {
    id: 4,
    name: "Mysore Coffee",
    description: "Smooth coffee with a hint of chicory, less strong than traditional filter coffee.",
    price: 70,
    image: "/placeholder.svg?height=200&width=200",
    category: "filter",
  },
  {
    id: 5,
    name: "Malgudi Coffee",
    description: "A nostalgic blend inspired by R.K. Narayan's fictional town, with cardamom notes.",
    price: 85,
    image: "/placeholder.svg?height=200&width=200",
    category: "filter",
    new: true,
  },
  {
    id: 6,
    name: "Cold Brew Coffee",
    description: "Slow-steeped for 12 hours, resulting in a smooth, less acidic coffee experience.",
    price: 110,
    image: "/placeholder.svg?height=200&width=200",
    category: "specials",
  },
  {
    id: 7,
    name: "Coffee Milkshake",
    description: "Creamy milkshake blended with our signature coffee and topped with whipped cream.",
    price: 130,
    image: "/placeholder.svg?height=200&width=200",
    category: "specials",
  },
  {
    id: 8,
    name: "Butter Biscuits",
    description: "Crispy, buttery biscuits that perfectly complement your coffee.",
    price: 40,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
  },
  {
    id: 9,
    name: "Masala Vada",
    description: "Spicy lentil fritters, a popular South Indian snack.",
    price: 60,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    vegan: true,
  },
  {
    id: 10,
    name: "Mysore Pak",
    description: "Traditional South Indian sweet made with gram flour, ghee, and sugar.",
    price: 50,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
  },
  {
    id: 11,
    name: "Banana Chips",
    description: "Crispy, thin slices of banana fried to perfection and lightly salted.",
    price: 45,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    vegan: true,
  },
  {
    id: 12,
    name: "Coconut Coffee",
    description: "Our signature filter coffee with a hint of coconut, a tropical twist.",
    price: 95,
    image: "/placeholder.svg?height=200&width=200",
    category: "specials",
    new: true,
  },
]

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [cartItems, setCartItems] = useState<{ item: MenuItem; quantity: number }[]>([])

  // Filter menu items based on search query
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    const existingItem = cartItems.find((cartItem) => cartItem.item.id === item.id)

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setCartItems([...cartItems, { item, quantity: 1 }])
    }
  }

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.item.id !== itemId))
  }

  // Update item quantity in cart
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }

    setCartItems(
      cartItems.map((cartItem) => (cartItem.item.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem)),
    )
  }

  // Calculate total price
  const totalPrice = cartItems.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0)

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
          <TabsTrigger value="signature" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Signature Coffees
          </TabsTrigger>
          <TabsTrigger value="filter" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Filter Coffees
          </TabsTrigger>
          <TabsTrigger value="specials" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Specials
          </TabsTrigger>
          <TabsTrigger value="snacks" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Snacks
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

        {["signature", "filter", "specials", "snacks"].map((category) => (
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
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      <Star className="h-3 w-3 mr-1 fill-current" /> Popular
                    </Badge>
                  </div>
                )}
                {selectedItem.new && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                  </div>
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
                    addToCart(selectedItem)
                    setSelectedItem(null)
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
  )
}

// Menu Item Card Component
function MenuItemCard({
  item,
  onAddToCart,
  onViewDetails,
}: {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  onViewDetails: () => void
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
  )
}

