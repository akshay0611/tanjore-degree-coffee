// app/auth/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Coffee, ShoppingBag, Users, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RecentOrders from "../RecentOrders"; // Adjust path if needed
import PopularItems from "../PopularItems"; // Adjust path if needed

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("week");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">Dashboard</h1>
          <p className="text-amber-700">Welcome back, Admin Rajesh</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-amber-300 text-amber-800">
            <Calendar className="h-4 w-4 mr-2" />
            July 1 - July 31, 2023
          </Button>
          <Button className="bg-amber-800 hover:bg-amber-700 text-white">Download Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">₹42,890</h3>
                <div className="flex items-center mt-1">
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12.5%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs last month</span>
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
                <h3 className="text-2xl font-bold text-amber-900 mt-1">538</h3>
                <div className="flex items-center mt-1">
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8.2%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs last month</span>
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
                <h3 className="text-2xl font-bold text-amber-900 mt-1">1,429</h3>
                <div className="flex items-center mt-1">
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    5.3%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs last month</span>
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
                <h3 className="text-2xl font-bold text-amber-900 mt-1">892 cups</h3>
                <div className="flex items-center mt-1">
                  <span className="text-red-600 text-sm font-medium flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    2.1%
                  </span>
                  <span className="text-amber-600 text-xs ml-2">vs last month</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Coffee className="h-5 w-5 text-amber-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart Placeholder */}
      <Card className="col-span-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-amber-900">Sales Overview</CardTitle>
              <CardDescription className="text-amber-600">Monitor your sales performance over time</CardDescription>
            </div>
            <Tabs defaultValue="week" value={dateRange} onValueChange={setDateRange}>
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
          <div className="h-64 flex items-center justify-center text-amber-600">
            Sales Chart Placeholder (Implement with Chart.js or Recharts)
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders and Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">Recent Orders</CardTitle>
            <CardDescription className="text-amber-600">Latest 10 orders from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">Popular Items</CardTitle>
            <CardDescription className="text-amber-600">Most ordered items this month</CardDescription>
          </CardHeader>
          <CardContent>
            <PopularItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}