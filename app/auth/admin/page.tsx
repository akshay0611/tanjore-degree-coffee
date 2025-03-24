// app/auth/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminHeader from "../components/admin/AdminHeader";
import OrdersManagement from "../components/admin/OrdersManagement";
import MenuManagement from "../components/admin/MenuManagement";
import CustomerManagement from "../components/admin/CustomerManagement";
import SettingsPanel from "../components/admin/SettingsPanel";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // Render the appropriate section based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "orders":
        return <OrdersManagement />;
      case "menu":
        return <MenuManagement />;
      case "customers":
        return <CustomerManagement />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AdminDashboard />;
    }
  };

  // Handle loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Handle non-admin access
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

  // Render the admin page for authenticated admins
  return (
    <div className="min-h-screen bg-amber-50/50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{renderSection()}</main>
        </div>
      </div>
    </div>
  );
}