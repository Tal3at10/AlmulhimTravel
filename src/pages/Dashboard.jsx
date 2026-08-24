import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Gift, LayoutDashboard, User, LogOut, ShieldAlert,
  Calendar, MapPin, CheckCircle, Clock, XCircle, ArrowLeftRight,
  TrendingUp, Award, ChevronLeft, CreditCard, RefreshCw, Key, Mail, Phone, Ticket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../lib/axios';
import { API_CONFIG } from '../config/api.config';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAuthenticated, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'bookings' | 'profile'
  
  // Wallet state
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    loyaltyPoints: 0,
    loyaltyTier: 'Amateur',
    loyaltyTierAr: 'هاوي',
    pointsToNextTier: 2000,
    walletTransactions: [],
    loyaltyTransactions: []
  });

  // Conversion form state
  const [convertPoints, setConvertPoints] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // Bookings state
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('يرجى تسجيل الدخول للوصول إلى لوحة التحكم');
    }
  }, [isAuthenticated, navigate]);

  // Load wallet data
  const fetchWalletData = async () => {
    setWalletLoading(true);
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.WALLET.GET);
      if (response) {
        setWalletData({
          balance: response.balance || 0,
          loyaltyPoints: response.loyaltyPoints || 0,
          loyaltyTier: response.loyaltyTier || 'Amateur',
          loyaltyTierAr: response.loyaltyTierAr || 'هاوي',
          pointsToNextTier: response.pointsToNextTier || 0,
          walletTransactions: response.walletTransactions || [],
          loyaltyTransactions: response.loyaltyTransactions || []
        });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('فشل تحميل بيانات المحفظة');
    } finally {
      setWalletLoading(false);
    }
  };

  // Load bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.BOOKINGS.MY_BOOKINGS);
      if (response) {
        setBookings(response);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('فشل تحميل الحجوزات');
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
      fetchBookings();
      
      // Initialize profile forms
      if (user) {
        setFullName(user.fullName || '');
        setPhoneNumber(user.phoneNumber || '');
      }
    }
  }, [isAuthenticated, user]);

  // Handle Points Conversion
  const handleConvertPoints = async (e) => {
    e.preventDefault();
    const pointsNum = parseInt(convertPoints);
    
    if (isNaN(pointsNum) || pointsNum <= 0) {
      toast.error('يرجى إدخال قيمة صحيحة للنقاط');
      return;
    }

    if (pointsNum < 500) {
      toast.error('الحد الأدنى للتحويل هو 500 نقطة');
      return;
    }

    if (pointsNum > walletData.loyaltyPoints) {
      toast.error('رصيد نقاطك غير كافٍ');
      return;
    }

    setIsConverting(true);
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.WALLET.CONVERT, { points: pointsNum });
      toast.success(response.message || 'تم تحويل النقاط بنجاح!');
      setConvertPoints('');
      fetchWalletData(); // Refresh balances
    } catch (error) {
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast.error('يرجى ملء كافة الحقول');
      return;
    }

    setIsUpdatingProfile(true);
    const result = await updateProfile({ fullName, phoneNumber });
    setIsUpdatingProfile(false);
    
    if (result.success) {
      fetchWalletData(); // Keep synced
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('يرجى ملء كافة حقول كلمة المرور');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    setIsChangingPassword(true);
    const result = await changePassword({ currentPassword, newPassword });
    setIsChangingPassword(false);

    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Helper to render booking type in Arabic
  const getBookingTypeAr = (type) => {
    switch (type) {
      case 0:
      case 'Hotel':
        return 'فندق';
      case 1:
      case 'Flight':
        return 'طيران';
      case 2:
      case 'Package':
        return 'باقة سياحية';
      default:
        return 'حجز';
    }
  };

  // Helper to render booking status in Arabic
  const getBookingStatusBadge = (status) => {
    const statusStr = status?.toString();
    switch (statusStr) {
      case '0':
      case 'Pending':
        return (
          <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <Clock className="w-3.5 h-3.5" />
            انتظار الدفع
          </span>
        );
      case '1':
      case 'Confirmed':
        return (
          <span className="flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <CheckCircle className="w-3.5 h-3.5" />
            مؤكد
          </span>
        );
      case '2':
      case 'Cancelled':
        return (
          <span className="flex items-center gap-1 bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <XCircle className="w-3.5 h-3.5" />
            ملغي
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-500 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            غير معروف
          </span>
        );
    }
  };

  // Calculate points percentage for the tier progress bar
  const getTierProgressPercent = () => {
    const points = walletData.loyaltyPoints;
    if (points < 2000) return (points / 2000) * 100;
    if (points < 5000) return ((points - 2000) / 3000) * 100;
    if (points < 10000) return ((points - 5000) / 5000) * 100;
    return 100;
  };

  const getNextTierName = () => {
    const tier = walletData.loyaltyTier;
    if (tier === 'Amateur') return 'دبره (Expert)';
    if (tier === 'Expert') return 'رحّال (Traveler)';
    if (tier === 'Traveler') return 'سفير (Ambassador)';
    return '';
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-24 dir-rtl">
      {/* Decorative Background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%23071428' d='M150,100 Q200,50 250,100 T350,100 Q400,150 350,200 T250,200 Q200,150 150,200 T50,200 Q0,150 50,100 T150,100'/%3E%3C/svg%3E")`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-y',
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Header */}
        <div className="bg-gradient-to-l from-[#071428] to-[#122e56] rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[#C9A227]/25 blur-2xl" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">أهلاً بك يا {user.firstName || user.fullName} 👋</h1>
            <p className="text-slate-300 text-sm">مستواك الحالي: <span className="text-[#C9A227] font-bold">{walletData.loyaltyTierAr}</span></p>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="flex gap-4 md:gap-6 relative">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-md border border-white/10 text-center min-w-[120px]">
              <span className="text-xs text-slate-300 block">رصيد المحفظة</span>
              <span className="text-xl font-bold block text-white mt-1">{walletData.balance.toLocaleString()} ر.س</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-md border border-white/10 text-center min-w-[120px]">
              <span className="text-xs text-slate-300 block">نقاط الولاء</span>
              <span className="text-xl font-bold block text-[#C9A227] mt-1">{walletData.loyaltyPoints.toLocaleString()} ن</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all duration-200 border-b-2 outline-none ${
              activeTab === 'wallet'
                ? 'border-[#C9A227] text-[#071428]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            المحفظة والولاء
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all duration-200 border-b-2 outline-none ${
              activeTab === 'bookings'
                ? 'border-[#C9A227] text-[#071428]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            حجوزاتي
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all duration-200 border-b-2 outline-none ${
              activeTab === 'profile'
                ? 'border-[#C9A227] text-[#071428]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            الملف الشخصي
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {walletLoading ? (
                <div className="flex justify-center py-20">
                  <RefreshCw className="w-10 h-10 animate-spin text-[#C9A227]" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Tiers & Convert Card */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Tier Progress Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-[#C9A227]/10 rounded-xl">
                          <Award className="w-6 h-6 text-[#C9A227]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#071428] text-base">مستوى الولاء</h3>
                          <span className="text-xs text-slate-500">تفاصيل فئتك الحالية</span>
                        </div>
                      </div>

                      {/* Tier Indicators */}
                      <div className="flex justify-between items-center bg-[#071428]/5 p-3 rounded-xl mb-4 text-sm font-semibold">
                        <span className="text-[#071428]">الفئة الحالية:</span>
                        <span className="text-[#C9A227] font-bold">{walletData.loyaltyTierAr}</span>
                      </div>

                      {/* Progress Bar */}
                      {walletData.pointsToNextTier > 0 ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-500">
                            <span>الفئة القادمة: {getNextTierName()}</span>
                            <span>متبقي {walletData.pointsToNextTier.toLocaleString()} ن</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#C9A227] to-[#e5ba32] h-full rounded-full transition-all duration-500"
                              style={{ width: `${getTierProgressPercent()}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-sm font-bold text-[#C9A227] bg-[#C9A227]/10 py-2 rounded-lg">
                          🎉 تهانينا! لقد بلغت أعلى مستويات سفراء الملحم
                        </p>
                      )}

                      {/* Info alert */}
                      <div className="mt-5 p-3 bg-amber-500/10 text-amber-900 rounded-xl text-xs flex gap-2 font-medium">
                        <ShieldAlert className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <div>
                          <p className="font-bold text-[#071428] mb-0.5">معدلات الاسترداد والخصم:</p>
                          <ul className="list-disc pr-4 space-y-0.5 mt-1">
                            <li>فئة هاوي: 1% كاش باك من كل حجز</li>
                            <li>فئة دبره: 1.5% كاش باك من كل حجز</li>
                            <li>فئة رحّال: 2% كاش باك من كل حجز</li>
                            <li>فئة سفير: 3% كاش باك من كل حجز</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Point Conversion Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-green-500/10 rounded-xl">
                          <ArrowLeftRight className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#071428] text-base">تحويل نقاط الولاء</h3>
                          <span className="text-xs text-slate-500">100 نقطة = 1 ريال سعودي</span>
                        </div>
                      </div>

                      <form onSubmit={handleConvertPoints} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">النقاط المراد تحويلها</label>
                          <input
                            type="number"
                            min="500"
                            step="100"
                            value={convertPoints}
                            onChange={(e) => setConvertPoints(e.target.value)}
                            placeholder="مثال: 500"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A227] transition-all"
                          />
                        </div>
                        {convertPoints && !isNaN(parseInt(convertPoints)) && (
                          <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-2 rounded-lg text-center">
                            ستحصل على: <span className="text-[#071428] font-bold">{(parseInt(convertPoints) / 100).toLocaleString()} ر.س</span> كاش باك في محفظتك
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={isConverting || !convertPoints || parseInt(convertPoints) < 500 || parseInt(convertPoints) > walletData.loyaltyPoints}
                          className="w-full py-3 bg-[#071428] hover:bg-[#0c2242] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
                        >
                          {isConverting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            'تحويل النقاط إلى محفظتي'
                          )}
                        </button>
                        <p className="text-[10px] text-center text-slate-500 font-medium">الحد الأدنى للتحويل هو 500 نقطة.</p>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Transactions History */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Wallet Transactions Table */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 overflow-hidden">
                      <h3 className="font-bold text-[#071428] text-base mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-[#C9A227]" />
                        سجل حركات المحفظة
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                          <thead className="bg-[#071428]/5 text-[#071428] text-xs font-bold rounded-lg">
                            <tr>
                              <th className="p-3 rounded-r-lg">التاريخ</th>
                              <th className="p-3">النوع</th>
                              <th className="p-3">الوصف</th>
                              <th className="p-3 rounded-l-lg text-left">المبلغ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {walletData.walletTransactions.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="text-center py-8 text-slate-500 font-medium">لا توجد عمليات سابقة بالمحفظة</td>
                              </tr>
                            ) : (
                              walletData.walletTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                  <td className="p-3 text-slate-500 text-xs font-medium">{new Date(tx.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                  <td className="p-3 font-semibold">
                                    {tx.type === 'Purchase' && <span className="text-rose-500">حجز تذكرة</span>}
                                    {tx.type === 'Refund' && <span className="text-green-500">استرداد</span>}
                                    {tx.type === 'Deposit' && <span className="text-blue-500">إيداع</span>}
                                    {tx.type === 'PointsConversion' && <span className="text-[#C9A227]">تحويل نقاط</span>}
                                  </td>
                                  <td className="p-3 text-slate-700 text-xs font-medium">{tx.description}</td>
                                  <td className={`p-3 font-bold text-left ${tx.amount < 0 ? 'text-rose-500' : 'text-green-600'}`}>
                                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} ر.س
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Loyalty Transactions Table */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 overflow-hidden">
                      <h3 className="font-bold text-[#071428] text-base mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-[#C9A227]" />
                        سجل حركات نقاط الولاء
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                          <thead className="bg-[#071428]/5 text-[#071428] text-xs font-bold rounded-lg">
                            <tr>
                              <th className="p-3 rounded-r-lg">التاريخ</th>
                              <th className="p-3">النوع</th>
                              <th className="p-3">الوصف</th>
                              <th className="p-3 rounded-l-lg text-left">النقاط</th>
                            </tr>
                          </thead>
                          <tbody>
                            {walletData.loyaltyTransactions.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="text-center py-8 text-slate-500 font-medium">لا توجد حركات نقاط سابقة</td>
                              </tr>
                            ) : (
                              walletData.loyaltyTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                  <td className="p-3 text-slate-500 text-xs font-medium">{new Date(tx.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                  <td className="p-3 font-semibold">
                                    {tx.points > 0 ? <span className="text-green-500">اكتساب</span> : <span className="text-rose-500">تحويل/خصم</span>}
                                  </td>
                                  <td className="p-3 text-slate-700 text-xs font-medium">{tx.description}</td>
                                  <td className={`p-3 font-bold text-left ${tx.points < 0 ? 'text-rose-500' : 'text-green-600'}`}>
                                    {tx.points > 0 ? `+${tx.points.toLocaleString()}` : tx.points.toLocaleString()} ن
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {bookingsLoading ? (
                <div className="flex justify-center py-20">
                  <RefreshCw className="w-10 h-10 animate-spin text-[#C9A227]" />
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-slate-100">
                      <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">لا توجد أي حجوزات مسجلة على حسابك حتى الآن</p>
                      <button 
                        onClick={() => navigate('/destinations')} 
                        className="mt-4 px-6 py-2.5 bg-[#071428] text-white font-bold rounded-xl text-xs hover:bg-[#0e2444] transition-colors shadow-lg shadow-black/10"
                      >
                        استكشف الباقات السياحية
                      </button>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#071428]/5 flex items-center justify-center shrink-0">
                            <Ticket className="w-6 h-6 text-[#071428]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono font-bold text-sm text-[#071428]">{booking.bookingNumber}</span>
                              <span className="bg-[#C9A227]/10 text-[#C9A227] px-2 py-0.5 rounded text-[10px] font-bold">
                                {getBookingTypeAr(booking.bookingType)}
                              </span>
                              {getBookingStatusBadge(booking.status)}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mt-1.5">{booking.customerName}</h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              تاريخ الحجز: {new Date(booking.createdAt || booking.bookingDate || new Date()).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                          <div>
                            <span className="text-xs text-slate-500 block">المبلغ الإجمالي</span>
                            <span className="font-bold text-base text-[#071428] mt-0.5 block">{booking.totalAmount?.toLocaleString()} {booking.currency || 'SAR'}</span>
                          </div>

                          {/* Print details/voucher if confirmed */}
                          {booking.status === 1 || booking.status === 'Confirmed' ? (
                            <button
                              onClick={() => {
                                // Direct QuestPDF stream from Voucher Pro via Backend
                                window.open(`${API_CONFIG.BASE_URL}/bookings/voucher/${booking.bookingNumber}`, '_blank');
                              }}
                              className="mt-2 px-4 py-2 border border-slate-200 hover:border-[#C9A227] hover:text-[#C9A227] font-semibold text-xs text-slate-600 rounded-lg transition-all"
                            >
                              تحميل الفاوتشر (PDF)
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Profile Settings Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="font-bold text-[#071428] text-base mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C9A227]" />
                  تعديل الملف الشخصي
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم الكامل</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] focus:bg-white text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الجوال</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] focus:bg-white text-sm outline-none transition-all ltr-input text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">البريد الإلكتروني (لا يمكن تعديله)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full pl-4 pr-10 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full py-3 bg-[#071428] hover:bg-[#0c2242] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    {isUpdatingProfile ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'تحديث البيانات'
                    )}
                  </button>
                </form>
              </div>

              {/* Password Settings Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="font-bold text-[#071428] text-base mb-6 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#C9A227]" />
                  تغيير كلمة المرور
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-3 bg-[#071428] hover:bg-[#0c2242] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    {isChangingPassword ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'تغيير كلمة المرور'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
