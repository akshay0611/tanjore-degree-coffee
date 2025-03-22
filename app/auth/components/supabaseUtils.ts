// app/auth/components/supabaseUtils.ts
import { supabase } from "@/lib/supabase/client";
import { CartItem, Profile, Address } from "./types";

export const fetchSavedCart = async (
  userId: string,
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
  try {
    const { data, error } = await supabase
      .from("carts")
      .select("items")
      .eq("profile_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data?.items) {
      const savedCart: CartItem[] = data.items;
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      
      const mergedCart = [...localCart];
      savedCart.forEach((savedItem) => {
        const existingItemIndex = mergedCart.findIndex(
          (item) => item.item.id === savedItem.item.id
        );
        if (existingItemIndex === -1) {
          mergedCart.push(savedItem);
        } else {
          mergedCart[existingItemIndex].quantity = Math.max(
            mergedCart[existingItemIndex].quantity,
            savedItem.quantity
          );
        }
      });

      setCartItems(mergedCart);
      localStorage.setItem("cartItems", JSON.stringify(mergedCart));
    }
  } catch (error) {
    console.error("Error fetching saved cart:", error);
  }
};

export const syncCartWithSupabase = async (profile: Profile | null, cartItems: CartItem[]) => {
  if (!profile) return;

  try {
    const { error } = await supabase
      .from("carts")
      .upsert(
        {
          profile_id: profile.id,
          items: cartItems,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" }
      );

    if (error) throw error;
  } catch (error) {
    console.error("Error syncing cart with Supabase:", error);
  }
};

export const handleCheckout = async (
  profile: Profile | null,
  cartItems: CartItem[],
  totalPrice: number,
  checkoutData: { name: string; email: string; address: string },
  setCheckoutStep: React.Dispatch<React.SetStateAction<"cart" | "form" | "confirmation">>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
      await supabase.from("carts").delete().eq("profile_id", profile.id);
    }

    setCheckoutStep("confirmation");
  } catch (error) {
    console.error("Error during checkout:", error);
    alert("There was an error processing your order. Please try again.");
  } finally {
    setLoading(false);
  }
};

// New address-related functions
export const fetchAddresses = async (profileId: string): Promise<Address[]> => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

export const addAddress = async (
  profileId: string,
  label: string,
  address: string,
  isDefault = false
): Promise<Address | null> => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .insert({ profile_id: profileId, label, address, is_default: isDefault })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding address:", error);
    return null;
  }
};

export const updateAddress = async (addressId: string, updates: Partial<Address>): Promise<Address | null> => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .update(updates)
      .eq("id", addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating address:", error);
    return null;
  }
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};