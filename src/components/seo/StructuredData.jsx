import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://almulhimtravel.com';
const ORG_NAME = 'الملحم للسفر والسياحة';
const LOGO_URL = `${SITE_URL}/logo.png`;

/**
 * Product Schema for Travel Packages
 * Enables Rich Results: stars, price, availability in Google Search
 */
export function PackageSchema({ pkg }) {
    if (!pkg) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": pkg.titleAr || pkg.title,
        "description": pkg.subtitle || `باقة سفر مميزة مع ${ORG_NAME}`,
        "image": pkg.imageUrl || LOGO_URL,
        "brand": { "@type": "Organization", "name": ORG_NAME },
        "offers": {
            "@type": "Offer",
            "price": String(pkg.price || 0),
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "TravelAgency",
                "name": ORG_NAME,
                "url": SITE_URL
            }
        },
    };

    // Only add rating if available
    if (pkg.rating) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": String(pkg.rating),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "85"
        };
    }

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
}

/**
 * Article Schema for Blog Posts
 * Enables Rich Results: author, date, image in Google Search
 */
export function ArticleSchema({ post }) {
    if (!post) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.metaTitle || post.title,
        "description": post.metaDescription || post.shortDescription || "",
        "image": post.coverImageUrl || LOGO_URL,
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt || post.createdAt,
        "author": { "@type": "Organization", "name": ORG_NAME },
        "publisher": {
            "@type": "Organization",
            "name": ORG_NAME,
            "logo": { "@type": "ImageObject", "url": LOGO_URL }
        },
        "mainEntityOfPage": `${SITE_URL}/blog/${post.slug}`
    };

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
}

/**
 * BreadcrumbList Schema
 * Helps Google understand site hierarchy and show breadcrumbs in search results
 * 
 * Usage: <BreadcrumbSchema items={[
 *   { name: 'الرئيسية', path: '/' },
 *   { name: 'الباقات', path: '/destinations' },
 *   { name: 'تركيا الفاخرة', path: '/package/turkey-luxury' }
 * ]} />
 */
export function BreadcrumbSchema({ items }) {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": `${SITE_URL}${item.path}`
        }))
    };

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
}

/**
 * FAQ Schema for Rich Snippets
 * Enables expandable Q&A directly in Google Search results
 */
export function FAQSchema({ questions }) {
    if (!questions || questions.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map(q => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer
            }
        }))
    };

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
}
