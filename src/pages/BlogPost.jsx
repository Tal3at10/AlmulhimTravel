import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, MapPin, ChevronRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { ArticleSchema } from '../components/seo/StructuredData';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import apiService from '../services/api.service';

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await apiService.blogPosts.getBySlug(slug);
                setPost(data || null);
            } catch (err) {
                console.error("Error fetching blog post:", err);
                setError("لم نتمكن من العثور على المقال المطلوب. قد يكون تم حذفه أو تم تغيير الرابط.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl font-bold text-navy mb-4 font-cairo">مقال غير موجود</h1>
                <p className="text-gray-600 mb-8 max-w-lg">{error}</p>
                <button
                    onClick={() => navigate('/blog')}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-navy transition-colors flex items-center gap-2"
                >
                    <ChevronRight className="w-5 h-5" />
                    العودة للمدونة
                </button>
            </div>
        );
    }

    const shareUrl = `https://almulhimtravel.com/blog/${slug}`;

    const breadcrumbItems = [
        { name: 'الرئيسية', path: '/' },
        { name: 'المدونة', path: '/blog' },
        { name: post.title },
    ];

    return (
        <>
            <Helmet>
                <title>{post.metaTitle || `${post.title} | مدونة الملحم`}</title>
                <meta name="description" content={post.metaDescription || post.shortDescription} />
                <link rel="canonical" href={shareUrl} />
                <link rel="alternate" hreflang="ar" href={shareUrl} />
                {/* Open Graph Tags for Social Sharing */}
                <meta property="og:title" content={post.metaTitle || post.title} />
                <meta property="og:description" content={post.metaDescription || post.shortDescription} />
                <meta property="og:image" content={post.coverImageUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:locale" content="ar_SA" />
                <meta property="article:published_time" content={post.createdAt} />
                <meta property="article:modified_time" content={post.updatedAt || post.createdAt} />
            </Helmet>

            {/* Structured Data: Article Schema for Rich Results */}
            <ArticleSchema post={post} />

            <article className="bg-[#fdfbf7] min-h-screen pb-20">
                {/* Breadcrumbs */}
                <div className="container mx-auto px-4 pt-24 pb-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
                {/* Hero Cover */}
                <div className="relative h-[50vh] min-h-[400px] w-full bg-navy overflow-hidden">
                    <img
                        src={post.coverImageUrl || '/about-team.jpg'}
                        alt="غلاف المقال"
                        className="w-full h-full object-cover opacity-60"
                        fetchPriority="high"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/about-team.jpg';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end pb-16">
                        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white relative z-10"
                            >
                                <div className="flex items-center gap-4 text-sm font-medium mb-6">
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full px-4 py-1.5 shadow-lg border border-primary/20">
                                        <Calendar className="w-4 h-4 text-gold-light" />
                                        <span>{new Date(post.createdAt).toLocaleDateString('ar-SA')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white rounded-full px-4 py-1.5 border border-white/20 shadow-lg">
                                        <User className="w-4 h-4 text-gold-light" />
                                        <span>فريق الملحم</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-cairo leading-tight text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                    {post.title}
                                </h1>
                                <div className="mt-8 w-24 h-1.5 bg-gradient-to-r from-gold-light via-gold to-gold-light rounded-full shadow-lg" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-8 max-w-4xl -mt-8 relative z-20">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                        {/* Header Content Summary */}
                        <div className="prose prose-lg text-navy font-medium text-xl leading-relaxed mb-12 border-r-4 border-gold pr-6 bg-gradient-to-l from-gold/5 to-transparent py-6 rounded-l-2xl shadow-sm">
                            {post.shortDescription}
                        </div>

                        {/* Article Content */}
                        <style>{`
                            .blog-content-container * {
                                background-color: transparent !important;
                            }
                            .blog-content-container *:not(a) {
                                color: inherit !important;
                            }
                        `}</style>
                        <div
                            className="blog-content-container prose prose-lg prose-headings:font-cairo prose-headings:text-navy prose-headings:font-bold prose-h2:border-b-2 prose-h2:border-gold/30 prose-h2:pb-2 prose-a:text-gold prose-a:font-bold hover:prose-a:text-navy prose-img:rounded-2xl prose-img:w-full prose-img:shadow-xl prose-img:my-8 mb-16 text-gray-700 leading-loose prose-strong:text-navy"
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />

                        {/* Footer Tags and Share */}
                        <div className="border-t border-gray-100 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">

                            {/* Tags */}
                            {post.tags && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <Tag className="w-5 h-5 text-gold ml-2" />
                                    {post.tags.split(',').map((tag, i) => (
                                        <span key={i} className="bg-navy/5 text-navy px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold hover:text-white transition-colors cursor-pointer shadow-sm border border-navy/10">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Share */}
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-navy flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-gold" />
                                    مشاركة:
                                </span>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-md">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 hover:-translate-y-1 transition-all shadow-md">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-md">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-16 mb-8 text-center">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 bg-navy text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all group border-2 border-transparent hover:border-gold"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-gold-light" />
                            تصفح المزيد من المقالات
                        </Link>
                    </div>

                </div>
            </article>
        </>
    );
}
