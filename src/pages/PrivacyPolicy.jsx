import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Database, Eye, UserCheck, Mail } from 'lucide-react';
import Footer from '../components/layout/Footer';

const sections = [
  { id: 'intro', title: 'المقدمة', icon: ShieldCheck },
  { id: 'collection', title: 'جمع البيانات', icon: Database },
  { id: 'usage', title: 'الاستخدام', icon: Eye },
  { id: 'security', title: 'الأمان', icon: Lock },
  { id: 'rights', title: 'حقوقك', icon: UserCheck },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');
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
            <ShieldCheck className="w-10 h-10 text-[#C9A227]" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            سياسة الخصوصية
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white font-medium text-lg max-w-xl mx-auto"
          >
            التزامنا بحماية خصوصيتكم جزء لا يتجزأ من عراقتنا
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
              {/* Introduction */}
              <section
                ref={(el) => (sectionRefs.current['intro'] = el)}
                id="intro"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#C9A227]" />
                  المقدمة
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>
                    مرحباً بكم في شركة الملحم للسفر والسياحة. نحن نقدر ثقتكم الغالية ونلتزم بحماية خصوصيتكم وبياناتكم الشخصية بأعلى معايير الأمان والسرية.
                  </p>
                  <p>
                    تُوضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتكم الشخصية عند استخدام خدماتنا. نحن ملتزمون بالامتثال لجميع القوانين واللوائح المعمول بها في المملكة العربية السعودية فيما يتعلق بحماية البيانات.
                  </p>
                  <p>
                    باستخدامكم لخدماتنا، فإنكم توافقون على الممارسات الموضحة في هذه السياسة. نوصي بقراءة هذه الوثيقة بعناية لفهم حقوقكم والتزاماتنا.
                  </p>
                </div>
              </section>

              {/* Data Collection */}
              <section
                ref={(el) => (sectionRefs.current['collection'] = el)}
                id="collection"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <Database className="w-8 h-8 text-[#C9A227]" />
                  جمع البيانات
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>نقوم بجمع المعلومات التالية لتقديم خدماتنا بأفضل صورة ممكنة:</p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>المعلومات الشخصية:</strong> الاسم الكامل، تاريخ الميلاد، الجنسية، ورقم الهوية الوطنية أو جواز السفر.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>معلومات الاتصال:</strong> رقم الهاتف، البريد الإلكتروني، والعنوان البريدي.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>معلومات السفر:</strong> تفضيلات السفر، الوجهات المفضلة، وتاريخ الحجوزات السابقة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>معلومات الدفع:</strong> تفاصيل البطاقة الائتمانية (مشفرة) لإتمام عمليات الحجز.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Usage */}
              <section
                ref={(el) => (sectionRefs.current['usage'] = el)}
                id="usage"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <Eye className="w-8 h-8 text-[#C9A227]" />
                  استخدام البيانات
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>نستخدم بياناتكم الشخصية للأغراض التالية:</p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>إتمام الحجوزات:</strong> حجز تذاكر الطيران، الفنادق، والجولات السياحية.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>إصدار التأشيرات:</strong> تقديم طلبات التأشيرات نيابة عنكم للسفارات والقنصليات.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>التواصل:</strong> إرسال تأكيدات الحجز، التحديثات، والعروض الخاصة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>تحسين الخدمات:</strong> تحليل تفضيلاتكم لتقديم عروض مخصصة تناسب احتياجاتكم.</span>
                    </li>
                  </ul>
                  <p>
                    نؤكد أننا لا نبيع أو نشارك بياناتكم الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتكم الصريحة.
                  </p>
                </div>
              </section>

              {/* Security */}
              <section
                ref={(el) => (sectionRefs.current['security'] = el)}
                id="security"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <Lock className="w-8 h-8 text-[#C9A227]" />
                  أمان البيانات
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>
                    نتخذ إجراءات أمنية صارمة لحماية بياناتكم الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف:
                  </p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>تشفير SSL:</strong> جميع البيانات المنقولة عبر موقعنا مشفرة باستخدام بروتوكول SSL 256-bit.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>خوادم آمنة:</strong> نستخدم خوادم محمية بجدران حماية متقدمة ومراقبة على مدار الساعة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>وصول محدود:</strong> فقط الموظفون المخولون يمكنهم الوصول إلى بياناتكم الشخصية.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>معايير PCI DSS:</strong> نلتزم بمعايير أمان بيانات صناعة بطاقات الدفع.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Rights */}
              <section
                ref={(el) => (sectionRefs.current['rights'] = el)}
                id="rights"
                className="mb-16"
              >
                <h2 className="text-3xl font-serif font-bold text-[#071428] mb-6 flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-[#C9A227]" />
                  حقوقكم
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mb-6" />
                <div className="text-slate-600 leading-loose text-justify space-y-4">
                  <p>لديكم الحقوق التالية فيما يتعلق ببياناتكم الشخصية:</p>
                  <ul className="list-none space-y-3 pr-4">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>حق الوصول:</strong> طلب نسخة من بياناتكم الشخصية المحفوظة لدينا.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>حق التصحيح:</strong> تحديث أو تصحيح أي معلومات غير دقيقة.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>حق الحذف:</strong> طلب حذف بياناتكم الشخصية (مع مراعاة المتطلبات القانونية).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>حق الاعتراض:</strong> الاعتراض على معالجة بياناتكم لأغراض تسويقية.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mb-8">
                <div className="bg-[#fdfbf7] rounded-2xl p-8 border border-[#C9A227]/20">
                  <h3 className="text-xl font-serif font-bold text-[#071428] mb-4 flex items-center gap-3">
                    <Mail className="w-6 h-6 text-[#C9A227]" />
                    للتواصل مع القسم القانوني
                  </h3>
                  <p className="text-slate-600 mb-4">
                    لأي استفسارات تتعلق بسياسة الخصوصية أو لممارسة حقوقكم، يرجى التواصل معنا:
                  </p>
                  <a 
                    href="mailto:legal@almulhimtravel.com" 
                    className="inline-flex items-center gap-2 text-[#C9A227] font-semibold hover:underline"
                  >
                    <Mail className="w-5 h-5" />
                    legal@almulhimtravel.com
                  </a>
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
                      <ShieldCheck className="w-10 h-10 text-[#C9A227] mx-auto mb-1" />
                      <span className="text-xs font-bold text-[#C9A227] block">معتمد</span>
                      <span className="text-[10px] text-[#071428]">AUTHORIZED</span>
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

export default PrivacyPolicy;
