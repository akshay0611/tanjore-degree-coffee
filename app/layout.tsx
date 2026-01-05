// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tanjore-degree-coffee.vercel.app"),
  title: {
    default: "Tanjore Degree Coffee | Built by Akshay Kumar",
    template: "%s | Tanjore Degree Coffee",
  },
  description:
    "Experience authentic South Indian Filter Coffee. A high-performance FoodTech project architected and developed by Akshay Kumar using Next.js.",
  keywords: [
    "Tanjore Degree Coffee",
    "South Indian Coffee",
    "Filter Coffee",
    "Thanjavur Coffee",
    "Traditional Coffee",
    "Authentic Coffee",
    "Indian Coffee",
    "Degree Coffee",
  ],
  authors: [{ name: "Akshay Kumar", url: "https://connectwithakshay.netlify.app" }],
  creator: "Akshay Kumar",
  publisher: "Tanjore Degree Coffee",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tanjore-degree-coffee.vercel.app",
    siteName: "Tanjore Degree Coffee",
    title: "Tanjore Degree Coffee | Built by Akshay Kumar",
    description:
      "Experience authentic South Indian Filter Coffee. A high-performance FoodTech project architected and developed by Akshay Kumar using Next.js.",
    images: [
      {
        url: "/coffee.jpg",
        width: 1200,
        height: 630,
        alt: "Tanjore Degree Coffee",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "izsgAAfJyH0oJvElEtgws5uhqxuJMyPR-JoSAlalS_w",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://connectwithakshay.netlify.app/#person",
                  "name": "Akshay Kumar",
                  "jobTitle": "Lead Developer",
                  "url": "https://connectwithakshay.netlify.app",
                  "sameAs": [
                    "https://www.linkedin.com/in/akshaykumar0611/",
                    "https://github.com/akshay0611/"
                  ],
                  "knowsAbout": ["Next.js", "AI Integrations", "System Architecture"]
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Tanjore Degree Coffee",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "keywords": "FoodTech, Digital Coffee Experience",
                  "author": { "@id": "https://connectwithakshay.netlify.app/#person" }
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Chatbot />
      </body>
    </html>
  );
}
