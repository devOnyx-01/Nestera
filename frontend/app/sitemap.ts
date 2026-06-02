import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nestera.finance";
const LOCALES = ["en", "es"];

// Define all routes with their metadata
const ROUTES = [
  {
    path: "",
    changeFrequency: "weekly" as const,
    priority: 1.0,
  },
  {
    path: "/features",
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    path: "/community",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    path: "/docs",
    changeFrequency: "monthly" as const,
    priority: 0.85,
  },
  {
    path: "/savings",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/goals",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/support",
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    path: "/proposals/preview",
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    path: "/terms",
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    path: "/privacy",
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for all locales
  ROUTES.forEach((route) => {
    LOCALES.forEach((locale) => {
      const url =
        route.path === ""
          ? `${BASE_URL}/${locale}`
          : `${BASE_URL}/${locale}${route.path}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${route.path}`,
            es: `${BASE_URL}/es${route.path}`,
          },
        },
      });
    });
  });

  // Also add non-locale versions for backwards compatibility
  ROUTES.forEach((route) => {
    const url = `${BASE_URL}${route.path}`;
    // Only add if not already added
    if (!sitemapEntries.some((entry) => entry.url === url)) {
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority * 0.9, // Slightly lower priority for non-locale versions
        alternates: {
          languages: {
            en: `${BASE_URL}/en${route.path}`,
            es: `${BASE_URL}/es${route.path}`,
          },
        },
      });
    }
  });

  return sitemapEntries;
}

