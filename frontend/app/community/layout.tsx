import type { Metadata } from "next";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Community - Nestera",
  description: "Connect with the Nestera community. Share savings tips, participate in discussions, and grow together in the decentralized financial ecosystem.",
  url: "/community",
  canonical: `${SITE_URL}/community`,
});

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
