import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Loader2, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const { login, register, forgotPassword } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhoneNumber('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login({ email, password });
        if (result.success) {
          handleClose();
        } else {
          toast.error(result.error || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
        }
      } else if (mode === 'register') {
        if (!fullName.trim()) {
          toast.error('يرجى إدخال الاسم الكامل');
          setLoading(false);
          return;
        }
        if (!phoneNumber.trim()) {
          toast.error('يرجى إدخال رقم الجوال');
          setLoading(false);
          return;
        }
        const result = await register({ email, password, fullName, phoneNumber });
        if (result.success) {
          handleClose();
        } else {
          toast.error(result.error || 'فشل إنشاء الحساب.');
        }
      } else if (mode === 'forgot') {
        const result = await forgotPassword(email);
        if (result.success) {
          setMode('login');
        } else {
          toast.error(result.error || 'فشل إرسال طلب إعادة تعيين كلمة المرور.');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#071428]/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-[#071428]/80 text-white shadow-2xl backdrop-blur-xl p-8 dir-rtl"
        >
          {/* Decorative glowing gradient sphere */}
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-[#C9A227]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#C9A227]/10 blur-3xl" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and subtitle */}
          <div className="text-center mb-8 relative">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#C9A227] to-white bg-clip-text text-transparent">
              {mode === 'login' && 'تسجيل الدخول'}
              {mode === 'register' && 'إنشاء حساب جديد'}
              {mode === 'forgot' && 'نسيت كلمة المرور'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {mode === 'login' && 'مرحباً بك مجدداً في الملحم للسياحة والسفر'}
              {mode === 'register' && 'انضم إلينا واستمتع بمميزات المحفظة ونقاط الولاء'}
              {mode === 'forgot' && 'أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">الاسم الكامل</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-white outline-none transition-all duration-200 text-sm"
                    placeholder="محمد عبدالله"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">رقم الجوال</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-white outline-none transition-all duration-200 text-sm ltr-input text-right"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-white outline-none transition-all duration-200 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">كلمة المرور</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-[#C9A227] hover:text-[#e5ba32] hover:underline transition-colors duration-200"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-white outline-none transition-all duration-200 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#C9A227] to-[#e5ba32] hover:from-[#e5ba32] hover:to-[#C9A227] active:scale-[0.98] text-[#071428] font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'تسجيل الدخول'}
                  {mode === 'register' && 'إنشاء الحساب'}
                  {mode === 'forgot' && 'إرسال طلب الاستعادة'}
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-slate-400 relative">
            {mode === 'login' && (
              <p>
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#C9A227] hover:text-[#e5ba32] font-semibold hover:underline transition-colors duration-200"
                >
                  أنشئ حساباً الآن
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#C9A227] hover:text-[#e5ba32] font-semibold hover:underline transition-colors duration-200"
                >
                  سجل دخولك
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <button
                onClick={() => setMode('login')}
                className="text-[#C9A227] hover:text-[#e5ba32] font-semibold hover:underline transition-colors duration-200"
              >
                العودة لتسجيل الدخول
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
