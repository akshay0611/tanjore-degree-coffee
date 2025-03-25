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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define interfaces (unchanged)
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  lastOrder: string;
  status: string;
  type: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

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

interface Order {
  id: string;
  name: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const customersPerPage = 5;

  // Fetch customers and orders
  const fetchData = async () => {
    setLoading(true);

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setLoading(false);
      return;
    }

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("id, name, created_at, total_price, status, items")
      .eq("status", "delivered");

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      setLoading(false);
      return;
    }

    const customersList = processCustomers(profilesData || [], ordersData || []);
    setCustomers(customersList);
    setFilteredCustomers(customersList);
    setOrders(ordersData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const profilesSubscription = supabase
      .channel("profiles-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchData)
      .subscribe();

    const ordersSubscription = supabase
      .channel("orders-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(profilesSubscription);
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const processCustomers = (profiles: Profile[], orders: Order[]): Customer[] => {
    return profiles.map((profile) => {
      const customerOrders = orders.filter((order) => order.name === profile.full_name);
      const ordersCount = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_price, 0);
      const lastOrderDate = customerOrders.length
        ? customerOrders.reduce((latest, order) =>
            new Date(order.created_at) > new Date(latest.created_at) ? order : latest
          ).created_at
        : null;
      const status =
        lastOrderDate && isAfter(new Date(lastOrderDate), subDays(new Date(), 30))
          ? "active"
          : "inactive";
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

  useEffect(() => {
    let filtered = customers;

    if (filterType !== "all") {
      filtered = filtered.filter((customer) => customer.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((customer) => customer.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [filterType, filterStatus, searchQuery, customers]);

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

  // Renamed and kept functional as a reset + refresh
  const handleReset = async () => {
    setFilterType("all");
    setFilterStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
    await fetchData(); // Refetch data from Supabase
  };

  const handleExportCustomers = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Orders", "Total Spent", "Last Order", "Status", "Type"];
    const csvRows = [
      headers.join(","), // Header row
      ...filteredCustomers.map((customer, index) =>
        [
          index + 1,
          `"${customer.name}"`, // Wrap in quotes to handle commas
          customer.email,
          customer.phone,
          customer.orders,
          customer.totalSpent.replace("₹", ""), // Remove ₹ symbol
          customer.lastOrder,
          customer.status,
          customer.type,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
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
          <Button
            className="bg-amber-800 hover:bg-amber-700 text-white"
            onClick={handleExportCustomers}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Customers
          </Button>
        </div>
      </div>

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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-amber-700"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        {selectedCustomer && selectedCustomer.id === customer.id && (
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{selectedCustomer.name} - Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Email:</span>
                                <span className="col-span-3">{selectedCustomer.email}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Phone:</span>
                                <span className="col-span-3">{selectedCustomer.phone}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Orders:</span>
                                <span className="col-span-3">{selectedCustomer.orders}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Total Spent:</span>
                                <span className="col-span-3">{selectedCustomer.totalSpent}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Last Order:</span>
                                <span className="col-span-3">{selectedCustomer.lastOrder}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Status:</span>
                                <span className="col-span-3">{selectedCustomer.status}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1 font-medium">Type:</span>
                                <span className="col-span-3">{selectedCustomer.type}</span>
                              </div>
                              <div className="mt-4">
                                <h3 className="font-semibold">Recent Orders</h3>
                                <ul className="mt-2 space-y-2">
                                  {orders
                                    .filter((order) => order.name === selectedCustomer.name)
                                    .slice(0, 3)
                                    .map((order) => (
                                      <li key={order.id} className="text-sm">
                                        <span>
                                          {format(new Date(order.created_at), "yyyy-MM-dd")} - ₹
                                          {order.total_price} ({order.items.length} items)
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

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