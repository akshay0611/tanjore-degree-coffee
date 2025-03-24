// app/auth/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/admin/dashboard");
  }, [router]);

  return null; // No need to render anything since we're redirecting
}