import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer | Akshay - Full Stack Developer",
  description:
    "Meet Akshay, the developer behind Tanjore Degree Coffee website. Full stack developer specializing in Next.js, React, TypeScript, and modern web technologies.",
  keywords: [
    "Akshay",
    "Full Stack Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Portfolio",
  ],
  authors: [{ name: "Akshay" }],
  creator: "Akshay",
  openGraph: {
    title: "Akshay | Full Stack Developer",
    description:
      "Meet Akshay, the developer behind Tanjore Degree Coffee website. Specializing in modern web development with Next.js, React, and TypeScript.",
    type: "profile",
    locale: "en_US",
    siteName: "Tanjore Degree Coffee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay | Full Stack Developer",
    description:
      "Meet Akshay, the developer behind Tanjore Degree Coffee website.",
    creator: "@akshaykumar0611",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
