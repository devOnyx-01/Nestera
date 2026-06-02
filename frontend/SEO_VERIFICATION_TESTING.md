# SEO Verification & Testing Guide

## Pre-Launch Checklist

### 1. Build & Test Locally

```bash
# Build the project
npm run build

# Run development server
npm run dev

# Visit pages and check DevTools
# Press F12 → Elements → Right-click → View page source
```

### 2. Meta Tags Verification

For each page, check that these meta tags are present:

```html
<!-- Essential Meta Tags -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Page description">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://nestera.finance/page-url">

<!-- Open Graph Tags -->
<meta property="og:type" content="website">
<meta property="og:title" content="Page Title - Nestera">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://nestera.finance/og-image.png">
<meta property="og:url" content="https://nestera.finance/page-url">
<meta property="og:site_name" content="Nestera">

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title - Nestera">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://nestera.finance/og-image.png">
<meta name="twitter:creator" content="@nestera_finance">
```

### 3. Structured Data Validation

#### Option A: Using Google's Rich Results Test
1. Go to [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Enter your site URL
3. Verify JSON-LD schemas are detected
4. Check for errors or warnings

#### Option B: Using Schema.org Validator
1. Go to [schema.org/validate](https://schema.org/validate)
2. Enter page URL or paste HTML
3. Verify schemas are recognized:
   - Organization
   - WebSite
   - BreadcrumbList (if applicable)
   - Other specific schemas

#### Expected Schemas
```json
✅ Organization (on all pages)
✅ WebSite (on all pages)
✅ Product (on features/savings pages)
✅ BreadcrumbList (on nested pages)
✅ FAQ (on support/docs)
✅ Article (on blog posts)
```

### 4. Social Media Preview Testing

#### Facebook / Meta Debugger
1. Go to [facebook.com/sharing/debugger](https://facebook.com/sharing/debugger)
2. Enter page URL
3. Click "Debug"
4. Verify:
   - ✅ Image displays correctly (1200x630px)
   - ✅ Title is descriptive
   - ✅ Description is present
   - ✅ URL is correct

#### Twitter Card Validator
1. Go to [twitter.com/intent/tweet](https://twitter.com/intent/tweet)
2. Share a page URL
3. Verify card displays with:
   - ✅ Image (1200x630px)
   - ✅ Title
   - ✅ Description
   - ✅ Site name

#### LinkedIn Share Preview
1. Go to [linkedin.com/sharing/share-offsite](https://linkedin.com/sharing/share-offsite)
2. Enter page URL
3. Verify preview shows:
   - ✅ Custom image
   - ✅ Title and description
   - ✅ Source (Nestera)

### 5. Robots.txt & Sitemap Verification

#### Check Robots.txt
```bash
# Visit in browser
https://nestera.finance/robots.txt

# Should show:
✅ User-agent: * Allow: /
✅ Disallow: /dashboard/
✅ Disallow: /api/
✅ Disallow: /_next/
✅ Crawl-delay: 10
✅ Sitemap: https://nestera.finance/sitemap.xml
```

#### Check Sitemap
```bash
# Visit in browser
https://nestera.finance/sitemap.xml

# Should include:
✅ Home page (/)
✅ All major pages (/features, /community, etc.)
✅ Language variants (/en/*, /es/*)
✅ Priority levels (1.0 for home, 0.8-0.9 for main pages)
✅ Change frequency (weekly/monthly)
✅ Last modified dates
```

### 6. Mobile-Friendly Testing

#### Google Mobile-Friendly Test
1. Go to [search.google.com/mobile-friendly-test](https://search.google.com/mobile-friendly-test)
2. Enter page URL
3. Verify:
   - ✅ Page is mobile-friendly
   - ✅ No rendering errors
   - ✅ Text is readable
   - ✅ Buttons are clickable

#### Lighthouse Mobile Performance
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Mobile" and "Performance"
4. Run audit
5. Target score: 90+

### 7. Image Alt Text Audit

#### Manual Check
```bash
# In DevTools Console, run:
document.querySelectorAll('img').forEach(img => {
  if (!img.alt || img.alt.length === 0) {
    console.warn('Image missing alt text:', img);
  }
});
```

#### Expected Results
```
✅ All <img> tags have non-empty alt text
✅ All Next.js <Image> components have alt prop
✅ Alt text is descriptive (not just "image" or "pic")
```

### 8. Lighthouse SEO Audit

#### Run Full SEO Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "SEO"
4. Click "Analyze page load"

#### Expected Results
```
✅ Meta description present
✅ Viewport is set appropriately
✅ Document has a valid hreflang
✅ HTTP status code is 200
✅ Document has successful HTTPS
✅ Links are crawlable
✅ robots.txt is valid
✅ Structured data is valid
```

**Target Score: 90+**

### 9. Google Search Console Setup

#### Initial Setup
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property (choose URL prefix)
3. Verify ownership (DNS/HTML file/Google Analytics)
4. Submit sitemap

#### Monitoring
```
Regular checks:
✅ Coverage report (should show 0 errors)
✅ Enhancements (rich results, mobile usability)
✅ Performance (impressions, clicks, CTR)
✅ Links (top links to/from site)
✅ Core Web Vitals
```

### 10. Bing Webmaster Tools

#### Setup
1. Go to [bing.com/webmasters](https://bing.com/webmasters)
2. Add site
3. Verify ownership
4. Submit sitemap

### 11. Performance Monitoring

#### Core Web Vitals (Lighthouse)
```
Largest Contentful Paint (LCP):    < 2.5s  ✅
First Input Delay (FID):           < 100ms ✅
Cumulative Layout Shift (CLS):     < 0.1   ✅
```

#### Page Load Speed
```
Aim for:
✅ First contentful paint: < 1.8s
✅ Time to interactive: < 3.8s
✅ Speed index: < 3.4s
```

### 12. Sitemap Validation

#### Check All Routes Included
```bash
# Routes that SHOULD be in sitemap:
✅ /
✅ /en / /es (language variants)
✅ /features
✅ /community
✅ /docs
✅ /savings
✅ /goals
✅ /support
✅ /terms
✅ /privacy
✅ /proposals/preview

# Routes that should NOT be in sitemap:
❌ /dashboard (marked noindex)
❌ /api/*
❌ /admin/*
```

### 13. Canonical URL Verification

#### Check All Pages
```bash
# Each page should have ONE canonical URL pointing to itself
# For example:
Page: https://nestera.finance/features
Canonical: <link rel="canonical" href="https://nestera.finance/features">

# Language variants:
Page: https://nestera.finance/en/features
Canonical: <link rel="canonical" href="https://nestera.finance/en/features">

Page: https://nestera.finance/es/features
Canonical: <link rel="canonical" href="https://nestera.finance/es/features">
```

### 14. Structured Data Testing

#### All Pages Should Include
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nestera",
  "url": "https://nestera.finance",
  "logo": "https://nestera.finance/logo.png"
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nestera",
  "url": "https://nestera.finance",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nestera.finance/search?q={search_term}"
  }
}
```

### 15. Multilingual SEO Verification

#### hreflang Tags
```html
<!-- On /features page -->
<link rel="alternate" hreflang="en" href="https://nestera.finance/en/features">
<link rel="alternate" hreflang="es" href="https://nestera.finance/es/features">
<link rel="alternate" hreflang="x-default" href="https://nestera.finance/features">
```

#### Language Coverage
```
✅ English pages: /en/*
✅ Spanish pages: /es/*
✅ Both languages for all public pages
✅ Proper language tags in <html lang="en">
```

## Automated Testing Script

```bash
#!/bin/bash
# Run this from frontend directory
# Checks key SEO elements

echo "🔍 SEO Verification Report"
echo "========================="
echo ""

# Check if build succeeds
echo "Building project..."
npm run build 2>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  exit 1
fi

echo ""
echo "Checking SEO files..."

# Check for required SEO files
files=("app/lib/seo.ts" "public/robots.txt" "public/manifest.json" "app/sitemap.ts")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo ""
echo "✅ SEO setup verification complete"
```

## Post-Launch Checklist

- [ ] All pages indexed in Google Search Console
- [ ] No crawl errors in GSC
- [ ] Sitemap submitted and processed
- [ ] Robots.txt allows crawling of desired pages
- [ ] Core Web Vitals in "Good" range
- [ ] No broken canonical URLs
- [ ] Social media preview tested on 3+ networks
- [ ] Lighthouse SEO score ≥ 90
- [ ] All images have descriptive alt text
- [ ] Meta descriptions updated for all pages
- [ ] OG images displaying correctly
- [ ] Twitter Card preview works
- [ ] Facebook sharing preview works
- [ ] Structured data validated
- [ ] Mobile-friendly test passed
- [ ] Language alternates verified
- [ ] Analytics tracking confirmed

## Ongoing Maintenance

### Weekly
- Check Google Search Console for new errors
- Monitor Core Web Vitals
- Verify no broken links

### Monthly
- Update meta descriptions if needed
- Check for new crawl errors
- Review analytics performance
- Validate structured data still correct

### Quarterly
- Audit all meta descriptions
- Check for outdated content
- Review image alt text
- Test social sharing again

### Annually
- Full SEO audit
- Competitor analysis
- Update with new pages
- Review keyword rankings

---

**Reference**: See [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md) for complete documentation.
