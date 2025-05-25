"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import MobileHeader from "./components/MobileHeader"
import MobileSidebar from "./components/MobileSidebar"
import DashboardView from "./components/DashboardView"
import ProfileView from "./components/ProfileView"
import Menu from "./components/Menu"
import OrdersView from "./components/OrdersView"
import SettingsView from "./components/SettingsView"
import LogoutView from "./components/LogoutView"

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Mobile Header */}
      <MobileHeader toggleMobileMenu={toggleMobileMenu} />

      <div className="flex h-[calc(100vh-4rem)] md:h-screen">
        {/* Sidebar - Desktop */}
        <Sidebar
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />

        {/* Sidebar - Mobile */}
        <MobileSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />

        {/* Main Content */}
        {/* <main className={`flex-1 p-6 transition-all duration-300 md:ml-64 ${collapsed ? "md:ml-20" : ""}`}> */}
        <main className={`flex-1 p-6 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
          {activeItem === "Dashboard" && <DashboardView />}
          {activeItem === "Profile" && <ProfileView />}
          {activeItem === "Menu" && <Menu />}
          {activeItem === "Orders" && <OrdersView />}
          {activeItem === "Settings" && <SettingsView />}
          {activeItem === "Logout" && <LogoutView setActiveItem={setActiveItem} />}
        </main>
      </div>
    </div>
  )
}