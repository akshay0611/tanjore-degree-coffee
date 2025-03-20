// app/auth/components/Cart.tsx
import Image from "next/image";
import { CoffeeIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";

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

interface CartProps {
  cartItems: { item: MenuItem; quantity: number }[];
  totalPrice: number;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  setCheckoutStep: (step: "cart" | "form" | "confirmation") => void;
}

export default function Cart({
  cartItems,
  totalPrice,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCheckoutStep,
}: CartProps) {
  return cartItems.length > 0 ? (
    <div className="space-y-6">
      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
        {cartItems.map(({ item, quantity }) => (
          <div key={item.id} className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-3 flex-1">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-amber-900">{item.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-amber-700">₹{item.price} × {quantity}</p>
                  <p className="text-sm font-medium text-amber-900">= ₹{item.price * quantity}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-center border-amber-300"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-700 hover:text-amber-900"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between pt-2">
          <span className="font-medium text-amber-900">Total</span>
          <span className="font-bold text-amber-900">₹{totalPrice}</span>
        </div>

        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            className="border-amber-300 text-amber-700"
            onClick={clearCart}
            disabled={cartItems.length === 0}
          >
            Clear Cart
          </Button>
          <div className="flex flex-wrap gap-2 justify-between w-full">
          <DialogClose asChild>
            <Button variant="outline" className="border-amber-300 text-amber-700 ">
              Continue Shopping
            </Button>
          </DialogClose>
          <Button
            className="bg-amber-700 hover:bg-amber-800 text-white flex-1"
            disabled={cartItems.length === 0}
            onClick={() => setCheckoutStep("form")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
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
  );
}