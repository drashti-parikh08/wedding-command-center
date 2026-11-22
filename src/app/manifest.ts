import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wedding Command Center",
    short_name: "Wedding",
    description: "Naman & Samiksha's wedding planner",
    start_url: "/",
    display: "standalone",
    background_color: "#f5c9cc",
    theme_color: "#e8b7b3",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}