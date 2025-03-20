"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    memberSince: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
          .select("email, full_name, phone, avatar_url")
          .eq("id", userData.user.id)
          .single();

        if (profileError || !profileData) {
          setError("No profile found. Using authenticated email.");
          setProfile((prev) => ({
            ...prev,
            email: userData.user?.email || "",
          }));
        } else {
          const memberSince = new Date(userData.user.created_at).getFullYear().toString();
          setProfile({
            fullName: profileData.full_name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            memberSince: memberSince,
            avatarUrl: profileData.avatar_url || "",
          });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }

      let avatarUrl = profile.avatarUrl;

      // Upload image if a file is selected
      if (file) {
        const fileExt = file.name.split(".").pop();
        // Upload to a folder named after the user ID
        const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`; // e.g., user_id/timestamp.jpg
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file);

        if (uploadError) {
          setError(`Error uploading image: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        // Get the public URL of the uploaded image
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = urlData.publicUrl;
      }

      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          avatar_url: avatarUrl,
        })
        .eq("id", userData.user.id);

      if (updateError) {
        setError(`Error updating profile: ${updateError.message}`);
        setLoading(false);
        return;
      }

      setProfile((prev) => ({ ...prev, avatarUrl }));
      setFile(null);
      setIsEditing(false);
    } catch (e) {
      setError("An unexpected error occurred.");
      console.error("Error updating profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    const initials = names
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
    return initials || "";
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
                  <AvatarImage src={profile.avatarUrl || "/placeholder-user.jpg"} alt="User" />
                  <AvatarFallback className="bg-amber-700 text-amber-50 text-xl">
                    {getInitials(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div>
                    <Label htmlFor="avatar" className="text-sm font-medium text-amber-700">
                      Upload New Picture
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 border-amber-200 bg-amber-50"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-amber-700">Full Name</Label>
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
                    <Label className="text-sm font-medium text-amber-700">Email</Label>
                    <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-amber-700">Phone</Label>
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
                    <Label className="text-sm font-medium text-amber-700">Member Since</Label>
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