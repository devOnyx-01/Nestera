import { Metadata } from 'next';
import React from 'react';
import { generatePageMetadata, SITE_URL } from '../lib/seo';
import DocsLayoutClient from './layout-client';

export const metadata: Metadata = generatePageMetadata({
  title: 'Documentation | Nestera',
  description:
    'Learn how to use Nestera, integrate with smart contracts, and manage your decentralized savings accounts.',
  url: '/docs',
  canonical: `${SITE_URL}/docs`,
});

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}

