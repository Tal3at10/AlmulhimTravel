import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Lock, CreditCard, Smartphone, Apple,
  Star, Calendar, Users, Moon, Shield, ChevronDown,
  Clock, Car, AlertCircle, Wallet, ArrowRight, ArrowLeft
} from 'lucide-react';
import AlmulhemLogo from '../components/ui/AlmulhemLogo';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import apiService from '../services/api.service';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axios from '../lib/axios';

// Progress Stepper Component (5 Steps)
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'بيانات الضيوف' },
    { id: 2, label: 'ترقيات السفر' },
    { id: 3, label: 'مراجعة الحجز' },
    { id: 4, label: 'الدفع' },
    { id: 5, label: 'التأكيد' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 max-w-3xl mx-auto py-2">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-[#071428] text-white ring-4 ring-[#C9A227]/30'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`text-[10px] md:text-xs mt-1.5 whitespace-nowrap font-medium transition-colors ${
                isActive ? 'text-[#071428] font-bold' : isCompleted ? 'text-green-600' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 rounded relative bg-slate-100">
                <div 
                  className="absolute top-0 right-0 h-full bg-green-500 transition-all duration-500" 
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Booking Summary Card
const BookingSummary = ({ 
  bookingData, 
  isCollapsed, 
  onToggle, 
  useWallet, 
  isAuthenticated, 
  user,
  upgrades,
  couponDiscount = 0,
  couponCode = '',
  onRemoveCoupon = null
}) => {
  if (!bookingData) return null;

  const cur = bookingData.pricing.currency === 'USD' ? '$' : bookingData.pricing.currency;
  const isNotSar = bookingData.pricing.currency !== 'SAR';
  const conversionRate = bookingData.pricing.conversionRate || 1;

  const upgradesTotal = upgrades.total;
  const upgradesTotalSAR = upgrades.totalSAR;

  const basePriceWithTaxesAndUpgrades = bookingData.pricing.total + upgradesTotal;
  const basePriceWithTaxesAndUpgradesSAR = bookingData.pricing.totalInSAR + upgradesTotalSAR;

  const discountInTargetCurrency = couponDiscount / conversionRate;
  const priceAfterCouponSAR = Math.max(0, basePriceWithTaxesAndUpgradesSAR - couponDiscount);

  // Calculate wallet deduction
  const walletDeductionInSAR = useWallet && isAuthenticated && user ? Math.min(priceAfterCouponSAR, user.walletBalance || 0) : 0;
  const walletDeduction = walletDeductionInSAR / conversionRate;
  const finalPayable = Math.max(0, basePriceWithTaxesAndUpgrades - discountInTargetCurrency - walletDeduction);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Mobile Toggle Header */}
      <button
        onClick={onToggle}
        className="lg:hidden w-full p-4 flex items-center justify-between bg-slate-50 border-b border-slate-200"
      >
        <span className="font-bold text-[#071428]">ملخص الحجز</span>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-bold text-[#C9A227]">
            {finalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
          </span>
          {isNotSar && (
            <span className="text-[10px] text-slate-500">
              (يعادل {(finalPayable * conversionRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} ر.س)
            </span>
          )}
        </div>
      </button>

      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        {/* Hotel Info */}
        <div className="p-4 border-b border-slate-100 bg-[#071428]/5">
          <div className="flex gap-4">
            <img
              src={bookingData.hotel.image}
              alt={bookingData.hotel.name}
              className="w-20 h-20 object-cover rounded-lg border border-slate-200"
            />
            <div>
              <div className="flex gap-1 mb-1">
                {[...Array(bookingData.hotel.stars || 4)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                ))}
              </div>
              <h3 className="font-bold text-sm text-[#071428] line-clamp-1">{bookingData.hotel.name}</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">{bookingData.room.name}</p>
            </div>
          </div>
        </div>

        {/* Dates & Room */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-[#C9A227]" />
              <span className="text-xs">تسجيل الوصول</span>
            </div>
            <span className="text-xs font-semibold text-[#071428]">{bookingData.dates.checkIn}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-[#C9A227]" />
              <span className="text-xs">تسجيل المغادرة</span>
            </div>
            <span className="text-xs font-semibold text-[#071428]">{bookingData.dates.checkOut}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Moon className="w-4 h-4 text-[#C9A227]" />
              <span className="text-xs">المدة</span>
            </div>
            <span className="text-xs font-semibold text-[#071428]">{bookingData.dates.nights} ليالي</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4 text-[#C9A227]" />
              <span className="text-xs">الضيوف والغرف</span>
            </div>
            <span className="text-xs font-semibold text-[#071428]">{bookingData.guests} ضيوف / {bookingData.room.quantity} غرف</span>
          </div>
        </div>

        {/* Selected Upgrades Breakdown */}
        {upgrades.totalSAR > 0 && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">الخدمات الإضافية المختارة</span>
            {upgrades.insuranceSAR > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Shield className="w-3.5 h-3.5 text-green-600" /> تأمين السفر التكافلي
                </span>
                <span className="font-medium">{upgrades.insurance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}</span>
              </div>
            )}
            {upgrades.esimSAR > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Smartphone className="w-3.5 h-3.5 text-green-600" /> شريحة eSIM دولية
                </span>
                <span className="font-medium">{upgrades.esim.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}</span>
              </div>
            )}
            {upgrades.transferSAR > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Car className="w-3.5 h-3.5 text-green-600" /> نقل مطار متميز
                </span>
                <span className="font-medium">{upgrades.transfer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}</span>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-xs text-slate-600">
            <span>سعر الغرفة ({bookingData.dates.nights} ليالي)</span>
            <span>{bookingData.pricing.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>الضرائب والرسوم</span>
            <span>{bookingData.pricing.taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>رسوم الخدمة</span>
            <span>{bookingData.pricing.serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}</span>
          </div>

          {couponCode && couponDiscount > 0 && (
            <div className="flex justify-between text-xs text-green-600 font-semibold bg-green-50 p-2.5 rounded-xl border border-green-100 items-center">
              <span className="flex items-center gap-1.5">
                الكوبون ({couponCode})
                {onRemoveCoupon && (
                  <button type="button" onClick={onRemoveCoupon} className="text-rose-500 hover:text-rose-700 mr-2 text-[10px] font-bold cursor-pointer">
                    إزالة
                  </button>
                )}
              </span>
              <span>
                -{(couponDiscount / conversionRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
              </span>
            </div>
          )}
          
          {useWallet && isAuthenticated && user && user.walletBalance > 0 && (
            <div className="flex justify-between text-xs text-green-600 font-semibold mb-2">
              <span>رصيد المحفظة المسترجع</span>
              <span className="text-left font-bold">
                -{walletDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
                {isNotSar && (
                  <span className="block text-[9px] text-green-600/80 font-normal">
                    (يعادل -{walletDeductionInSAR.toLocaleString()} ر.س)
                  </span>
                )}
              </span>
            </div>
          )}
          
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 text-sm">المستحق للدفع</span>
              <div className="text-left">
                <span className="text-xl font-black text-[#C9A227]">
                  {finalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
                </span>
                {isNotSar && (
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                    (يعادل {(finalPayable * conversionRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} ر.س)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Free Cancel Badge */}
        <div className="p-3.5 bg-green-50 border-t border-green-100 flex items-center gap-2 text-green-700 text-xs font-semibold">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>إلغاء مجاني متاح حتى يومين قبل موعد الوصول</span>
        </div>
      </div>
    </div>
  );
};

const isValidGuid = (id) => {
  if (!id) return false;
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(id);
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [useWallet, setUseWallet] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Coupons State
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Upgrades State
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [esimPlan, setEsimPlan] = useState('none'); // 'none', '10gb', '20gb'
  const [transferType, setTransferType] = useState('none'); // 'none', 'sedan', 'suv'

  const [gender, setGender] = useState('male');
  const [selectedSpecialRequests, setSelectedSpecialRequests] = useState([]);
  const specialRequestOptions = [
    'سرير أطفال', 'غرفة لغير المدخنين', 'إزالة المشروبات الكحولية',
    'أسرة منفصلة', 'غرفة للمدخنين', 'مسبح'
  ];

  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    emailConfirm: '',
    phone: '',
    countryCode: '+966',
    nationality: 'SA',
    dob: '',
    bookingForSomeoneElse: false,
    specialRequests: '',
    lateCheckIn: false,
    agreeTerms: false,
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  // Exchange Rates relative to SAR
  const [exchangeRates, setExchangeRates] = useState({
    'SAR': 1.0,
    'USD': 3.75,
    'EUR': 4.02,
    'GBP': 4.81,
    'AED': 1.02,
    'KWD': 12.21,
    'BHD': 9.95,
    'OMR': 9.74,
    'QAR': 1.03,
    'EGP': 0.078,
  });

  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/SAR');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            const newRates = { 'SAR': 1.0 };
            Object.keys(data.rates).forEach(cur => {
              if (data.rates[cur] > 0) {
                newRates[cur] = 1 / data.rates[cur];
              }
            });
            setExchangeRates(prev => ({ ...prev, ...newRates }));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live exchange rates, using fallback rates:', err);
      }
    };
    fetchLiveRates();
  }, []);

  // Parse URL search params into checkout details
  useEffect(() => {
    const hotelName = searchParams.get('hotelName') || searchParams.get('name') || 'فندق';
    const roomName = searchParams.get('roomName') || searchParams.get('room') || 'غرفة قياسية';
    const checkIn = searchParams.get('checkIn') || searchParams.get('checkin') || '';
    const checkOut = searchParams.get('checkOut') || searchParams.get('checkout') || '';
    const guests = parseInt(searchParams.get('guests') || searchParams.get('adults') || '2');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const price = parseFloat(searchParams.get('price') || '0');
    const currency = searchParams.get('currency') || 'SAR';
    const hotelImage = searchParams.get('image') || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80';
    const hotelId = searchParams.get('hotelId') || searchParams.get('hotelid') || '';
    
    const isGds = hotelId === '' || !isValidGuid(hotelId);
    const nights = checkIn && checkOut ?
      Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 3;

    const basePrice = isGds ? (price * nights) : price;
    const taxes = Math.round(basePrice * 0.15 * 100) / 100;
    const serviceFee = Math.round(basePrice * 0.05 * 100) / 100;
    const total = basePrice + taxes + serviceFee;

    const conversionRate = exchangeRates[currency] || 1;
    const totalInSAR = total * conversionRate;

    setBookingData({
      hotel: {
        id: hotelId,
        name: hotelName,
        stars: 4,
        image: hotelImage,
      },
      room: {
        id: searchParams.get('roomId') || searchParams.get('roomid'),
        name: roomName,
        quantity: quantity,
        offerId: searchParams.get('offerId') || searchParams.get('offerid'),
      },
      dates: {
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        nights: nights,
      },
      guests: guests,
      pricing: {
        basePrice,
        taxes,
        serviceFee,
        total,
        currency,
        conversionRate,
        totalInSAR,
      },
    });

    // Populate user profile info if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        emailConfirm: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [searchParams, exchangeRates, user]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getUpgradePrices = () => {
    if (!bookingData) return { insurance: 0, insuranceSAR: 0, esim: 0, esimSAR: 0, transfer: 0, transferSAR: 0, total: 0, totalSAR: 0 };
    
    const insuranceSAR = insuranceSelected ? (45 * bookingData.guests) : 0;
    
    let esimSAR = 0;
    if (esimPlan === '10gb') esimSAR = 75;
    else if (esimPlan === '20gb') esimSAR = 120;
    
    let transferSAR = 0;
    if (transferType === 'sedan') transferSAR = 150;
    else if (transferType === 'suv') transferSAR = 250;

    const conversionRate = bookingData.pricing.conversionRate || 1;

    return {
      insurance: insuranceSAR / conversionRate,
      insuranceSAR,
      esim: esimSAR / conversionRate,
      esimSAR,
      transfer: transferSAR / conversionRate,
      transferSAR,
      totalSAR: insuranceSAR + esimSAR + transferSAR,
      total: (insuranceSAR + esimSAR + transferSAR) / conversionRate
    };
  };

  const upgrades = getUpgradePrices();
  const basePriceWithTaxesAndUpgrades = bookingData ? bookingData.pricing.total + upgrades.total : 0;
  const basePriceWithTaxesAndUpgradesSAR = bookingData ? bookingData.pricing.totalInSAR + upgrades.totalSAR : 0;

  const couponDiscount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const priceAfterCouponSAR = Math.max(0, basePriceWithTaxesAndUpgradesSAR - couponDiscount);

  const walletDeductionInSAR = useWallet && isAuthenticated && user ? Math.min(priceAfterCouponSAR, user.walletBalance || 0) : 0;
  const finalPayableSAR = Math.max(0, priceAfterCouponSAR - walletDeductionInSAR);
  const finalPayable = finalPayableSAR / (bookingData?.pricing?.conversionRate || 1);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !bookingData) return;
    setCouponLoading(true);
    try {
      const totalAmountSAR = basePriceWithTaxesAndUpgradesSAR;
      const response = await axios.get(`/api/coupons/verify?code=${couponInput.trim().toUpperCase()}&amount=${totalAmountSAR}`);
      
      if (response.data && response.data.isValid) {
        setAppliedCoupon(response.data);
        toast.success(response.data.message || 'تم تطبيق الكوبون بنجاح!');
      } else {
        toast.error('الكوبون غير صالح');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'كود الكوبون غير صالح أو غير متطابق مع شروط الحجز';
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    toast.success('تم إزالة الكوبون');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setFormData(prev => ({ ...prev, cardNumber: formatted.substring(0, 19) }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setFormData(prev => ({ ...prev, cardExpiry: val.substring(0, 5) }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      toast.error('الرجاء إدخال الاسم الأول');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('الرجاء إدخال اسم العائلة');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return false;
    }
    if (formData.email !== formData.emailConfirm) {
      toast.error('البريد الإلكتروني غير متطابق');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('الرجاء إدخال رقم الجوال');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.agreeTerms) {
      toast.error('يرجى الموافقة على الشروط والأحكام للمتابعة');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (useWallet && isAuthenticated && user && user.walletBalance >= basePriceWithTaxesAndUpgradesSAR) {
      return true; // covered fully by wallet balance
    }
    if (paymentMethod === 'card' || paymentMethod === 'mada') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('الرجاء إدخال رقم بطاقة صحيح مكون من 16 رقم');
        return false;
      }
      if (!formData.cardExpiry || formData.cardExpiry.length < 5) {
        toast.error('الرجاء إدخال تاريخ انتهاء البطاقة (MM/YY)');
        return false;
      }
      if (!formData.cardCvv || formData.cardCvv.length < 3) {
        toast.error('الرجاء إدخال رمز الأمان (CVV) المكون من 3 أرقام');
        return false;
      }
      if (!formData.cardName.trim()) {
        toast.error('الرجاء إدخال الاسم المكتوب على البطاقة');
        return false;
      }
    }
    return true;
  };

  const executeHotelBooking = async () => {
    setLoading(true);
    try {
      const rawHotelId = bookingData.hotel.id || '';
      const rawRoomId = bookingData.room.id || '';
      const rawRatePlanId = bookingData.room.offerId || '';

      const isGdsBooking = rawHotelId === '' || !isValidGuid(rawHotelId);

      const hotelId = isValidGuid(rawHotelId) ? rawHotelId : '00000000-0000-0000-0000-000000000000';
      const roomId = isValidGuid(rawRoomId) ? rawRoomId : '00000000-0000-0000-0000-000000000000';
      const ratePlanId = isValidGuid(rawRatePlanId) ? rawRatePlanId : '00000000-0000-0000-0000-000000000000';

      // Assemble upgrades information into specialRequests string
      let addonsText = '';
      if (insuranceSelected) addonsText += '\n- ترقية: تأمين سفر تكافلي شامل (مفعل)';
      if (esimPlan !== 'none') addonsText += `\n- ترقية: شريحة اتصال eSIM دولية (${esimPlan === '10gb' ? '10 جيجا - 7 أيام' : '20 جيجا - 15 يوم'})`;
      if (transferType !== 'none') addonsText += `\n- ترقية: نقل المطار الخاص (${transferType === 'sedan' ? 'سيدان قياسية' : 'عائلية فاخرة SUV'})`;

      const finalSpecialRequests = (formData.specialRequests || '').trim() + addonsText;

      const bookingPayload = {
        hotelId,
        roomId,
        ratePlanId,
        checkInDate: searchParams.get('checkIn') || searchParams.get('checkin') || new Date().toISOString().split('T')[0],
        checkOutDate: searchParams.get('checkOut') || searchParams.get('checkout') || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        numberOfGuests: bookingData.guests,
        guestFirstName: formData.firstName,
        guestLastName: formData.lastName,
        guestTitle: formData.title,
        guestNationality: formData.nationality,
        guestDob: formData.dob,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        guestCountryCode: formData.countryCode,
        bookingForSomeoneElse: formData.bookingForSomeoneElse,
        specialRequests: finalSpecialRequests,
        lateCheckIn: formData.lateCheckIn,
        airportTransfer: transferType !== 'none' || formData.airportTransfer,
        useWallet,
        hotelName: isGdsBooking ? bookingData.hotel.name : null,
        roomName: isGdsBooking ? bookingData.room.name : null,
        roomPrice: isGdsBooking ? parseFloat((parseFloat(searchParams.get('price') || '0') * bookingData.pricing.conversionRate).toFixed(2)) : null,
        hotelImage: isGdsBooking ? bookingData.hotel.image : null,
      };

      const response = await apiService.bookings.createHotel(bookingPayload);

      if (response && response.referenceNumber) {
        if (appliedCoupon) {
          try {
            await axios.post(`/api/coupons/use?code=${appliedCoupon.code}`);
          } catch (e) {
            console.error('Failed to increment coupon use count:', e);
          }
        }

        if (paymentMethod === 'card' || paymentMethod === 'mada') {
          try {
            toast.loading('جاري التحويل لبوابة الدفع الآمنة...', { id: 'payment-toast' });
            
            const paymentResponse = await apiService.payments.initiate({
              amount: finalPayableSAR,
              currency: 'SAR',
              description: `Hotel Booking - ${bookingData.hotel.name}`,
              referenceId: response.id || response.referenceNumber,
              callbackUrl: `${window.location.origin}/booking-success?bookingRef=${response.referenceNumber}&hotelName=${encodeURIComponent(bookingData.hotel.name)}`
            });
            
            toast.dismiss('payment-toast');
            // The API returns Ok(new { success = true, data = new { paymentUrl = "..." } })
            if (paymentResponse.data?.success && paymentResponse.data?.data?.paymentUrl) {
              window.location.href = paymentResponse.data.data.paymentUrl;
              return;
            } else {
              toast.error('فشل في بدء جلسة الدفع بالخادم');
            }
          } catch (err) {
            console.error(err);
            toast.dismiss('payment-toast');
            toast.error('حدث خطأ أثناء الاتصال ببوابة الدفع الميسر');
          }
          setCurrentStep(4);
          return;
        }

        if (paymentMethod === 'tabby' || paymentMethod === 'tamara') {
          try {
            toast.loading('جاري تجهيز خطة التقسيط...', { id: 'installment-toast' });
            
            const sessionResponse = await axios.post('/api/installments/create-session', {
              bookingId: response.id,
              amount: finalPayableSAR,
              provider: paymentMethod === 'tabby' ? 'Tabby' : 'Tamara'
            });
            
            toast.dismiss('installment-toast');
            if (sessionResponse.data?.redirectUrl) {
              window.location.href = sessionResponse.data.redirectUrl;
              return;
            } else {
              toast.error('فشل في إنشاء جلسة التقسيط بالخادم');
            }
          } catch (err) {
            console.error(err);
            toast.dismiss('installment-toast');
            toast.error('حدث خطأ أثناء الاتصال ببوابة التقسيط');
          }
          setCurrentStep(4);
          return;
        }

        toast.success('تم تأكيد حجز الفندق بنجاح!');
        // Redirect to booking success
        navigate(`/booking-success?bookingRef=${response.referenceNumber}&hotelName=${encodeURIComponent(bookingData.hotel.name)}`);
      } else {
        toast.error('حدث خطأ في الرد من السيرفر. يرجى المحاولة مرة أخرى.');
        setCurrentStep(4); // Back to payment step
      }
    } catch (error) {
      console.error('Booking confirmation error:', error);
      const errorData = error.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => {
          toast.error(err.message || err || 'خطأ في معالجة الحجز');
        });
      } else if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error('فشل في إتمام عملية الحجز. يرجى التأكد من تفاصيل الدفع.');
      }
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 5) {
      executeHotelBooking();
    }
  }, [currentStep]);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const cur = bookingData.pricing.currency === 'USD' ? '$' : bookingData.pricing.currency;

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-arabic pb-16">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
            <Link to="/">
              <AlmulhemLogo className="h-12 md:h-14" />
            </Link>
            
            <div className="w-full md:w-auto">
              <ProgressStepper currentStep={currentStep} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mobile Booking Summary (Collapsible) */}
            <div className="lg:hidden">
              <BookingSummary
                bookingData={bookingData}
                isCollapsed={summaryCollapsed}
                onToggle={() => setSummaryCollapsed(!summaryCollapsed)}
                useWallet={useWallet}
                isAuthenticated={isAuthenticated}
                user={user}
                upgrades={upgrades}
                couponDiscount={appliedCoupon ? appliedCoupon.calculatedDiscount : 0}
                couponCode={appliedCoupon ? appliedCoupon.code : ''}
                onRemoveCoupon={handleRemoveCoupon}
              />
            </div>

            {/* Stepper Content Form Column */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Guest Details */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-8 h-8 bg-[#071428] text-[#C9A227] rounded-full flex items-center justify-center font-bold text-sm">
                        ١
                      </div>
                      <h2 className="text-xl font-bold text-[#071428]">بيانات الضيوف والاتصال</h2>
                    </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mb-2">
                          <div className="flex gap-3 flex-1">
                            <button
                              type="button"
                              onClick={() => setGender('male')}
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                gender === 'male' 
                                  ? 'bg-[#C9A227]/10 text-[#C9A227] border-2 border-[#C9A227]' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              ذكر
                            </button>
                            <button
                              type="button"
                              onClick={() => setGender('female')}
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                gender === 'female' 
                                  ? 'bg-[#C9A227]/10 text-[#C9A227] border-2 border-[#C9A227]' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              أنثى
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1 justify-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="title" value="Mr" checked={formData.title === 'Mr'} onChange={handleChange} className="accent-[#C9A227] w-4 h-4" />
                              <span className="text-sm font-bold text-slate-700">السيد</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="title" value="Mrs" checked={formData.title === 'Mrs'} onChange={handleChange} className="accent-[#C9A227] w-4 h-4" />
                              <span className="text-sm font-bold text-slate-700">السيدة</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="title" value="Ms" checked={formData.title === 'Ms'} onChange={handleChange} className="accent-[#C9A227] w-4 h-4" />
                              <span className="text-sm font-bold text-slate-700">الآنسة</span>
                            </label>
                          </div>
                        </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">الاسم الأول *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 transition-all text-sm font-medium"
                          placeholder="أدخل الاسم الأول بالإنجليزية"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">اسم العائلة *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 transition-all text-sm font-medium"
                          placeholder="أدخل اسم العائلة بالإنجليزية"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">الجنسية *</label>
                        <div className="relative">
                          <select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] appearance-none bg-white text-sm font-medium"
                          >
                            <option value="SA">المملكة العربية السعودية</option>
                            <option value="AE">الإمارات العربية المتحدة</option>
                            <option value="KW">الكويت</option>
                            <option value="QA">قطر</option>
                            <option value="BH">البحرين</option>
                            <option value="OM">عمان</option>
                            <option value="EG">مصر</option>
                            <option value="JO">الأردن</option>
                            <option value="OTHER">أخرى</option>
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">تاريخ الميلاد *</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 transition-all text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">البريد الإلكتروني *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 transition-all text-sm font-medium text-right"
                          placeholder="example@email.com"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">تأكيد البريد الإلكتروني *</label>
                        <input
                          type="email"
                          name="emailConfirm"
                          value={formData.emailConfirm}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 transition-all text-sm font-medium text-right"
                          placeholder="أعد كتابة البريد الإلكتروني"
                          dir="ltr"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-2">رقم الجوال *</label>
                        <div className="flex gap-2">
                          <div className="relative w-28">
                            <select
                              name="countryCode"
                              value={formData.countryCode}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] appearance-none bg-white text-sm font-semibold"
                            >
                              <option value="+966">🇸🇦 +966</option>
                              <option value="+971">🇦🇪 +971</option>
                              <option value="+965">🇰🇼 +965</option>
                              <option value="+974">🇶🇦 +974</option>
                              <option value="+973">🇧🇭 +973</option>
                              <option value="+968">🇴🇲 +968</option>
                              <option value="+20">🇪🇬 +20</option>
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 transition-all text-sm font-semibold text-right"
                            placeholder="5XXXXXXXX"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <h3 className="font-bold text-sm text-[#071428]">طلبات خاصة إضافية (اختياري)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                        {specialRequestOptions.map(option => (
                          <label key={option} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" className="accent-[#C9A227] w-4 h-4"
                              checked={selectedSpecialRequests.includes(option)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedSpecialRequests(prev => [...prev, option]);
                                else setSelectedSpecialRequests(prev => prev.filter(r => r !== option));
                              }}
                            />
                            <span className="text-xs font-semibold text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 resize-none text-sm"
                          placeholder="أي طلبات خاصة أخرى (مثال: طابق علوي...)"
                        />
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-xl hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            name="lateCheckIn"
                            checked={formData.lateCheckIn}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                          />
                          <Clock className="w-4 h-4 text-[#C9A227]" />
                          <span className="text-xs font-semibold text-slate-700 select-none">تسجيل وصول متأخر (بعد الساعة ٦ مساءً)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-xl hover:bg-slate-100 transition-colors w-full md:w-auto">
                          <input
                            type="checkbox"
                            name="bookingForSomeoneElse"
                            checked={formData.bookingForSomeoneElse}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                          />
                          <Users className="w-4 h-4 text-[#C9A227]" />
                          <span className="text-xs font-semibold text-slate-700 select-none">أنا أقوم بالحجز لشخص آخر</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => { if (validateStep1()) setCurrentStep(2); }}
                        className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                      >
                        الخطوة التالية: الترقيات
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Travel Upgrades */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-8 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#071428] text-[#C9A227] rounded-full flex items-center justify-center font-bold text-sm">
                          ٢
                        </div>
                        <h2 className="text-xl font-bold text-[#071428]">خدمات السفر الإضافية (رقي حجزك)</h2>
                      </div>
                      <span className="text-xs text-[#C9A227] font-bold bg-[#C9A227]/10 px-3 py-1.5 rounded-full">توصية حصرية</span>
                    </div>

                    {/* Addon 1: Takaful Insurance */}
                    <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#C9A227]/50 transition-all bg-gradient-to-l from-slate-50/50 to-white">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                          <Shield className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-sm">تأمين السفر التكافلي الشامل</h3>
                            <span className="text-xs font-black text-[#071428]">45 ر.س / لكل ضيف</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                            تغطية طبية معتمدة لحالات الطوارئ، إلغاء أو تأخير الرحلات، وفقدان الأمتعة. يضمن لك راحة البال طوال فترة إقامتك.
                          </p>
                          <div className="pt-3">
                            <button
                              type="button"
                              onClick={() => setInsuranceSelected(!insuranceSelected)}
                              className={`text-xs font-bold py-2 px-5 rounded-xl border transition-all ${
                                insuranceSelected
                                  ? 'bg-green-600 border-green-600 text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {insuranceSelected ? '✓ تمت إضافة التأمين' : '+ إضافة التأمين التكافلي'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addon 2: eSIM Bundle */}
                    <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#C9A227]/50 transition-all bg-gradient-to-l from-slate-50/50 to-white">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                          <Smartphone className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-sm">شريحة اتصال انترنت دولية (eSIM)</h3>
                            <span className="text-xs font-semibold text-slate-500">مفعلة رقمياً عبر الـ QR Code</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                            تواصل فور وصولك مع شبكات الجيل الخامس دون الحاجة لتغيير شريحتك الفعلية. باقات مصممة خصيصاً لوجهتك.
                          </p>
                          
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'none', label: 'لا أرغب بشريحة', price: 'مجاني' },
                              { id: '10gb', label: '10 جيجا (7 أيام)', price: '75 ر.س' },
                              { id: '20gb', label: '20 جيجا (15 يوم)', price: '120  ر.س' },
                            ].map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setEsimPlan(option.id)}
                                className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center gap-1 ${
                                  esimPlan === option.id
                                    ? 'border-[#071428] bg-[#071428]/5 ring-1 ring-[#071428]'
                                    : 'border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className="text-[11px] font-bold text-slate-800">{option.label}</span>
                                <span className="text-[10px] font-black text-[#C9A227]">{option.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addon 3: Airport Transfer */}
                    <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#C9A227]/50 transition-all bg-gradient-to-l from-slate-50/50 to-white">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl">
                          <Car className="w-7 h-7 text-amber-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-sm">توصيل خاص متميز من المطار إلى الفندق</h3>
                            <span className="text-xs font-semibold text-slate-500">استقبال لافتة بالاسم وسائق خاص</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                            تخطي طوابير المطار وانتظر سائقك الخاص بالخارج. خدمة تعقب رحلة الطيران التلقائي للوصول الآمن.
                          </p>
                          
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'none', label: 'لا أرغب بالنقل', price: 'مجاني' },
                              { id: 'sedan', label: 'سيارة سيدان قياسية', price: '150 ر.س' },
                              { id: 'suv', label: 'سيارة عائلية فاخرة SUV', price: '250 ر.س' },
                            ].map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setTransferType(option.id)}
                                className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center gap-1 ${
                                  transferType === option.id
                                    ? 'border-[#071428] bg-[#071428]/5 ring-1 ring-[#071428]'
                                    : 'border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className="text-[11px] font-bold text-slate-800">{option.label}</span>
                                <span className="text-[10px] font-black text-[#C9A227]">{option.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                        الرجوع للبيانات
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                      >
                        الخطوة التالية: المراجعة
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review Reservation */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-8 h-8 bg-[#071428] text-[#C9A227] rounded-full flex items-center justify-center font-bold text-sm">
                        ٣
                      </div>
                      <h2 className="text-xl font-bold text-[#071428]">مراجعة تفاصيل حجزك</h2>
                    </div>

                    {/* Summary Cards */}
                    <div className="space-y-4">
                      {/* Hotel Overview */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                        <img
                          src={bookingData.hotel.image}
                          alt={bookingData.hotel.name}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                        />
                        <div className="space-y-1">
                          <h4 className="font-bold text-[#071428] text-sm">{bookingData.hotel.name}</h4>
                          <p className="text-xs text-slate-600 font-medium">{bookingData.room.name} • {bookingData.dates.nights} ليالي</p>
                          <p className="text-[11px] text-slate-500">{bookingData.dates.checkIn}  إلى  {bookingData.dates.checkOut}</p>
                        </div>
                      </div>

                      {/* Guest Details */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-right">
                        <span className="text-[10px] font-bold text-slate-400 block">تفاصيل الضيف الرئيسي</span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 block">الاسم بالكامل:</span>
                            <span className="font-bold text-[#071428]">{formData.firstName} {formData.lastName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">رقم الاتصال:</span>
                            <span className="font-bold text-[#071428]">{formData.countryCode} {formData.phone}</span>
                          </div>
                          <div className="col-span-2 mt-1">
                            <span className="text-slate-500 block">البريد الإلكتروني:</span>
                            <span className="font-bold text-[#071428]">{formData.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Addons summary */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-right">
                        <span className="text-[10px] font-bold text-slate-400 block">الترقيات والخدمات الإضافية</span>
                        {upgrades.totalSAR === 0 ? (
                          <span className="text-xs text-slate-500 font-medium">لم يتم اختيار أي خدمات إضافية</span>
                        ) : (
                          <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                            {insuranceSelected && (
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
                                تأمين السفر التكافلي الشامل لمواجهة الطوارئ
                              </li>
                            )}
                            {esimPlan !== 'none' && (
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
                                شريحة eSIM دولية ({esimPlan === '10gb' ? '10 جيجا' : '20 جيجا'})
                              </li>
                            )}
                            {transferType !== 'none' && (
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
                                استقبال وتوصيل مطار خاص بسيارة ({transferType === 'sedan' ? 'سيدان قياسية' : 'عائلية SUV'})
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/25 rounded-2xl">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="w-5 h-5 mt-0.5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                        />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          أقر بأني اطلعت وأوافق بالكامل على <Link to="/terms" className="text-[#C9A227] font-bold hover:underline">الشروط والأحكام</Link> و <Link to="/privacy" className="text-[#C9A227] font-bold hover:underline">سياسة الخصوصية الخاصة بالملحم للسفر</Link> وكذلك سياسة إلغاء الفندق المختارة.
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                        تعديل الترقيات
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => { if (validateStep3()) setCurrentStep(4); }}
                        className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                      >
                        الخطوة التالية: الدفع
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Payment Details */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-8 h-8 bg-[#071428] text-[#C9A227] rounded-full flex items-center justify-center font-bold text-sm">
                        ٤
                      </div>
                      <h2 className="text-xl font-bold text-[#071428]">طريقة الدفع الآمن</h2>
                    </div>

                    {/* Wallet Integration */}
                    {isAuthenticated && user && user.walletBalance > 0 && (
                      <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="useWallet"
                            checked={useWallet}
                            onChange={(e) => setUseWallet(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                          />
                          <div>
                            <label htmlFor="useWallet" className="font-bold text-[#071428] text-sm cursor-pointer select-none">
                              استخدام رصيد المحفظة للدفع
                            </label>
                            <span className="text-xs text-slate-500 block mt-0.5">رصيدك الحالي: {user.walletBalance.toLocaleString()} ر.س</span>
                          </div>
                        </div>
                        <Wallet className="w-6 h-6 text-[#C9A227]" />
                      </div>
                    )}

                    {useWallet && isAuthenticated && user && user.walletBalance >= basePriceWithTaxesAndUpgradesSAR ? (
                      <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-200/50 space-y-2">
                        <Check className="w-10 h-10 text-green-600 mx-auto" />
                        <p className="text-green-800 font-bold text-sm">سيتم خصم قيمة حجز الفندق بالكامل من رصيد محفظتك.</p>
                        <p className="text-slate-500 text-xs">لا حاجة لإدخال تفاصيل بطاقة الائتمان.</p>
                      </div>
                    ) : (
                      <>
                        {/* Coupon Code Input */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-right">
                          <label className="block text-xs font-bold text-slate-700">هل لديك كود خصم / كوبون؟</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              disabled={!!appliedCoupon}
                              placeholder="أدخل كود الخصم (مثال: ALMULHIM)"
                              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold uppercase text-left"
                              dir="ltr"
                            />
                            {appliedCoupon ? (
                              <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                className="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                              >
                                حذف الكوبون
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={couponLoading || !couponInput.trim()}
                                className="px-6 py-2.5 bg-[#071428] hover:bg-[#071428]/90 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                              >
                                {couponLoading ? 'جاري التحقق...' : 'تطبيق'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Payment Tabs */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'card', label: 'بطاقة ائتمان', icon: CreditCard },
                            { id: 'mada', label: 'مدى', icon: CreditCard },
                            { id: 'apple', label: 'Apple Pay', icon: () => null },
                            { id: 'tabby', label: 'تابي (تقسيط)', icon: Wallet },
                            { id: 'tamara', label: 'تمارا (تقسيط)', icon: Wallet },
                          ].map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`flex-grow flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 transition-all ${
                                paymentMethod === method.id
                                  ? 'border-[#071428] bg-[#071428]/5 font-bold'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
                              }`}
                            >
                              <method.icon className="w-4 h-4" />
                              <span className="text-xs">{method.label}</span>
                            </button>
                          ))}
                        </div>

                        {(paymentMethod === 'tabby' || paymentMethod === 'tamara') && (
                          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4 text-right">
                            <div className="flex items-center gap-3">
                              <span className={`w-3.5 h-3.5 rounded-full ${paymentMethod === 'tabby' ? 'bg-[#3DF2C9]' : 'bg-[#FF5B26]'}`} />
                              <h4 className="font-bold text-sm text-[#071428]">
                                الدفع بالتقسيط عبر {paymentMethod === 'tabby' ? 'تابي' : 'تمارا'}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              قسّم فاتورتك على 4 دفعات شهرية بقيمة <strong className="text-[#071428]">{(finalPayableSAR / 4).toFixed(2)} ر.س</strong> لكل قسط، بدون فوائد أو رسوم خفية.
                            </p>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-500">القسط الأول المستحق اليوم:</span>
                              <span className="font-bold text-[#C9A227]">{(finalPayableSAR / 4).toFixed(2)} ر.س</span>
                            </div>
                          </div>
                        )}

                        {/* Credit Card Details Form */}
                        {(paymentMethod === 'card' || paymentMethod === 'mada') && (
                          <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">رقم البطاقة *</label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleCardNumberChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-sm tracking-wider"
                                placeholder="XXXX XXXX XXXX XXXX"
                                maxLength={19}
                                dir="ltr"
                                autoComplete="cc-number"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">تاريخ الانتهاء *</label>
                                <input
                                  type="text"
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={handleExpiryChange}
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-sm text-center"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  dir="ltr"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">رمز التحقق (CVV) *</label>
                                <input
                                  type="text"
                                  name="cardCvv"
                                  value={formData.cardCvv}
                                  onChange={(e) => setFormData(prev => ({ ...prev, cardCvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-sm text-center"
                                  placeholder="XXX"
                                  maxLength={4}
                                  dir="ltr"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">الاسم على البطاقة *</label>
                              <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-sm uppercase"
                                placeholder="CARDHOLDER NAME"
                                dir="ltr"
                                autoComplete="cc-name"
                              />
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'apple' && (
                          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <Apple className="w-12 h-12 mx-auto text-slate-800 mb-2" />
                            <p className="text-xs text-slate-600">سيتم تفعيل الدفع عبر نافذة Apple Pay عند الضغط على تأكيد الحجز</p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                        رجوع للمراجعة
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => { if (validateStep4()) setCurrentStep(5); }}
                        className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                      >
                        <Lock className="w-4 h-4" />
                        تأكيد الحجز والدفع
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Confirmation & Loading Screen */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]"
                  >
                    {/* Simulated Flight/Hotel confirmation loading */}
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-[#C9A227]/20 border-t-[#C9A227] rounded-full animate-spin flex items-center justify-center" />
                      <Shield className="w-10 h-10 text-[#071428] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h3 className="text-xl font-bold text-[#071428]">جاري تأكيد حجز الفندق ومعالجة الدفع...</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        يرجى الانتظار قليلاً وعدم إغلاق المتصفح أو تحديث الصفحة لحين اكتمال الحجز الآمن وإصدار رقم مرجع التذكرة.
                      </p>
                    </div>

                    <div className="bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-xl p-3.5 text-xs text-[#071428] font-bold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#C9A227]" />
                      <span>اتصال مشفر وآمن ١٠٠٪ بنظام الترويسة الأمنية العالمية</span>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Desktop Booking Summary Sticky Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <BookingSummary
                  bookingData={bookingData}
                  isCollapsed={false}
                  onToggle={() => {}}
                  useWallet={useWallet}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  upgrades={upgrades}
                  couponDiscount={appliedCoupon ? appliedCoupon.calculatedDiscount : 0}
                  couponCode={appliedCoupon ? appliedCoupon.code : ''}
                  onRemoveCoupon={handleRemoveCoupon}
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
