"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";

interface Order {
  id: string;
  items: {
    item: {
      id: number;
      name: string;
      image: string;
      price: number;
      popular: boolean;
      category: string;
      description: string;
    };
    quantity: number;
  }[];
  total_price: number;
  status: string;
  created_at: string;
  delivery_address: string;
  name: string;
  email: string;
}

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders data from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          setError("No authenticated user found.");
          setLoading(false);
          return;
        }

        // Fetch orders for the authenticated user
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("profile_id", userData.user.id)
          .order("created_at", { ascending: false });

        if (ordersError) {
          setError(`Error fetching orders: ${ordersError.message}`);
          setLoading(false);
          return;
        }

        setOrders(ordersData || []);
      } catch (e) {
        setError("An unexpected error occurred.");
        console.error("Error fetching orders:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-amber-900">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (orders.length === 0) {
    return <p className="text-amber-900">No orders found.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Orders</h1>
      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = new Date(order.created_at);
              const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={order.id} className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-amber-900 text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending" ? "bg-amber-200 text-amber-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status === "pending" ? "Processing" : "Delivered"}
                      </span>
                    </div>
                    <CardDescription>
                      {daysAgo} day{daysAgo > 1 ? "s" : ""} ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                    {order.items.map((orderItem, index) => (
  <div key={index} className="flex justify-between text-sm">
    <span className="text-amber-700">
      {orderItem.item.name} x {orderItem.quantity}
    </span>
    <span className="font-medium text-amber-900">₹{orderItem.item.price * orderItem.quantity}</span>
  </div>
))}
                      <Separator className="my-2 bg-amber-200" />
                      <div className="flex justify-between">
                        <span className="font-medium text-amber-900">Total</span>
                        <span className="font-bold text-amber-900">₹{order.total_price}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="text-amber-700 border-amber-300 text-xs">
                        View Details
                      </Button>
                      <Button variant="outline" className="text-amber-700 border-amber-300 text-xs">
                        Reorder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}