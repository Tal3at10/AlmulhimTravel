import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, Shield, Star, Phone, MapPin, Users, Calendar, Download, Sparkles } from 'lucide-react';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';
import { getOptimizedImageUrl } from '../utils/image';

const features = [
  { icon: Clock, title: 'التزام تام بالمواعيد', description: 'تتبع مباشر للرحلات الجوية لضمان الاستقبال فور الهبوط.' },
  { icon: Shield, title: 'أعلى معايير الأمان', description: 'أسطول سيارات حديث مؤمن بالكامل يخضع للفحص الدوري.' },
  { icon: Star, title: 'سائقون محترفون', description: 'سائقون ذوو كفاءة عالية بمعرفة تامة بالمسارات يرتدون الزي الرسمي.' },
  { icon: Sparkles, title: 'مزايا كبار الشخصيات', description: 'مياه باردة، مناديل معطرة، إنترنت مجاني، ومساعد استقبال الصالة.' }
];

const services = [
  {
    icon: MapPin,
    title: 'الاستقبال والتوصيل من وإلى المطار',
    description: 'نغطي كافة المطارات الإقليمية والدولية بالمملكة، ونضمن ترحيباً راقياً بلافتة تحمل اسمك فور الخروج.'
  },
  {
    icon: Car,
    title: 'توصيل الفنادق والمنتجعات',
    description: 'انتقال مباشر وخاص من المطار إلى مقر إقامتك بأعلى درجات الخصوصية والراحة دون أي عناء.'
  },
  {
    icon: Calendar,
    title: 'جولات سياحية وسائق خاص يومي',
    description: 'سيارة فاخرة مع سائق خاص تحت تصرفك طوال اليوم لاستكشاف المعالم السياحية أو إنجاز الأعمال.'
  },
  {
    icon: Users,
    title: 'النقل العائلي والوفود الرسمية',
    description: 'حلول نقل متكاملة للعائلات الكبيرة ووفود الشركات بسيارات وحافلات حديثة تتسع لكافة الحقائب.'
  }
];

const steps = [
  { 
    number: '٠١', 
    title: 'الحجز الفوري والتواصل', 
    description: 'تواصل معنا عبر الواتساب وحدد تفاصيل رحلتك، موعد الهبوط، ونوع السيارة المطلوبة.'
  },
  { 
    number: '٠٢', 
    title: 'تأكيد الحجز وجدولة السائق', 
    description: 'نرسل لك تفاصيل السائق، لوحة السيارة، وموقع الاستقبال بدقة قبل موعد الرحلة.'
  },
  { 
    number: '٠٣', 
    title: 'الترحيب والمساعدة بالحقائب', 
    description: 'ينتظرك السائق عند الصالة بلافتة خاصة، ويساعدك في تنظيم وتحميل الحقائب للسيارة.'
  },
  { 
    number: '٠٤', 
    title: 'انطلاق الرحلة الفاخرة', 
    description: 'استرخ في مقصورة سيارتك المجهزة بالكامل واستمتع برحلة هادئة وسلسة لوجهتك.'
  }
];

const vehicles = [
  {
    name: 'فئة كبار الشخصيات (VIP Sedan)',
    models: 'مرسيدس اليخت (S-Class) / كاديلاك (CT6)',
    capacity: '٣ ركاب بحد أقصى',
    luggage: '٣ حقائب سفر كبيرة',
    price: 'حسب الطلب والمسار',
    features: ['سائق بلباس رسمي يتحدث لغات متعددة', 'مساعد استقبال خاص وتوفير عربات حقائب', 'إنترنت لاسلكي مجاني فائق السرعة', 'مياه معدنية باردة ومشروبات ترحيبية', 'شواحن هواتف ذكية لكافة الأجهزة'],
    whatsappMsg: 'مرحباً، أود استئجار سيارة VIP Sedan فاخرة (مرسيدس اليخت أو كاديلاك) لتوصيل المطار. الرجاء تأكيد التوفر والتسعير.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
  },
  {
    name: 'الفئة العائلية الممتازة (Premium SUV)',
    models: 'جي إم سي يوكون (Yukon Denali) / شيفروليه ترافيرس',
    capacity: '٦ ركاب بحد أقصى',
    luggage: '٥ حقائب سفر كبيرة',
    price: 'حسب الطلب والمسار',
    features: ['مساحة داخلية رحبة للغاية ومقاعد مريحة', 'تكييف هواء خلفي مستقل متعدد المناطق', 'أنظمة ترفيه وشاشات عرض للمقاعد الخلفية', 'مثالية للعائلات والرحلات الطويلة بالحقائب', 'منافذ شحن مخصصة لجميع الركاب'],
    whatsappMsg: 'مرحباً، أود استئجار سيارة عائلية فاخرة Premium SUV (يوكون أو ترافيرس) لتوصيل المطار. الرجاء تأكيد التوفر والتسعير.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
  },
  {
    name: 'فئة رجال الأعمال والمجموعات (Luxury Van)',
    models: 'مرسيدس فيانو (V-Class) / هيونداي ستاريا',
    capacity: '٨ ركاب بحد أقصى',
    luggage: '٨ حقائب سفر كبيرة',
    price: 'حسب الطلب والمسار',
    features: ['مقصورة اجتماعات ذكية بمقاعد متقابلة', 'طاولات جانبية قابلة للطي ومضاءة', 'أبواب كهربائية منزلقة لسهولة الركوب', 'سعة تخزين فائقة للحقائب الكبيرة', 'تكييف هوائي مركزي لكافة المقاعد'],
    whatsappMsg: 'مرحباً، أود استئجار حافلة / فان فاخر Luxury Van (مرسيدس V-Class) لتوصيل المطار. الرجاء تأكيد التوفر والتسعير.',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&q=80'
  }
];

