import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scale, BookOpen, CreditCard, XCircle, Stamp, AlertTriangle, FileCheck } from 'lucide-react';
import Footer from '../components/layout/Footer';

const sections = [
  { id: 'definitions', title: 'التعريفات', icon: BookOpen },
  { id: 'booking', title: 'الحجز والدفع', icon: CreditCard },
  { id: 'cancellation', title: 'سياسة الإلغاء', icon: XCircle },
  { id: 'visas', title: 'التأشيرات', icon: Stamp },
  { id: 'liability', title: 'المسؤولية', icon: AlertTriangle },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('definitions');
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 100;
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-header-offset">
      {/* Hero Header */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-[#071428]">
        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C9A227]/20 flex items-center justify-center"
          >
            <Scale className="w-10 h-10 text-[#C9A227]" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            الشروط والأحكام العامة
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white font-medium text-lg max-w-xl mx-auto"
          >
            ضوابط تقديم الخدمات وحقوق المسافرين
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-[#C9A227] mx-auto mt-6"
          />
        </div>
      </section>

      {/* Document Container */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="text-[20rem] font-serif text-[#C9A227]/[0.03] font-bold select-none">
              الملحم
            </div>
          </div>

          {/* Last Updated Badge */}
          <div className="absolute top-6 left-6 z-10">
            <span className="text-sm text-[#C9A227] font-medium bg-[#C9A227]/10 px-4 py-2 rounded-full">
              آخر تحديث: يناير 2025
            </span>
          </div>

          <div className="flex flex-col lg:flex-row relative">
            {/* Sidebar - Table of Contents */}
            <div className="lg:w-72 bg-[#fdfbf7] p-8 lg:sticky top-header-offset lg:h-fit">
              <h3 className="text-lg font-bold text-[#071428] mb-6 font-serif">
                فهرس المحتويات
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-300 relative ${
                        isActive
                          ? 'bg-white text-[#071428] font-bold shadow-md'
                          : 'text-slate-700 font-medium hover:bg-white/50'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#C9A227] rounded-full"
                        />
                      )}
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#C9A227]' : ''}`} />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 lg:p-12 relative">
              {/* Definitions */}
              <section
                ref={(el) => (sectionRefs.current['definitions'] = el)}
                id="definitions"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-[#C9A227]" />
                  التعريفات
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>في هذه الوثيقة، تُستخدم المصطلحات التالية بالمعاني المحددة أدناه:</p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>"الشركة" أو "نحن":</strong> شركة الملحم للسفر والسياحة، المسجلة في المملكة العربية السعودية.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>"العميل" أو "المسافر":</strong> الشخص الطبيعي أو الاعتباري الذي يتعاقد مع الشركة للحصول على خدمات السفر.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>"الباقة السياحية":</strong> مجموعة الخدمات المتكاملة التي تشمل الطيران والإقامة والجولات.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>"الحجز":</strong> الاتفاق المبرم بين الشركة والعميل لتقديم خدمات سفر محددة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>"القوة القاهرة":</strong> أي حدث خارج عن السيطرة المعقولة يمنع تنفيذ الالتزامات.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Booking & Payment */}
              <section
                ref={(el) => (sectionRefs.current['booking'] = el)}
                id="booking"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-[#C9A227]" />
                  الحجز والدفع
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>تخضع جميع الحجوزات للشروط التالية:</p>
                  
                  <div className="bg-amber-50/70 border-r-4 border-[#C9A227] p-4 rounded-lg my-4">
                    <p className="font-semibold text-[#071428]">
                      ⚠️ هام: يُعتبر الحجز مؤكداً فقط بعد استلام الدفعة الأولى وإصدار تأكيد الحجز الرسمي.
                    </p>
                  </div>

                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>الدفعة الأولى:</strong> يجب دفع 30% من إجمالي قيمة الباقة عند الحجز كعربون.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>الدفعة النهائية:</strong> يجب سداد المبلغ المتبقي قبل 14 يوماً من تاريخ السفر.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>طرق الدفع:</strong> نقبل التحويل البنكي، البطاقات الائتمانية، ومدى.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>الأسعار:</strong> جميع الأسعار بالريال السعودي وقابلة للتغيير حتى تأكيد الحجز.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Cancellation Policy - Prominent */}
              <section
                ref={(el) => (sectionRefs.current['cancellation'] = el)}
                id="cancellation"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-[#C9A227]" />
                  سياسة الإلغاء والاسترداد
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                
                <div className="bg-amber-50/70 border-2 border-[#C9A227]/30 p-6 rounded-2xl mb-6">
                  <h3 className="font-bold text-[#071428] text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    تنبيه مهم - يرجى القراءة بعناية
                  </h3>
                  <p className="text-slate-700">
                    تختلف رسوم الإلغاء حسب توقيت الإلغاء ونوع الخدمات المحجوزة. بعض الخدمات قد تكون غير قابلة للاسترداد.
                  </p>
                </div>

                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p><strong>جدول رسوم الإلغاء:</strong></p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#071428] text-white">
                          <th className="p-4 text-right font-serif">توقيت الإلغاء</th>
                          <th className="p-4 text-right font-serif">رسوم الإلغاء</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-4">أكثر من 30 يوماً قبل السفر</td>
                          <td className="p-4">10% من قيمة الحجز</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-4">من 15 إلى 30 يوماً</td>
                          <td className="p-4">25% من قيمة الحجز</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-4">من 7 إلى 14 يوماً</td>
                          <td className="p-4">50% من قيمة الحجز</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-4">أقل من 7 أيام</td>
                          <td className="p-4">75% من قيمة الحجز</td>
                        </tr>
                        <tr className="bg-red-50">
                          <td className="p-4 font-semibold text-red-700">عدم الحضور (No Show)</td>
                          <td className="p-4 font-semibold text-red-700">100% - لا استرداد</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50/70 border-r-4 border-[#C9A227] p-4 rounded-lg my-4">
                    <p className="font-semibold text-[#071428]">
                      ⚠️ ملاحظة: تذاكر الطيران الخاصة والعروض الموسمية قد تكون غير قابلة للاسترداد بالكامل.
                    </p>
                  </div>
                </div>
              </section>

              {/* Visas */}
              <section
                ref={(el) => (sectionRefs.current['visas'] = el)}
                id="visas"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <Stamp className="w-8 h-8 text-[#C9A227]" />
                  التأشيرات ووثائق السفر
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>يتحمل العميل المسؤولية الكاملة عن:</p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>صلاحية جواز السفر:</strong> يجب أن يكون ساري المفعول لمدة 6 أشهر على الأقل من تاريخ السفر.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>الحصول على التأشيرات:</strong> نساعد في تقديم الطلبات لكن القرار النهائي للسفارة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>رفض التأشيرة:</strong> في حال الرفض، تُطبق سياسة الإلغاء العادية مع خصم رسوم التأشيرة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>التطعيمات:</strong> العميل مسؤول عن الحصول على التطعيمات المطلوبة للوجهة.</span>
                    </li>
                  </ul>

                  <div className="bg-amber-50/70 border-r-4 border-[#C9A227] p-4 rounded-lg my-4">
                    <p className="font-semibold text-[#071428]">
                      ⚠️ تنبيه: رسوم التأشيرة غير قابلة للاسترداد في جميع الحالات.
                    </p>
                  </div>
                </div>
              </section>

              {/* Liability */}
              <section
                ref={(el) => (sectionRefs.current['liability'] = el)}
                id="liability"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-[#C9A227]" />
                  حدود المسؤولية
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>تحدد مسؤولية الشركة وفقاً للآتي:</p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>مقدمو الخدمات:</strong> نعمل كوسيط بينكم وبين شركات الطيران والفنادق، ولا نتحمل مسؤولية أخطائهم.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>القوة القاهرة:</strong> لا نتحمل مسؤولية الإلغاء بسبب الكوارث الطبيعية أو الأوبئة أو الحروب.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>الأمتعة:</strong> لا نتحمل مسؤولية فقدان أو تلف الأمتعة الشخصية.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>التأمين:</strong> ننصح بشدة بالحصول على تأمين سفر شامل.</span>
                    </li>
                  </ul>
                  <p>
                    في جميع الأحوال، لا تتجاوز مسؤولية الشركة قيمة الخدمات المدفوعة.
                  </p>
                </div>
              </section>

              {/* Acceptance Section */}
              <section className="mb-8">
                <div className="bg-[#071428] rounded-2xl p-8 text-center">
                  <FileCheck className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-white mb-4">
                    إقرار بالموافقة
                  </h3>
                  <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
                    باستخدامكم لخدمات شركة الملحم للسفر والسياحة أو إتمام أي حجز، فإنكم تُقرون بأنكم قد قرأتم وفهمتم ووافقتم على جميع الشروط والأحكام المذكورة أعلاه.
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-[#C9A227] font-serif text-lg">
                      شركة الملحم للسفر والسياحة
                    </p>
                    <p className="text-white/90 font-medium text-sm mt-1">
                      المملكة العربية السعودية - الهفوف والمبرز
                    </p>
                  </div>
                </div>
              </section>

              {/* Official Seal */}
              <div className="flex justify-center pt-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full border-4 border-[#C9A227] flex items-center justify-center bg-gradient-to-br from-[#C9A227]/10 to-[#C9A227]/5">
                    <div className="text-center">
                      <Scale className="w-10 h-10 text-[#C9A227] mx-auto mb-1" />
                      <span className="text-xs font-bold text-[#C9A227] block">ملزم قانونياً</span>
                      <span className="text-[10px] text-[#071428]">LEGALLY BINDING</span>
                    </div>
                  </div>
                  {/* Decorative Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9A227]/30 animate-spin" style={{ animationDuration: '20s' }} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
