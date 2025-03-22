// app/auth/components/DashboardView.tsx
"use client";

import { Bell, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";

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
}

interface Notification {
  id: string;
  profile_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function DashboardView() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          setError("No authenticated user found.");
          setLoading(false);
          return;
        }

        const userId = userData.user.id;

        // Fetch full_name from the `profiles` table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();

        if (profileError || !profileData) {
          setError("No profile found.");
          setFullName(null);
        } else {
          setFullName(profileData.full_name || null);
        }

        // Fetch recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("profile_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setRecentOrders(ordersData || []);
        }

        // Fetch existing notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from("notifications")
          .select("*")
          .eq("profile_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (notificationsError) {
          console.error("Error fetching notifications:", notificationsError);
        } else {
          setNotifications(notificationsData || []);
        }

        // Real-time subscription for order updates
        const orderSubscription = supabase
          .channel("orders-channel")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "orders",
              filter: `profile_id=eq.${userId}`,
            },
            async (payload) => {
              const updatedOrder = payload.new as Order;
              const oldOrder = payload.old as Order;

              if (updatedOrder.status !== oldOrder.status) {
                const message =
                  updatedOrder.status === "Confirmed"
                    ? `Order #${updatedOrder.id.slice(0, 8)} Confirmed`
                    : updatedOrder.status === "Shipped"
                    ? `Order #${updatedOrder.id.slice(0, 8)} Shipped`
                    : `Order #${updatedOrder.id.slice(0, 8)} Updated: ${updatedOrder.status}`;

                // Insert the notification into the database
                const { error: insertError } = await supabase
                  .from("notifications")
                  .insert({
                    profile_id: userId,
                    message,
                    created_at: new Date().toISOString(),
                    read: false,
                  });

                if (insertError) {
                  console.error("Error inserting notification:", insertError);
                }

                // Update recent orders
                setRecentOrders((prev) =>
                  prev.map((order) =>
                    order.id === updatedOrder.id ? updatedOrder : order
                  )
                );
              }
            }
          )
          .subscribe();

        // Real-time subscription for notifications table
        const notificationSubscription = supabase
          .channel("notifications-channel")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `profile_id=eq.${userId}`,
            },
            (payload) => {
              console.log("Notification Event Received:", payload);
              if (payload.eventType === "INSERT") {
                setNotifications((prev) => [payload.new as Notification, ...prev]);
              } else if (payload.eventType === "UPDATE") {
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === payload.new.id ? (payload.new as Notification) : notif
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setNotifications((prev) => {
                  const updatedNotifications = prev.filter((notif) => notif.id !== payload.old.id);
                  console.log("Notifications after DELETE:", updatedNotifications);
                  return updatedNotifications;
                });
              }
            }
          )
          .subscribe((status) => {
            console.log("Notification Subscription Status:", status);
          });

        setLoading(false);

        return () => {
          supabase.removeChannel(orderSubscription);
          supabase.removeChannel(notificationSubscription);
        };
      } catch (e) {
        setError("An unexpected error occurred.");
        console.error("Error fetching data:", e);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateDaysAgo = (dateString: string) => {
    const orderDate = new Date(dateString);
    const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo;
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearNotifications = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error("User not authenticated:", userError);
        return;
      }

      const userId = userData.user.id;
      console.log("Clearing notifications for user:", userId);

      const { error: deleteError } = await supabase
        .from("notifications")
        .delete()
        .eq("profile_id", userId);

      if (deleteError) {
        console.error("Error clearing notifications:", deleteError);
        return;
      }

      // Optimistically update the UI
      setNotifications([]);

      // Fetch notifications again as a fallback to ensure consistency
      const { data: notificationsData, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("profile_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (fetchError) {
        console.error("Error fetching notifications after clear:", fetchError);
      } else {
        setNotifications(notificationsData || []);
      }
    } catch (e) {
      console.error("Unexpected error clearing notifications:", e);
    }
  };

  const handleViewAllOrders = () => {
    router.push("/orders");
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-900">Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative text-amber-900 border-amber-300">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-amber-900">Notifications</h4>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-700 hover:text-amber-900"
                  onClick={clearNotifications}
                >
                  Clear All
                </Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-amber-700 text-center py-2">No notifications</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2 rounded-md flex items-center justify-between ${
                      notif.read ? "bg-amber-50" : "bg-amber-100"
                    }`}
                  >
                    <div>
                      <p className={`text-sm ${notif.read ? "text-amber-700" : "text-amber-900 font-medium"}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-amber-600">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-700 hover:text-amber-900"
                        onClick={() => markAsRead(notif.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <Card className="bg-white border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-900">
            {loading ? "Welcome back!" : error ? "Welcome back, User!" : `Welcome back, ${fullName}!`}
          </CardTitle>
          <CardDescription>Here&apos;s an overview of your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">Loyalty Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">250 pts</div>
                <p className="text-xs text-amber-700 mt-1">Earn 50 more for a free coffee</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{recentOrders.length}</div>
                <p className="text-xs text-amber-700 mt-1">
                  {recentOrders.length > 0
                    ? `Last order: ${calculateDaysAgo(recentOrders[0].created_at)} days ago`
                    : "No recent orders"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">Saved Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">3</div>
                <p className="text-xs text-amber-700 mt-1">Home, Work, Parents</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-amber-900">Loading orders...</p>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const daysAgo = calculateDaysAgo(order.created_at);
                  const firstItemName = order.items.length > 0 ? order.items[0].item.name : "Unknown item";
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between pb-4 border-b border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                          <Coffee className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-900">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-amber-700">
                            {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago • {firstItemName}
                            {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-amber-900">₹{order.total_price}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-amber-700 text-center py-4">No recent orders found</p>
            )}
            <Button
              variant="ghost"
              className="w-full mt-4 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
              onClick={handleViewAllOrders}
            >
              View All Orders
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Favorite Coffees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Tanjore Filter Coffee", "Madras Kaapi", "Kumbakonam Degree Coffee"].map((coffee, index) => (
                <div key={coffee} className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-medium text-amber-900">{coffee}</p>
                      <p className="text-xs text-amber-700">Ordered {5 - index} times</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-700">
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              View Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}