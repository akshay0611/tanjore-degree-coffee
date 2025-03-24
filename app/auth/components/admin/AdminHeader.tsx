"use client"

import { useState } from "react"
import { Bell, Search, User, Settings, LogOut, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function AdminHeader() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order #1234",
      description: "A new order has been placed",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      description: "Arabica beans are running low",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      description: "Payment for Order #1230 received",
      time: "3 hours ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="bg-white border-b border-amber-200 py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Input
            type="search"
            placeholder="Search orders, customers..."
            className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-amber-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-amber-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-amber-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 text-xs h-auto py-1"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-amber-600">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-amber-100 last:border-0 ${notification.read ? "" : "bg-amber-50"}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-900">{notification.title}</h4>
                          <p className="text-sm text-amber-600">{notification.description}</p>
                          <p className="text-xs text-amber-500 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-amber-600 mt-1"></div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-amber-100">
                <Button variant="ghost" size="sm" className="w-full text-amber-600">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-amber-100">
                <span className="text-amber-800 font-medium">AR</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-amber-900">Admin Rajesh</p>
                  <p className="text-amber-600 text-xs">admin@tanjorecoffee.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

