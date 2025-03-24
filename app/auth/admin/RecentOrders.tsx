// app/auth/admin/RecentOrders.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function RecentOrders() {
  const orders = [
    {
      id: "ORD-1234",
      customer: "Ramesh Kumar",
      date: "2023-07-31 14:30",
      amount: "₹450",
      status: "completed",
      items: 3,
    },
    {
      id: "ORD-1233",
      customer: "Priya Venkatesh",
      date: "2023-07-31 13:15",
      amount: "₹680",
      status: "processing",
      items: 5,
    },
    {
      id: "ORD-1232",
      customer: "Arun Nair",
      date: "2023-07-31 11:45",
      amount: "₹320",
      status: "completed",
      items: 2,
    },
    {
      id: "ORD-1231",
      customer: "Lakshmi Narayan",
      date: "2023-07-31 10:20",
      amount: "₹550",
      status: "completed",
      items: 4,
    },
    {
      id: "ORD-1230",
      customer: "Karthik Subramanian",
      date: "2023-07-30 16:40",
      amount: "₹780",
      status: "cancelled",
      items: 6,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "processing":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)} variant="outline">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/auth/admin/orders/${order.id}`}>
                  <Button variant="ghost" size="icon" className="text-amber-700">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}