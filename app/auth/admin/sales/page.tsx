"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { DollarSign, ShoppingCart, Coffee, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SalesChart from "../SalesChart";
import { subDays, subWeeks, subMonths, subYears, startOfDay, startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

interface ItemDetails {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  description: string;
}

interface OrderItem {
  item: ItemDetails;
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[];
}

interface SalesStats {
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItem: { name: string; quantity: number } | null;
}

interface ItemSales {
  itemId: number;
  name: string;
  category: string;
  totalRevenue: number;
  quantitySold: number;
}

export default function SalesPage() {
  const [dateRange, setDateRange] = useState("month");
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [itemSales, setItemSales] = useState<ItemSales[]>([]);
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);

      const { startCurrent } = getDateRange(dateRange);
      setStartDate(startCurrent);

      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, name, created_at, total_price, status, items")
        .gte("created_at", startCurrent.toISOString())
        .eq("status", "delivered");

      if (error) {
        console.error("Error fetching sales data:", error);
        setStats({
          totalRevenue: 0,
          averageOrderValue: 0,
          topSellingItem: null,
        });
        setItemSales([]);
        setLoading(false);
        return;
      }

      const deliveredOrders = orders || [];
      const stats = calculateStats(deliveredOrders);
      const itemSalesData = calculateItemSales(deliveredOrders);

      setStats(stats);
      setItemSales(itemSalesData);
      setLoading(false);
    };

    fetchSalesData();
  }, [dateRange]);

  const calculateStats = (orders: Order[]): SalesStats => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemQuantities: { [key: number]: { name: string; quantity: number } } = {};
    orders.forEach((order) => {
      order.items.forEach((orderItem) => {
        const itemId = orderItem.item.id;
        if (!itemQuantities[itemId]) {
          itemQuantities[itemId] = { name: orderItem.item.name, quantity: 0 };
        }
        itemQuantities[itemId].quantity += orderItem.quantity;
      });
    });

    const topSellingItemEntry = Object.entries(itemQuantities).reduce(
      (max, entry) => {
        const data = entry[1];
        return data.quantity > max.quantity ? { name: data.name, quantity: data.quantity } : max;
      },
      { name: "", quantity: 0 }
    );

    return {
      totalRevenue,
      averageOrderValue,
      topSellingItem: topSellingItemEntry.quantity > 0 ? topSellingItemEntry : null,
    };
  };

  const calculateItemSales = (orders: Order[]): ItemSales[] => {
    const itemSalesMap: { [key: number]: ItemSales } = {};

    orders.forEach((order) => {
      order.items.forEach((orderItem) => {
        const itemId = orderItem.item.id;
        if (!itemSalesMap[itemId]) {
          itemSalesMap[itemId] = {
            itemId: itemId,
            name: orderItem.item.name,
            category: orderItem.item.category,
            totalRevenue: 0,
            quantitySold: 0,
          };
        }
        itemSalesMap[itemId].totalRevenue += orderItem.item.price * orderItem.quantity;
        itemSalesMap[itemId].quantitySold += orderItem.quantity;
      });
    });

    return Object.values(itemSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const handleDownloadReport = () => {
    const csvContent = [
      "Item Name,Category,Total Revenue,Quantity Sold",
      ...itemSales.map((item) => `${item.name},${item.category},${item.totalRevenue},${item.quantitySold}`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales_report_${dateRange}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading || !stats) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">Sales</h1>
          <p className="text-amber-700">Detailed sales performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-amber-300 text-amber-800">
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange === "day" && format(new Date(), "MMMM d, yyyy")}
            {dateRange === "week" && `${format(subWeeks(new Date(), 1), "MMM d")} - ${format(new Date(), "MMM d, yyyy")}`}
            {dateRange === "month" && format(new Date(), "MMMM yyyy")}
            {dateRange === "year" && format(new Date(), "yyyy")}
          </Button>
          <Button className="bg-amber-800 hover:bg-amber-700 text-white" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Average Order Value</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">₹{stats.averageOrderValue.toFixed(2)}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <ShoppingCart className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Top Selling Item</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">
                  {stats.topSellingItem ? `${stats.topSellingItem.name} (${stats.topSellingItem.quantity})` : "N/A"}
                </h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Coffee className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-amber-900">Sales Trend</CardTitle>
              <CardDescription className="text-amber-600">Revenue over time (delivered orders only)</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-amber-900">Sales by Item</CardTitle>
          <CardDescription className="text-amber-600">Breakdown of sales by menu item (delivered orders only)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-amber-900">Item Name</TableHead>
                <TableHead className="text-amber-900">Category</TableHead>
                <TableHead className="text-amber-900">Total Revenue</TableHead>
                <TableHead className="text-amber-900">Quantity Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemSales.length > 0 ? (
                itemSales.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>{item.quantitySold}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-amber-600">
                    No sales data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}