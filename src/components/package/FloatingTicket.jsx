import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, X, Phone, Mail, User, MessageCircle, Users, Calendar, Hotel } from 'lucide-react';
import toast from 'react-hot-toast';

const FloatingTicket = ({ price, currency, title }) => {
  const ENABLE_FULL_WIDTH_BOTTOM_BAR_MOBILE = true;

  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    adults: '2',
    children: '0',
    travelDate: '',
    flightStatus: 'لم يتم الحجز بعد',
    hotelPref: '4 نجوم',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const whatsappNumber = '966535727771';
    const travelersText = `${formData.adults || 1} بالغين${parseInt(formData.children) > 0 ? ` + ${formData.children} أطفال` : ''}`;
    
    const msg = `مرحباً، أود طلب حجز الباقة التالية:
*الباقة*: ${title}
*السعر*: ${price.toLocaleString()} ${currency}

*بياناتي:*
- الاسم: ${formData.name}
- الجوال: ${formData.phone}
${formData.email ? `- الإيميل: ${formData.email}\n` : ''}- عدد المسافرين: ${travelersText}
- تاريخ السفر: ${formData.travelDate || 'غير محدد'}
- حالة الطيران: ${formData.flightStatus}
- تفضيلات الفنادق: ${formData.hotelPref}
- ملاحظات: ${formData.message || 'لا توجد ملاحظات'}

أرجو التواصل معي لإتمام الحجز. شكراً.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('تم تحويلك للواتساب لإتمام الحجز ✈️');
    
    setIsExpanded(false);
    setFormData({ 
      name: '', 
      phone: '', 
      email: '', 
      adults: '2', 
      children: '0', 
      travelDate: '', 
      flightStatus: 'لم يتم الحجز بعد', 
      hotelPref: '4 نجوم', 
      message: '' 
    });
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Ticket */}
      <motion.div
        className={
          ENABLE_FULL_WIDTH_BOTTOM_BAR_MOBILE
            ? "fixed bottom-3 right-4 w-[230px] md:bottom-6 md:right-6 md:w-auto z-50"
            : "fixed bottom-3 right-3 md:bottom-6 md:right-6 z-50"
        }
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="ticket"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-[#071428] shadow-2xl cursor-pointer hover:scale-[1.02] md:hover:scale-105 transition-transform ${
                ENABLE_FULL_WIDTH_BOTTOM_BAR_MOBILE
                  ? "w-full rounded-full border border-[#C9A227]/30 py-1.5 px-3 md:rounded-xl md:p-2.5"
                  : "rounded-lg md:rounded-xl p-2 md:p-2.5"
              }`}
              onClick={() => setIsExpanded(true)}
              style={{
                background: 'linear-gradient(135deg, #071428 0%, #071428 100%)',
              }}
            >
              {/* Boarding Pass Style */}
              <div className="flex items-center justify-between md:justify-start md:gap-3 w-full">
                {/* Left Section */}
                <div className="hidden md:block border-l border-dashed border-white/30 pr-2 md:pr-3">
                  <Plane className="w-4 h-4 md:w-5 md:h-5 text-[#C9A227] rotate-45" />
                </div>

                {/* Right Section / Mobile content */}
                <div className="flex items-center justify-between w-full md:block md:w-auto md:text-right">
                  <div className="text-right select-none">
                    <p className="text-[#C9A227] text-xs font-bold leading-tight">
                      {price.toLocaleString()} {currency}
                    </p>
                    <p className="text-white/60 text-[8px] leading-none">السعر</p>
                  </div>
                  <button className="bg-[#C9A227] hover:bg-[#b08e22] text-[#071428] !px-3.5 !py-1 !rounded-full text-[10px] font-black tracking-wide shadow-md transition-colors duration-200 md:btn-primary md:!px-3 md:!py-1 md:!rounded-lg md:text-[11px] md:mt-1">
                    احجز الآن
                  </button>
                </div>
              </div>

              {/* Decorative Circles - Hidden on mobile */}
              <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full" />
              <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full" />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] overflow-y-auto mx-auto mb-4 md:mb-0 text-slate-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">احجز رحلتك</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Package Info */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-5">
                <p className="text-slate-500 font-medium text-xs">الباقة المختارة</p>
                <p className="font-bold text-slate-800 text-sm md:text-base leading-snug">{title}</p>
                <p className="text-[#C9A227] font-bold text-base mt-1">
                  {price.toLocaleString()} {currency}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-right" dir="rtl">
                {/* Personal Info */}
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="رقم الجوال"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pr-9 pl-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني (اختياري)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-9 pl-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>
                </div>

                {/* Qualifying Details Section Header */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 mb-2.5">تفاصيل الحجز والرحلة 🧳:</p>
                </div>

                {/* Travelers Count Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">عدد البالغين (12+ سنة)</label>
                    <select
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="1">شخص واحد (1)</option>
                      <option value="2">شخصين (2)</option>
                      <option value="3">3 أشخاص</option>
                      <option value="4">4 أشخاص</option>
                      <option value="5">5+ أشخاص</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">عدد الأطفال (تحت 12)</label>
                    <select
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="0">بدون أطفال</option>
                      <option value="1">طفل واحد</option>
                      <option value="2">طفلان</option>
                      <option value="3">3 أطفال+</option>
                    </select>
                  </div>
                </div>

                {/* Travel Date */}
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="تاريخ السفر المتوقع (مثال: أغسطس / سبتمبر)"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full pr-9 pl-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                {/* Flight & Hotel Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">حالة تذاكر الطيران</label>
                    <select
                      value={formData.flightStatus}
                      onChange={(e) => setFormData({ ...formData, flightStatus: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="لم يتم الحجز بعد">لم يتم الحجز بعد</option>
                      <option value="محجوز مسبقاً">محجوز مسبقاً</option>
                      <option value="أرغب في حجز الطيران معكم">أرغب في حجز الطيران معكم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">تفضيل الفنادق</label>
                    <select
                      value={formData.hotelPref}
                      onChange={(e) => setFormData({ ...formData, hotelPref: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="4 نجوم">4 نجوم (ممتازة)</option>
                      <option value="5 نجوم">5 نجوم (فاخرة)</option>
                      <option value="حسب ترشيح الشركة">حسب ترشيح الشركة</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="relative">
                  <MessageCircle className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    placeholder="ملاحظات أو طلبات خاصة (مثلاً: شهر عسل، كوخ خاص...)"
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pr-9 pl-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-sm font-bold shadow-lg mt-2"
                >
                  إرسال طلب الحجز للواتساب ✈️
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default FloatingTicket;
