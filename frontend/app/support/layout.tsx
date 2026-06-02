import type { Metadata } from "next";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Support - Nestera",
  description: "Get help with Nestera. Find answers to common questions, view documentation, and contact our support team for assistance.",
  url: "/support",
  canonical: `${SITE_URL}/support`,
});

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
