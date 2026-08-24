import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, name, type, ogImage, canonicalPath }) => {
    const location = useLocation();
    const baseTitle = "الملحم للسفر والسياحة";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const defaultDescription = "الملحم للسفر والسياحة - أفضل باقات السفر وعروض الرحلات السياحية إلى تركيا، ماليزيا، جورجيا والمالديف. حجوزات طيران وفنادق بأسعار منافسة منذ 1993.";
    const siteUrl = "https://almulhimtravel.com";
    const canonical = `${siteUrl}${canonicalPath || location.pathname}`;
    const image = ogImage || `${siteUrl}/logo.png`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description || defaultDescription} />
            {keywords && <meta name='keywords' content={keywords} />}

            {/* SEO and Canonical */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <link rel="canonical" href={canonical} />

            {/* hreflang - Arabic is the primary language */}
            <link rel="alternate" hreflang="ar" href={canonical} />
            <link rel="alternate" hreflang="x-default" href={canonical} />

            {/* Open Graph tags for social media sharing */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:site_name" content={baseTitle} />
            <meta property="og:locale" content="ar_SA" />
            <meta property="og:image" content={image} />

            {/* Twitter Card tags */}
            <meta name="twitter:creator" content={name || 'Almulhim Travel'} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;