const AirportTransfers = () => {
  const handleDownloadPDF = () => {
    window.open('https://almulhimtravel.com/assets/bot_images/transfer_prices.png', '_blank');
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-right" dir="rtl">
      <SEO
        title="خدمات النقل الفاخر والاستقبال VIP - الملحم للسفر والسياحة"
        description="ارتقِ بتجربة سفرك مع خدمة الاستقبال والنقل الملكي الفاخر من وإلى جميع مطارات المملكة. أسطول من أحدث السيارات الفاخرة وسائقين محترفين."
        keywords="انتقالات المطار الفاخرة, سيارة مع سائق مرسيدس, استقبال مطار الرياض, حجز توصيل المطار, الملحم كونسييرج"
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] lg:min-h-[55vh] flex items-center justify-center overflow-hidden bg-[#071428]">
        <div className="absolute inset-0">
          <img
            src={getOptimizedImageUrl('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80', 1920, 75)}
            alt="VIP Airport Transfer Service"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-[#071428]/80 to-[#071428]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center pt-36 md:pt-48 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full mx-auto px-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#C9A227]/25 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-[#C9A227]/40 shadow-lg shadow-amber-500/5 animate-pulse">
              <Sparkles className="w-5 h-5 text-[#C9A227]" />
              <span className="text-[#C9A227] font-black text-xs md:text-sm tracking-wider uppercase">الملحم كونسييرج والخدمات الفاخرة</span>
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif text-center text-balance max-w-4xl mx-auto leading-tight"
            >
              خدمات الاستقبال والنقل الفاخر
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-10 leading-relaxed font-semibold max-w-2xl mx-auto px-4">
              نقل فاخر وسلس يغطي كافة مناطق المملكة على مدار الساعة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/966502447741?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D9%86%D9%82%D9%84%20%D8%A7%D9%84%D9%81%D8%A7%D8%AE%D8%B1%20%D9%88%D8%AD%D8%AC%D8%B2%20%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%85%D8%B9%20%D8%B3%D8%A7%D8%A6%D9%82"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#C9A227] to-[#DFBA44] text-[#071428] hover:scale-105 px-8 py-4 rounded-2xl font-black text-sm md:text-base transition-all duration-300 shadow-xl shadow-amber-500/10 cursor-pointer"
              >
                <Phone className="w-5 h-5" />
                طلب حجز فوري VIP
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-white relative z-10 -mt-10 rounded-t-[40px] shadow-2xl border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#fdfbf7]/50 p-6 rounded-2xl border border-slate-100 hover:border-[#C9A227]/30 hover:bg-white shadow-sm hover:shadow-md transition-all duration-500 text-center group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#071428]/5 text-[#C9A227] mb-4 group-hover:bg-[#071428] group-hover:text-[#C9A227] transition-all duration-500 shadow-inner">
                    <IconComponent className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-serif font-black text-[#071428] mb-2 text-base md:text-lg">{feature.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-gradient-to-b from-[#fdfbf7] to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C9A227] text-xs font-black tracking-widest uppercase mb-2 block">باقة خدماتنا الراقية</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#071428] mb-4 font-serif">
              مفهوم جديد للانتقالات والترحاب
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#C9A227] to-[#DFBA44] mx-auto mb-4 rounded-full" />
            <p className="text-slate-600 text-sm md:text-base font-semibold max-w-2xl mx-auto">
              نصمم لكم رحلات تنقل خالية تماماً من الإجهاد، تجمع بين الخصوصية والرفاهية العالية في كل خطوة.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 text-right group border border-slate-100/80"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#C9A227]/10 text-[#C9A227] mb-6 group-hover:bg-[#071428] group-hover:text-white transition-all duration-500">
                    <IconComponent className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-[#071428] mb-3 group-hover:text-[#C9A227] transition-colors">{service.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Step by Step Timeline */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C9A227] text-xs font-black tracking-widest uppercase mb-2 block">خطة الخطوات الأربعة</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#071428] mb-4 font-serif">
              كيف تجري رحلة نقلكم الفاخرة؟
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#C9A227] to-[#DFBA44] mx-auto mb-4 rounded-full" />
            <p className="text-slate-500 text-sm font-semibold max-w-xl mx-auto">
              خطوات يسيرة ومحكمة تضمن لكم السكينة التامة والرفاهية المطلقة في كل لحظة.
            </p>
          </motion.div>

          <div className="relative">
            {/* Center line for timeline on desktop */}
            <div className="hidden lg:block absolute right-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#C9A227]/40 via-[#071428]/10 to-transparent translate-x-1/2" />

            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative ${
                    idx % 2 === 0 ? '' : 'lg:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                >
                  {/* Step card */}
                  <div className="w-full lg:w-1/2 bg-[#fdfbf7] p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#071428] text-[#C9A227] text-xl font-serif font-black flex items-center justify-center shadow-lg shadow-[#071428]/10">
                        {step.number}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-[#071428]">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{step.description}</p>
                  </div>

                  {/* Bullet center marker */}
                  <div className="hidden lg:flex absolute right-1/2 w-8 h-8 rounded-full bg-[#071428] border-4 border-white shadow-xl translate-x-1/2 items-center justify-center text-[10px] text-[#C9A227] font-serif font-bold">
                    {step.number}
                  </div>

                  {/* Empty column to balance grid */}
                  <div className="hidden lg:block w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Official Schedule Table with Golden Frame */}
      <section className="py-24 bg-gradient-to-b from-white to-[#fdfbf7]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#C9A227] text-xs font-black tracking-widest uppercase mb-2 block">دليل مسارات النقل</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#071428] mb-4 font-serif">
              طلب تسعير فوري ومسارات التوصيل
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#C9A227] to-[#DFBA44] mx-auto mb-4 rounded-full" />
            <p className="text-slate-500 text-sm md:text-base font-semibold max-w-xl mx-auto">
              جدول رسمي يوضح مسارات الانتقال والتوصيل المتاحة؛ تواصل معنا لتحديد تسعيرتك المخصصة فوراً.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Royal Golden Double Frame Design */}
            <div className="relative bg-[#071428] p-4 md:p-8 rounded-[36px] shadow-2xl border-4 border-double border-[#C9A227]/60 overflow-hidden">
              {/* Gold corners */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-[3px] border-l-[3px] border-[#C9A227] rounded-tl-lg"></div>
              <div className="absolute top-3 right-3 w-10 h-10 border-t-[3px] border-r-[3px] border-[#C9A227] rounded-tr-lg"></div>
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-[3px] border-l-[3px] border-[#C9A227] rounded-bl-lg"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-[3px] border-r-[3px] border-[#C9A227] rounded-br-lg"></div>
              
              <div className="bg-[#fdfbf7] p-4 md:p-6 rounded-[24px] border border-[#C9A227]/25 relative">

                {/* Premium header inside */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#C9A227]/20 pb-4 mb-6 gap-4 text-center sm:text-right">
                  <div>
                    <h4 className="font-serif font-black text-[#071428] text-base md:text-lg">الملحم لخدمات النقل - قائمة الأسعار الرسمية</h4>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">تطبق شروط الحجز وسياسة الإلغاء والجدولة</p>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center gap-2 bg-[#071428] hover:bg-[#122846] text-[#C9A227] px-4 py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer self-center"
                  >
                    <Download className="w-4 h-4" />
                    عرض بدقة كاملة
                  </button>
                </div>
                
                {/* Image table with double borders */}
                <div className="relative overflow-hidden rounded-xl border-2 border-[#071428]/10 group">
                  <img
                    src="https://almulhimtravel.com/assets/bot_images/transfer_prices.png"
                    alt="جدول تعرفة خدمات النقل بالملحم"
                    className="w-full h-auto object-cover"
                  />
                  {/* Glowing hover state */}
                  <div className="absolute inset-0 bg-[#071428]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Quick Pricing Note */}
            <p className="text-center text-slate-400 text-[10px] md:text-xs font-bold mt-4">
              * الأسعار المذكورة خاضعة للتحديثات الموسمية، يرجى الاستعلام وتأكيد الحجز للحصول على القيمة النهائية.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Royal VIP Booking Callout */}
      <section className="py-24 bg-[#071428] bg-gradient-to-br from-[#071428] via-[#122846] to-[#071428] relative text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-[#C9A227] text-xs font-black tracking-widest uppercase block">مستشار الترحيب والاستقبال الفاخر</span>
            <h2 className="text-2xl md:text-4xl font-bold font-serif leading-tight">
              هل أنت جاهز لتجربة سفر مفعمة بالفخامة؟
            </h2>
            <p className="text-slate-300 text-xs md:text-base font-medium leading-relaxed max-w-xl mx-auto">
              تواصل مع الموظف المختص بخدمات الكونسيرج والنقل بالملحم فوراً عبر الواتساب لتأكيد مواعيد رحلتك واختيار سيارتك المفضلة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="https://wa.me/966535727771?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%85%D8%B9%20%D8%B3%D8%A7%D8%A6%D9%82%20%D9%84%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D8%A7%D9%84%D9%85%D8%B7%D8%A7%D8%B1%D9%8A"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-lg cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                طلب الحجز واتساب مباشر
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AirportTransfers;