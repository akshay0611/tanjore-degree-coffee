// app/auth/admin/settings/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell, Store, Save } from "lucide-react";

export default function SettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    name: "Tanjore Degree Coffee",
    description: "Experience the authentic taste of traditional South Indian coffee",
    phone: "+91 98765 43210",
    email: "info@tanjorecoffee.com",
    address: "123 Temple Street, Thanjavur, Tamil Nadu, India - 613001",
    website: "https://tanjorecoffee.com",
    openingHours: {
      weekdays: "6:00 AM - 10:00 PM",
      weekends: "6:00 AM - 11:00 PM",
      holidays: "7:00 AM - 9:00 PM",
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    customerReviews: true,
    marketingEmails: false,
    systemUpdates: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">Settings</h1>
        <p className="text-amber-700">Manage your account and store settings</p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          <TabsTrigger value="store" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
            <Store className="h-4 w-4 mr-2" />
            Store
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-amber-800 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input
                      id="store-name"
                      value={storeSettings.name}
                      onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-website">Website</Label>
                    <Input
                      id="store-website"
                      value={storeSettings.website}
                      onChange={(e) => setStoreSettings({ ...storeSettings, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-description">Description</Label>
                  <Textarea
                    id="store-description"
                    value={storeSettings.description}
                    onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Phone Number</Label>
                    <Input
                      id="store-phone"
                      value={storeSettings.phone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Email Address</Label>
                    <Input
                      id="store-email"
                      value={storeSettings.email}
                      onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Address</Label>
                  <Textarea
                    id="store-address"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-amber-800 hover:bg-amber-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Set your store&apos;s operating hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekday-hours">Weekdays (Mon-Fri)</Label>
                    <Input
                      id="weekday-hours"
                      value={storeSettings.openingHours.weekdays}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          openingHours: {
                            ...storeSettings.openingHours,
                            weekdays: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekend-hours">Weekends (Sat-Sun)</Label>
                    <Input
                      id="weekend-hours"
                      value={storeSettings.openingHours.weekends}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          openingHours: {
                            ...storeSettings.openingHours,
                            weekends: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holiday-hours">Public Holidays</Label>
                    <Input
                      id="holiday-hours"
                      value={storeSettings.openingHours.holidays}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          openingHours: {
                            ...storeSettings.openingHours,
                            holidays: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-amber-800 hover:bg-amber-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" value="Admin Rajesh" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value="admin@tanjorecoffee.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="admin">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value="+91 98765 43210" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-amber-800 hover:bg-amber-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Two-factor Authentication</Label>
                    <Switch id="two-factor" />
                  </div>
                  <p className="text-sm text-amber-600">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-amber-800 hover:bg-amber-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose which notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-orders">New Orders</Label>
                    <p className="text-sm text-amber-600">Receive notifications when new orders are placed</p>
                  </div>
                  <Switch
                    id="new-orders"
                    checked={notificationSettings.newOrders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, newOrders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-amber-600">Receive notifications when order status changes</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, orderUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="low-stock">Low Stock Alerts</Label>
                    <p className="text-sm text-amber-600">Receive notifications when inventory items are running low</p>
                  </div>
                  <Switch
                    id="low-stock"
                    checked={notificationSettings.lowStock}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, lowStock: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="customer-reviews">Customer Reviews</Label>
                    <p className="text-sm text-amber-600">Receive notifications when customers leave reviews</p>
                  </div>
                  <Switch
                    id="customer-reviews"
                    checked={notificationSettings.customerReviews}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, customerReviews: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-amber-600">Receive promotional emails and marketing updates</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-updates">System Updates</Label>
                    <p className="text-sm text-amber-600">Receive notifications about system updates and maintenance</p>
                  </div>
                  <Switch
                    id="system-updates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-amber-800 hover:bg-amber-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Manage your subscription and billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-amber-900">Premium Plan</h3>
                      <p className="text-sm text-amber-700">₹2,999/month</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Active</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-amber-700">Next billing date: August 15, 2023</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-amber-900">Plan Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <span className="block h-2 w-2 bg-green-600 rounded-full"></span>
                      </div>
                      <span className="text-sm text-amber-700">Unlimited orders</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <span className="block h-2 w-2 bg-green-600 rounded-full"></span>
                      </div>
                      <span className="text-sm text-amber-700">Advanced analytics and reporting</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <span className="block h-2 w-2 bg-green-600 rounded-full"></span>
                      </div>
                      <span className="text-sm text-amber-700">Customer management tools</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <span className="block h-2 w-2 bg-green-600 rounded-full"></span>
                      </div>
                      <span className="text-sm text-amber-700">Priority support</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button className="bg-amber-800 hover:bg-amber-700 text-white">Upgrade Plan</Button>
                <Button variant="outline" className="text-amber-800 border-amber-200">
                  View Billing History
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Update your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-md mr-4">
                        <CreditCard className="h-6 w-6 text-amber-800" />
                      </div>
                      <div>
                        <h3 className="font-medium text-amber-900">HDFC Bank •••• 4321</h3>
                        <p className="text-sm text-amber-700">Expires 05/2025</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Default</Badge>
                  </div>
                </div>

                <Button variant="outline" className="text-amber-800 border-amber-200">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>
              </CardContent>
              <CardFooter>
                <Button className="bg-amber-800 hover:bg-amber-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}