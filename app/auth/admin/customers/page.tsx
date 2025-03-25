// app/auth/admin/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, RefreshCcw, Download, Eye, Mail, Phone } from "lucide-react";
import { format, subDays, isAfter } from "date-fns";

// Define the Customer interface
interface Customer {
  id: string; // UUID from profiles
  name: string; // full_name from profiles
  email: string; // email from profiles
  phone: string; // phone from profiles
  orders: number; // Count of delivered orders from orders table
  totalSpent: string; // Sum of total_price from delivered orders
  lastOrder: string; // Most recent created_at from orders table
  status: string; // "active" or "inactive" based on last order date
  type: string; // "vip" or "regular" based on totalSpent
}

// Define the Profile interface (from profiles table)
interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

// Define the OrderItem interface (for items in an order)
interface OrderItem {
  item: {
    id: number;
    name: string;
    image: string;
    price: number;
    category: string;
    description: string;
  };
  quantity: number;
}

// Define the Order interface (from orders table)
interface Order {
  id: string;
  name: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[]; // Replaced 'any[]' with 'OrderItem[]'
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const customersPerPage = 5;

  // Fetch customers and orders, and set up real-time subscriptions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        setLoading(false);
        return;
      }

      // Fetch all orders (only delivered)
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, name, created_at, total_price, status, items")
        .eq("status", "delivered"); // Filter for delivered orders

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setLoading(false);
        return;
      }

      // Process data to create customers list
      const customersList = processCustomers(profilesData || [], ordersData || []);
      setCustomers(customersList);
      setFilteredCustomers(customersList);
      setLoading(false);
    };

    fetchData();

    // Set up real-time subscription for profiles table
    const profilesSubscription = supabase
      .channel("profiles-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        async () => { // Removed unused 'payload' parameter
          const { data: ordersData } = await supabase
            .from("orders")
            .select("id, name, created_at, total_price, status, items")
            .eq("status", "delivered");

          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, email, phone");

          const updatedCustomers = processCustomers(profilesData || [], ordersData || []);
          setCustomers(updatedCustomers);
          setFilteredCustomers(updatedCustomers);
        }
      )
      .subscribe();

    // Set up real-time subscription for orders table
    const ordersSubscription = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => { // Removed unused 'payload' parameter
          const { data: ordersData } = await supabase
            .from("orders")
            .select("id, name, created_at, total_price, status, items")
            .eq("status", "delivered");

          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, email, phone");

          const updatedCustomers = processCustomers(profilesData || [], ordersData || []);
          setCustomers(updatedCustomers);
          setFilteredCustomers(updatedCustomers);
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(profilesSubscription);
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  // Process profiles and orders to create the customers list
  const processCustomers = (profiles: Profile[], orders: Order[]): Customer[] => {
    return profiles.map((profile) => {
      // Filter orders for this customer (match by name)
      const customerOrders = orders.filter((order) => order.name === profile.full_name);

      // Calculate orders count (delivered orders only)
      const ordersCount = customerOrders.length;

      // Calculate total spent (delivered orders only)
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_price, 0);

      // Determine last order date (from delivered orders)
      const lastOrderDate = customerOrders.length
        ? customerOrders.reduce((latest, order) =>
            new Date(order.created_at) > new Date(latest.created_at) ? order : latest
          ).created_at
        : null;

      // Determine status (active if last order within 30 days)
      const status =
        lastOrderDate && isAfter(new Date(lastOrderDate), subDays(new Date(), 30))
          ? "active"
          : "inactive";

      // Determine type (VIP if totalSpent > ₹5,000)
      const type = totalSpent > 5000 ? "vip" : "regular";

      return {
        id: profile.id,
        name: profile.full_name || "Unknown",
        email: profile.email || "N/A",
        phone: profile.phone || "N/A",
        orders: ordersCount,
        totalSpent: `₹${totalSpent.toLocaleString()}`,
        lastOrder: lastOrderDate ? format(new Date(lastOrderDate), "yyyy-MM-dd") : "N/A",
        status,
        type,
      };
    });
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = customers;

    // Filter by customer type
    if (filterType !== "all") {
      filtered = filtered.filter((customer) => customer.type === filterType);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((customer) => customer.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filterType, filterStatus, searchQuery, customers]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "vip":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "regular":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleReset = () => {
    setFilterType("all");
    setFilterStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">
            Customer Management
          </h1>
          <p className="text-amber-700">View and manage your customer database</p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-amber-800 hover:bg-amber-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Customers
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Input
            type="search"
            placeholder="Search customers by name, email..."
            className="pl-10 border-amber-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="Customer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-amber-200">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>

          <Button variant="ghost" className="text-amber-700" onClick={handleReset}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-amber-600">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell>{index + 1 + (currentPage - 1) * customersPerPage}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-amber-700" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1 text-amber-700" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>{customer.totalSpent}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)} variant="outline">
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCustomerTypeColor(customer.type)} variant="outline">
                        {customer.type === "vip" ? "VIP" : "Regular"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-amber-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-amber-200">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}