"use client"

import { X, Coffee, LogOut, Home, Package, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface MobileSidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function MobileSidebar({
  isMobileMenuOpen,
  toggleMobileMenu,
  activeItem,
  setActiveItem,
}: MobileSidebarProps) {
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setError("No authenticated user found.");
          setLoading(false);
          return;
        }
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", userData.user.id)
          .single();
        if (profileError || !profileData) {
          setError("No profile found. Using authenticated email.");
          setFullName(null);
          setEmail(userData.user.email || null);
          setAvatarUrl(null);
        } else {
          setFullName(profileData.full_name || null);
          setEmail(profileData.email || null);
          setAvatarUrl(profileData.avatar_url || null);
        }
        setLoading(false);
      } catch (e) {
        setError("An unexpected error occurred.");
        console.error("Error fetching profile data for mobile sidebar:", e);
        setLoading(false);
      }
    };

    if (isMobileMenuOpen) {
      fetchProfileData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const getInitials = () => {
    if (loading || error || !fullName) return "JD";
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
    <>
      {/* Overlay - Conditionally rendered for click-outside-to-close */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-amber-900 text-amber-50 p-4
          flex flex-col md:hidden
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} {/* MODIFIED HERE */}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6" />
            <span id="mobile-menu-title" className="font-bold">Tanjore Coffee</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-amber-50" aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2 flex-1">
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
                setActiveItem(item.name);
                toggleMobileMenu(); // Close menu on item click
              }}
            >
              <item.icon className="h-5 w-5 mr-2" />
              <span>{item.name}</span>
            </Button>
          ))}
        </nav>

        <div className="pt-4 mt-auto border-t border-amber-800 -mx-4 px-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-amber-200">
              <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt="User" />
              <AvatarFallback className="bg-amber-700 text-amber-50">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {loading ? "Loading..." : error ? "User" : fullName || "User"}
              </span>
              <span className="text-xs text-amber-300">
                {loading ? "Fetching..." : error ? "Error fetching profile" : email || "No email"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}