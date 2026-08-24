import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, ChevronLeft, MapPin } from 'lucide-react';
import apiService from '../services/api.service';

export default function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await apiService.blogPosts.getAll();
                setPosts(Array.isArray(data) ? data : []);

                if (!Array.isArray(data)) {
                    console.warn('BlogList: expected array, got:', data);
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>المدونة | الملحم للسفر والسياحة</title>
                <meta name="description" content="اقرأ أحدث المقالات والنصائح حول السفر والسياحة وأفضل الوجهات العالمية عبر مدونة الملحم للسفر." />
            </Helmet>

            <div className="min-h-screen py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-96 bg-primary/5 rounded-bl-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-navy/5 rounded-tr-full blur-3xl -z-10" />
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-10 mt-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-navy mb-4 font-cairo"
                        >
                            مدونة الملحم للسفر
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-600 max-w-2xl mx-auto font-medium"
                        >
                            دليلك الشامل لاستكشاف العالم، نصائح قيمة، وتجارب سياحية لا تُنسى
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-1.5 bg-gradient-to-r from-primary via-gold to-primary mx-auto mt-8 rounded-full"
                        />
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 font-medium">لا توجد مقالات حالياً</h3>
                            <p className="text-gray-400 mt-2">نعمل على إضافة محتوى جديد قريباً.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group/card relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    {/* Image */}
                                    <Link to={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden group">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                        <img
                                            src={post.coverImageUrl || '/about-team.jpg'}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/about-team.jpg';
                                            }}
                                        />
                                        {post.tags && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                    {post.tags.split(',')[0]}
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-sm text-slate-700 font-medium mb-3 gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>{new Date(post.createdAt).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                        </div>

                                        <Link to={`/blog/${post.slug}`} className="block group">
                                            <h2 className="text-xl font-bold text-navy mb-3 line-clamp-2 group-hover:text-primary transition-colors font-cairo">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                                            {post.shortDescription}
                                        </p>

                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 text-primary font-bold hover:text-navy transition-colors mt-auto w-fit group/btn"
                                        >
                                            اقرأ المزيد
                                            <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
