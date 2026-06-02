import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturesHero from './components/FeaturesHero';
import FeatureGrid from './components/FeatureGrid';
import SecuritySection from './components/SecuritySection';
import YieldSection from './components/YieldSection';
import MultiAssetSection from './components/MultiAssetSection';
import GoalToolsSection from './components/GoalToolsSection';
import FeaturesCta from './components/FeaturesCta';
import { generatePageMetadata, SITE_URL } from '../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Features — Nestera',
  description:
    'Explore the full suite of Nestera features: decentralized savings, smart-contract security, yield optimization, multi-asset support, and goal-based tools — all on Stellar.',
  url: '/features',
  canonical: `${SITE_URL}/features`,
});

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#061a1a]">
      <Navbar />
      <FeaturesHero />
      <FeatureGrid />
      <SecuritySection />
      <YieldSection />
      <MultiAssetSection />
      <GoalToolsSection />
      <FeaturesCta />
      <Footer />
    </main>
  );
}
