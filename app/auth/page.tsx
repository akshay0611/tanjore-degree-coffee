"use client";

// app/auth/page.tsx
import { ProfileSection } from "@/components/ProfileSection"

export default function AuthPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Profile</h1>
      <ProfileSection />
    </>
  )
}