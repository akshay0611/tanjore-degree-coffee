"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, Download, Filter, Search, RefreshCcw } from "lucide-react"

export default function OrdersManagement() {
  const [filterStatus, setFilterStatus] = useState("all")

  const orders = [
    {
      id: "ORD-1234",
      customer: "Ramesh Kumar",
      date: "2023-07-31 14:30",
      amount: "₹450",
      status: "completed",
      items: 3,
      payment: "Online",
    },
    {
      id: "ORD-1233",
      customer: "Priya Venkatesh",
      date: "2023-07-31 13:15",
      amount: "₹680",
      status: "processing",
      items: 5,
      payment: "Cash",
    },
    {
      id: "ORD-1232",
      customer: "Arun Nair",
      date: "2023-07-31 11:45",
      amount: "₹320",
      status: "completed",
      items: 2,
      payment: "Online",
    },
    {
      id: "ORD-1231",
      customer: "Lakshmi Narayan",
      date: "2023-07-31 10:20",
      amount: "₹550",
      status: "completed",
      items: 4,
      payment: "Cash",
    },
    {
      id: "ORD-1230",
      customer: "Karthik Subramanian",
      date: "2023-07-30 16:40",
      amount: "₹780",
      status: "cancelled",
      items: 6,
      payment: "Online",
    },
    {
      id: "ORD-1229",
      customer: "Meena Iyer",
      date: "2023-07-30 15:10",
      amount: "₹420",
      status: "processing",
      items: 3,
      payment: "Cash",
    },
    {
      id: "ORD-1228",
      customer: "Rajesh Sharma",
      date: "2023-07-30 14:25",
      amount: "₹650",
      status: "completed",
      items: 5,
      payment: "Online",
    },
    {
      id: "ORD-1227",
      customer: "Ananya Patel",
      date: "2023-07-30 12:50",
      amount: "₹380",
      status: "completed",
      items: 2,
      payment: "Cash",
    },
    {
      id: "ORD-1226",
      customer: "Vikram Singh",
      date: "2023-07-30 11:15",
      amount: "₹520",
      status: "cancelled",
      items: 4,
      payment: "Online",
    },
    {
      id: "ORD-1225",
      customer: "Divya Krishnan",
      date: "2023-07-29 17:30",
      amount: "₹720",
      status: "completed",
      items: 6,
      payment: "Cash",
    },
  ]

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "processing":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">Orders Management</h1>
          <p className="text-amber-700">View and manage all customer orders</p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-amber-800 hover:bg-amber-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Input type="search" placeholder="Search orders by ID, customer..." className="pl-10 border-amber-200" />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-amber-200">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>

          <Button variant="ghost" className="text-amber-700">
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
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-amber-700">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-amber-200">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

