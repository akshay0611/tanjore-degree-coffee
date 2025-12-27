import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/admin/", "/api/"],
      },
    ],
    sitemap: "https://tanjore-degree-coffee.vercel.app/sitemap.xml",
  };
}
