import type { Metadata } from "next";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy - Nestera",
  description: "Learn about how Nestera protects your privacy and handles your data with transparency and security on the Stellar blockchain.",
  url: "/privacy",
  canonical: `${SITE_URL}/privacy`,
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
