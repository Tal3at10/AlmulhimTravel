import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Search, CheckCircle, Calendar, MapPin, 
  Download, Building2, User, Mail, Phone
} from 'lucide-react';
import Footer from '../components/layout/Footer';

// Mock booking data for simulation
const mockBooking = {
  reference: 'ALM-88293',
  status: 'confirmed',
  hotel: {
    name: 'هيلتون لندن بارك لين',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    stars: 5,
    location: 'مايفير، لندن',
  },
  guest: {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966 53 572 7771',
  },
  dates: {
    checkIn: '15 فبراير 2025',
    checkOut: '18 فبراير 2025',
    nights: 3,
  },
  room: {
    type: 'غرفة ديلوكس كينج',
    guests: 2,
  },
  payment: {
    total: 4500,
    currency: 'ر.س',
    method: 'بطاقة ائتمان',
    status: 'مدفوع',
  },
};

const ManageBooking = () => {
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setBooking(null);
    
    if (!reference.trim() || !email.trim()) {
      setError('يرجى إدخال رقم الحجز والبريد الإلكتروني');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success if reference matches
    if (reference.toUpperCase().includes('ALM')) {
      setBooking(mockBooking);
    } else {
      setError('لم يتم العثور على الحجز. يرجى التحقق من البيانات المدخلة.');
    }
    
    setIsSearching(false);
  };

  const handleDownloadVoucher = () => {
    // Simulate voucher download
    alert('جاري تحميل الفاوتشر...');
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-24">
      {/* World Map Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%23071428' d='M150,100 Q200,50 250,100 T350,100 Q400,150 350,200 T250,200 Q200,150 150,200 T50,200 Q0,150 50,100 T150,100 M450,80 Q500,30 550,80 T650,80 Q700,130 650,180 T550,180 Q500,130 450,180 T350,180 M750,120 Q800,70 850,120 T950,120 Q1000,170 950,220 T850,220 Q800,170 750,220'/%3E%3C/svg%3E")`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-y',
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-xl mx-auto">
          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-[#C9A227]" />
              </div>
              <h1 className="text-2xl font-bold text-[#071428] mb-2">إدارة حجزي</h1>
              <p className="text-slate-700 font-medium">
                أدخل رقم الحجز والبريد الإلكتروني لعرض التفاصيل وتحميل الفاوتشر
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Reference Input */}
              <div>
                <label className="block text-sm font-medium text-[#071428] mb-2">
                  رقم الحجز
                </label>
                <div className="relative">
                  <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="مثال: ALM-88293"
                    className="w-full pr-12 pl-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-[#071428] mb-2">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-12 pl-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Search Button */}
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    بحث عن الحجز
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Booking Result */}
          <AnimatePresence>
            {booking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Status Banner */}
                <div className="bg-green-500 text-white px-6 py-3 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">الحجز مؤكد</span>
                </div>

                {/* Hotel Info */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex gap-4">
                    <img
                      src={booking.hotel.image}
                      alt={booking.hotel.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#071428] text-lg mb-1">
                        {booking.hotel.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[#C9A227] mb-2">
                        {[...Array(booking.hotel.stars)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                        <MapPin className="w-4 h-4" />
                        {booking.hotel.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                  {/* Reference */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">رقم الحجز</span>
                    <span className="font-mono font-bold text-[#071428] text-lg">
                      {booking.reference}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">تاريخ الإقامة</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2 text-[#071428]">
                        <Calendar className="w-4 h-4 text-slate-600 font-medium" />
                        {booking.dates.checkIn} - {booking.dates.checkOut}
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        ({booking.dates.nights} ليالي)
                      </span>
                    </div>
                  </div>

                  {/* Room */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">الغرفة</span>
                    <div className="flex items-center gap-2 text-[#071428]">
                      <Building2 className="w-4 h-4 text-slate-600 font-medium" />
                      {booking.room.type}
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">الضيوف</span>
                    <div className="flex items-center gap-2 text-[#071428]">
                      <User className="w-4 h-4 text-slate-600 font-medium" />
                      {booking.room.guests} ضيوف
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-slate-700 font-medium">المبلغ الإجمالي</span>
                    <span className="font-bold text-[#071428] text-xl">
                      {booking.payment.total.toLocaleString()} {booking.payment.currency}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">حالة الدفع</span>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      {booking.payment.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={handleDownloadVoucher}
                    className="w-full py-4 bg-[#C9A227] text-white font-semibold rounded-xl hover:bg-[#c9a432] transition-colors flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    تحميل الفاوتشر (PDF)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Text */}
          <p className="text-center text-slate-600 font-medium text-sm mt-8">
            هل تحتاج مساعدة؟{' '}
            <a href="/contact" className="text-[#C9A227] hover:underline">
              تواصل معنا
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageBooking;
