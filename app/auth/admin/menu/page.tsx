// app/auth/admin/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
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
import { Pencil, Trash2, Plus, Search, Filter, RefreshCcw } from "lucide-react";

// Define the MenuItem interface (status removed)
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  new: boolean;
  chef_special: boolean;
  created_at: string;
  updated_at: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // State for Add dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for Edit dialog
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    popular: false,
    new: false,
    chef_special: false,
  });
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  // Fetch menu items and set up real-time subscription
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("menu_items")
        .select("id, name, description, price, image, category, popular, new, chef_special, created_at, updated_at");

      if (error) {
        console.error("Error fetching menu items:", error);
        setLoading(false);
        return;
      }

      setMenuItems(data);
      setFilteredItems(data);
      setLoading(false);
    };

    fetchMenuItems();

    // Set up real-time subscription
    const subscription = supabase
      .channel("menu-items-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        async () => {
          const { data } = await supabase
            .from("menu_items")
            .select("id, name, description, price, image, category, popular, new, chef_special, created_at, updated_at");

          // Check if data exists before processing
          if (!data) {
            console.error("No data returned from Supabase");
            return;
          }

          setMenuItems(data);
          setFilteredItems(data);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [filterCategory, searchQuery, menuItems]);

  const handleReset = () => {
    setFilterCategory("all");
    setSearchQuery("");
  };

  const handleAddItem = async () => {
    const { name, category, price, description, image, popular, new: isNew, chef_special } = newItem;
  
    // Validation
    if (!name || !category || isNaN(parseInt(price)) || !description) {
      alert("Please fill in all required fields (Name, Category, Price, Description) with valid values.");
      return false;
    }
  
    try {
      const payload = {
        name,
        category,
        price: parseInt(price),
        description,
        image: image || "/default.jpeg",
        popular,
        new: isNew,
        chef_special,
      };
      console.log("Insert payload:", payload); // Debug payload
  
      const { error } = await supabase.from("menu_items").insert(payload);
  
      if (error) {
        console.error("Error adding menu item:", error.message, error.details, error.hint);
        alert(`Failed to add menu item: ${error.message}`);
        return false;
      }
  
      // Reset the form
      setNewItem({
        name: "",
        category: "",
        price: "",
        description: "",
        image: "",
        popular: false,
        new: false,
        chef_special: false,
      });
  
      alert("Menu item added successfully!");
      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
      return false;
    }
  };

  // Handle editing an item
  const handleEditItem = async () => {
    if (!editItem) return false;

    const { id, name, category, price, description, image, popular, new: isNew, chef_special } = editItem;

    // Validation
    if (!name || !category || !price || !description) {
      alert("Please fill in all required fields (Name, Category, Price, Description).");
      return false;
    }

    const { error } = await supabase
      .from("menu_items")
      .update({
        name,
        category,
        price,
        description,
        image,
        popular,
        new: isNew,
        chef_special,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating menu item:", error);
      alert("Failed to update menu item. Please try again.");
      return false;
    }

    setEditItem(null);
    return true;
  };

  // Handle deleting an item
  const handleDeleteItem = async (id: number) => {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">
            Menu Management
          </h1>
          <p className="text-amber-700">Add, edit, and manage your menu items</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <Input
                  id="name"
                  placeholder="Item name"
                  className="col-span-3"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee-specialties">Coffee Specialties</SelectItem>
                    <SelectItem value="traditional-brews">Traditional Brews</SelectItem>
                    <SelectItem value="contemporary-coffees">Contemporary Coffees</SelectItem>
                    <SelectItem value="south-indian-snacks">South Indian Snacks</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  className="col-span-3"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Item description"
                  className="col-span-3"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <Input
                  id="image"
                  placeholder="/path/to/image.jpeg"
                  className="col-span-3"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="popular" className="text-right">
                  Popular
                </Label>
                <Select
                  value={newItem.popular ? "true" : "false"}
                  onValueChange={(value) => setNewItem({ ...newItem, popular: value === "true" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Is popular?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new" className="text-right">
                  New
                </Label>
                <Select
                  value={newItem.new ? "true" : "false"}
                  onValueChange={(value) => setNewItem({ ...newItem, new: value === "true" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Is new?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chef_special" className="text-right">
                  Chef Special
                </Label>
                <Select
                  value={newItem.chef_special ? "true" : "false"}
                  onValueChange={(value) => setNewItem({ ...newItem, chef_special: value === "true" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Is chef special?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewItem({
                    name: "",
                    category: "",
                    price: "",
                    description: "",
                    image: "",
                    popular: false,
                    new: false,
                    chef_special: false,
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-amber-800 hover:bg-amber-700 text-white"
                onClick={async () => {
                  const success = await handleAddItem();
                  if (success) {
                    setIsAddDialogOpen(false);
                  }
                }}
              >
                Save Item
              </Button>
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
              <SelectItem value="coffee-specialties">Coffee Specialties</SelectItem>
              <SelectItem value="traditional-brews">Traditional Brews</SelectItem>
              <SelectItem value="contemporary-coffees">Contemporary Coffees</SelectItem>
              <SelectItem value="south-indian-snacks">South Indian Snacks</SelectItem>
              <SelectItem value="desserts">Desserts</SelectItem>
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
                <TableHead>Popular</TableHead>
                <TableHead>New</TableHead>
                <TableHead>Chef Special</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-amber-600">
                    No menu items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
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
                    <TableCell>
                      {item.new ? (
                        <Badge className="bg-blue-100 text-blue-800" variant="outline">
                          New
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800" variant="outline">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.chef_special ? (
                        <Badge className="bg-red-100 text-red-800" variant="outline">
                          Chef Special
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800" variant="outline">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-700"
                              onClick={() => {
                                setEditItem(item);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                              <DialogTitle>Edit Menu Item</DialogTitle>
                              <DialogDescription>
                                Edit the details of this menu item. Click save when you&apos;re done.
                              </DialogDescription>
                            </DialogHeader>
                            {editItem && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-name" className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={editItem.name}
                                    onChange={(e) =>
                                      setEditItem({ ...editItem, name: e.target.value })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-category" className="text-right">
                                    Category
                                  </Label>
                                  <Select
                                    value={editItem.category}
                                    onValueChange={(value) =>
                                      setEditItem({ ...editItem, category: value })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="coffee-specialties">Coffee Specialties</SelectItem>
                                      <SelectItem value="traditional-brews">Traditional Brews</SelectItem>
                                      <SelectItem value="contemporary-coffees">Contemporary Coffees</SelectItem>
                                      <SelectItem value="south-indian-snacks">South Indian Snacks</SelectItem>
                                      <SelectItem value="desserts">Desserts</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-price" className="text-right">
                                    Price (₹)
                                  </Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    value={editItem.price}
                                    onChange={(e) =>
                                      setEditItem({ ...editItem, price: parseInt(e.target.value) })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                  <Label htmlFor="edit-description" className="text-right pt-2">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editItem.description}
                                    onChange={(e) =>
                                      setEditItem({ ...editItem, description: e.target.value })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-image" className="text-right">
                                    Image
                                  </Label>
                                  <Input
                                    id="edit-image"
                                    value={editItem.image}
                                    onChange={(e) =>
                                      setEditItem({ ...editItem, image: e.target.value })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-popular" className="text-right">
                                    Popular
                                  </Label>
                                  <Select
                                    value={editItem.popular ? "true" : "false"}
                                    onValueChange={(value) =>
                                      setEditItem({ ...editItem, popular: value === "true" })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Is popular?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">Yes</SelectItem>
                                      <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-new" className="text-right">
                                    New
                                  </Label>
                                  <Select
                                    value={editItem.new ? "true" : "false"}
                                    onValueChange={(value) =>
                                      setEditItem({ ...editItem, new: value === "true" })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Is new?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">Yes</SelectItem>
                                      <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-chef_special" className="text-right">
                                    Chef Special
                                  </Label>
                                  <Select
                                    value={editItem.chef_special ? "true" : "false"}
                                    onValueChange={(value) =>
                                      setEditItem({ ...editItem, chef_special: value === "true" })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Is chef special?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">Yes</SelectItem>
                                      <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setEditItem(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-amber-800 hover:bg-amber-700 text-white"
                                onClick={async () => {
                                  const success = await handleEditItem();
                                  if (success) {
                                    setIsEditDialogOpen(false);
                                  }
                                }}
                              >
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-700"
                          onClick={() => handleDeleteItem(item.id)}
                        >
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