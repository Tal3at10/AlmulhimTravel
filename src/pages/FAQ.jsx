import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle,
  Plane,
  CreditCard,
  Users,
  XCircle,
  MapPin,
  MessageCircle
} from 'lucide-react';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';

const faqCategories = [
  {
    id: 'booking',
    title: 'الحجز والأسعار',
    icon: Plane,
    questions: [
      {
        question: 'هل الأسعار شاملة الطيران؟',
        answer: 'أسعار الباقات السياحية تشمل الإقامة الفندقية والتنقلات الداخلية والبرنامج السياحي الكامل. تذاكر الطيران الدولي عادةً غير مشمولة ويتم حجزها بشكل منفصل حسب التاريخ المناسب لك لضمان أفضل سعر ممكن.'
      },
      {
        question: 'كيف يتم احتساب سعر الباقة؟',
        answer: 'يتم احتساب السعر بناءً على عدة عوامل: عدد الأشخاص، مستوى الفندق، موسم السفر، ومدة الإقامة. نقدم لك عرض سعر مخصص يناسب احتياجاتك وميزانيتك.'
      },
      {
        question: 'هل يمكن تعديل الباقة حسب رغبتي؟',
        answer: 'بالتأكيد! جميع باقاتنا قابلة للتخصيص. يمكنك تغيير الفنادق، إضافة أو إزالة أيام، تعديل البرنامج السياحي، أو إضافة خدمات إضافية حسب رغبتك.'
      },
      {
        question: 'متى يجب أن أحجز الباقة؟',
        answer: 'ننصح بالحجز المبكر (قبل شهرين على الأقل) للحصول على أفضل الأسعار وتوفر الفنادق المفضلة. الحجز المبكر يمنحك أيضاً مرونة أكبر في اختيار التواريخ.'
      }
    ]
  },
  {
    id: 'payment',
    title: 'الدفع والتقسيط',
    icon: CreditCard,
    questions: [
      {
        question: 'ما هي طرق الدفع المتاحة؟',
        answer: 'نقبل عدة طرق للدفع: التحويل البنكي، بطاقات مدى، فيزا وماستركارد. كما نوفر خدمات التقسيط المريح عبر تابي وتمارا. ننصح بالدفع الكاش أو الحوالة البنكية للاستفادة من الخصم الخاص.'
      },
      {
        question: 'هل يمكن الدفع بالتقسيط؟',
        answer: 'نعم، نوفر خيارات تقسيط مرنة عبر تابي وتمارا. يمكنك تقسيم المبلغ على 3 أو 4 دفعات بدون فوائد. الموافقة فورية وبدون أوراق معقدة.'
      },
      {
        question: 'متى يجب دفع المبلغ كاملاً؟',
        answer: 'عادةً نطلب دفعة مقدمة عند الحجز (30-50%) والباقي قبل السفر بأسبوعين. يمكن التفاوض على جدول دفع مناسب حسب حالتك.'
      },
      {
        question: 'هل يوجد خصم للدفع الكاش؟',
        answer: 'نعم! نقدم خصم خاص للعملاء الذين يدفعون كاش أو عبر التحويل البنكي المباشر. تواصل معنا لمعرفة قيمة الخصم على باقتك.'
      }
    ]
  },
  {
    id: 'services',
    title: 'الخدمات المقدمة',
    icon: Users,
    questions: [
      {
        question: 'هل يوجد مرشد سياحي؟',
        answer: 'نعم، معظم باقاتنا تتضمن مرشد سياحي محترف يتحدث العربية بطلاقة. المرشد يرافقكم طوال فترة البرنامج السياحي مع توفير مواصلات خاصة مريحة.'
      },
      {
        question: 'ما هي الخدمات المشمولة في الباقة؟',
        answer: 'الباقة تشمل: الإقامة الفندقية، الإفطار اليومي، التنقلات الداخلية، المرشد السياحي، رسوم دخول المعالم السياحية الرئيسية، وخط هاتف محلي في بعض الوجهات.'
      },
      {
        question: 'هل يمكن إضافة خدمات إضافية؟',
        answer: 'بالتأكيد! يمكنك إضافة: جولات إضافية، ترقية الفنادق، وجبات إضافية، خدمة الانتقالات من المطار، أو أي خدمة خاصة تحتاجها.'
      },
      {
        question: 'هل تساعدون في استخراج التأشيرة؟',
        answer: 'نعم، نقدم خدمة استخراج التأشيرات لجميع الوجهات. فريقنا المتخصص يساعدك في تجهيز الأوراق وتقديم الطلب ومتابعته حتى الحصول على التأشيرة.'
      }
    ]
  },
  {
    id: 'cancellation',
    title: 'الإلغاء والتعديل',
    icon: XCircle,
    questions: [
      {
        question: 'ما هي سياسة الإلغاء؟',
        answer: 'لدينا نوعان من الحجوزات:\n• حجز مسترد: يمكن إلغاؤه مع استرداد جزئي (تكلفة أعلى قليلاً)\n• حجز غير مسترد: لا يمكن إلغاؤه (تكلفة أقل)\n\nكلما كان الحجز مبكراً، كلما حصلت على شروط وأسعار أفضل.'
      },
      {
        question: 'هل يمكن تأجيل موعد السفر؟',
        answer: 'نعم، يمكن تأجيل الحجز حسب توفر الفنادق والخدمات في التاريخ الجديد. قد تطبق رسوم تعديل بسيطة حسب سياسة الفنادق وشركات الطيران.'
      },
      {
        question: 'ماذا لو حدث طارئ ولم أستطع السفر؟',
        answer: 'في حالة الطوارئ، نحاول مساعدتك قدر الإمكان. ننصح بشراء تأمين السفر الذي يغطي حالات الإلغاء للطوارئ الطبية أو الظروف القاهرة.'
      },
      {
        question: 'كم يستغرق استرداد المبلغ؟',
        answer: 'في حالة الحجوزات المستردة، يتم معالجة الاسترداد خلال 7-14 يوم عمل بعد خصم رسوم الإلغاء المطبقة حسب سياسة الحجز.'
      }
    ]
  },
  {
    id: 'contact',
    title: 'التواصل والموقع',
    icon: MapPin,
    questions: [
      {
        question: 'وين موقعكم وكيف أتواصل معكم؟',
        answer: '📍 الموقع: الهفوف والمبرز، المملكة العربية السعودية\n📞 واتساب: +966 53 572 7771\n🌐 الموقع الإلكتروني: almulhimtravel.com\n⏰ أوقات العمل: السبت - الخميس، 10 صباحاً - 8:30 مساءً'
      },
      {
        question: 'هل يمكن زيارة المكتب شخصياً؟',
        answer: 'بالتأكيد! نرحب بزيارتك لمكتبنا في الهفوف. ننصح بحجز موعد مسبق عبر الواتساب لضمان توفر المستشار المناسب لخدمتك.'
      },
      {
        question: 'كم يستغرق الرد على الاستفسارات؟',
        answer: 'نحرص على الرد خلال ساعات العمل في أسرع وقت ممكن (عادةً خلال ساعة). للاستفسارات العاجلة، يمكنك الاتصال مباشرة على رقم الواتساب.'
      },
      {
        question: 'هل تقدمون استشارات مجانية؟',
        answer: 'نعم! نقدم استشارات سياحية مجانية لمساعدتك في اختيار الوجهة المناسبة والباقة الأفضل لك. تواصل معنا وسنسعد بخدمتك.'
      }
    ]
  }
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <motion.div
      className="border-b border-slate-200 last:border-0"
      initial={false}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-right hover:text-[#C9A227] transition-colors group"
      >
        <span className="text-base md:text-lg font-semibold text-[#071428] pr-4 group-hover:text-[#C9A227] flex-1">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-[#C9A227] flex-shrink-0" strokeWidth={2} />
        ) : (
          <ChevronDown className="w-6 h-6 text-slate-400 flex-shrink-0 group-hover:text-[#C9A227]" strokeWidth={2} />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-4 text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (categoryId, questionIndex) => {
    const key = `${categoryId}-${questionIndex}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category =>
    (activeCategory === 'all' || activeCategory === category.id) &&
    category.questions.length > 0
  );

  return (
    <div className="pt-header-offset">
      <SEO
        title="الأسئلة الشائعة"
        description="إجابات على جميع أسئلتك حول خدمات السفر والسياحة، الحجوزات، الدفع، التأشيرات والمزيد مع الملحم للسياحة"
        keywords="أسئلة شائعة, استفسارات السفر, حجز الباقات, سياسة الإلغاء, طرق الدفع, الملحم"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#071428] via-[#002855] to-[#071428] py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#C9A227] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C9A227] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <HelpCircle className="w-16 h-16 text-[#C9A227] mx-auto mb-6" strokeWidth={1.5} />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-white/90 mb-8">
              إجابات واضحة على جميع استفساراتك حول خدماتنا
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن سؤالك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A227] transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-slate-100 sticky top-header-offset z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-[#C9A227] text-white shadow-lg'
                  : 'bg-slate-100 text-[#071428] hover:bg-slate-200'
              }`}
            >
              الكل
            </button>
            {faqCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-[#C9A227] text-white shadow-lg'
                      : 'bg-slate-100 text-[#071428] hover:bg-slate-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-[#fdfbf7]">
        <div className="container mx-auto px-4 max-w-5xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">لم نجد نتائج</h3>
              <p className="text-slate-500">جرب البحث بكلمات مختلفة أو تصفح الأقسام</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-[#071428] to-[#002855] px-6 py-4 flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-[#C9A227]" strokeWidth={2} />
                      <h2 className="text-xl font-bold text-white">{category.title}</h2>
                    </div>
                    <div className="p-6">
                      {category.questions.map((question, questionIndex) => (
                        <FAQItem
                          key={questionIndex}
                          question={question.question}
                          answer={question.answer}
                          isOpen={openQuestions[`${category.id}-${questionIndex}`]}
                          onToggle={() => toggleQuestion(category.id, questionIndex)}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MessageCircle className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#071428] mb-3 font-serif">
              لم تجد إجابة لسؤالك؟
            </h2>
            <p className="text-slate-600 mb-6">
              فريقنا جاهز لمساعدتك والإجابة على جميع استفساراتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/966535727771"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                تواصل عبر واتساب
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#071428] hover:bg-[#002855] text-white px-8 py-3 rounded-xl font-bold transition-all duration-300"
              >
                صفحة اتصل بنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default FAQ;
