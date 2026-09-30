import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/tokens`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteConfig.url}/launch`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/protocol`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
