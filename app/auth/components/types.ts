// app/auth/components/types.ts
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
  addresses?: Address[]; // Added optional addresses array
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
};