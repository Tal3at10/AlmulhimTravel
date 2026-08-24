import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { BreadcrumbSchema } from './StructuredData';

/**
 * Visual Breadcrumbs + Schema.org BreadcrumbList
 * 
 * Usage:
 * <Breadcrumbs items={[
 *   { name: 'الرئيسية', path: '/' },
 *   { name: 'الباقات السياحية', path: '/destinations' },
 *   { name: 'تركيا الفاخرة' }  // last item has no path (current page)
 * ]} />
 */
const Breadcrumbs = ({ items, className = '' }) => {
    if (!items || items.length === 0) return null;

    return (
        <>
            {/* Schema.org BreadcrumbList for crawlers */}
            <BreadcrumbSchema items={items.map((item, i) => ({
                name: item.name,
                path: item.path || (typeof window !== 'undefined' ? window.location.pathname : '/')
            }))} />

            {/* Visual breadcrumbs for users */}
            <nav
                aria-label="مسار التصفح"
                className={`flex items-center flex-wrap gap-1.5 text-sm text-gray-500 ${className}`}
            >
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;

                    return (
                        <span key={i} className="flex items-center gap-1.5">
                            {i > 0 && (
                                <ChevronLeft className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                            )}
                            {isLast || !item.path ? (
                                <span
                                    aria-current="page"
                                    className="text-[#071428] font-semibold truncate max-w-[200px]"
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="hover:text-[#C9A227] transition-colors font-medium"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </nav>
        </>
    );
};

export default Breadcrumbs;
