import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check, Download, Home, Calendar, CreditCard,
  Mail, Phone, MapPin, Star, Printer, Share2, MessageCircle
} from 'lucide-react';
import AlmulhemLogo from '../components/ui/AlmulhemLogo';
import apiService from '../services/api.service';

// Confetti Particle Component
const ConfettiParticle = ({ delay, x }) => (
  <motion.div
    className="absolute w-3 h-3 rounded-sm"
    style={{
      left: `${x}%`,
      top: '-20px',
      backgroundColor: ['#C9A227', '#071428', '#22c55e', '#3b82f6', '#f59e0b'][Math.floor(Math.random() * 5)],
    }}
    initial={{ y: -20, opacity: 1, rotate: 0 }}
    animate={{
      y: '100vh',
      opacity: [1, 1, 0],
      rotate: Math.random() * 720 - 360,
      x: Math.random() * 100 - 50,
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      delay: delay,
      ease: 'easeOut',
    }}
  />
);

// Animated Checkmark Component
const AnimatedCheckmark = () => (
  <motion.div
    className="relative w-32 h-32 mx-auto mb-8"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
  >
    {/* Outer Ring */}
    <motion.div
      className="absolute inset-0 rounded-full bg-green-100"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
    />

    {/* Inner Circle */}
    <motion.div
      className="absolute inset-2 rounded-full bg-green-500 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
    >
      {/* Checkmark SVG */}
      <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>

    {/* Pulse Effect */}
    <motion.div
      className="absolute inset-0 rounded-full bg-green-400"
      initial={{ scale: 1, opacity: 0.5 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ delay: 0.6, duration: 0.8, repeat: 2 }}
    />
  </motion.div>
);

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false); // We'll trigger this after verification if successful
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');

  // Get booking data from URL params
  const bookingRef = searchParams.get('bookingRef') || 'ALM-' + Date.now();
  const hotelName = searchParams.get('hotelName') || 'الفندق';

  // Get current date for payment date
  const today = new Date().toLocaleDateString('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get('id');
      const status = searchParams.get('status');
      
      if (paymentId) {
        setVerifying(true);
        try {
          const response = await apiService.payments.verify(paymentId);
          const data = response.data;
          
          if (response && response.success && response.data?.status === 'paid') {
            setPaymentStatus('success');
            setShowConfetti(true);
          } else {
            setPaymentStatus('failed');
            setErrorMessage(response.data?.message || 'عملية الدفع لم تكتمل بنجاح');
          }
        } catch (error) {
          console.error('Payment verification failed', error);
          setPaymentStatus('failed');
          setErrorMessage('فشل التحقق من حالة الدفع بسبب مشكلة في الاتصال.');
        } finally {
          setVerifying(false);
        }
      } else {
        // No payment ID, so it's a direct success (e.g. wallet or no payment required)
        setPaymentStatus('success');
        setShowConfetti(true);
      }
    };

    verifyPayment();

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleDownload = () => {
    // In production, this would generate a PDF
    alert('جاري تحميل قسيمة الحجز...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'تأكيد الحجز - الملحم للسفر',
        text: `تم حجز إقامتي بنجاح! رقم الحجز: ${bookingRef}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] to-white relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.05} x={Math.random() * 100} />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <Link to="/">
            <AlmulhemLogo className="h-14" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {verifying ? (
            <motion.div className="text-center mb-10 py-12">
              <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-[#071428] mb-2">جاري التحقق من عملية الدفع...</h2>
              <p className="text-slate-500">يرجى الانتظار لحين تأكيد الدفع من البنك المصدر للبطاقة.</p>
            </motion.div>
          ) : paymentStatus === 'success' ? (
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AnimatedCheckmark />

              <motion.h1
                className="text-3xl md:text-4xl font-bold text-[#071428] mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                تم الحجز بنجاح! 🎉
              </motion.h1>

              <motion.p
                className="text-lg text-slate-600 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                تهانينا! تم استلام طلب حجزك
                {hotelName && hotelName !== 'الفندق' && (
                  <> في <span className="font-bold text-[#071428]">{decodeURIComponent(hotelName)}</span></>
                )}
              </motion.p>

              <motion.p
                className="text-slate-700 font-medium flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <Mail className="w-4 h-4 text-[#C9A227]" />
                سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني
              </motion.p>
            </motion.div>
          ) : (
            <motion.div className="text-center mb-10 py-12">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#071428] mb-4">فشل عملية الدفع</h2>
              <p className="text-lg text-slate-600 mb-6">{errorMessage}</p>
              <Link to="/" className="inline-block bg-[#071428] text-white px-8 py-3 rounded-xl font-bold">العودة للرئيسية والمحاولة مجدداً</Link>
            </motion.div>
          )}

          {/* Booking Reference Card */}
          {paymentStatus === 'success' && !verifying && (
            <>
              <motion.div
                className="bg-[#071428] rounded-2xl p-6 mb-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
            <p className="text-white font-medium text-sm mb-2">رقم الحجز</p>
            <p className="text-3xl md:text-4xl font-mono font-bold text-[#C9A227] tracking-wider">
              #{bookingRef}
            </p>
            <p className="text-white/80 font-medium text-xs mt-2">احتفظ بهذا الرقم للرجوع إليه</p>
          </motion.div>

          {/* Info Card */}
          <motion.div
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            {/* Status */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#071428]">قيد المعالجة</h3>
                  <p className="text-sm text-slate-700 font-medium">سيتم تأكيد الحجز خلال 24 ساعة</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-6">
              <h4 className="font-semibold text-[#071428] mb-4">الخطوات التالية</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">تم استلام طلبك</p>
                    <p className="text-sm text-slate-700 font-medium">سنقوم بمراجعة تفاصيل الحجز</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">تأكيد بالبريد الإلكتروني</p>
                    <p className="text-sm text-slate-700 font-medium">ستصلك رسالة تأكيد خلال ساعات</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">تواصل من فريقنا</p>
                    <p className="text-sm text-slate-700 font-medium">قد نتواصل معك لتأكيد بعض التفاصيل</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Date */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 font-medium">تاريخ الطلب</span>
                <span className="font-semibold text-[#071428]">{today}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <a 
              href={`https://wa.me/966535727771?text=${encodeURIComponent(`تأكيد الطلب رقم ${bookingRef}`)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1"
            >
              <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg">
                <MessageCircle className="w-5 h-5" />
                تأكيد الحجز عبر واتساب (مهم)
              </button>
            </a>
            <Link to="/" className="flex-1">
              <button className="w-full bg-white border-2 border-[#071428] text-[#071428] hover:bg-[#071428] hover:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300">
                <Home className="w-5 h-5" />
                العودة للرئيسية
              </button>
            </Link>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            className="flex justify-center gap-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 text-slate-700 font-medium hover:text-[#071428] transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span className="text-sm">طباعة</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-700 font-medium hover:text-[#071428] transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">مشاركة</span>
            </button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-slate-700 font-medium text-sm mb-2">تحتاج مساعدة؟</p>
            <a
              href={`https://wa.me/966535727771?text=${encodeURIComponent(`تأكيد الطلب رقم ${bookingRef}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A227] hover:underline font-semibold"
            >
              تواصل معنا عبر واتساب
            </a>
            </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
