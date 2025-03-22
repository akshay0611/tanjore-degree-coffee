// app/auth/components/CheckoutForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Address } from "./types";
import { fetchAddresses } from "./supabaseUtils";
import { supabase } from "@/lib/supabase/client";

interface CheckoutFormProps {
  checkoutData: { name: string; email: string; address: string };
  setCheckoutData: (data: { name: string; email: string; address: string }) => void;
  totalPrice: number;
  setCheckoutStep: (step: "cart" | "form" | "confirmation") => void;
  handleCheckout: () => void;
  loading: boolean;
}

export default function CheckoutForm({
  checkoutData,
  setCheckoutData,
  totalPrice,
  setCheckoutStep,
  handleCheckout,
  loading,
}: CheckoutFormProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("manual"); // "manual" for manual input
  const [fetchingAddresses, setFetchingAddresses] = useState(false);

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

  // Fetch addresses on mount
  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        setFetchingAddresses(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fetchedAddresses = await fetchAddresses(user.id);
          setAddresses(fetchedAddresses);
          const defaultAddress = fetchedAddresses.find((addr) => addr.is_default);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setCheckoutData({ ...checkoutData, address: defaultAddress.address });
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setFetchingAddresses(false);
      }
    };

    fetchUserAddresses();
  }, []);

  // Handle address selection
  const handleAddressChange = (value: string) => {
    setSelectedAddressId(value);
    if (value === "manual") {
      setCheckoutData({ ...checkoutData, address: "" });
    } else {
      const selected = addresses.find((addr) => addr.id === value);
      if (selected) {
        setCheckoutData({ ...checkoutData, address: selected.address });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label htmlFor="name" className="text-amber-700">Full Name</Label>
          <Input
            id="name"
            placeholder="Full Name"
            value={checkoutData.name}
            onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
            className="border-amber-300 focus:ring-amber-500"
            disabled={loading}
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-amber-700">Email</Label>
          <Input
            id="email"
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
        </div>
        <div>
          <Label htmlFor="address" className="text-amber-700">Delivery Address</Label>
          {fetchingAddresses ? (
            <div className="p-2 text-amber-700">Loading addresses...</div>
          ) : addresses.length > 0 ? (
            <>
              <Select value={selectedAddressId} onValueChange={handleAddressChange} disabled={loading}>
                <SelectTrigger className="border-amber-300 focus:ring-amber-500">
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Enter manually</SelectItem>
                  {addresses.map((addr) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.label} - {addr.address.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAddressId === "manual" && (
                <Input
                  id="address"
                  placeholder="Delivery Address"
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                  className="border-amber-300 focus:ring-amber-500 mt-2"
                  disabled={loading}
                  required
                />
              )}
            </>
          ) : (
            <Input
              id="address"
              placeholder="Delivery Address"
              value={checkoutData.address}
              onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
              className="border-amber-300 focus:ring-amber-500"
              disabled={loading}
              required
            />
          )}
        </div>
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
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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