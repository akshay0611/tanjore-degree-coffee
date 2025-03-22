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
  
  export type Profile = {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    member_since: string;
  };
  
  export type CartItem = {
    item: MenuItem;
    quantity: number;
  };