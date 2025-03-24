// app/auth/admin/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
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

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  lastOrder: string;
  status: string;
  type: string;
}

export default function CustomersPage() {
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: "Ramesh Kumar",
      email: "ramesh@example.com",
      phone: "+91 98765 43210",
      orders: 12,
      totalSpent: "₹5,480",
      lastOrder: "2023-07-31",
      status: "active",
      type: "regular",
    },
    {
      id: 2,
      name: "Priya Venkatesh",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      orders: 8,
      totalSpent: "₹3,240",
      lastOrder: "2023-07-29",
      status: "active",
      type: "vip",
    },
    {
      id: 3,
      name: "Arun Nair",
      email: "arun@example.com",
      phone: "+91 76543 21098",
      orders: 5,
      totalSpent: "₹1,950",
      lastOrder: "2023-07-25",
      status: "active",
      type: "regular",
    },
    {
      id: 4,
      name: "Lakshmi Narayan",
      email: "lakshmi@example.com",
      phone: "+91 65432 10987",
      orders: 15,
      totalSpent: "₹7,320",
      lastOrder: "2023-07-30",
      status: "active",
      type: "vip",
    },
    {
      id: 5,
      name: "Karthik Subramanian",
      email: "karthik@example.com",
      phone: "+91 54321 09876",
      orders: 3,
      totalSpent: "₹1,120",
      lastOrder: "2023-07-20",
      status: "inactive",
      type: "regular",
    },
    {
      id: 6,
      name: "Meena Iyer",
      email: "meena@example.com",
      phone: "+91 43210 98765",
      orders: 7,
      totalSpent: "₹2,890",
      lastOrder: "2023-07-28",
      status: "active",
      type: "regular",
    },
    {
      id: 7,
      name: "Rajesh Sharma",
      email: "rajesh@example.com",
      phone: "+91 32109 87654",
      orders: 10,
      totalSpent: "₹4,560",
      lastOrder: "2023-07-27",
      status: "active",
      type: "vip",
    },
    {
      id: 8,
      name: "Ananya Patel",
      email: "ananya@example.com",
      phone: "+91 21098 76543",
      orders: 4,
      totalSpent: "₹1,780",
      lastOrder: "2023-07-22",
      status: "active",
      type: "regular",
    },
  ]);

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

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
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
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