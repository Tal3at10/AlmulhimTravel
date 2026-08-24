import { useEffect, useRef, useState } from 'react';

const LeafletMap = ({ hotels = [], center, zoom = 13, height = '300px', singleHotel = false }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject Leaflet CSS dynamically if not already present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (window.L) {
      setLoaded(true);
      return;
    }

    // Inject Leaflet JS dynamically if not already present
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      // Script is present but maybe not loaded yet, check periodically
      const interval = setInterval(() => {
        if (window.L) {
          setLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !window.L || !mapRef.current) return;

    // Clean up previous map instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const L = window.L;

    // Find valid coordinates in hotels list
    const validHotels = hotels.filter(h => h.latitude && h.longitude);

    // Determine map center
    let mapCenter = center;
    if (!mapCenter) {
      if (validHotels.length > 0) {
        mapCenter = [parseFloat(validHotels[0].latitude), parseFloat(validHotels[0].longitude)];
      } else {
        mapCenter = [24.7136, 46.6753]; // Fallback to Riyadh
      }
    }

    // Initialize map
    mapInstance.current = L.map(mapRef.current, {
      center: mapCenter,
      zoom: zoom,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // Custom marker icon fixing Leaflet default missing marker images issue
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add markers
    if (singleHotel) {
      L.marker(mapCenter, { icon: customIcon }).addTo(mapInstance.current);
    } else {
      validHotels.forEach(hotel => {
        const marker = L.marker([parseFloat(hotel.latitude), parseFloat(hotel.longitude)], { icon: customIcon })
          .addTo(mapInstance.current);
        
        const priceText = hotel.price ? `${hotel.price} ${hotel.currency === 'USD' ? '$' : hotel.currency || 'ر.س'}` : 'عرض السعر';
        
        marker.bindPopup(`
          <div style="font-family: Tajawal, sans-serif; text-align: right; direction: rtl; min-width: 150px;">
            <h4 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #071428;">${hotel.name}</h4>
            <p style="margin: 0 0 5px 0; font-size: 11px; color: #555;">★ ${hotel.stars} نجوم | التقييم: ${hotel.rating}</p>
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #C9A227;">${priceText} / ليلة</p>
          </div>
        `);
      });

      // Fit bounds if multiple markers are present
      if (validHotels.length > 1) {
        const group = new L.featureGroup(validHotels.map(h => L.marker([parseFloat(h.latitude), parseFloat(h.longitude)])));
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loaded, hotels, center, zoom, singleHotel]);

  return (
    <div className="relative overflow-hidden border border-slate-200" style={{ borderRadius: '12px' }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-semibold">
          جاري تحميل الخريطة تفاعلياً...
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: height, zIndex: 1 }} />
    </div>
  );
};

export default LeafletMap;
