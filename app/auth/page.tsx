"use client"

import { useState } from "react"
import { Bell, ChevronLeft, Coffee, CreditCard, Home, LogOut, Menu, Package, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Profile", icon: User },
    { name: "Orders", icon: Package },
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ]

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-amber-900 text-amber-50 md:hidden">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6" />
          <span className="font-bold">Tanjore Coffee</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-amber-50">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen">
        {/* Sidebar - Desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 hidden md:flex flex-col bg-amber-900 text-amber-50 transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-amber-800">
            <div className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
              <Coffee className="h-6 w-6 flex-shrink-0" />
              {!collapsed && <span className="font-bold">Tanjore Coffee</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={`text-amber-50 ${collapsed ? "hidden" : ""}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant={activeItem === item.name ? "secondary" : "ghost"}
                className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""} ${
                  activeItem === item.name
                    ? "bg-amber-800 hover:bg-amber-700 text-amber-50"
                    : "text-amber-200 hover:text-amber-50 hover:bg-amber-800"
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                <item.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`} />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t border-amber-800">
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Avatar className="h-8 w-8 border border-amber-200">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-amber-700 text-amber-50">JD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-amber-300">john@example.com</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu} />
            <div className="fixed inset-y-0 left-0 w-64 bg-amber-900 text-amber-50 p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Coffee className="h-6 w-6" />
                  <span className="font-bold">Tanjore Coffee</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-amber-50">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={activeItem === item.name ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      activeItem === item.name
                        ? "bg-amber-800 hover:bg-amber-700 text-amber-50"
                        : "text-amber-200 hover:text-amber-50 hover:bg-amber-800"
                    }`}
                    onClick={() => {
                      setActiveItem(item.name)
                      toggleMobileMenu()
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span>{item.name}</span>
                  </Button>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-800">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-amber-200">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-amber-700 text-amber-50">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-amber-300">john@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 md:ml-64 ${collapsed ? "md:ml-20" : ""}`}>
          {activeItem === "Dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-amber-900">Dashboard</h1>
                <Button variant="outline" size="icon" className="relative text-amber-900 border-amber-300">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>

              <Card className="bg-white border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-900">Welcome back, John!</CardTitle>
                  <CardDescription>Here&apos;s an overview of your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="bg-amber-100 border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Loyalty Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-900">250 pts</div>
                        <p className="text-xs text-amber-700 mt-1">Earn 50 more for a free coffee</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-100 border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-900">12</div>
                        <p className="text-xs text-amber-700 mt-1">Last order: 2 days ago</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-100 border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Saved Addresses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-900">3</div>
                        <p className="text-xs text-amber-700 mt-1">Home, Work, Parents</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-900">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((order) => (
                        <div key={order} className="flex items-center justify-between pb-4 border-b border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                              <Coffee className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium text-amber-900">Order #{1000 + order}</p>
                              <p className="text-xs text-amber-700">
                                {order} day{order > 1 ? "s" : ""} ago
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-amber-900">₹{120 + order * 10}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                    >
                      View All Orders
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-900">Favorite Coffees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Tanjore Filter Coffee", "Madras Kaapi", "Kumbakonam Degree Coffee"].map((coffee, index) => (
                        <div key={coffee} className="flex items-center justify-between pb-4 border-b border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                              <Coffee className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium text-amber-900">{coffee}</p>
                              <p className="text-xs text-amber-700">Ordered {5 - index} times</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs border-amber-300 text-amber-700">
                            Reorder
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                    >
                      View Menu
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeItem === "Profile" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-amber-900">Profile</h1>
              <Card className="bg-white border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24 border-2 border-amber-300">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className="bg-amber-700 text-amber-50 text-xl">JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="text-amber-700 border-amber-300">
                        Change Photo
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-amber-700">Full Name</label>
                          <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">John Doe</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-amber-700">Email</label>
                          <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">john@example.com</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-amber-700">Phone</label>
                          <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">+91 98765 43210</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-amber-700">Member Since</label>
                          <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">January 2023</p>
                        </div>
                      </div>
                      <Button className="bg-amber-700 hover:bg-amber-800 text-white">Edit Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeItem === "Orders" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-amber-900">Orders</h1>
              <Card className="bg-white border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map((order) => (
                      <Card key={order} className="bg-amber-50 border-amber-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-amber-900 text-base">Order #{1000 + order}</CardTitle>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order === 1 ? "bg-amber-200 text-amber-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {order === 1 ? "Processing" : "Delivered"}
                            </span>
                          </div>
                          <CardDescription>
                            {order} day{order > 1 ? "s" : ""} ago
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-amber-700">Tanjore Filter Coffee x {order}</span>
                              <span className="font-medium text-amber-900">₹{80 * order}</span>
                            </div>
                            {order > 1 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-amber-700">Butter Biscuits x 1</span>
                                <span className="font-medium text-amber-900">₹40</span>
                              </div>
                            )}
                            <Separator className="my-2 bg-amber-200" />
                            <div className="flex justify-between">
                              <span className="font-medium text-amber-900">Total</span>
                              <span className="font-bold text-amber-900">₹{80 * order + (order > 1 ? 40 : 0)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" className="text-amber-700 border-amber-300 text-xs">
                              View Details
                            </Button>
                            <Button variant="outline" className="text-amber-700 border-amber-300 text-xs">
                              Reorder
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeItem === "Settings" && (
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
                    {["Home", "Work", "Parents"].map((label, index) => (
                      <div
                        key={label}
                        className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-amber-900">{label}</p>
                          <p className="text-sm text-amber-700">
                            {index === 0 && "123 Coffee Street, Tanjore, Tamil Nadu"}
                            {index === 1 && "456 Tech Park, Chennai, Tamil Nadu"}
                            {index === 2 && "789 Temple Road, Kumbakonam, Tamil Nadu"}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-amber-700">
                          Edit
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="text-amber-700 border-amber-300 w-full">
                      Add New Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeItem === "Logout" && (
            <div className="flex items-center justify-center h-[80vh]">
              <Card className="w-full max-w-md bg-white border-amber-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-amber-900">Confirm Logout</CardTitle>
                  <CardDescription>Are you sure you want to log out of your account?</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="text-amber-700 border-amber-300"
                    onClick={() => setActiveItem("Dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}