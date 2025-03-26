export type MenuItem = {
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
  created_at: string; // Assuming timestamp is returned as string
  updated_at: string; // Assuming timestamp is returned as string
};

export type Address = {
  id: string;
  profile_id: string;
  label: string;
  address: string;
  is_default: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  member_since: string;
  addresses?: Address[];
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

export type Notification = {
  id: string;
  profile_id: string;
  order_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Add Order type (was missing, aligning with OrdersView.tsx)
export type Order = {
  id: string;
  profile_id: string; // Added to match database structure
  items: CartItem[];  // Changed to CartItem to match handleCheckout
  total_price: number;
  status: "pending" | "preparing" | "shipped" | "delivered" | "cancelled"; // Added "cancelled"
  created_at: string;
  delivery_address: string;
  name: string;
  email: string;
};