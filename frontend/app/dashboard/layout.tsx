import React from "react";
import type { Metadata } from "next";
import Sidebar from "../components/dashboard/Sidebar";
import TopNav from "../components/dashboard/TopNav";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Dashboard - Nestera",
  description: "Manage your Nestera account, view portfolio analytics, track savings progress, and control your decentralized financial strategy from one unified dashboard.",
  url: "/dashboard",
  canonical: `${SITE_URL}/dashboard`,
  noindex: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="block bg-[#061218] min-h-screen overflow-x-hidden">
      <Sidebar />

      {/* Responsive margin: no margin on mobile, 180px on md+ to clear the fixed sidebar */}
      <div className="min-h-screen px-4 py-5 md:ml-[180px] md:px-6 max-w-full">
        <TopNav />
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
