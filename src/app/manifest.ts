import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "twitterbanner.lol",
    short_name: "twitterbanner",
    description: "Rent Twitter/X profile banners from verified creators.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#09090b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
