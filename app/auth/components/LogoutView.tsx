"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LogoutViewProps {
  setActiveItem: (item: string) => void;
}

export default function LogoutView({ setActiveItem }: LogoutViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Handle logout
  const handleLogout = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      // Check if the user is logged in
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("No authenticated user found. Please log in.");
        setLoading(false);
        return;
      }

      // Perform logout
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        setError(`Logout failed: ${logoutError.message}`);
        setLoading(false);
        return;
      }

      // Redirect to home page after successful logout
      router.push("/");
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error during logout:", e);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="w-full max-w-md bg-white border-amber-200">
        <CardHeader className="text-center">
          <CardTitle className="text-amber-900">Confirm Logout</CardTitle>
          <CardDescription>Are you sure you want to log out of your account?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="text-amber-700 border-amber-300"
              onClick={() => setActiveItem("Dashboard")}
              disabled={loading} // Disable button during loading
            >
              Cancel
            </Button>
            <Button
              className="bg-amber-700 hover:bg-amber-800 text-white"
              onClick={handleLogout}
              disabled={loading} // Disable button during loading
            >
              {loading ? (
                "Logging out..."
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}