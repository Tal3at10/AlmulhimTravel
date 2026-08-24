import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Camera, Users } from 'lucide-react';
import apiService from '../../services/api.service';
import useIsMobile from '../../hooks/useIsMobile';

const getCloudinaryH264Url = (url) => {
  if (!url) return url;

  try {
    if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) {
      return url;
    }

    // If the URL already has transformations, keep it as-is.
    const [prefix, suffix] = url.split('/video/upload/');
    if (!suffix) return url;

    const suffixParts = suffix.split('/');
    const firstPart = suffixParts[0] || '';
    const looksLikeVersionSegment = /^v\d+$/.test(firstPart);
    const alreadyHasTransforms = !looksLikeVersionSegment && firstPart.length > 0;

    if (alreadyHasTransforms) return url;

    // Force browser-compatible encoding (H.264 + AAC) + MP4 container.
    const transforms = 'f_mp4,vc_h264,ac_aac,q_auto';
    return `${prefix}/video/upload/${transforms}/${suffix}`;
  } catch {
    return url;
  }
};

const getCloudinaryPlayerUrl = (url) => {
  if (!url) return null;

  try {
    // If user already provided an embed URL, use it as-is
    if (url.includes('player.cloudinary.com/embed')) return url;

    if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) return null;

    const cloudNameMatch = url.match(/res\.cloudinary\.com\/([^/]+)\//);
    const cloudName = cloudNameMatch?.[1];
    if (!cloudName) return null;

    const afterUpload = url.split('/video/upload/')[1];
    if (!afterUpload) return null;

    const lastSegment = afterUpload.split('/').pop() || '';
    const publicId = lastSegment.replace(/\.[a-z0-9]+$/i, '');
    if (!publicId) return null;

    const params = new URLSearchParams({
      cloud_name: cloudName,
      public_id: publicId,
    });

    return `https://player.cloudinary.com/embed/?${params.toString()}`;
  } catch {
    return null;
  }
};

const CustomerGallery = ({ destinationSlug = '' }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useEmbedPlayer, setUseEmbedPlayer] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await apiService.cms.getCustomerVideos(destinationSlug);
        if (Array.isArray(response) && response.length > 0) {
          const transformedVideos = response.map(video => ({
            id: video.id,
            thumbnail: video.thumbnailUrl || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
            videoUrl: getCloudinaryH264Url(video.videoUrl),
            customerName: video.customerName,
            location: video.location || '',
            date: video.date || ''
          }));
          setVideos(transformedVideos);
        }
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.error('Error fetching customer videos:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (destinationSlug) {
      fetchVideos();
    } else {
      setLoading(false);
    }
  }, [destinationSlug]);

  useEffect(() => {
    setUseEmbedPlayer(false);
  }, [activeVideo?.id]);

  const galleryVideos = videos;

  if (loading) {
    return null;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-[#C9A227]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071428]">
              تصوير عملائنا
            </h2>
          </div>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            لحظات حقيقية من رحلات عملائنا - شاهد تجاربهم الممتعة
          </p>
          <div className="w-20 h-1 bg-[#C9A227] mx-auto mt-4"></div>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {galleryVideos.map((video, index) => (
            <motion.div
              key={video.id}
              className="relative group cursor-pointer"
              initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              whileInView={isMobile ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={video.thumbnail}
                  loading="lazy"
                  decoding="async"
                  alt={`تصوير ${video.customerName}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#C9A227] transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[#071428] group-hover:text-white mr-[-2px]" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Customer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3 h-3 text-[#C9A227]" />
                    <span className="text-white text-sm font-semibold">{video.customerName}</span>
                  </div>
                  <p className="text-white font-medium text-xs">{video.location} • {video.date}</p>
                </div>

                {/* Gold Border on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#C9A227] transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-8 sm:mt-12 flex justify-center gap-6 sm:gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C9A227]">500+</span>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">فيديو من عملائنا</p>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C9A227]">150K+</span>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">عميل سعيد</p>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C9A227]">65+</span>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">وجهة حول العالم</p>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              onClick={() => setActiveVideo(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

             {/* Video Container */}
             <motion.div
              className="relative w-[min(520px,96vw)] h-[88vh] md:h-[86vh] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!useEmbedPlayer ? (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                preload="metadata"
                onError={() => {
                  const embedUrl = getCloudinaryPlayerUrl(activeVideo.videoUrl);
                  if (embedUrl) setUseEmbedPlayer(true);
                }}
              >
                <source src={activeVideo.videoUrl} type="video/mp4" />
              </video>
              ) : (
                <iframe
                  title={activeVideo.customerName || 'Customer video'}
                  src={getCloudinaryPlayerUrl(activeVideo.videoUrl)}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              )}
              
              {/* Customer Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-white font-semibold">{activeVideo.customerName}</span>
                </div>
                <p className="text-white font-medium text-sm">{activeVideo.location} • {activeVideo.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CustomerGallery;
