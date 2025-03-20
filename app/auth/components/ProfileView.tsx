"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [profile, setProfile] = useState({
    fullName: "John Doe", // Default values
    email: "",
    phone: "+91 98765 43210",
    memberSince: "January 2023",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get authenticated user
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          setError("No authenticated user found.");
          setLoading(false);
          return;
        }

        // Fetch profile data from the `profiles` table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userData.user.id)
          .single();

        if (profileError || !profileData) {
          setError("No profile found. Using authenticated email.");
          setProfile((prev) => ({ ...prev, email: userData.user?.email || "" }));
        } else {
          setProfile((prev) => ({ ...prev, email: profileData.email }));
        }
      } catch (e) {
        setError("An unexpected error occurred.");
        console.error("Error fetching profile:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get authenticated user
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }

      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          email: profile.email, // Update email (or other fields if added later)
        })
        .eq("id", userData.user.id);

      if (updateError) {
        setError(`Error updating profile: ${updateError.message}`);
        setLoading(false);
        return;
      }

      // Exit edit mode
      setIsEditing(false);
    } catch (e) {
      setError("An unexpected error occurred.");
      console.error("Error updating profile:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Profile</h1>
      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-amber-300">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-amber-700 text-amber-50 text-xl">JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  Change Photo
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-amber-700">Full Name</label>
                    {isEditing ? (
                      <Input
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleInputChange}
                        className="mt-1 border-amber-200 bg-amber-50"
                      />
                    ) : (
                      <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">
                        {profile.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Email</label>
                    {isEditing ? (
                      <Input
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="mt-1 border-amber-200 bg-amber-50"
                      />
                    ) : (
                      <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">
                        {profile.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Phone</label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="mt-1 border-amber-200 bg-amber-50"
                      />
                    ) : (
                      <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">
                        {profile.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Member Since</label>
                    <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">
                      {profile.memberSince}
                    </p>
                  </div>
                </div>
                {isEditing ? (
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-amber-700 hover:bg-amber-800 text-white"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-amber-700 border-amber-300"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    className="bg-amber-700 hover:bg-amber-800 text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </form>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}