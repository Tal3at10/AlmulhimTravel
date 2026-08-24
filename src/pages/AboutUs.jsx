import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Award, 
  Target, 
  ShieldCheck, 
  Star, 
  Heart, 
  Handshake, 
  Download, 
  MapPin, 
  Calendar,
  Sparkles,
  Plane,
  BadgeCheck
} from 'lucide-react';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';

// Floating Gold Particles Component
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#C9A227]/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// Animated Gold Line
function AnimatedGoldLine({ className = "" }) {
  return (
    <motion.div
      className={`h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent ${className}`}
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: "100%", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  );
}

// 1. Hero Banner Component
function AboutHeroSection() {
  return (
    <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center bg-[#071428] overflow-hidden">
      {/* Background with Ken Burns zoom-out effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/moscow-hero.jpg")'
        }}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071428]/90 via-[#071428]/60 to-[#071428]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#C9A227]/15 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-[#C9A227]/30"
        >
          <Building2 className="w-4 h-4 text-[#C9A227]" />
          <span className="text-[#C9A227] text-xs font-bold">عن الملحم للسفر والسياحة</span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-black text-white mb-4 font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          قصتنا ومسيرتنا
        </motion.h1>
        
        <motion.p
          className="text-slate-300 text-lg md:text-xl font-medium max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          ضيافتك الفاخرة الممتدة منذ عام 1993
        </motion.p>
      </div>
    </section>
  );
}

// 2. About Story Section
function AboutSection() {
  return (
    <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
      <GoldParticles />

      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(180,139,62,0.15)] border-t-4 border-[#C9A227] p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Corner */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#C9A227]/10 to-transparent rounded-tl-full pointer-events-none" />

          <div className="grid lg:grid-cols-1 gap-8 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#071428] font-serif mb-3">
                قصة الملحم: من رؤية طموحة إلى واقع ملموس
              </h2>
              <motion.div
                className="w-20 h-1 bg-[#C9A227] mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              />

              <div className="text-[#334155] leading-relaxed md:leading-loose text-base md:text-lg space-y-4 md:space-y-6 font-medium">
                <p>
                  بدأت الحكاية في عام <span className="text-[#C9A227] font-bold">1993</span>، في وقت كان فيه قطاع السفر يحتاج إلى بوصلة تجمع بين الالتزام بالتقاليد المهنية وبين الانفتاح على العالم. انطلقنا بإيمان عميق بأن السفر ليس مجرد انتقال من نقطة إلى أخرى، بل هو رحلة تستحق أن تُنظم بأعلى <span className="text-[#C9A227] font-bold">معايير الدقة</span>.
                </p>
                <p>
                  عبر ثلاثة عقود، مرت "<span className="text-[#C9A227] font-bold">الملحم للسفر والسياحة</span>" بتحولات جوهرية؛ بدأنا بتقديم خدمات شخصية ومباشرة، وتطورنا لنصبح اليوم مؤسسة رقمية متكاملة. لم يكن الطريق مفروشاً بالورود، بل كان رحلة مستمرة من التعلم والتطوير. تجاوزنا التحديات بفضل التركيز على "<span className="text-[#C9A227] font-bold">إرضاء العميل</span>" كأولوية قصوى، وهو المبدأ الذي لا نزال نتمسك به.
                </p>
                <p>
                  اليوم، وبينما نقف على أعتاب مرحلة جديدة كلياً في قطاع الأعمال، نحمل معنا <span className="text-[#C9A227] font-bold">خبرة 30 عاماً</span>، ونضيف إليها أدوات الجيل القادم من التكنولوجيا. نحن هنا لنروي قصة نجاح سعودية، كتبت بجهدٍ استمر لعقود، وتستمر اليوم برؤية واعدة تقودها <span className="text-[#C9A227] font-bold">شراكات استراتيجية</span> وتقنيات ذكية لخدمة عملائنا في كل مكان.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 3. Interactive Milestones Timeline Section
const timelineEvents = [
  {
    year: '1993',
    title: 'التأسيس والبداية',
    description: 'تأسست شركة الملحم للسفر والسياحة كإحدى الوكالات الوطنية الرائدة في تقديم خدمات السفر المتكاملة وحجز الرحلات، واضعةً التميز والجودة ركيزةً أساسية لكل تعاملاتها.',
    icon: '🏢'
  },
  {
    year: '2000',
    title: 'التوسع الإقليمي',
    description: 'افتتاح فروع جديدة وتوسيع نطاق أعمالنا ليشمل كامل المنطقة الشرقية، وتدشين باقات سياحية عائلية مخصصة تلبي طموحات واهتمامات عملائنا بمختلف فئاتهم.',
    icon: '📍'
  },
  {
    year: '2010',
    title: 'الاعتماد والشراكات الدولية',
    description: 'الحصول على الاعتماد الدولي الرسمي من الاتحاد الدولي للنقل الجوي (IATA)، وتوطيد تحالفات استراتيجية مع كبرى الفنادق والخطوط الجوية العالمية لتقديم عروض حصرية.',
    icon: '✈️'
  },
  {
    year: '2020',
    title: 'التحول الرقمي الكامل',
    description: 'إطلاق منصاتنا التقنية الحديثة لتسهيل الحجوزات الفورية، وتقديم خدمة الكونسيرج والدعم الذكي على مدار الساعة لتوفير تجربة سفر رقمية سلسة ومتكاملة.',
    icon: '💻'
  },
  {
    year: '2026',
    title: 'ريادة سياحة المستقبل',
    description: 'المضي قدماً في قيادة قطاع السفر الفاخر في المملكة، وتوسيع شراكاتنا لدعم مستهدفات القطاع السياحي والمساهمة الفاعلة في تحقيق تطلعات رؤية السعودية 2030.',
    icon: '🇸🇦'
  }
];

function TimelineSection() {
  const [activeEvent, setActiveEvent] = useState(0);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[#C9A227] text-sm font-bold tracking-widest uppercase block mb-3">مسيرتنا الممتدة عبر الزمن</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#071428] font-serif">خطنا الزمني التاريخي</h2>
          <AnimatedGoldLine className="max-w-[120px] mx-auto mt-4" />
        </div>

        {/* Interactive Desktop Timeline */}
        <div className="hidden lg:block relative mt-20">
          {/* Horizontal Connecting Line */}
          <div className="absolute top-[48px] left-8 right-8 h-1 bg-slate-100 rounded-full">
            <motion.div 
              className="h-full bg-[#C9A227]"
              initial={{ width: 0 }}
              animate={{ width: `${(activeEvent / (timelineEvents.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Timeline Nodes */}
          <div className="grid grid-cols-5 gap-4 relative">
            {timelineEvents.map((evt, idx) => {
              const isActive = activeEvent === idx;
              return (
                <div 
                  key={evt.year} 
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setActiveEvent(idx)}
                >
                  {/* Node Circle */}
                  <motion.div 
                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 z-10 transition-all duration-300 ${isActive ? 'bg-[#071428] border-[#C9A227] text-white shadow-lg shadow-[#C9A227]/25 scale-110' : 'bg-white border-slate-200 text-slate-500 hover:border-[#C9A227] hover:text-[#C9A227]'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm font-bold block">{evt.year}</span>
                    <span className="text-2xl mt-1">{evt.icon}</span>
                  </motion.div>

                  {/* Title & Short Preview */}
                  <div className="text-center mt-6 px-2">
                    <h3 className={`text-base font-black transition-colors ${isActive ? 'text-[#C9A227]' : 'text-slate-800 group-hover:text-[#C9A227]'}`}>
                      {evt.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Event Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-12 bg-gradient-to-br from-[#fdfbf7] to-white border border-[#C9A227]/30 rounded-3xl p-8 shadow-[0_15px_40px_rgba(201,162,39,0.08)] max-w-3xl mx-auto flex items-start gap-6"
            >
              <span className="text-5xl p-4 bg-white rounded-2xl shadow-sm border border-slate-100">{timelineEvents[activeEvent].icon}</span>
              <div className="flex-1 text-right">
                <div className="flex items-center gap-3 mb-2 justify-end">
                  <h3 className="text-2xl font-black text-[#071428] font-serif">{timelineEvents[activeEvent].title}</h3>
                  <span className="bg-[#C9A227] text-[#071428] font-black text-sm px-3 py-1 rounded-full">{timelineEvents[activeEvent].year}</span>
                </div>
                <p className="text-slate-700 font-medium text-lg leading-relaxed">{timelineEvents[activeEvent].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden relative space-y-8 mt-12 pr-4 border-r-2 border-slate-100">
          {timelineEvents.map((evt) => (
            <motion.div 
              key={evt.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="relative text-right pr-6"
            >
              {/* Timeline Bullet */}
              <div className="absolute -right-[27px] top-1.5 w-4.5 h-4.5 rounded-full bg-white border-4 border-[#C9A227] shadow-sm z-10" />

              {/* Event Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-[#C9A227] transition-all">
                <div className="flex items-center gap-2 mb-3 justify-end">
                  <h3 className="text-lg font-bold text-[#071428] font-serif">{evt.title}</h3>
                  <span className="bg-[#C9A227]/10 text-[#C9A227] font-black text-xs px-2.5 py-0.5 rounded-full">{evt.year}</span>
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{evt.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Chairman's Message Section
function ChairmanSection() {
  return (
    <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
      <GoldParticles />

      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(180,139,62,0.15)] border-t-4 border-[#C9A227] p-6 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#C9A227]/10 to-transparent rounded-br-full pointer-events-none" />

          {/* Section Title */}
          <motion.div
            className="mb-12 flex flex-col items-start"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[#C9A227] text-xl font-serif mb-1">رسالة رئيس مجلس الإدارة</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#071428] font-serif leading-tight">
              كلمة المهندس إبراهيم الملحم
            </h2>
            <motion.div
              className="h-1 rounded-full bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mt-4"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 280, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Chairman Image */}
            <motion.div
              className="lg:col-span-5 order-2 lg:order-1 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative group w-full">
                {/* Gold Glow Effect */}
                <div className="absolute -inset-3 bg-gradient-to-br from-[#C9A227]/30 via-[#C9A227]/20 to-[#C9A227]/30 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500" />
                <div className="relative border-4 border-[#C9A227]/40 p-2 bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-lg">
                  <motion.img
                    src="/assets/about/chairman.jpg"
                    alt="رئيس مجلس الإدارة المهندس إبراهيم الملحم"
                    className="w-full h-[380px] lg:h-[480px] rounded-xl object-cover object-top"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Chairman Message */}
            <motion.div
              className="lg:col-span-7 order-1 lg:order-2 text-right"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-[#334155] leading-relaxed text-base md:leading-loose md:text-lg space-y-5 font-medium">
                <p>
                  "في عالم يتسارع فيه التغيير، لم تعد الخدمة التقليدية كافية لمواكبة تطلعات عملائنا. منذ بدأت رحلتي في الملحم للسفر، كان طموحي أبعد من مجرد تقديم تذاكر أو حجوزات؛ كان هدفي بناء صرحٍ يرتكز على قيم الأمانة، الابتكار، والاحترافية.
                </p>
                <p>
                  اليوم، ونحن ننظر إلى آفاق المستقبل، نضع نصب أعيننا تحويل تجربة السفر إلى <span className="text-[#C9A227] font-bold">منظومة تقنية متكاملة</span> تضمن لعملائنا -سواء كانوا أفراداً أو مؤسسات- مرونة لا تضاهى. إنني أؤمن بأن <span className="text-[#C9A227] font-bold">نجاحنا الحقيقي</span> لا يقاس بعدد رحلاتنا، بل بمستوى الثقة التي نبنيها مع كل عميل يختار 'الملحم'.
                </p>
                <p>
                  أعدكم أن نستمر في الاستثمار في <span className="text-[#C9A227] font-bold">الكفاءات الوطنية</span> و<span className="text-[#C9A227] font-bold">الحلول الرقمية الذكية</span>، لنظل دوماً الاختيار الأول لكل من يبحث عن التميز في عالم السفر."
                </p>
              </div>

              {/* Signature */}
              <motion.div
                className="mt-10 pt-6 border-t border-[#C9A227]/30"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-[#071428] font-bold text-2xl font-serif">
                  المهندس إبراهيم ناصر الملحم
                </p>
                <p className="text-[#C9A227] text-base mt-1">رئيس مجلس الإدارة</p>
                <motion.div
                  className="w-32 h-1 bg-gradient-to-r from-[#C9A227] to-[#C9A227] mt-4"
                  initial={{ width: 0 }}
                  whileInView={{ width: 128 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 5. Vision & Mission Section
function VisionMissionSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Vision Card */}
          <motion.div
            className="bg-gradient-to-br from-[#fdfbf7] to-white rounded-3xl shadow-[0_15px_50px_rgb(180,139,62,0.12)] border-t-4 border-[#C9A227] p-10 relative overflow-hidden group"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -8, boxShadow: "0 25px 60px rgb(180,139,62,0.2)" }}
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#C9A227]/10 to-transparent rounded-br-full pointer-events-none" />
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#071428] font-serif mb-3">
                الرؤية
              </h2>
              <motion.div
                className="h-1 rounded-full bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 120 }}
                viewport={{ once: true }}
              />
            </div>
            <p className="text-[#334155] leading-loose text-lg text-right font-medium">
              أن تصبح الملحم الخيار الأول لتوفير أفضل خدمات السفر والسياحة في المملكة العربية السعودية والمنطقة.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            className="bg-gradient-to-br from-[#fdfbf7] to-white rounded-3xl shadow-[0_15px_50px_rgb(180,139,62,0.12)] border-t-4 border-[#C9A227] p-10 relative overflow-hidden group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -8, boxShadow: "0 25px 60px rgb(180,139,62,0.2)" }}
          >
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#C9A227]/10 to-transparent rounded-tl-full pointer-events-none" />
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#071428] font-serif mb-3">
                الرسالة
              </h2>
              <motion.div
                className="h-1 rounded-full bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 120 }}
                viewport={{ once: true }}
              />
            </div>
            <p className="text-[#334155] leading-loose text-lg text-right font-medium">
              تلبية رغبة عملائنا من خلال توفير حلول سفر متكاملة ذات جودة عالية، ونمو مستدام من خلال شراكات استراتيجية.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// 6. Values Section
function ValuesSection() {
  const values = [
    { icon: ShieldCheck, title: 'الشفافية', content: 'نلتزم بأعلى معايير الشفافية والنزاهة في جميع تعاملاتنا وخدماتنا.' },
    { icon: Star, title: 'التميز', content: 'نسعى دائماً لتقديم خدمات سفر استثنائية فاخرة تتجاوز التوقعات.' },
    { icon: Heart, title: 'الالتزام', content: 'نحترم وعودنا لعملائنا ونحققها بأعلى درجات الجودة والمصداقية.' },
    { icon: Handshake, title: 'الشراكة', content: 'نبني علاقات عمل وثيقة ومستدامة قائمة على الثقة المتبادلة.' }
  ];

  return (
    <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
      <GoldParticles />

      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#071428] font-serif mb-4">
            قيمنا الراسخة
          </h2>
          <AnimatedGoldLine className="max-w-[100px] mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-4 gap-0">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <motion.div
                key={value.title}
                className={`text-center px-8 py-6 ${index < 3 ? 'md:border-l border-[#C9A227]/20' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent
                    className="w-16 h-16 text-[#C9A227]"
                    strokeWidth={1}
                  />
                </motion.div>
                <h3 className="text-[#071428] font-bold text-2xl font-serif mb-4">
                  {value.title}
                </h3>
                <p className="text-[#334155] text-base leading-relaxed font-medium">
                  {value.content}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 7. Accreditations Section
function AccreditationsSection() {
  const accreditations = [
    { icon: Target, name: 'رؤية 2030', description: 'شريك فاعل في تحقيق التطلعات السياحية للمملكة' },
    { icon: Plane, name: 'IATA', description: 'عضو معتمد لدى الاتحاد الدولي للنقل الجوي' },
    { icon: Building2, name: 'وزارة السياحة', description: 'وكيل سفر مرخص رسمياً من وزارة السياحة' },
    { icon: BadgeCheck, name: 'ISO 9001', description: 'نطبق أفضل معايير الجودة العالمية المعتمدة' }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C9A227] text-sm font-bold tracking-widest uppercase block mb-3">شراكات رسمية واعتمادات موثوقة</span>
          <h2 className="text-2xl md:text-4xl font-bold text-[#071428] font-serif mb-2">اعتماداتنا وشراكاتنا الاستراتيجية</h2>
          <AnimatedGoldLine className="max-w-[80px] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {accreditations.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.name}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#fdfbf7] shadow-[0_8px_30px_rgb(180,139,62,0.06)] border border-[#C9A227]/10 flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.1, boxShadow: "0 15px 40px rgb(180,139,62,0.18)" }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent
                    className="w-12 h-12 text-gray-400 group-hover:text-[#C9A227] transition-colors duration-500"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <h3 className="text-[#071428] font-bold text-base font-serif mb-1 group-hover:text-[#C9A227] transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-sm font-semibold">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 8. Download Profile CTA Section
function DownloadProfileSection() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-20 bg-[#fdfbf7] relative overflow-hidden download-profile-section">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="relative bg-white border border-[#C9A227]/30 rounded-3xl p-12 text-center overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-white to-[#fdfbf7] opacity-50 pointer-events-none" />

          {/* Decorative Corners */}
          <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#C9A227]/30 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#C9A227]/30 rounded-bl-3xl pointer-events-none" />

          <div className="relative">
            <motion.h2
              className="text-3xl font-bold text-[#071428] font-serif mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              الملف التعريفي للشركة
            </motion.h2>
            <motion.p
              className="text-[#334155] mb-10 text-lg leading-relaxed font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              للتعرف أكثر على تاريخنا وإنجازاتنا، يمكنكم تحميل الملف التعريفي الكامل لشركة الملحم للسفر والسياحة.
            </motion.p>
            <motion.button
              onClick={handlePrint}
              className="btn-primary inline-flex items-center gap-3 text-lg relative overflow-hidden group cursor-pointer print-trigger"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Download className="w-6 h-6 relative" strokeWidth={2} />
              <span className="relative">تحميل البروفايل (PDF)</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutUs() {
  return (
    <div>
      <SEO
        title="عن الملحم"
        description="تعرف على شركة الملحم للسفر والسياحة وتاريخنا الطويل في صناعة السفر ورؤيتنا المستقبلية 2030 لتقديم أفضل الخدمات السياحية."
        keywords="شركة الملحم, عن الملحم, سفر, سياحة, السعودية, رؤية 2030, الحجوزات"
      />
      <AboutHeroSection />
      <AboutSection />
      <TimelineSection />
      <ChairmanSection />
      <VisionMissionSection />
      <ValuesSection />
      <AccreditationsSection />
      <DownloadProfileSection />
      <Footer />
    </div>
  );
}

export default AboutUs;
