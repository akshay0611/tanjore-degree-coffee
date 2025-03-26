// app/auth/admin/layout.tsx
"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Button } from "@/components/ui/button";

// Create a SearchContext to share the search query with child components
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Custom hook to access the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const router = useRouter();
  const pathname = usePathname();

  // Check user authentication and role on mount
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/"); // Redirect to homepage if not logged in
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching profile:", error);
        router.push("/auth"); // Redirect to regular auth page if profile fetch fails
        return;
      }

      setUserRole(data.role || "user"); // Default to "user" if no role is set
      setLoading(false);
    };

    checkUserRole();
  }, [router]);

  // Determine active section based on pathname
  const getActiveSection = () => {
    if (pathname.includes("dashboard")) return "dashboard";
    if (pathname.includes("orders")) return "orders";
    if (pathname.includes("menu")) return "menu";
    if (pathname.includes("customers")) return "customers";
    if (pathname.includes("/sales")) return "sales";
    if (pathname.includes("settings")) return "settings";
    return "dashboard";
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-amber-50/50">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <Button onClick={() => router.push("/auth")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="min-h-screen bg-amber-50/50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <AdminSidebar activeSection={getActiveSection()} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader
              activeSection={getActiveSection()}
              onSearch={(query) => setSearchQuery(query)} // Pass onSearch callback
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
}