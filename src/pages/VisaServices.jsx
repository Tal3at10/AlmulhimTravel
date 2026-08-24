import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stamp, 
  Globe, 
  CheckCircle, 
  Clock, 
  Shield,
  FileText,
  Phone,
  Briefcase,
  Award,
  Plane,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
  Check,
  AlertCircle,
  Loader2,
  Upload,
  User
} from 'lucide-react';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';
import { getOptimizedImageUrl } from '../utils/image';

// Floating Gold Particles Component
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#C9A227]/20"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
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

const visaTypes = [
  {
    id: 'schengen',
    title: 'تأشيرة الشنغن',
    titleEn: 'Schengen Visa',
    icon: '🇪🇺',
    countries: 'دول الشنغن',
    duration: 'تختلف حسب السفارة',
    description: 'تتيح لك الدخول والتنقل بحرية بين دول الشنغن الأوروبية',
    requirements: [
      'تعبئة نموذج الطلب',
      'حجز الموعد',
      'حجز الطيران وحجز الفندق',
      'ترجمة الهوية وبطاقة العائلة',
      'تأمين السفر',
      'كشف حساب بنكي 3 شهور إنجليزي (اللي ينزل فيه الراتب ولا يقل الحساب عن 20 الف) - في موعد المقابلة',
      'تعريف بالراتب إنجليزي - في موعد المقابلة',
      'صور شخصية - في موعد المقابلة'
    ]
  },
  {
    id: 'uk',
    title: 'تأشيرة بريطانيا',
    titleEn: 'UK Visa',
    icon: '🇬🇧',
    countries: 'المملكة المتحدة',
    duration: 'تختلف حسب السفارة',
    description: 'تأشيرة سياحية للمملكة المتحدة',
    requirements: [
      'صورة من الجواز الأصلي',
      'صورة شخصية خلفية بيضاء'
    ]
  },
  {
    id: 'japan',
    title: 'تأشيرة اليابان',
    titleEn: 'Japan Visa',
    icon: '🇯🇵',
    countries: 'اليابان',
    duration: 'صلاحيتها 3 أشهر (مدة الاستخراج 10 أيام)',
    description: 'تأشيرة سياحية لليابان',
    requirements: [
      'صورة شخصية مقاس الجواز',
      'صورة الجواز بشكل واضح',
      'بطاقة الأحوال',
      'صورة التذكرة',
      'كشف الحساب البنكي أو تعريف الراتب بالإنجليزي',
      'تاريخ السفر إلى اليابان وتاريخ العودة',
      'مطار الوصول في اليابان',
      'رقم الجوال والإيميل',
      'جهة العمل والمسمى الوظيفي'
    ]
  },
  {
    id: 'usa',
    title: 'تأشيرة أمريكا',
    titleEn: 'USA Visa',
    icon: '🇺🇸',
    countries: 'الولايات المتحدة',
    duration: 'تختلف حسب السفارة',
    description: 'تأشيرة سياحية للولايات المتحدة الأمريكية مع مقابلة شخصية',
    requirements: [
      'جواز سفر صالح',
      'ملء نموذج DS-160',
      'صورة شخصية حديثة',
      'إثبات مالي ودفع رسوم التأشيرة'
    ]
  },
  {
    id: 'asia',
    title: 'تأشيرات آسيا',
    titleEn: 'Asia Visas',
    icon: '🌏',
    countries: 'فيتنام، الهند، وغيرها',
    duration: '7-15 يوم',
    description: 'تأشيرات سريعة لمعظم الدول الآسيوية بإجراءات مبسطة',
    requirements: [
      'جواز سفر صالح لأكثر من 6 أشهر',
      'صور شخصية حديثة',
      'نموذج طلب التأشيرة',
      'حجز فندقي وتذاكر طيران'
    ]
  },
  {
    id: 'license',
    title: 'الرخصة الدولية',
    titleEn: 'International License',
    icon: '🚗',
    countries: 'دولية',
    duration: 'لمدة سنة',
    description: 'استخراج رخصة قيادة دولية (النوع دفتر)',
    requirements: [
      'صورة شخصية',
      'صورة الجواز',
      'صورة الرخصة السعودية'
    ]
  }
];

