"use client";

import { ChevronLeft, Coffee, LogOut, Home, Package, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function Sidebar({ collapsed, toggleSidebar, activeItem, setActiveItem }: SidebarProps) {
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Added state for avatar URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user full name, email, and avatar URL
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          setError("No authenticated user found.");
          setLoading(false);
          return;
        }

        // Fetch full_name, email, and avatar_url from the `profiles` table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", userData.user.id)
          .single();

        if (profileError || !profileData) {
          setError("No profile found. Using authenticated email.");
          setFullName(null);
          setEmail(userData.user.email || null);
          setAvatarUrl(null); // No avatar if profile not found
        } else {
          setFullName(profileData.full_name || null);
          setEmail(profileData.email || null);
          setAvatarUrl(profileData.avatar_url || null); // Set avatar URL
        }

        setLoading(false);
      } catch (e) {
        setError("An unexpected error occurred.");
        console.error("Error fetching profile data:", e);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Get first two letters of fullName for AvatarFallback
  const getInitials = () => {
    if (loading || error || !fullName) return "JD"; // Fallback to "JD" during loading, error, or if no fullName
    return fullName.slice(0, 2).toUpperCase();
  };

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Profile", icon: User },
    { name: "Menu", icon: Coffee },
    { name: "Orders", icon: Package },
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ];

  return (
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
            <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt="User" />
            <AvatarFallback className="bg-amber-700 text-amber-50">{getInitials()}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {loading ? "Loading..." : error ? "User" : fullName || "User"}
              </span>
              <span className="text-xs text-amber-300">
                {loading ? "Fetching..." : error ? "Error fetching profile" : email || "No email"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}