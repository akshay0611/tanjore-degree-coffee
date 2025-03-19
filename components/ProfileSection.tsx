"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Profile {
  id: string;
  email: string;
}

export function ProfileSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError(`Auth error: ${authError.message}`);
          setLoading(false);
          return;
        }
        
        if (!authData.user) {
          setError("No authenticated user found");
          setLoading(false);
          return;
        }

        // Instead of using .single(), get all matches and handle accordingly
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("id", authData.user.id);

        if (profileError) {
          setError(`Profile error: ${profileError.message}`);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          // No profile found - could create one here if needed
          setError("No profile found for this user. You may need to create one.");
          setLoading(false);
          return;
        }

        // Use the first profile if multiple exist
        setProfile(data[0]);
        setLoading(false);
      } catch (e) {
        console.error("Unexpected error:", e);
        setError(`Unexpected error: ${e instanceof Error ? e.message : String(e)}`);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return <div>Email: {profile.email}</div>;
}