const processSteps = [
  {
    number: '01',
    title: 'تجهيز المستندات',
    description: 'نساعدك في تجهيز جميع الأوراق المطلوبة لضمان قبول الطلب'
  },
  {
    number: '02',
    title: 'مراجعة الطلب',
    description: 'نراجع طلبك بدقة للتأكد من اكتماله ومطابقته للشروط'
  },
  {
    number: '03',
    title: 'التقديم للسفارة',
    description: 'نتولى تقديم طلبك للسفارة أو القنصلية وحجز الموعد'
  },
  {
    number: '04',
    title: 'استلام التأشيرة',
    description: 'نتابع طلبك حتى الحصول على التأشيرة وتسليمك الجواز'
  }
];

const features = [
  {
    icon: Shield,
    title: 'نسبة قبول 95%',
    description: 'نضمن لك جودة الملف لزيادة فرص القبول'
  },
  {
    icon: Clock,
    title: 'سرعة الإنجاز',
    description: 'إجراءات سريعة ومتابعة مستمرة لطلبك'
  },
  {
    icon: FileText,
    title: 'تجهيز متكامل',
    description: 'نتولى تعبئة النماذج وتجهيز جميع الأوراق'
  },
  {
    icon: Award,
    title: 'خبرة طويلة',
    description: 'أكثر من 10,000 تأشيرة مستخرجة بنجاح'
  }
];

const visaPrices = {
  schengen: 450,
  uk: 550,
  japan: 350,
  usa: 650,
  asia: 250,
  license: 150
};

