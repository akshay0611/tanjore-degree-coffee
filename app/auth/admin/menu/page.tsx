// app/auth/admin/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Search, Filter, RefreshCcw, ImagePlus } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  status: string;
  popular: boolean;
}

export default function MenuPage() {
  const [menuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Tanjore Degree Coffee",
      category: "Coffee Specialties",
      price: "₹80",
      description:
        "Our signature coffee made with traditional decoction and farm-fresh milk heated to the perfect 'degree'.",
      status: "active",
      popular: true,
    },
    {
      id: 2,
      name: "Filter Coffee",
      category: "Traditional Brews",
      price: "₹60",
      description: "Classic South Indian filter coffee served in traditional davara-tumbler.",
      status: "active",
      popular: true,
    },
    {
      id: 3,
      name: "Chukku Kaapi",
      category: "Traditional Brews",
      price: "₹75",
      description: "Traditional coffee with dry ginger and warming spices.",
      status: "active",
      popular: false,
    },
    {
      id: 4,
      name: "Crispy Masala Dosa",
      category: "South Indian Snacks",
      price: "₹90",
      description: "Thin rice crepe filled with spiced potato filling, served with chutneys.",
      status: "active",
      popular: true,
    },
    {
      id: 5,
      name: "Coffee Jaggery Ice Cream",
      category: "Desserts",
      price: "₹120",
      description: "Handcrafted ice cream made with our coffee and palm jaggery.",
      status: "active",
      popular: true,
    },
    {
      id: 6,
      name: "Coconut Cold Brew",
      category: "Contemporary Coffees",
      price: "₹120",
      description: "Cold brewed coffee with coconut water and a hint of cardamom.",
      status: "inactive",
      popular: false,
    },
    {
      id: 7,
      name: "Butter Mysore Pak",
      category: "South Indian Snacks",
      price: "₹70",
      description: "Melt-in-your-mouth sweet made with gram flour, ghee and sugar.",
      status: "active",
      popular: false,
    },
    {
      id: 8,
      name: "Rose Cardamom Latte",
      category: "Contemporary Coffees",
      price: "₹140",
      description: "A fragrant latte infused with rose petals and cardamom.",
      status: "active",
      popular: false,
    },
  ]);

  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply filters and search
  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [filterCategory, filterStatus, searchQuery, menuItems]);

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
    setFilterCategory("all");
    setFilterStatus("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">
            Menu Management
          </h1>
          <p className="text-amber-700">Add, edit, and manage your menu items</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-amber-800 hover:bg-amber-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Create a new item to add to your menu. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Item name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coffee Specialties">Coffee Specialties</SelectItem>
                    <SelectItem value="Traditional Brews">Traditional Brews</SelectItem>
                    <SelectItem value="Contemporary Coffees">Contemporary Coffees</SelectItem>
                    <SelectItem value="South Indian Snacks">South Indian Snacks</SelectItem>
                    <SelectItem value="Desserts">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price (₹)
                </Label>
                <Input id="price" type="number" placeholder="0.00" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea id="description" placeholder="Item description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center hover:bg-amber-50 transition-colors cursor-pointer">
                    <ImagePlus className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <p className="text-sm text-amber-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-amber-500 mt-1">PNG, JPG or WEBP (max. 2MB)</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue="active">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button className="bg-amber-800 hover:bg-amber-700 text-white">Save Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Input
            type="search"
            placeholder="Search menu items..."
            className="pl-10 border-amber-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Coffee Specialties">Coffee Specialties</SelectItem>
              <SelectItem value="Traditional Brews">Traditional Brews</SelectItem>
              <SelectItem value="Contemporary Coffees">Contemporary Coffees</SelectItem>
              <SelectItem value="South Indian Snacks">South Indian Snacks</SelectItem>
              <SelectItem value="Desserts">Desserts</SelectItem>
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

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-amber-600">
                    No menu items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)} variant="outline">
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.popular ? (
                        <Badge className="bg-amber-100 text-amber-800" variant="outline">
                          Popular
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800" variant="outline">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-700">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}