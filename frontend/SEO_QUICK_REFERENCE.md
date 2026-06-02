# SEO Quick Reference Guide

## For Developers: Adding SEO to New Pages

### Basic Usage

#### Layout File (`app/[route]/layout.tsx`)
```typescript
import type { Metadata } from "next";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Page Title - Nestera",
  description: "A brief description of this page (155-160 characters recommended)",
  url: "/your-route",
  canonical: `${SITE_URL}/your-route`,
});

export default function YourLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

#### Page File (`app/[route]/page.tsx`)
If you need metadata on a page (without a layout):
```typescript
import type { Metadata } from "next";
import { generatePageMetadata, SITE_URL } from "../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Page Title - Nestera",
  description: "Your page description",
  url: "/your-route",
});

export default function YourPage() {
  return <main>Your content</main>;
}
```

### Adding Structured Data to Pages

#### Option 1: In the Page Component
```typescript
'use client';

import { StructuredData } from "@/app/components/StructuredData";
import { 
  getFinancialProductSchema, 
  getBreadcrumbSchema 
} from "@/app/lib/seo";

export default function MyPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://nestera.finance" },
    { name: "Features", url: "https://nestera.finance/features" },
  ];

  return (
    <>
      <StructuredData 
        schema={[
          getFinancialProductSchema(),
          getBreadcrumbSchema(breadcrumbs),
        ]} 
      />
      <main>Your content</main>
    </>
  );
}
```

#### Option 2: Using Other Schema Generators
```typescript
import { getArticleSchema, getFAQSchema } from "@/app/lib/seo";

// For articles
const articleSchema = getArticleSchema({
  headline: "Article Title",
  description: "Short description",
  image: "https://example.com/image.jpg",
  datePublished: "2026-06-02",
  author: "Nestera Team",
});

// For FAQ pages
const faqSchema = getFAQSchema([
  { 
    question: "What is Nestera?", 
    answer: "Nestera is a decentralized savings platform..." 
  },
  { 
    question: "How do I create an account?", 
    answer: "Click the sign up button and..." 
  },
]);
```

### Image Alt Text Best Practices

```typescript
// GOOD - Descriptive alt text
<img 
  src="/image.png" 
  alt="Nestera Mobile App Dashboard showing savings portfolio"
/>

// BAD - Generic or missing alt text
<img src="/image.png" alt="image" />
<img src="/image.png" /> // No alt text

// For Next.js Image component
import Image from "next/image";

<Image
  src="/image.png"
  alt="Clear description of what the image shows"
  width={1200}
  height={630}
/>
```

### Social Media Preview

Add this to optimize for social sharing:
```typescript
export const metadata: Metadata = generatePageMetadata({
  title: "Your Page Title",
  description: "Your description (kept under 160 chars)",
  url: "/your-route",
  image: "/og-images/your-page.png", // Optional: custom OG image
  type: "website", // or "article"
});
```

**Note**: If no custom image is provided, the default OG image is used. You can also use the dynamic OG generator:
```
https://nestera.finance/og?title=Your+Title&description=Your+Description
```

### Meta Description Guidelines

- **Length**: 155-160 characters (optimal for Google search results)
- **Content**: Include primary keyword naturally
- **Action**: Start with value proposition when possible
- **Examples**:
  ✅ "Create flexible savings accounts with Nestera. Set goals, earn rewards, and manage your finances with decentralized smart contracts on Stellar."
  ❌ "This is the savings page of Nestera"

### Canonical URL Best Practices

Always include canonical URL for consistency:
```typescript
export const metadata: Metadata = generatePageMetadata({
  title: "Your Title",
  url: "/your-route",
  canonical: `${SITE_URL}/your-route`, // Must match the actual URL
});
```

### Multilingual Pages

For pages available in multiple languages:
```typescript
export const metadata: Metadata = generatePageMetadata({
  title: "Your Title - Nestera",
  description: "Your description",
  url: "/your-route",
  locale: "en",
  alternateLanguages: {
    "en-US": `${SITE_URL}/en/your-route`,
    "es-ES": `${SITE_URL}/es/your-route`,
  },
});
```

### Common Mistakes to Avoid

❌ **Missing alt text on images**
```typescript
// BAD
<img src="/image.png" />
```

✅ **Always include descriptive alt text**
```typescript
// GOOD
<img src="/image.png" alt="Description of image content" />
```

❌ **Duplicate canonical URLs**
```typescript
// BAD - Different URLs with same canonical
// URL1: https://nestera.finance/features
canonical: https://nestera.app/features

// URL2: https://nestera.app/features  
canonical: https://nestera.app/features
```

✅ **Match canonical to actual URL**
```typescript
// GOOD
canonical: `${SITE_URL}/features`  // Will be the actual URL
```

❌ **Truncated meta descriptions**
```typescript
// BAD - Gets cut off
description: "Very long text that goes on and on and on and on..."
```

✅ **Keep it concise and valuable**
```typescript
// GOOD
description: "Create goals, track savings, earn rewards on Stellar blockchain."
```

### Testing Your SEO

1. **Browser DevTools**: Open DevTools → Elements → Search for meta tags
2. **Social Media Debuggers**:
   - Facebook: facebook.com/sharing/debugger
   - Twitter: twitter.com/intent/tweet
   - LinkedIn: linkedin.com/sharing/share-offsite
3. **Schema Validator**: schema.org/validate
4. **Lighthouse**: Chrome DevTools → Lighthouse → SEO
5. **Google Search Console**: Add your site and monitor impressions

### Useful Functions from `app/lib/seo.ts`

```typescript
// Generate complete metadata with OG tags
generatePageMetadata(params: PageMetadataParams): Metadata

// Generate structured data (any schema type)
generateStructuredData(type: string, data: Record<string, any>)

// Get organization schema
getOrganizationSchema()

// Get website schema with search action
getWebsiteSchema()

// Get financial product schema
getFinancialProductSchema()

// Get breadcrumb list schema
getBreadcrumbSchema(items: Array<{ name: string; url: string }>)

// Get FAQ schema
getFAQSchema(faqs: Array<{ question: string; answer: string }>)

// Get article schema
getArticleSchema(article: ArticleSchema)
```

### Constants

```typescript
// From app/lib/seo.ts
SITE_URL          // e.g., "https://nestera.finance"
SITE_NAME         // "Nestera"
SITE_DESCRIPTION  // Default description
DEFAULT_OG_IMAGE  // Default OG image URL
```

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://nestera.finance
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/nestera_finance
NEXT_PUBLIC_DISCORD_URL=https://discord.gg/nestera
NEXT_PUBLIC_GITHUB_URL=https://github.com/nestera
```

### More Resources

- [Next.js Metadata API Docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Reference](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central SEO Guide](https://developers.google.com/search/docs)

---

**Need help?** Check the [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md) for comprehensive documentation.
