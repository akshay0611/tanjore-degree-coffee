// app/auth/admin/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Coffee,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  BarChart,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeSection: string;
}

export default function AdminSidebar({ activeSection }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fullName, setFullName] = useState<string>("Admin"); // State for full name
  const [initials, setInitials] = useState<string>("AU"); // State for initials
  const router = useRouter();

  // Fetch the admin's full name from Supabase
  useEffect(() => {
    const fetchFullName = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        router.push("/");
        return;
      }

      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("profiles") // Fetch from "profiles" table
        .select("full_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching full name:", error);
        return;
      }

      if (data?.full_name) {
        setFullName(data.full_name);
        setInitials(data.full_name.slice(0, 2).toUpperCase());
      }
    };

    fetchFullName();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/auth/admin/dashboard" },
    { id: "orders", label: "Orders", icon: <ShoppingBag className="h-5 w-5" />, href: "/auth/admin/orders" },
    { id: "menu", label: "Menu Items", icon: <Coffee className="h-5 w-5" />, href: "/auth/admin/menu" },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" />, href: "/auth/admin/customers" },
    { id: "sales", label: "Sales", icon: <BarChart className="h-5 w-5" />, href: "/auth/admin/sales" },
    { id: "contact", label: "Contact", icon: <User className="h-5 w-5" />, href: "/auth/admin/contact" },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/auth/admin/settings" },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
                  <Link key={item.id} href={item.href}>
                    <div
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                        activeSection === item.id
                          ? "bg-amber-800 text-amber-100"
                          : "text-amber-300 hover:bg-amber-800/50 hover:text-amber-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-3 rounded-lg transition-colors duration-200 text-amber-300 hover:bg-amber-800/50 hover:text-amber-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-amber-400 hover:bg-amber-800 hover:text-amber-300"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div
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
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className={`p-4 border-t border-amber-800/50 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-amber-800 flex items-center justify-center mr-3">
                <span className="text-amber-100 font-medium">{initials}</span>
              </div>
              <div>
                <p className="text-amber-100 font-medium">{fullName}</p>
                <p className="text-amber-400 text-sm">Super Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 rounded-lg transition-colors duration-200 text-amber-300 hover:bg-amber-800/50 hover:text-amber-100"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-amber-300 hover:bg-amber-800 hover:text-amber-100"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}