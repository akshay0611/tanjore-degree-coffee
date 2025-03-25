// app/auth/admin/SalesChart.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Define the structure of an order for the chart
interface Order {
  created_at: string;
  total_price: number;
  status: string;
}

// Define the structure of the chart data
interface ChartData {
  date: string;
  revenue: number;
}

interface SalesChartProps {
  dateRange: string;
  startDate: Date;
}

export default function SalesChart({ dateRange, startDate }: SalesChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      // Fetch all orders within the current period for the chart
      const { data: chartOrders, error: chartError } = await supabase
        .from("orders")
        .select("created_at, total_price, status")
        .gte("created_at", startDate.toISOString())
        .eq("status", "delivered");

      if (chartError) {
        console.error("Error fetching chart orders:", chartError);
        setChartData([]);
        setLoading(false);
        return;
      }

      // Prepare chart data
      const now = new Date();
      let intervals: Date[] = [];
      let formatString = "";

      // Define intervals based on the date range
      switch (dateRange) {
        case "day":
          intervals = eachDayOfInterval({ start: startDate, end: now });
          formatString = "MMM d";
          break;
        case "week":
          intervals = eachWeekOfInterval({ start: startDate, end: now }, { weekStartsOn: 1 });
          formatString = "MMM d";
          break;
        case "month":
          intervals = eachDayOfInterval({ start: startDate, end: now });
          formatString = "MMM d";
          break;
        case "year":
          intervals = eachMonthOfInterval({ start: startDate, end: now });
          formatString = "MMM yyyy";
          break;
        default:
          intervals = eachDayOfInterval({ start: startDate, end: now });
          formatString = "MMM d";
      }

      // Initialize chart data with 0 revenue for each interval
      const chartDataMap: { [key: string]: number } = {};
      intervals.forEach((interval) => {
        const dateKey = format(interval, formatString);
        chartDataMap[dateKey] = 0;
      });

      // Aggregate revenue by interval
      chartOrders?.forEach((order: Order) => {
        const orderDate = new Date(order.created_at);
        let dateKey: string;

        switch (dateRange) {
          case "day":
            dateKey = format(orderDate, "MMM d");
            break;
          case "week":
            const startOfWeekDate = startOfWeek(orderDate, { weekStartsOn: 1 });
            dateKey = format(startOfWeekDate, "MMM d");
            break;
          case "month":
            dateKey = format(orderDate, "MMM d");
            break;
          case "year":
            dateKey = format(orderDate, "MMM yyyy");
            break;
          default:
            dateKey = format(orderDate, "MMM d");
        }

        if (chartDataMap[dateKey] !== undefined) {
          chartDataMap[dateKey] += order.total_price;
        }
      });

      // Convert chartDataMap to array for Recharts
      const preparedData = Object.keys(chartDataMap).map((date) => ({
        date,
        revenue: chartDataMap[date],
      }));

      setChartData(preparedData);
      setLoading(false);
    };

    fetchChartData();
  }, [dateRange, startDate]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-amber-600">Loading chart...</div>;
  }

  return (
    <div className="h-64">
      {chartData.length === 0 ? (
        <div className="h-full flex items-center justify-center text-amber-600">
          No sales data available for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#4a2c0b" />
            <YAxis stroke="#4a2c0b" />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              labelStyle={{ color: "#4a2c0b" }}
              itemStyle={{ color: "#4a2c0b" }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#8b5a2b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}