import { Star } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/image';

const HotelShowcase = ({ hotel }) => {
  const rawImageUrl =
    hotel?.dayImageUrl ||
    hotel?.nightImageUrl ||
    hotel?.imageUrl ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80';

  const imageUrl = getOptimizedImageUrl(rawImageUrl, 1200, 75);

  return (
    <div className="relative">
      {/* Hotel Info */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{hotel.name}</h3>
        <p className="text-slate-700 font-medium">{hotel.location}</p>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(hotel.stars)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#C9A227] text-[#C9A227]" />
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
        <img
          src={imageUrl}
          alt={hotel.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default HotelShowcase;

