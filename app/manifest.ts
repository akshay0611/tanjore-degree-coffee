import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tanjore Degree Coffee",
    short_name: "TDC",
    description:
      "Experience the authentic taste of traditional South Indian filter coffee. Crafted with care since 1942.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6F4E37",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
