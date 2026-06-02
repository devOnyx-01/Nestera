import type { Metadata } from "next";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service - Nestera",
  description: "Review the terms and conditions for using Nestera's decentralized savings platform and smart contract services.",
  url: "/terms",
  canonical: `${SITE_URL}/terms`,
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
