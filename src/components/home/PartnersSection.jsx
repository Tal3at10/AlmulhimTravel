import { useEffect, useState } from 'react';
import apiService from '../../services/api.service';
import LoadingSpinner from '../ui/LoadingSpinner';

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await apiService.cms.getPartners();
        if (Array.isArray(response) && response.length > 0) {
          setPartners(response);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  if (loading) {
    return (
      <section className="py-16 bg-[#071428]">
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#071428] overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 font-bold">
            شركاؤنا في النجاح
          </h2>
          <div className="w-20 h-1 bg-[#C9A15A] mx-auto" />
        </div>
      </div>

      {/* First Row - Moving Right */}
      <div className="relative mb-8">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#071428] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#071428] to-transparent z-10" />

        <div className="flex animate-marquee-right" style={{ direction: 'ltr' }}>
          {duplicatedPartners.map((partner, index) => (
            <div key={`row1-${index}`} className="flex-shrink-0 mx-8">
              <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  width={120}
                  height={48}
                  loading="lazy"
                  className="h-12 w-auto object-contain bg-white rounded-lg p-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-white/80 text-sm font-medium whitespace-nowrap">{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Moving Left */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#071428] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#071428] to-transparent z-10" />

        <div className="flex animate-marquee-left" style={{ direction: 'ltr' }}>
          {duplicatedPartners.map((partner, index) => (
            <div key={`row2-${index}`} className="flex-shrink-0 mx-8">
              <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  width={120}
                  height={48}
                  loading="lazy"
                  className="h-12 w-auto object-contain bg-white rounded-lg p-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-white/80 text-sm font-medium whitespace-nowrap">{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-right {
          animation: marqueeRight 15s linear infinite;
        }
        .animate-marquee-left {
          animation: marqueeLeft 15s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee-right {
            animation: marqueeRight 7s linear infinite;
          }
          .animate-marquee-left {
            animation: marqueeLeft 7s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnersSection;
