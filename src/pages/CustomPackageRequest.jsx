import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';
import { motion } from 'framer-motion';

export default function CustomPackageRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    email: '',
    destination: '',
    nights: 3,
    adults: 1,
    children: 0,
    budget: '',
    expectedArrivalDate: '',
    specialRequirements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.rfp.submit(formData);
      toast.success('تم إرسال طلبك بنجاح! سيتواصل معك فريقنا قريباً بعروض مخصصة.');
      navigate('/');
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-header-offset min-h-screen bg-[#fdfbf7] flex flex-col justify-between">
      <SEO 
        title="صمم رحلتك الخاصة | سفريات الملحم" 
        description="صمم باقتك السياحية الخاصة حسب رغبتك وميزانيتك وسيقوم وكلائنا بتقديم أفضل العروض المخصصة لك بأعلى جودة." 
      />
      
      {/* Decorative Gold Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-[#C9A227]/3 blur-3xl" />
        <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-[#071428]/3 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10 flex-grow">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#071428]/60 hover:text-[#C9A227] font-semibold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          <span>العودة للرئيسية</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>صمم باقتك السياحية على كيفك</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#071428] mb-4 leading-tight font-serif">
            خطّط لرحلتك الاستثنائية
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            حدد وجهتك، ميزانيتك وتفاصيل إقامتك، وسيتولى مستشارو السفر لدينا تصميم أفضل عرض مخصص لك.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Accent colored top bar */}
          <div className="h-2 bg-gradient-to-r from-[#071428] via-[#C9A227] to-[#071428]" />

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Section 1: Personal Info */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-[#071428]">المعلومات الشخصية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل *</label>
                    <div className="relative">
                      <User className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="clientName"
                        required
                        value={formData.clientName}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                        placeholder="الاسم الثلاثي"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">رقم الجوال *</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        dir="ltr"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 text-right font-semibold"
                        placeholder="+966 50 000 0000"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني (اختياري)</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                        placeholder="example@domain.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Trip Details */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-[#071428]">تفاصيل الرحلة والوجهات</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">الوجهة السياحية المطلوبة *</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="destination"
                        required
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                        placeholder="مثال: لندن، باريس، ماليزيا، دبي..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ السفر المتوقع</label>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        type="date"
                        name="expectedArrivalDate"
                        value={formData.expectedArrivalDate}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الميزانية الإجمالية المتوقعة (ريال سعودي)</label>
                    <div className="relative">
                      <DollarSign className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                        placeholder="مثال: 10000"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">عدد المسافرين البالغين (+12 سنة)</label>
                    <div className="relative">
                      <Users className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        name="adults"
                        min="1"
                        value={formData.adults}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">عدد الأطفال (أقل من 12 سنة)</label>
                    <div className="relative">
                      <Users className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        name="children"
                        min="0"
                        value={formData.children}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">مدة الإقامة المطلوبة (بالليالي)</label>
                    <div className="relative">
                      <Clock className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        name="nights"
                        min="1"
                        value={formData.nights}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Extra Info */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-[#071428]">تفاصيل ومتطلبات إضافية</h3>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">أي تفاصيل أو رغبات خاصة؟ (فندق محدد، وجبات، إلخ)</label>
                  <textarea
                    name="specialRequirements"
                    rows="4"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-transparent focus:bg-white transition-all outline-none text-slate-800 font-semibold resize-none"
                    placeholder="مثال: غرف متصلة، إطلالة على البحر، فنادق قريبة من مراكز التسوق والمترو..."
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#DFBA44] hover:from-[#DFBA44] hover:to-[#C9A227] text-[#071428] font-extrabold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-[#071428] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>إرسال طلب التسعير</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-slate-400 text-sm mt-4 font-semibold">
                  سنقوم بالرد عليك خلال 24 ساعة بأفضل العروض والأسعار المتاحة.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
