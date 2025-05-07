"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download, Filter, Search, RefreshCcw } from "lucide-react";
import { format } from "date-fns";

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
  customer: string;
  date: string;
  amount: string;
  status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const ordersPerPage = 10;

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, name, created_at, total_price, status, items")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setFilteredOrders([]);
    } else {
      const mappedOrders: Order[] = data.map((order) => ({
        id: order.id,
        customer: order.name,
        date: format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
        amount: `₹${order.total_price.toLocaleString()}`,
        status: order.status,
        items: order.items || [],
      }));

      setOrders(mappedOrders);
      setFilteredOrders(mappedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription for orders table
    const ordersSubscription = supabase
      .channel("orders-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = orders;

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter((order) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesBasic =
          order.id.toLowerCase().includes(searchLower) ||
          order.customer.toLowerCase().includes(searchLower);

        // Search through items
        const matchesItems = order.items.some((orderItem) =>
          orderItem.item.name.toLowerCase().includes(searchLower)
        );

        return matchesBasic || matchesItems;
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [filterStatus, searchQuery, orders]);

  // Function to update order status in Supabase
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status. Please try again.");
      return;
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setFilteredOrders((prevFiltered) =>
      prevFiltered.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Reset and refetch data
  const handleReset = async () => {
    setFilterStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
    await fetchOrders(); // Refetch data from Supabase
  };

  // Export Orders as CSV
  const handleExportOrders = () => {
    const headers = ["Order ID", "Customer", "Date & Time", "Items", "Quantity", "Amount", "Status"];
    const csvRows = [
      headers.join(","), // Header row
      ...filteredOrders.map((order) =>
        [
          order.id,
          `"${order.customer}"`, // Wrap in quotes to handle commas
          order.date,
          `"${getItemNames(order.items)}"`, // Wrap in quotes to handle commas
          getTotalQuantity(order.items),
          order.amount.replace("₹", ""), // Remove ₹ symbol
          order.status,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to truncate Order ID to 8 characters
  const truncateOrderId = (id: string) => {
    return id.length > 8 ? `${id.slice(0, 8)}` : id;
  };

  // Helper to get item names for display in the table
  const getItemNames = (items: OrderItem[]) => {
    if (items.length === 0) return "No items";
    const names = items
      .map((orderItem) => (orderItem.item && orderItem.item.name ? orderItem.item.name : "Unknown Item"))
      .join(", ");
    return names.length > 50 ? `${names.slice(0, 50)}...` : names;
  };

  // Helper to get total quantity of items
  const getTotalQuantity = (items: OrderItem[]) => {
    return items.reduce((sum, orderItem) => sum + orderItem.quantity, 0);
  };

  if (loading) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">
            Orders Management
          </h1>
          <p className="text-amber-700">View and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-amber-800 hover:bg-amber-700 text-white"
            onClick={handleExportOrders}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Input
            type="search"
            placeholder="Search by ID, customer, or items..."
            className="pl-10 border-amber-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-amber-600">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{truncateOrderId(order.id)}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{getItemNames(order.items)}</TableCell>
                    <TableCell>{getTotalQuantity(order.items)}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                      >
                        <SelectTrigger className={`w-[120px] ${getStatusColor(order.status)}`}>
                          <SelectValue>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-amber-700"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        {selectedOrder && selectedOrder.id === order.id && (
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p><strong>Customer:</strong> {order.customer}</p>
                                <p><strong>Date:</strong> {order.date}</p>
                                <p><strong>Total Amount:</strong> {order.amount}</p>
                                <p><strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-amber-900">Items</h3>
                                {order.items.length > 0 ? (
                                  <ul className="space-y-2">
                                    {order.items.map((orderItem, index) => (
                                      <li key={index} className="flex justify-between">
                                        <span>{orderItem.item.name} (x{orderItem.quantity})</span>
                                        <span>₹{orderItem.item.price * orderItem.quantity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No items in this order.</p>
                                )}
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