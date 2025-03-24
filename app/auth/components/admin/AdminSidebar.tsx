"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Coffee,
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "menu", label: "Menu Items", icon: <Coffee className="h-5 w-5" /> },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
    { id: "reports", label: "Reports", icon: <FileText className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-amber-800 text-white hover:bg-amber-700"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

        <div
          className={`fixed top-0 left-0 h-full bg-amber-900 text-white z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-amber-800/50">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <Coffee className="h-6 w-6 text-amber-400 mr-2" />
                  <span className="text-lg font-bold text-amber-100">Tanjore Admin</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="text-amber-400 hover:bg-amber-800 hover:text-amber-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMobileOpen(false)
                    }}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                      activeSection === item.id
                        ? "bg-amber-800 text-amber-100"
                        : "text-amber-300 hover:bg-amber-800/50 hover:text-amber-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div
      className={`bg-amber-900 text-white h-screen ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 border-b border-amber-800/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center">
              <Coffee className="h-6 w-6 text-amber-400 mr-2" />
              <span className="text-lg font-bold text-amber-100">Tanjore Admin</span>
            </Link>
          )}
          {collapsed && <Coffee className="h-6 w-6 text-amber-400 mx-auto" />}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-amber-400 hover:bg-amber-800 hover:text-amber-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center ${
                collapsed ? "justify-center" : "justify-start"
              } px-3 py-3 rounded-lg transition-colors duration-200 ${
                activeSection === item.id
                  ? "bg-amber-800 text-amber-100"
                  : "text-amber-300 hover:bg-amber-800/50 hover:text-amber-100"
              }`}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className={`p-4 border-t border-amber-800/50 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-amber-800 flex items-center justify-center mr-3">
                <span className="text-amber-100 font-medium">AR</span>
              </div>
              <div>
                <p className="text-amber-100 font-medium">Admin Rajesh</p>
                <p className="text-amber-400 text-sm">Super Admin</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-amber-300 hover:bg-amber-800 hover:text-amber-100"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-amber-300 hover:bg-amber-800 hover:text-amber-100"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
