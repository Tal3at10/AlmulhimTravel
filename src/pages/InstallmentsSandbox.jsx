import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Smartphone, Lock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AlmulhemLogo from '../components/ui/AlmulhemLogo';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5284/api').replace('/api', '');

const InstallmentsSandbox = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const provider = (searchParams.get('provider') || 'tabby').toLowerCase();
  const bookingId = searchParams.get('bookingId');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const reference = searchParams.get('ref') || 'ALM-REF';

  const [step, setStep] = useState(1); // 1: Schedule & Phone, 2: OTP, 3: Success, 4: Failed
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // Colors based on provider
  const isTabby = provider === 'tabby';
  const brandColor = isTabby ? '#3DF2C9' : '#FF5B26'; // Tabby Teal vs Tamara Orange
  const brandBg = isTabby ? 'bg-[#3DF2C9]' : 'bg-[#FF5B26]';
  const brandText = isTabby ? 'text-[#071428]' : 'text-white';
  const brandName = isTabby ? 'تابي (Tabby)' : 'تمارا (Tamara)';

  // Calculate installment breakdown
  const monthlyAmount = (amount / 4).toFixed(2);
  const today = new Date();
  
  const getPaymentDate = (monthsToAdd) => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + monthsToAdd);
    return d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('الرجاء إدخال رقم جوال صحيح');
      return;
    }
    setStep(2);
    setTimer(60);
    toast.success('تم إرسال رمز التحقق التجريبي: 1234');
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode !== '1234' && otpCode !== '0000') {
      toast.error('رمز التحقق غير صحيح، استخدم 1234 للتجربة');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/installments/confirm`, {
        bookingId,
        status: 'Approved'
      });
      
      toast.success(response.data.message || 'تمت العملية بنجاح');
      setStep(3);
      
      // Redirect to success page
      setTimeout(() => {
        navigate(`/booking-success?bookingRef=${reference}&hotelName=${encodeURIComponent(provider.toUpperCase() + ' التقسيط')}`);
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء تأكيد الدفع');
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!window.confirm('هل أنت متأكد من إلغاء عملية التقسيط؟ سيؤدي ذلك لإلغاء الحجز.')) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/installments/confirm`, {
        bookingId,
        status: 'Cancelled'
      });
      
      toast.error('تم إلغاء عملية الدفع وإلغاء الحجز');
      setStep(4);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('فشل إلغاء الحجز بالخادم، جاري العودة للرئيسية');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Custom SVG logo for Tabby / Tamara */}
            {isTabby ? (
              <div className="flex items-center gap-1.5 font-black text-2xl tracking-tighter text-[#071428]">
                <span className="bg-[#3DF2C9] px-2 py-0.5 rounded text-[#071428] font-bold">tabby</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 font-bold text-2xl text-[#FF5B26] tracking-tight">
                <span>tamara</span>
                <span className="text-slate-800 font-normal text-xs bg-slate-100 px-1.5 py-0.5 rounded">تمارا</span>
              </div>
            )}
            <span className="text-xs text-slate-400 font-bold border-r pr-3 border-slate-200">بوابة محاكاة الدفع</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">التاجر:</span>
            <AlmulhemLogo className="h-8" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-lg w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {/* Warning Sandbox Header */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 items-start shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">بيئة فحص آمنة (Sandbox Sandbox)</h4>
            <p className="text-xs text-amber-700/95 mt-1 leading-relaxed">
              هذه الصفحة تحاكي بوابة الدفع بالتقسيط لـ {brandName}. لن يتم خصم أي مبالغ حقيقية من حسابك. يرجى استخدام رمز التحقق <strong>1234</strong> لإكمال الفحص.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
          {/* Top Banner */}
          <div className={`p-4 ${brandBg} ${brandText} flex justify-between items-center font-bold`}>
            <span>قسّم فاتورتك على 4 دفعات بدون فوائد</span>
            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full text-xs">Sandbox</span>
          </div>

          {/* Booking Summary */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500">رقم الحجز المرجعي</p>
              <p className="font-mono font-bold text-slate-700">#{reference}</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500">المبلغ الإجمالي</p>
              <p className="font-extrabold text-lg text-[#071428]">{amount.toFixed(2)} ر.س</p>
            </div>
          </div>

          {/* Stepper Wizard Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Payment Timeline */}
                  <div>
                    <h3 className="font-bold text-slate-700 mb-4 text-sm">جدول أقساط الدفع المخطط:</h3>
                    
                    <div className="relative border-r-2 border-slate-200 pr-5 mr-3 space-y-5 py-1">
                      {/* Payment 1 */}
                      <div className="relative">
                        <div className="absolute right-[-26px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#071428] border-2 border-white" />
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-bold text-slate-800">الدفعة الأولى (اليوم)</span>
                            <p className="text-xs text-slate-500">{getPaymentDate(0)}</p>
                          </div>
                          <span className="font-bold text-[#071428]">{monthlyAmount} ر.س</span>
                        </div>
                      </div>

                      {/* Payment 2 */}
                      <div className="relative">
                        <div className="absolute right-[-26px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-slate-700">الدفعة الثانية (بعد شهر)</span>
                            <p className="text-xs text-slate-500">{getPaymentDate(1)}</p>
                          </div>
                          <span className="font-semibold text-slate-700">{monthlyAmount} ر.س</span>
                        </div>
                      </div>

                      {/* Payment 3 */}
                      <div className="relative">
                        <div className="absolute right-[-26px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-slate-700">الدفعة الثالثة (بعد شهرين)</span>
                            <p className="text-xs text-slate-500">{getPaymentDate(2)}</p>
                          </div>
                          <span className="font-semibold text-slate-700">{monthlyAmount} ر.س</span>
                        </div>
                      </div>

                      {/* Payment 4 */}
                      <div className="relative">
                        <div className="absolute right-[-26px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-slate-700">الدفعة الرابعة والأخيرة</span>
                            <p className="text-xs text-slate-500">{getPaymentDate(3)}</p>
                          </div>
                          <span className="font-semibold text-slate-700">{monthlyAmount} ر.س</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Input Form */}
                  <form onSubmit={handleSendOtp} className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">أدخل رقم جوالك للمتابعة</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="5XXXXXXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-left pl-4 pr-12 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#071428] focus:border-[#071428] transition-all font-mono text-lg tracking-wider"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                          <Smartphone className="w-5 h-5" />
                          <span className="font-bold text-sm border-l pl-2 pr-1 ml-1 border-slate-200">+966</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{ backgroundColor: brandColor, color: isTabby ? '#071428' : 'white' }}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                      <span>أرسل رمز التحقق</span>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 text-center"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-800">رمز التحقق المرسل</h3>
                    <p className="text-xs text-slate-500 mt-1">أدخل الرمز المكون من 4 أرقام المرسل إلى +966 {phoneNumber}</p>
                  </div>

                  {/* OTP inputs */}
                  <div className="flex justify-center gap-3" dir="ltr">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-14 h-14 text-center border-2 border-slate-300 focus:border-[#071428] focus:ring-2 focus:ring-[#071428] rounded-xl text-2xl font-bold font-mono transition-all"
                      />
                    ))}
                  </div>

                  <div className="text-xs text-slate-500">
                    {timer > 0 ? (
                      <p>إعادة إرسال الرمز خلال {timer} ثانية</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTimer(60);
                          toast.success('تمت إعادة إرسال رمز التحقق: 1234');
                        }}
                        className="text-[#071428] font-bold underline cursor-pointer"
                      >
                        إعادة إرسال الرمز
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.some(d => d === '')}
                      className="w-full bg-[#071428] hover:bg-[#0c2447] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>تأكيد الدفع وتقسيم الفاتورة</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full text-slate-500 hover:text-slate-700 py-2 text-sm font-semibold"
                    >
                      تعديل رقم الجوال
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">تم قبول دفعة التقسيط بنجاح</h3>
                    <p className="text-sm text-slate-500 mt-2">جاري توجيهك الآن لإكمال الحجز في سفريات الملحم...</p>
                  </div>
                  <div className="flex justify-center pt-4">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#071428]" />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">تم إلغاء عملية التقسيط</h3>
                    <p className="text-sm text-slate-500 mt-2">تم إلغاء الحجز بناءً على طلبك، جاري إعادتك للموقع الرئيسي...</p>
                  </div>
                  <div className="flex justify-center pt-4">
                    <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Cancel Operation / Back Button */}
        {step < 3 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleCancelPayment}
              disabled={loading}
              className="text-sm font-semibold text-rose-600 hover:text-rose-700 border-b border-rose-600/30 hover:border-rose-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>إلغاء عملية التقسيط والعودة للموقع</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 justify-center">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-500">حماية دفع آمنة 100% ومشفرة بالكامل</span>
          </div>
          <p>© {new Date().getFullYear()} {brandName}. جميع الحقوق محفوظة لبيئة الفحص.</p>
        </div>
      </footer>
    </div>
  );
};

export default InstallmentsSandbox;
