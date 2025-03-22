// app/auth/components/cartUtils.ts
import { CartItem, MenuItem } from "./types";

export const addToCart = (
  item: MenuItem,
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
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

export const reduceFromCart = (
  itemId: number,
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
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

export const removeFromCart = (
  itemId: number,
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
  if (window.confirm("Are you sure you want to remove this item from your cart?")) {
    setCartItems(cartItems.filter((cartItem) => cartItem.item.id !== itemId));
  }
};

export const updateQuantity = (
  itemId: number,
  newQuantity: number,
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
  if (newQuantity < 1) {
    removeFromCart(itemId, cartItems, setCartItems);
    return;
  }
  setCartItems(
    cartItems.map((cartItem) =>
      cartItem.item.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
    )
  );
};

export const clearCart = (
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
  if (cartItems.length === 0) return;
  if (window.confirm("Are you sure you want to clear your entire cart?")) {
    setCartItems([]);
  }
};

export const calculateTotalPrice = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );
};