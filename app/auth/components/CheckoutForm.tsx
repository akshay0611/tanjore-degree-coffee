import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckoutFormProps {
  checkoutData: { name: string; email: string; address: string };
  setCheckoutData: (data: { name: string; email: string; address: string }) => void;
  totalPrice: number;
  setCheckoutStep: (step: "cart" | "form" | "confirmation") => void;
  handleCheckout: () => void;
  loading: boolean; // Added loading prop
}

export default function CheckoutForm({
  checkoutData,
  setCheckoutData,
  totalPrice,
  setCheckoutStep,
  handleCheckout,
  loading,
}: CheckoutFormProps) {
  // Basic email validation
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid
  const isFormValid = 
    checkoutData.name.trim() !== "" &&
    isEmailValid(checkoutData.email) &&
    checkoutData.address.trim() !== "";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Full Name"
          value={checkoutData.name}
          onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
          className="border-amber-300 focus:ring-amber-500"
          disabled={loading}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={checkoutData.email}
          onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
          className={`border-amber-300 focus:ring-amber-500 ${
            checkoutData.email && !isEmailValid(checkoutData.email) ? "border-red-500" : ""
          }`}
          disabled={loading}
          required
        />
        <Input
          placeholder="Delivery Address"
          value={checkoutData.address}
          onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
          className="border-amber-300 focus:ring-amber-500"
          disabled={loading}
          required
        />
      </div>

      {/* Order Total Display */}
      <div className="flex justify-between pt-2">
        <span className="font-medium text-amber-900">Order Total</span>
        <span className="font-bold text-amber-900">₹{totalPrice.toFixed(2)}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
          onClick={() => setCheckoutStep("cart")}
          disabled={loading}
        >
          Back to Cart
        </Button>
        <Button
          className="bg-amber-700 hover:bg-amber-800 text-white disabled:bg-amber-400"
          onClick={handleCheckout}
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Place Order (₹${totalPrice.toFixed(2)})`
          )}
        </Button>
      </div>

      {/* Validation Messages */}
      {!isFormValid && (
        <p className="text-sm text-red-500 mt-2">
          {checkoutData.name.trim() === "" 
            ? "Please enter your name"
            : !isEmailValid(checkoutData.email)
            ? "Please enter a valid email"
            : "Please enter a delivery address"}
        </p>
      )}
    </div>
  );
}