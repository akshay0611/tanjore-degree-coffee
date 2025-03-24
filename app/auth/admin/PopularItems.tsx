// app/auth/admin/PopularItems.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function PopularItems() {
  const items = [
    {
      name: "Tanjore Degree Coffee",
      category: "Coffee Specialties",
      price: "₹80",
      orders: 245,
      stock: "In Stock",
      popularity: 92,
    },
    {
      name: "Filter Coffee",
      category: "Traditional Brews",
      price: "₹60",
      orders: 198,
      stock: "In Stock",
      popularity: 85,
    },
    {
      name: "Crispy Masala Dosa",
      category: "South Indian Snacks",
      price: "₹90",
      orders: 176,
      stock: "In Stock",
      popularity: 78,
    },
    {
      name: "Coffee Jaggery Ice Cream",
      category: "Desserts",
      price: "₹120",
      orders: 154,
      stock: "Low Stock",
      popularity: 72,
    },
    {
      name: "Chukku Kaapi",
      category: "Traditional Brews",
      price: "₹75",
      orders: 132,
      stock: "In Stock",
      popularity: 65,
    },
  ];

  const getStockColor = (stock: string) => {
    switch (stock) {
      case "In Stock":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Low Stock":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Out of Stock":
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
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Popularity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.orders}</TableCell>
              <TableCell>
                <Badge className={getStockColor(item.stock)} variant="outline">
                  {item.stock}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={item.popularity} className="h-2" />
                  <span className="text-xs text-amber-700">{item.popularity}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}