// app/auth/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Coffee, ShoppingBag, Users, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RecentOrders from "../RecentOrders";
import PopularItems from "../PopularItems";
import SalesChart from "../SalesChart";
import { subDays, subWeeks, subMonths, subYears, startOfDay, startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

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

// Define the structure of an order from the Supabase orders table
interface Order {
  id: string;
  name: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[];
}

// Define the structure of the stats for the dashboard
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  coffeeSold: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  coffeeSoldChange: number;
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("month");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string>("Admin");

  // Fetch the admin's full name from Supabase
  useEffect(() => {
    const fetchFullName = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("profiles") // Changed from "users" to "profiles" to match AdminHeader
        .select("full_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching full name:", error);
        return;
      }

      if (data?.full_name) {
        setFullName(data.full_name);
      }
    };

    fetchFullName();
  }, []);

  // Calculate the date range for the current and previous periods
  const getDateRange = (range: string) => {
    const now = new Date();
    let startCurrent: Date;
    let startPrevious: Date;

    switch (range) {
      case "day":
        startCurrent = startOfDay(now);
        startPrevious = startOfDay(subDays(now, 1));
        break;
      case "week":
        startCurrent = startOfWeek(now, { weekStartsOn: 1 });
        startPrevious = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        break;
      case "month":
        startCurrent = startOfMonth(now);
        startPrevious = startOfMonth(subMonths(now, 1));
        break;
      case "year":
        startCurrent = startOfYear(now);
        startPrevious = startOfYear(subYears(now, 1));
        break;
      default:
        startCurrent = startOfMonth(now);
        startPrevious = startOfMonth(subMonths(now, 1));
    }

    return { startCurrent, startPrevious };
  };

  // Fetch orders and calculate stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const { startCurrent, startPrevious } = getDateRange(dateRange);

      setStartDate(startCurrent);

      const { data: currentOrders, error: currentError } = await supabase
        .from("orders")
        .select("id, name, created_at, total_price, status, items")
        .gte("created_at", startCurrent.toISOString())
        .eq("status", "delivered");

      const { data: previousOrders, error: previousError } = await supabase
        .from("orders")
        .select("id, name, created_at, total_price, status, items")
        .gte("created_at", startPrevious.toISOString())
        .lt("created_at", startCurrent.toISOString())
        .eq("status", "delivered");

      if (currentError || previousError) {
        console.error("Error fetching orders:", currentError || previousError);
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          coffeeSold: 0,
          revenueChange: 0,
          ordersChange: 0,
          customersChange: 0,
          coffeeSoldChange: 0,
        });
        setLoading(false);
        return;
      }

      const currentStats = calculateStats(currentOrders || []);
      const previousStats = calculateStats(previousOrders || []);

      const revenueChange = previousStats.totalRevenue
        ? ((currentStats.totalRevenue - previousStats.totalRevenue) / previousStats.totalRevenue) * 100
        : 0;
      const ordersChange = previousStats.totalOrders
        ? ((currentStats.totalOrders - previousStats.totalOrders) / previousStats.totalOrders) * 100
        : 0;
      const customersChange = previousStats.totalCustomers
        ? ((currentStats.totalCustomers - previousStats.totalCustomers) / previousStats.totalCustomers) * 100
        : 0;
      const coffeeSoldChange = previousStats.coffeeSold
        ? ((currentStats.coffeeSold - previousStats.coffeeSold) / previousStats.coffeeSold) * 100
        : 0;

      setStats({
        totalRevenue: currentStats.totalRevenue,
        totalOrders: currentStats.totalOrders,
        totalCustomers: currentStats.totalCustomers,
        coffeeSold: currentStats.coffeeSold,
        revenueChange,
        ordersChange,
        customersChange,
        coffeeSoldChange,
      });

      setLoading(false);
    };

    fetchStats();
  }, [dateRange]);

  const calculateStats = (orders: Order[]) => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map((order) => order.name)).size;

    let coffeeSold = 0;
    orders.forEach((order) => {
      order.items.forEach((orderItem) => {
        const category = orderItem.item.category.toLowerCase();
        if (category.includes("coffee")) {
          coffeeSold += orderItem.quantity;
        }
      });
    });

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      coffeeSold,
    };
  };

  if (loading || !stats) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">Dashboard</h1>
          <p className="text-amber-700">Welcome back, {fullName}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-amber-300 text-amber-800">
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange === "day" && format(new Date(), "MMMM d, yyyy")}
            {dateRange === "week" && `${format(subWeeks(new Date(), 1), "MMM d")} - ${format(new Date(), "MMM d, yyyy")}`}
            {dateRange === "month" && format(new Date(), "MMMM yyyy")}
            {dateRange === "year" && format(new Date(), "yyyy")}
          </Button>
          <Button className="bg-amber-800 hover:bg-amber-700 text-white">Download Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.revenueChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.revenueChange).toFixed(1)}%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs previous period</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <TrendingUp className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Total Orders</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">{stats.totalOrders}</h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stats.ordersChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.ordersChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.ordersChange).toFixed(1)}%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs previous period</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <ShoppingBag className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Total Customers</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">{stats.totalCustomers}</h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stats.customersChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.customersChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.customersChange).toFixed(1)}%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs previous period</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Users className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Coffee Sold</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">{stats.coffeeSold} cups</h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stats.coffeeSoldChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.coffeeSoldChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.coffeeSoldChange).toFixed(1)}%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs previous period</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Coffee className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-amber-900">Sales Overview</CardTitle>
              <CardDescription className="text-amber-600">Monitor your sales performance over time (delivered orders only)</CardDescription>
            </div>
            <Tabs defaultValue="month" value={dateRange} onValueChange={setDateRange}>
              <TabsList className="bg-amber-100">
                <TabsTrigger value="day" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Month
                </TabsTrigger>
                <TabsTrigger value="year" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Year
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <SalesChart dateRange={dateRange} startDate={startDate} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">Recent Orders</CardTitle>
            <CardDescription className="text-amber-600">
              Latest 10 orders from customers (includes all statuses; stats above reflect delivered orders only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">Popular Items</CardTitle>
            <CardDescription className="text-amber-600">Most ordered items this month (delivered orders only)</CardDescription>
          </CardHeader>
          <CardContent>
            <PopularItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}