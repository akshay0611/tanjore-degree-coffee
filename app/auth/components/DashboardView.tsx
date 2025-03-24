"use client";

import { Bell, Coffee, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Address, Notification, Order } from "./types"; // Import Order from types.ts
import { fetchAddresses } from "./supabaseUtils";
import { getRecommendedItems } from "./supabaseRecommendations";

export default function DashboardView() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]); // Use Order from types.ts
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
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

        const addressData = await fetchAddresses(userId);
        setAddresses(addressData);

        const { data: notificationsData, error: notificationsError } = await supabase
          .from("notifications")
          .select("*")
          .eq("profile_id", userId)
          .order("created_at", { ascending: false });

        if (notificationsError) {
          console.error("Error fetching notifications:", notificationsError);
        } else {
          setNotifications(notificationsData || []);
        }

        const orderSubscription = supabase
          .channel("orders")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "orders",
              filter: `profile_id=eq.${userId}`,
            },
            (payload) => {
              setRecentOrders((prev) =>
                prev.map((order) =>
                  order.id === payload.new.id ? { ...order, ...payload.new } : order
                )
              );
            }
          )
          .subscribe();

        const notificationSubscription = supabase
          .channel("notifications")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `profile_id=eq.${userId}`,
            },
            (payload) => {
              setNotifications((prev) => [payload.new as Notification, ...prev]);
            }
          )
          .subscribe();

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

  const handleViewAllOrders = () => {
    router.push("/orders");
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } else {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } else {
      console.error("Error deleting notification:", error);
    }
  };

  const recommendedItems = getRecommendedItems(recentOrders);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-900">Dashboard</h1>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="relative text-amber-900 border-amber-300"
            onClick={handleToggleNotifications}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-amber-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 flex justify-between items-center border-b border-amber-100 last:border-b-0"
                  >
                    <div
                      className={`text-sm ${n.is_read ? "text-amber-700" : "text-amber-900 font-medium"} cursor-pointer`}
                      onClick={() => !n.is_read && markNotificationAsRead(n.id)}
                    >
                      {n.message}
                      <p className="text-xs text-amber-600">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteNotification(n.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="p-2 text-sm text-amber-700">No notifications</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Card className="bg-white border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-900">
            {loading ? "Welcome back!" : error ? "Welcome back, User!" : `Welcome back, ${fullName}!`}
          </CardTitle>
          <CardDescription>Here's an overview of your account</CardDescription>
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
                <div className="text-2xl font-bold text-amber-900">{addresses.length}</div>
                <p className="text-xs text-amber-700 mt-1">
                  {addresses.length > 0 ? addresses.map((addr) => addr.label).join(", ") : "No addresses saved"}
                </p>
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
                    <div
                      key={order.id}
                      className="flex items-center justify-between pb-4 border-b border-amber-100"
                    >
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
                          <p className="text-xs text-amber-800 font-medium">Status: {order.status}</p>
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
            <CardTitle className="text-amber-900">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-amber-900">Loading recommendations...</p>
            ) : recommendedItems.length > 0 ? (
              <div className="space-y-4">
                {recommendedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                        <Coffee className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-900">{item.name}</p>
                        <p className="text-xs text-amber-700">{item.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-700">
                      Order Now
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-700 text-center py-4">No recommendations available</p>
            )}
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