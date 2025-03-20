// app/auth/components/CheckoutForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckoutFormProps {
  checkoutData: { name: string; email: string; address: string };
  setCheckoutData: (data: { name: string; email: string; address: string }) => void;
  totalPrice: number;
  setCheckoutStep: (step: "cart" | "form" | "confirmation") => void;
  handleCheckout: () => void;
}

export default function CheckoutForm({
  checkoutData,
  setCheckoutData,
  totalPrice,
  setCheckoutStep,
  handleCheckout,
}: CheckoutFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Full Name"
          value={checkoutData.name}
          onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
          className="border-amber-300"
        />
        <Input
          placeholder="Email"
          type="email"
          value={checkoutData.email}
          onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
          className="border-amber-300"
        />
        <Input
          placeholder="Delivery Address"
          value={checkoutData.address}
          onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
          className="border-amber-300"
        />
      </div>
      <div className="flex justify-between pt-2">
        <span className="font-medium text-amber-900">Order Total</span>
        <span className="font-bold text-amber-900">₹{totalPrice}</span>
      </div>
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="border-amber-300 text-amber-700"
          onClick={() => setCheckoutStep("cart")}
        >
          Back to Cart
        </Button>
        <Button
          className="bg-amber-700 hover:bg-amber-800 text-white"
          onClick={handleCheckout}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}