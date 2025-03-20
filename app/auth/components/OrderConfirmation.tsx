// app/auth/components/OrderConfirmation.tsx
import { CoffeeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface OrderConfirmationProps {
  cartItems: { item: MenuItem; quantity: number }[];
  totalPrice: number;
  checkoutData: { name: string; email: string; address: string };
  resetCheckout: () => void;
}

export default function OrderConfirmation({
  cartItems,
  totalPrice,
  checkoutData,
  resetCheckout,
}: OrderConfirmationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CoffeeIcon className="h-12 w-12 text-amber-300 mx-auto mb-4" />
        <p className="text-amber-700">Order placed successfully!</p>
        <p className="text-sm text-amber-600 mt-2">
          Thank you, {checkoutData.name}! Your order will be delivered to {checkoutData.address}.
        </p>
      </div>
      <div className="space-y-4">
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} × {quantity}</span>
              <span>₹{item.price * quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-2">
          <span className="font-medium text-amber-900">Total</span>
          <span className="font-bold text-amber-900">₹{totalPrice}</span>
        </div>
      </div>
      <DialogClose asChild>
        <Button
          className="w-full bg-amber-700 hover:bg-amber-800 text-white"
          onClick={resetCheckout}
        >
          Back to Menu
        </Button>
      </DialogClose>
    </div>
  );
}