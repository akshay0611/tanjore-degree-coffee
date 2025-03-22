// app/auth/components/SettingsView.tsx
"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { Address, Profile } from "./types";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "./supabaseUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsView() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [editAddress, setEditAddress] = useState<Address | null>(null); // State for editing address
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndAddresses = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          
          const addressData = await fetchAddresses(user.id);
          setProfile(profileData);
          setAddresses(addressData);
        }
      } catch (error) {
        console.error("Error fetching profile or addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAddresses();
  }, []);

  const handleAddAddress = async () => {
    if (!profile || !newAddress.label || !newAddress.address) return;
  
    try {
      setLoading(true);
      const addedAddress = await addAddress(profile.id, newAddress.label, newAddress.address);
      if (addedAddress) {
        setAddresses([...addresses, addedAddress]);
        setNewAddress({ label: "", address: "" });
      } else {
        console.error("Failed to add address: returned null");
      }
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editAddress || !editAddress.label || !editAddress.address) return;

    try {
      setLoading(true);
      const updatedAddress = await updateAddress(editAddress.id, {
        label: editAddress.label,
        address: editAddress.address,
      });
      if (updatedAddress) {
        setAddresses(addresses.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr)));
        setEditAddress(null); // Close the edit dialog
      } else {
        console.error("Failed to update address: returned null");
      }
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await deleteAddress(addressId);
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-amber-700 block mb-1">Email Notifications</label>
              <div className="flex items-center gap-2 p-2 border border-amber-200 rounded-md bg-amber-50">
                <input type="checkbox" id="emailNotif" className="rounded text-amber-600" defaultChecked />
                <label htmlFor="emailNotif" className="text-amber-900">
                  Receive order updates
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-amber-700 block mb-1">SMS Notifications</label>
              <div className="flex items-center gap-2 p-2 border border-amber-200 rounded-md bg-amber-50">
                <input type="checkbox" id="smsNotif" className="rounded text-amber-600" defaultChecked />
                <label htmlFor="smsNotif" className="text-amber-900">
                  Receive delivery updates
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-amber-700 block mb-1">Language</label>
              <select className="w-full p-2 border border-amber-200 rounded-md bg-amber-50 text-amber-900">
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-amber-900">•••• •••• •••• 4242</p>
                  <p className="text-xs text-amber-700">Expires 12/25</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs">Default</span>
            </div>
            <div className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-amber-900">•••• •••• •••• 8888</p>
                  <p className="text-xs text-amber-700">Expires 08/24</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="text-amber-700 border-amber-300 w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-amber-900">{addr.label}</p>
                  <p className="text-sm text-amber-700">{addr.address}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-amber-700" onClick={() => setEditAddress(addr)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    {editAddress && editAddress.id === addr.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-amber-900">Edit Address</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-label" className="text-amber-700">Label</Label>
                            <Input
                              id="edit-label"
                              value={editAddress.label}
                              onChange={(e) => setEditAddress({ ...editAddress, label: e.target.value })}
                              className="border-amber-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-address" className="text-amber-700">Address</Label>
                            <Input
                              id="edit-address"
                              value={editAddress.address}
                              onChange={(e) => setEditAddress({ ...editAddress, address: e.target.value })}
                              className="border-amber-200"
                            />
                          </div>
                          <Button
                            onClick={handleUpdateAddress}
                            disabled={loading || !editAddress.label || !editAddress.address}
                            className="bg-amber-700 hover:bg-amber-800 text-white w-full"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-amber-700 border-amber-300 w-full">
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-amber-900">Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="label" className="text-amber-700">Label</Label>
                    <Input
                      id="label"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="border-amber-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-amber-700">Address</Label>
                    <Input
                      id="address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="border-amber-200"
                    />
                  </div>
                  <Button
                    onClick={handleAddAddress}
                    disabled={loading || !newAddress.label || !newAddress.address}
                    className="bg-amber-700 hover:bg-amber-800 text-white w-full"
                  >
                    {loading ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}