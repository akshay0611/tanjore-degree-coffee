"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Fetch orders data from Supabase
  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  // Show notification helper
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({
      show: true,
      type,
      message
    });
  };

  // Handle view details button click
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  // Handle reorder button click
  const handleReorder = async (order: Order) => {
    try {
      setReorderLoading(true);
  
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        showNotification("error", "You must be logged in to reorder.");
        return;
      }
  
      // Prepare new order data based on the existing order
      const newOrder = {
        profile_id: userData.user.id,
        items: order.items, // Reuse the items from the original order
        total_price: order.total_price,
        status: "pending", // Set status to "pending" for the new order
        created_at: new Date().toISOString(), // New timestamp
        delivery_address: order.delivery_address,
        name: order.name,
        email: order.email,
      };
  
      // Insert the new order into the orders table
      const { error: orderError } = await supabase
        .from("orders")
        .insert(newOrder)
        .select();
  
      if (orderError) {
        console.error("Order insert error:", orderError);
        showNotification("error", `Failed to create new order: ${orderError.message}`);
        return;
      }
  
      // Show success notification
      showNotification("success", "New order created successfully!");
      
      // Refresh the orders list
      fetchOrders();
  
    } catch (e) {
      console.error("Unexpected error during reorder:", e);
      showNotification("error", "An unexpected error occurred. Please try again.");
    } finally {
      setReorderLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
      {/* Custom notification */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

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
                      {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago
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
                      <Button 
                        variant="outline" 
                        className="text-amber-700 border-amber-300 text-xs"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-amber-700 border-amber-300 text-xs"
                        onClick={() => handleReorder(order)}
                        disabled={reorderLoading}
                      >
                        {reorderLoading ? "Processing..." : "Reorder"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id.slice(0, 8)} placed on {selectedOrder && formatDate(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-amber-900">Items</h3>
                {selectedOrder.items.map((orderItem, index) => (
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
                  <span className="font-bold text-amber-900">₹{selectedOrder.total_price}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-amber-900">Delivery Details</h3>
                <p className="text-sm text-amber-700">
                  <strong>Name:</strong> {selectedOrder.name}
                </p>
                <p className="text-sm text-amber-700">
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p className="text-sm text-amber-700">
                  <strong>Address:</strong> {selectedOrder.delivery_address}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-amber-900">Order Status</h3>
                <p className="text-sm text-amber-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.status === "pending" ? "bg-amber-200 text-amber-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedOrder.status === "pending" ? "Processing" : "Delivered"}
                  </span>
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="text-amber-700 border-amber-300"
              onClick={() => handleReorder(selectedOrder!)}
              disabled={reorderLoading || !selectedOrder}
            >
              {reorderLoading ? "Processing..." : "Reorder"}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="text-amber-700">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}