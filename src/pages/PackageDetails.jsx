import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinematicHero from '../components/package/CinematicHero';
import FloatingTicket from '../components/package/FloatingTicket';
import ParticleOverlay from '../components/package/ParticleOverlay';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEO from '../components/ui/SEO';
import { Suspense } from 'react';
import React from 'react';
const ItinerarySection = React.lazy(() => import('../components/package/ItinerarySection'));
const HotelSection = React.lazy(() => import('../components/package/HotelSection'));
const CustomerGallery = React.lazy(() => import('../components/package/CustomerGallery'));
import { PackageSchema } from '../components/seo/StructuredData';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import apiService from '../services/api.service';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [rawPkg, setRawPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const pkg = await apiService.packages.getById(id);
        
        if (pkg && pkg.id) {
          // Store raw API data for SEO schemas
          setRawPkg(pkg);

          // Transform API data to match component structure
          setPackageData({
            hero: {
              titleAr: pkg.titleAr,
              titleEn: pkg.titleEn,
              subtitle: pkg.subtitle,
              price: pkg.price,
              currency: pkg.currency || 'ر.س',
              duration: pkg.duration,
              imageUrl: pkg.imageUrl,
              videoUrl: pkg.videoUrl,
              vibe: pkg.vibe || 'tropical',
            },
            itinerary: pkg.itineraries || [],
            hotels: pkg.hotels || [],
            destinationSlug: pkg.destinationSlug || '', // Add destination slug
          });
        } else {
          setError('لم يتم العثور على الباقة');
        }
      } catch (err) {
        console.error('Error fetching package details:', err);
        setError('حدث خطأ أثناء تحميل تفاصيل الباقة');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#071428] mb-4">{error || 'لم يتم العثور على الباقة'}</h2>
          <button
            onClick={() => navigate('/destinations')}
            className="btn-primary"
          >
            العودة إلى الباقات
          </button>
        </div>
      </div>
    );
  }

  // Build SEO description from package data
  const seoDescription = rawPkg
    ? `احجز باقة ${rawPkg.titleAr} بسعر ${rawPkg.price} ${rawPkg.currency || 'ر.س'} - ${rawPkg.duration}. ${rawPkg.subtitle || 'رحلة مميزة مع الملحم للسفر والسياحة.'}`
    : '';

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الباقات السياحية', path: '/destinations' },
    { name: rawPkg?.titleAr || 'تفاصيل الباقة' },
  ];

  return (
    <div className="relative pb-20 md:pb-0">
      {/* SEO Meta Tags */}
      <SEO
        title={rawPkg?.titleAr}
        description={seoDescription}
        keywords={`باقة ${rawPkg?.titleAr || ''}, سفر, سياحة, رحلات, عروض سياحية, حجز باقة`}
        type="product"
        ogImage={rawPkg?.imageUrl}
        canonicalPath={`/package/${id}`}
      />

      {/* Structured Data: Product Schema for Rich Results */}
      <PackageSchema pkg={rawPkg} />

      {/* Breadcrumbs */}
      <div className="absolute top-24 md:top-24 right-4 md:right-8 z-30">
        <Breadcrumbs
          items={breadcrumbItems}
          className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-[#C9A227] [&_span[aria-current]]:text-white"
        />
      </div>

      {/* Atmospheric Particles */}
      <ParticleOverlay vibe={packageData.hero.vibe} intensity={8} desktopOnly />

      {/* Cinematic Hero with Zoom Effect */}
      <CinematicHero hero={packageData.hero} />

      <Suspense fallback={<div className="py-12 flex justify-center"><LoadingSpinner size="md" /></div>}>
        <div>
          {/* Itinerary Section */}
          <ItinerarySection itinerary={packageData.itinerary} />

          {/* Hotel Experience */}
          <HotelSection hotels={packageData.hotels} />

          {/* Customer Gallery - Videos from our clients */}
          <CustomerGallery destinationSlug={packageData.destinationSlug} />
        </div>
      </Suspense>

      {/* Floating Booking Ticket */}
      <FloatingTicket
        price={packageData.hero.price}
        currency={packageData.hero.currency}
        title={packageData.hero.titleAr}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PackageDetails;