function VisaServices() {
  const location = useLocation();
  const [selectedVisa, setSelectedVisa] = useState(visaTypes[0]);

  // Visa Application Wizard States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [visaFormData, setVisaFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    dateOfBirth: '',
    jobTitle: '',
    employer: '',
    email: '',
    phone: '',
    countryCode: '+966',
    proposedDate: '',
    passportFile: null,
    photoFile: null,
    bankFile: null
  });
  const [uploadProgress, setUploadProgress] = useState({
    passportFile: 0,
    photoFile: 0,
    bankFile: 0
  });

  // Simulated OTP Gateway
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (showOTPModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setShowOTPModal(false);
      setIsProcessing(false);
      setOtpError('انتهت صلاحية رمز التحقق، يرجى المحاولة مرة أخرى.');
    }
    return () => clearInterval(interval);
  }, [showOTPModal, otpTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartApplication = () => {
    setCurrentStep(1);
    setVisaFormData({
      title: '',
      firstName: '',
      lastName: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      dateOfBirth: '',
      jobTitle: '',
      employer: '',
      email: '',
      phone: '',
      countryCode: '+966',
      proposedDate: '',
      passportFile: null,
      photoFile: null,
      bankFile: null
    });
    setUploadProgress({
      passportFile: 0,
      photoFile: 0,
      bankFile: 0
    });
    setShowApplyModal(true);
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setVisaFormData(prev => ({ ...prev, [field]: file }));
    setUploadProgress(prev => ({ ...prev, [field]: 10 }));
    
    // Simulate upload progress
    let progress = 10;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({ ...prev, [field]: progress }));
    }, 200);
  };

  const handleVisaSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate contact with the bank gateway
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setShowOTPModal(true);
    setOtpTimer(300); // reset timer to 5 minutes
    setOtpError('');
    setOtpCode('');
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setOtpError('الرجاء إدخال رمز التحقق');
      return;
    }
    
    setOtpError('');
    setIsProcessing(true); // show loader in modal
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setShowOTPModal(false);
    setShowApplyModal(false);
    
    // Navigate to success screen
    window.location.href = `/booking-success?bookingRef=ALM-VISA-${Math.floor(100000 + Math.random() * 900000)}&hotelName=${encodeURIComponent("تأشيرة " + selectedVisa.title)}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchVal = params.get('search');
    if (searchVal) {
      const query = decodeURIComponent(searchVal).toLowerCase().trim();
      let matchedVisa = null;

      if (query.includes('شنجن') || query.includes('schengen') || query.includes('أوروبا') || query.includes('اوروبا')) {
        matchedVisa = visaTypes.find(v => v.id === 'schengen');
      } else if (query.includes('بريطانيا') || query.includes('uk') || query.includes('المملكة المتحدة')) {
        matchedVisa = visaTypes.find(v => v.id === 'uk');
      } else if (query.includes('يابان') || query.includes('japan')) {
        matchedVisa = visaTypes.find(v => v.id === 'japan');
      } else if (query.includes('أمريكا') || query.includes('امريكا') || query.includes('usa') || query.includes('الولايات المتحدة')) {
        matchedVisa = visaTypes.find(v => v.id === 'usa');
      } else if (query.includes('رخصة') || query.includes('دولية') || query.includes('license')) {
        matchedVisa = visaTypes.find(v => v.id === 'license');
      } else if (query.includes('تعليم') || query.includes('سياحة') || query.includes('آسيا') || query.includes('اسيا') || query.includes('asia') || query.includes('فيتنام') || query.includes('الهند')) {
        matchedVisa = visaTypes.find(v => v.id === 'asia');
      }

      if (matchedVisa) {
        setSelectedVisa(matchedVisa);
        // Scroll smoothly to details
        setTimeout(() => {
          const element = document.getElementById('visa-details');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [location.search]);

  return (
    <div className="pt-header-offset">
      <SEO
        title="خدمات التأشيرات والفيزا"
        description="خدمات احترافية لاستخراج التأشيرات لجميع دول العالم. تأشيرة الشنغن، بريطانيا، أمريكا بأفضل نسبة قبول."
        keywords="تأشيرات, فيزا, شنغن, بريطانيا, استخراج تأشيرة, الملحم"
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#fdfbf7] via-[#fff9ed] to-[#fdfbf7] overflow-hidden">
        {/* Subtle Navy Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23071428' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <GoldParticles />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#C9A227]/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-[#C9A227]/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Stamp className="w-5 h-5 text-[#C9A227]" />
              <span className="text-[#C9A227] font-bold">خدمات التأشيرات والفيزا</span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#C9A227] mb-6 font-serif leading-tight">
              استخراج التأشيرات السياحية
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-[#071428] mb-8 leading-relaxed font-medium max-w-3xl mx-auto px-2">
              نساعدك في استخراج تأشيرتك بسهولة وسرعة لأكثر من 50 دولة
              <span className="block mt-2 text-[#C9A227]">نسبة قبول 95% • خدمة احترافية • متابعة مستمرة</span>
            </p>

            <AnimatedGoldLine className="max-w-[200px] mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            className="bg-gradient-to-br from-[#fdfbf7] to-white rounded-3xl shadow-[0_20px_60px_rgb(201,162,39,0.2)] border-t-4 border-[#C9A227] p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#C9A227]/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#C9A227]/10 to-transparent rounded-tl-full" />

            <div className="grid lg:grid-cols-2 gap-12 items-center relative">
              {/* Image - Left Side */}
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative group">
                  {/* Gold Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#C9A227]/30 via-[#C9A227]/20 to-[#C9A227]/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  
                  {/* Image Container */}
                  <div className="relative border-4 border-[#C9A227]/40 p-3 bg-white rounded-xl overflow-hidden shadow-lg">
                    <motion.img
                      src="/saudi_student_education.jpg"
                      alt="خدمات التأشيرات"
                      className="w-full h-80 object-cover rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C9A227]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Small Gallery Below */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <motion.div
                      className="relative border-2 border-[#C9A227]/30 rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src="/visa_schengen.jpg"
                        alt="جواز سفر"
                        className="w-full h-32 object-cover"
                      />
                    </motion.div>
                    <motion.div
                      className="relative border-2 border-[#C9A227]/30 rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src="/tourism.jpg"
                        alt="تأشيرة"
                        className="w-full h-32 object-cover"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Text Content - Right Side */}
              <motion.div
                className="order-1 lg:order-2 text-right"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-[#C9A227] font-serif mb-4">
                  شريكك الموثوق
                </h2>
                <motion.div
                  className="w-24 h-1 bg-[#C9A227] mb-6 mr-auto"
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                />
                
                <div className="text-[#071428] leading-relaxed md:leading-loose text-base md:text-lg space-y-4 font-medium">
                  <p>
                    نحن في <span className="text-[#C9A227] font-bold">الملحم للسفر والسياحة</span> نقدم خدمات احترافية لاستخراج التأشيرات السياحية لمختلف دول العالم بأعلى معايير الدقة والاحترافية.
                  </p>
                  <p>
                    مع خبرتنا الطويلة، نضمن لك تجهيز ملف متكامل يلبي كافة متطلبات السفارات، مما يرفع نسبة القبول إلى <span className="text-[#C9A227] font-bold">95%</span>.
                  </p>
                  <p>
                    نتولى عنك عناء تعبئة النماذج، حجز المواعيد، وترجمة المستندات، لنوفر عليك الوقت والجهد ونضمن لك راحة البال لتستمتع برحلتك.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#C9A227]/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#C9A227]">10K+</div>
                    <div className="text-sm text-[#071428] mt-1 font-semibold">تأشيرة مستخرجة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#C9A227]">50+</div>
                    <div className="text-sm text-[#071428] mt-1 font-semibold">دولة متاحة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#C9A227]">95%</div>
                    <div className="text-sm text-[#071428] mt-1 font-semibold">نسبة القبول</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visa Types Section (Styled like Nationalities) */}
      <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
        <GoldParticles />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#C9A227] font-serif mb-4">
              أنواع التأشيرات المتاحة
            </h2>
            <AnimatedGoldLine className="max-w-[120px] mx-auto mb-4" />
            <p className="text-[#071428] text-lg">اختر نوع التأشيرة لعرض المتطلبات والتفاصيل</p>
          </motion.div>

          {/* Visa Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {visaTypes.map((visa, index) => {
              const isSelected = selectedVisa.id === visa.id;
              return (
                <motion.div
                  key={visa.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedVisa(visa);
                    if (window.innerWidth < 768) {
                      setTimeout(() => document.getElementById('visa-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                    }
                  }}
                >
                  <motion.div
                    className={`bg-white rounded-2xl shadow-[0_12px_40px_rgb(201,162,39,0.15)] border-t-4 ${isSelected ? 'border-[#C9A227] ring-4 ring-[#C9A227]/30 scale-105' : 'border-[#C9A227]'} p-6 text-center relative overflow-hidden group cursor-pointer h-full transition-all duration-300`}
                    whileHover={{ y: -8, boxShadow: "0 20px 50px rgb(201,162,39,0.25)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <div className="text-6xl mb-4 drop-shadow-md">{visa.icon}</div>
                    <h3 className="text-xl font-bold text-[#071428] mb-4 font-serif group-hover:text-[#C9A227] transition-colors">
                      {visa.title}
                    </h3>
                    <ul className="space-y-2 text-right">
                      {visa.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[#071428]">
                          <CheckCircle className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                          <span className="font-semibold">{feature}</span>
                        </li>
                      )) || (
                        <>
                          <li className="flex items-center gap-2 text-sm text-[#071428]">
                            <Globe className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                            <span className="font-semibold">{visa.countries}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-[#071428]">
                            <Clock className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                            <span className="font-semibold">{visa.duration}</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Visa Details Card */}
          <motion.div
            id="visa-details"
            key={selectedVisa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(201,162,39,0.2)] border-t-4 border-[#C9A227] p-8 md:p-12 relative overflow-hidden scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b-2 border-[#C9A227]/20">
              <span className="text-7xl md:text-8xl drop-shadow-lg">{selectedVisa.icon}</span>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-[#071428] font-serif mb-2">{selectedVisa.title}</h3>
                <p className="text-[#071428]/80 text-lg md:text-xl font-medium">{selectedVisa.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Requirements */}
              <div>
                <h4 className="text-2xl font-bold text-[#C9A227] mb-6 flex items-center gap-3">
                  <FileText className="w-7 h-7" strokeWidth={2} />
                  المتطلبات الأساسية
                </h4>
                <ul className="space-y-4">
                  {selectedVisa.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#C9A227] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-[#071428] font-semibold text-lg">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company WhatsApp Contact */}
              <div>
                <h4 className="text-2xl font-bold text-[#C9A227] mb-6 flex items-center gap-3">
                  <Phone className="w-7 h-7" strokeWidth={2} />
                  تواصل معنا لاستخراج التأشيرة
                </h4>
                <div className="bg-[#fdfbf7] rounded-2xl p-6 shadow-inner border border-[#C9A227]/20">
                  <p className="text-sm text-[#071428]/80 mb-4 font-bold leading-relaxed text-center bg-white p-3 rounded-lg shadow-sm">
                    ⏰ أوقات الاستقبال: من الأحد للخميس (4:00 مساءً حتى 9:00 مساءً)
                  </p>
                  <p className="text-[#071428]/70 text-sm text-center mb-5 leading-relaxed">
                    تواصل معنا عبر واتساب وسيقوم المختص بمتابعة طلبك فوراً
                  </p>
                  <div className="flex flex-col gap-3">
                    {/* <button
                      onClick={handleStartApplication}
                      className="flex items-center justify-center gap-3 p-4 bg-[#C9A227] hover:bg-[#B8924A] text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-102 font-bold text-lg w-full"
                    >
                      <Stamp className="w-6 h-6" />
                      قدّم طلبك إلكترونياً الآن
                    </button> */}
                    <a
                      href="https://wa.me/966535727771?text=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%A7%D9%84%D8%AA%D8%A3%D8%B4%D9%8A%D8%B1%D8%A7%D8%AA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-102 font-bold text-lg w-full"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      تواصل عبر واتساب للاستفسار
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-10 h-10 text-[#C9A227]" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-[#071428] font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-[#071428]/70 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#C9A227] font-serif mb-4">
              خطوات استخراج التأشيرة
            </h2>
            <AnimatedGoldLine className="max-w-[120px] mx-auto mb-4" />
            <p className="text-[#071428] text-lg">نرافقك في كل خطوة حتى استلام جوازك</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A227]/20 via-[#C9A227] to-[#C9A227]/20" />
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center relative"
                >
                  <motion.div
                    className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A227] to-[#B8924A] shadow-lg mb-6 mx-auto"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-3xl font-bold text-[#071428] z-10">{step.number}</span>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#C9A227]"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#071428] mb-3">{step.title}</h3>
                  <p className="text-[#071428]/70 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#fdfbf7] via-[#fff9ed] to-[#fdfbf7] relative overflow-hidden">
        <GoldParticles />
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <motion.div
            className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(201,162,39,0.2)] border-t-4 border-[#C9A227] p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Decorative Corners */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#C9A227]/30 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#C9A227]/30 rounded-bl-3xl" />

            <div className="relative">
              <Plane className="w-16 h-16 text-[#C9A227] mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl md:text-4xl font-bold text-[#C9A227] mb-4 font-serif">
                جاهز لاستخراج تأشيرتك؟
              </h2>
              <p className="text-[#071428] text-lg mb-8 max-w-2xl mx-auto font-medium">
                تواصل معنا الآن وسنساعدك في تجهيز ملفك والحصول على التأشيرة بأسرع وقت
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <button
                  onClick={handleStartApplication}
                  className="inline-flex items-center justify-center gap-2 bg-[#C9A227] hover:bg-[#B8924A] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Stamp className="w-6 h-6" />
                  تقديم طلب إلكتروني
                </button> */}
                <a
                  href="https://wa.me/966535727771?text=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%A7%D9%84%D8%AA%D8%A3%D8%B4%D9%8A%D8%B1%D8%A7%D8%AA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visa Wizard Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071428]/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_20px_60px_rgb(201,162,39,0.3)] border-t-4 border-[#C9A227] overflow-hidden dir-rtl text-right my-8"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#C9A227]/20 flex items-center justify-between bg-gradient-to-r from-[#fdfbf7] to-white">
              <div>
                <h3 className="text-2xl font-bold text-[#071428] font-serif">طلب تأشيرة إلكتروني</h3>
                <p className="text-sm text-[#C9A227] font-semibold mt-1">تأشيرة {selectedVisa.title}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="px-8 py-4 bg-[#fdfbf7] border-b border-gray-100">
              <div className="flex justify-between items-center relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                {/* Active Progress Line */}
                <div 
                  className="absolute top-1/2 right-0 h-1 bg-[#C9A227] -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />

                {[1, 2, 3, 4].map((stepNum) => {
                  const isActive = stepNum <= currentStep;
                  const isCurrent = stepNum === currentStep;
                  return (
                    <div key={stepNum} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-[#C9A227] text-white ring-4 ring-[#C9A227]/20 scale-110 shadow-md' 
                            : isActive 
                            ? 'bg-[#071428] text-white font-bold' 
                            : 'bg-white text-gray-400 border-2 border-gray-200'
                        }`}
                      >
                        {isActive && stepNum < currentStep ? <Check className="w-5 h-5" /> : stepNum}
                      </div>
                      <span className={`text-xs mt-1.5 font-bold ${isActive ? 'text-[#071428]' : 'text-gray-400'}`}>
                        {stepNum === 1 && 'البيانات'}
                        {stepNum === 2 && 'الجواز'}
                        {stepNum === 3 && 'المرفقات'}
                        {stepNum === 4 && 'الدفع'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleVisaSubmit} className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-[#071428] border-r-4 border-[#C9A227] pr-3 mb-4">البيانات الشخصية</h4>
                  <div className="grid md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-[#071428] mb-2">اللقب</label>
                      <select
                        required
                        value={visaFormData.title}
                        onChange={(e) => setVisaFormData({...visaFormData, title: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold"
                      >
                        <option value="">اختر اللقب</option>
                        <option value="السيد">السيد</option>
                        <option value="السيدة">السيدة</option>
                        <option value="الآنسة">الآنسة</option>
                      </select>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm font-bold text-[#071428] mb-2">الاسم الأول (إنجليزي)</label>
                      <input
                        type="text"
                        required
                        value={visaFormData.firstName}
                        onChange={(e) => setVisaFormData({...visaFormData, firstName: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        placeholder="e.g. Abdullah"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-sm font-bold text-[#071428] mb-2">اسم العائلة (إنجليزي)</label>
                      <input
                        type="text"
                        required
                        value={visaFormData.lastName}
                        onChange={(e) => setVisaFormData({...visaFormData, lastName: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        placeholder="e.g. Al-Mulhim"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">الجنسية</label>
                      <input
                        type="text"
                        required
                        value={visaFormData.nationality}
                        onChange={(e) => setVisaFormData({...visaFormData, nationality: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold"
                        placeholder="السعودية"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">تاريخ الميلاد</label>
                      <input
                        type="date"
                        required
                        value={visaFormData.dateOfBirth}
                        onChange={(e) => setVisaFormData({...visaFormData, dateOfBirth: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        required
                        value={visaFormData.email}
                        onChange={(e) => setVisaFormData({...visaFormData, email: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">رقم الجوال</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={visaFormData.phone}
                          onChange={(e) => setVisaFormData({...visaFormData, phone: e.target.value})}
                          className="flex-1 p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                          placeholder="5xxxxxxx"
                        />
                        <select
                          value={visaFormData.countryCode}
                          onChange={(e) => setVisaFormData({...visaFormData, countryCode: e.target.value})}
                          className="w-24 p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        >
                          <option value="+966">+966</option>
                          <option value="+971">+971</option>
                          <option value="+965">+965</option>
                          <option value="+973">+973</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-[#071428] border-r-4 border-[#C9A227] pr-3 mb-4">تفاصيل الجواز وتاريخ السفر</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">رقم جواز السفر</label>
                      <input
                        type="text"
                        required
                        value={visaFormData.passportNumber}
                        onChange={(e) => setVisaFormData({...visaFormData, passportNumber: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        placeholder="e.g. U123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">تاريخ انتهاء صلاحية الجواز</label>
                      <input
                        type="date"
                        required
                        value={visaFormData.passportExpiry}
                        onChange={(e) => setVisaFormData({...visaFormData, passportExpiry: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">المسمى الوظيفي (بالإنجليزي كما في تعريف الراتب)</label>
                      <input
                        type="text"
                        required
                        value={visaFormData.jobTitle}
                        onChange={(e) => setVisaFormData({...visaFormData, jobTitle: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-2">جهة العمل (بالإنجليزي)</label>
                      <input
                        type="text"
                        required
                        value={visaFormData.employer}
                        onChange={(e) => setVisaFormData({...visaFormData, employer: e.target.value})}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                        placeholder="e.g. Saudi Aramco"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#071428] mb-2">تاريخ السفر المقترح</label>
                    <input
                      type="date"
                      required
                      value={visaFormData.proposedDate}
                      onChange={(e) => setVisaFormData({...visaFormData, proposedDate: e.target.value})}
                      className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="hidden space-y-6">
                  <h4 className="text-lg font-bold text-[#071428] border-r-4 border-[#C9A227] pr-3 mb-4">تحميل المستندات المطلوبة</h4>
                  <p className="text-sm text-gray-500 mb-4">يرجى رفع صور أو ملفات PDF واضحة للمستندات التالية لضمان مراجعتها بسرعة.</p>
                  
                  {/* Passport copy upload */}
                  <div className="p-4 bg-white border-2 border-dashed border-[#C9A227]/30 rounded-2xl relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#C9A227]/10 rounded-full flex items-center justify-center text-[#C9A227]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <h5 className="font-bold text-gray-800 text-sm">صورة جواز السفر *</h5>
                          <p className="text-xs text-gray-400">صورة واضحة للصفحة الأولى من الجواز (صلاحية 6 أشهر على الأقل)</p>
                        </div>
                      </div>
                      <label className="bg-[#071428] hover:bg-[#C9A227] text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors">
                        اختر الملف
                        <input
                          type="file"
                          required={false}
                          className="hidden"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange('passportFile', e)}
                        />
                      </label>
                    </div>
                    {uploadProgress.passportFile > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{uploadProgress.passportFile}% تم الرفع</span>
                          <span>{visaFormData.passportFile?.name}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A227] transition-all duration-300" style={{ width: `${uploadProgress.passportFile}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photo copy upload */}
                  <div className="p-4 bg-white border-2 border-dashed border-[#C9A227]/30 rounded-2xl relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#C9A227]/10 rounded-full flex items-center justify-center text-[#C9A227]">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <h5 className="font-bold text-gray-800 text-sm">صورة شخصية حديثة *</h5>
                          <p className="text-xs text-gray-400">مقاس (4.5 × 3.5 سم) بخلفية بيضاء وبدون تعديلات</p>
                        </div>
                      </div>
                      <label className="bg-[#071428] hover:bg-[#C9A227] text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors">
                        اختر الملف
                        <input
                          type="file"
                          required={false}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange('photoFile', e)}
                        />
                      </label>
                    </div>
                    {uploadProgress.photoFile > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{uploadProgress.photoFile}% تم الرفع</span>
                          <span>{visaFormData.photoFile?.name}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A227] transition-all duration-300" style={{ width: `${uploadProgress.photoFile}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank statement/salary upload */}
                  <div className="p-4 bg-white border-2 border-dashed border-[#C9A227]/30 rounded-2xl relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#C9A227]/10 rounded-full flex items-center justify-center text-[#C9A227]">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <h5 className="font-bold text-gray-800 text-sm">تعريف بالراتب أو كشف حساب (اختياري)</h5>
                          <p className="text-xs text-gray-400">ملف PDF لتعريف الراتب أو كشف حساب بنكي (لبعض السفارات كالشنغن واليابان)</p>
                        </div>
                      </div>
                      <label className="bg-[#071428] hover:bg-[#C9A227] text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors">
                        اختر الملف
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange('bankFile', e)}
                        />
                      </label>
                    </div>
                    {uploadProgress.bankFile > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{uploadProgress.bankFile}% تم الرفع</span>
                          <span>{visaFormData.bankFile?.name}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A227] transition-all duration-300" style={{ width: `${uploadProgress.bankFile}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-[#071428] border-r-4 border-[#C9A227] pr-3 mb-4">الدفع الإلكتروني الآمن</h4>
                  
                  {/* Price breakdown */}
                  <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#C9A227]/20 text-right">
                    <h5 className="font-bold text-gray-800 mb-3 border-b pb-2">تفاصيل الفاتورة</h5>
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-600 mb-2">
                      <span>رسوم تأشيرة {selectedVisa.title}:</span>
                      <span>{visaPrices[selectedVisa.id] || 300} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-600 mb-3">
                      <span>ضريبة القيمة المضافة (15%):</span>
                      <span>{Math.round((visaPrices[selectedVisa.id] || 300) * 0.15)} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-gray-800 text-lg border-t pt-3">
                      <span>المبلغ الإجمالي المستحق:</span>
                      <span className="text-[#C9A227]">{ (visaPrices[selectedVisa.id] || 300) + Math.round((visaPrices[selectedVisa.id] || 300) * 0.15) } ر.س</span>
                    </div>
                  </div>

                  {/* Cards logos */}
                  <div className="flex justify-center items-center gap-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400">البطاقات المدعومة:</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold border border-blue-600 text-blue-600 rounded">مدى mada</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold border border-amber-500 text-amber-500 rounded">Mastercard</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold border border-blue-900 text-blue-900 rounded font-serif">VISA</span>
                  </div>

                  {/* Card entry form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-1.5">اسم صاحب البطاقة</label>
                      <input
                        type="text"
                        required
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold"
                        placeholder="اسم حامل البطاقة"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#071428] mb-1.5">رقم البطاقة</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left tracking-widest"
                        placeholder="4000 1234 5678 9010"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#071428] mb-1.5">تاريخ الانتهاء</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#071428] mb-1.5">الرمز السري (CVV)</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          className="w-full p-3 bg-[#fdfbf7] border border-[#C9A227]/20 rounded-xl focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 font-semibold text-left"
                          placeholder="***"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                      نظام الدفع لدينا آمن ومحمي بأحدث تقنيات التشفير SSL و متوافق مع معايير PCI-DSS.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev === 4 ? 2 : prev - 1)}
                    className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-[#071428] font-bold rounded-xl transition-all"
                  >
                    السابق
                  </button>
                )}
                <div className="flex-1" />
                {currentStep < 4 ? (
                  <button
                    type="button"
                    disabled={
                      (currentStep === 1 && (!visaFormData.firstName || !visaFormData.lastName || !visaFormData.email || !visaFormData.phone)) ||
                      (currentStep === 2 && (!visaFormData.passportNumber || !visaFormData.passportExpiry || !visaFormData.proposedDate))
                    }
                    onClick={() => setCurrentStep(prev => prev === 2 ? 4 : prev + 1)}
                    className="px-8 py-3 bg-[#071428] hover:bg-[#C9A227] disabled:opacity-40 disabled:hover:bg-[#071428] text-white font-bold rounded-xl transition-all"
                  >
                    المتابعة
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-3 bg-[#C9A227] hover:bg-[#B8924A] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري معالجة الطلب...
                      </>
                    ) : (
                      'إتمام الدفع الآمن'
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3D Secure OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071428]/90 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-t-4 border-[#C9A227] overflow-hidden dir-rtl text-right"
          >
            {/* Bank simulated header */}
            <div className="bg-slate-50 p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  بوابة الدفع الآمنة (Mada 3D Secure)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Al-Mulhim Travel simulated gateway</p>
              </div>
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setIsProcessing(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyOTP} className="p-6 space-y-6">
              {/* Payment Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-gray-500">
                  <span>التاجر:</span>
                  <span className="text-left text-[#071428] font-bold">الملحم للسفر والسياحة</span>
                  <span>نوع العملية:</span>
                  <span className="text-left text-[#071428]">شراء تأشيرة {selectedVisa.title}</span>
                  <span>المبلغ الإجمالي:</span>
                  <span className="text-left text-[#C9A227] font-bold text-sm">
                    { (visaPrices[selectedVisa.id] || 300) + Math.round((visaPrices[selectedVisa.id] || 300) * 0.15) } ر.س
                  </span>
                  <span>رقم الهاتف المسجل:</span>
                  <span className="text-left text-[#071428] tracking-wider">
                    {visaFormData.countryCode} {visaFormData.phone.substring(0, 3)}****
                  </span>
                </div>
              </div>

              {/* OTP Code input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 text-center">
                  أدخل رمز التحقق (OTP) المرسل لهاتفك
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-gray-200 rounded-2xl text-center font-bold text-2xl tracking-widest focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none"
                  placeholder="••••"
                  autoFocus
                />
                <p className="text-xs text-center font-semibold text-slate-400">
                  لغرض الاختبار، يرجى إدخال الرمز: <span className="text-[#C9A227] font-bold select-all bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/30">1234</span>
                </p>
                {otpError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              {/* Timer info */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>ينتهي الرمز خلال: <span className="text-red-500 font-bold">{formatTimer(otpTimer)}</span></span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpTimer(300);
                    setOtpCode('');
                    setOtpError('تمت إعادة إرسال الرمز بنجاح (استخدم 1234)');
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  إعادة إرسال الرمز
                </button>
              </div>

              {/* Verify / Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#C9A227] hover:bg-[#B8924A] text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جاري التحقق والدفع...
                  </>
                ) : (
                  'تحقق وإتمام العملية'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default VisaServices;
