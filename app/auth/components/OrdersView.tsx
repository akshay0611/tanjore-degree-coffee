// app/auth/components/OrdersView.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cancelOrder } from "./supabaseUtils"; // Import cancelOrder utility

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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
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

  // Filter states
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("most-recent");

  useEffect(() => {
    fetchOrders();

    // Real-time subscription to orders
    const orderSubscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) =>
            prev.map((order) => (order.id === payload.new.id ? { ...order, ...payload.new } : order))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((order) => new Date(order.created_at) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      filtered = filtered.filter((order) => new Date(order.created_at) <= toDate);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter((order) => order.total_price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((order) => order.total_price <= max);
    }

    if (sortOption === "most-recent") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOption === "highest-value") {
      filtered.sort((a, b) => b.total_price - a.total_price);
    }

    setFilteredOrders(filtered);
  }, [orders, dateFrom, dateTo, statusFilter, minPrice, maxPrice, sortOption]);

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

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleReorder = async (order: Order) => {
    try {
      setReorderLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        showNotification("error", "You must be logged in to reorder.");
        return;
      }

      const newOrder = {
        profile_id: userData.user.id,
        items: order.items,
        total_price: order.total_price,
        status: "pending",
        created_at: new Date().toISOString(),
        delivery_address: order.delivery_address,
        name: order.name,
        email: order.email,
      };

      const { error: orderError } = await supabase.from("orders").insert(newOrder).select();
      if (orderError) {
        console.error("Order insert error:", orderError);
        showNotification("error", `Failed to create new order: ${orderError.message}`);
        return;
      }

      showNotification("success", "New order created successfully!");
      fetchOrders();
    } catch (e) {
      console.error("Unexpected error during reorder:", e);
      showNotification("error", "An unexpected error occurred. Please try again.");
    } finally {
      setReorderLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if order is cancellable (within 10 minutes of creation)
  const isOrderCancellable = (order: Order) => {
    const createdAt = new Date(order.created_at);
    const now = new Date();
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return diffInMinutes <= 10 && order.status !== "cancelled" && order.status !== "delivered";
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      showNotification("success", "Order cancelled successfully!");
      // Real-time subscription will update the UI
    } catch (error) {
      console.error("Error cancelling order:", error);
      showNotification("error", "Failed to cancel order. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-amber-900">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
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
          <CardTitle className="text-amber-900">Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-amber-700">From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 border-amber-200 bg-amber-50"
              />
            </div>
            <div>
              <Label className="text-amber-700">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 border-amber-200 bg-amber-50"
              />
            </div>
            <div>
              <Label className="text-amber-700">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1 border-amber-200 bg-amber-50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem> {/* Added */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-amber-700">Min Price</Label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="mt-1 border-amber-200 bg-amber-50"
                />
              </div>
              <div>
                <Label className="text-amber-700">Max Price</Label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="mt-1 border-amber-200 bg-amber-50"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-amber-700">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="mt-1 border-amber-200 bg-amber-50 w-full md:w-48">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-recent">Most Recent</SelectItem>
                <SelectItem value="highest-value">Highest Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-amber-900">No orders match the selected filters.</p>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const orderDate = new Date(order.created_at);
                const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
                const cancellable = isOrderCancellable(order);

                return (
                  <Card key={order.id} className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-amber-900 text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "pending"
                              ? "bg-amber-200 text-amber-800"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800" // Added for cancelled
                          }`}
                        >
                          {order.status === "pending" ? "Processing" : order.status === "delivered" ? "Delivered" : "Cancelled"}
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
                            <span className="font-medium text-amber-900">
                              ₹{orderItem.item.price * orderItem.quantity}
                            </span>
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
                          disabled={reorderLoading || order.status === "cancelled"} // Disable if cancelled
                        >
                          {reorderLoading ? "Processing..." : "Reorder"}
                        </Button>
                        {cancellable && (
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-300 text-xs hover:text-red-800"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
                      selectedOrder.status === "pending"
                        ? "bg-amber-200 text-amber-800"
                        : selectedOrder.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800" // Added for cancelled
                    }`}
                  >
                    {selectedOrder.status === "pending"
                      ? "Processing"
                      : selectedOrder.status === "delivered"
                      ? "Delivered"
                      : "Cancelled"}
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
              disabled={reorderLoading || !selectedOrder || selectedOrder?.status === "cancelled"} // Disable if cancelled
            >
              {reorderLoading ? "Processing..." : "Reorder"}
            </Button>
            {selectedOrder && isOrderCancellable(selectedOrder) && (
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:text-red-800"
                onClick={() => handleCancelOrder(selectedOrder.id)}
              >
                Cancel Order
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="ghost" className="text-amber-700">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}