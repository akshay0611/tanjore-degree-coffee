// app/auth/admin/PopularItems.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define the structure of the item details inside an OrderItem
interface ItemDetails {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  description: string;
}

// Define the structure of an item in the order
interface OrderItem {
  item: ItemDetails;
  quantity: number;
}

// Define the structure of an order
interface Order {
  id: string;
  name: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[];
}

// Define the structure of an item for display in PopularItems
interface Item {
  name: string;
  category: string;
  price: number;
  orders: number;
  stock: string;
  popularity: number;
}

export default function PopularItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularItems = async () => {
      // Fetch only delivered orders from Supabase
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, name, created_at, total_price, status, items")
        .eq("status", "delivered"); // Only count delivered orders

      if (error) {
        console.error("Error fetching orders:", error);
        setItems([]);
        setLoading(false);
        return;
      }

      // Aggregate items to calculate total quantity ordered
      const itemMap: { [key: string]: { totalQuantity: number; price: number; category: string } } = {};

      orders?.forEach((order: Order) => {
        order.items.forEach((orderItem: OrderItem) => {
          const item = orderItem.item;
          const name = item.name;

          if (item.price === undefined || item.price === null) {
            console.warn(`Item "${name}" in order "${order.id}" has no price. Skipping.`);
            return;
          }

          if (itemMap[name]) {
            itemMap[name].totalQuantity += orderItem.quantity;
            itemMap[name].price = item.price;
            itemMap[name].category = item.category;
          } else {
            itemMap[name] = {
              totalQuantity: orderItem.quantity,
              price: item.price,
              category: item.category,
            };
          }
        });
      });

      // Convert the itemMap to an array of Item objects
      const aggregatedItems: Item[] = Object.keys(itemMap).map((name) => {
        const totalQuantity = itemMap[name].totalQuantity;
        const price = itemMap[name].price;
        const category = itemMap[name].category;

        const formattedCategory = category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        let stock = "In Stock";
        if (name.toLowerCase().includes("ice cream")) {
          stock = "Low Stock";
        }

        return {
          name,
          category: formattedCategory,
          price,
          orders: totalQuantity,
          stock,
          popularity: 0,
        };
      });

      // Calculate popularity as a percentage
      const maxQuantity = Math.max(...aggregatedItems.map((item) => item.orders));
      const itemsWithPopularity = aggregatedItems.map((item) => ({
        ...item,
        popularity: maxQuantity > 0 ? Math.round((item.orders / maxQuantity) * 100) : 0,
      }));

      // Sort by total quantity (orders) and take the top 5
      const sortedItems = itemsWithPopularity
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      setItems(sortedItems);
      setLoading(false);
    };

    fetchPopularItems();
  }, []);

  const getStockColor = (stock: string) => {
    switch (stock) {
      case "In Stock":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Low Stock":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (loading) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Popularity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-amber-600">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>₹{(item.price ?? 0).toLocaleString()}</TableCell>
                <TableCell>{item.orders}</TableCell>
                <TableCell>
                  <Badge className={getStockColor(item.stock)} variant="outline">
                    {item.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={item.popularity} className="h-2" />
                    <span className="text-xs text-amber-700">{item.popularity}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}