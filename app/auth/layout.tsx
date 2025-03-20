"use client";

// app/auth/layout.tsx
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // User is not authenticated, redirect to login page
        router.replace("/"); // Or to your login page, e.g., "/login"
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="text-amber-800">Loading...</div>
      </div>
    );
  }

  // Only render children if past the loading state (which means user is authenticated)
  return <div>{children}</div>;
}