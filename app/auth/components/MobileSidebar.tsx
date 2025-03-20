"use client"

import { ChevronLeft, Coffee, LogOut, Home, Package, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileSidebarProps {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  activeItem: string
  setActiveItem: (item: string) => void
}

export default function MobileSidebar({ 
  isMobileMenuOpen, 
  toggleMobileMenu, 
  activeItem, 
  setActiveItem 
}: MobileSidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Profile", icon: User },
    { name: "Orders", icon: Package },
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ]

  if (!isMobileMenuOpen) return null

  return (
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
  )
}