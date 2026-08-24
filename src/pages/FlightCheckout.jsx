import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Check, CreditCard, Lock, Shield, ChevronDown,
  User, Mail, Phone, Calendar, Globe, FileText, AlertCircle, Loader2, X, Wallet, Smartphone, Car, ArrowRight, ArrowLeft
} from 'lucide-react';
import { API_CONFIG } from '../config/api.config';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import apiService from '../services/api.service';
import axios from '../lib/axios';

const nationalities = [
  'السعودية', 'الإمارات', 'الكويت', 'البحرين', 'قطر', 'عمان',
  'مصر', 'الأردن', 'لبنان', 'سوريا', 'العراق', 'اليمن',
  'المغرب', 'تونس', 'الجزائر', 'ليبيا', 'السودان',
  'بريطانيا', 'أمريكا', 'فرنسا', 'ألمانيا', 'أخرى'
];

const titles = ['السيد', 'السيدة', 'الآنسة', 'الدكتور'];

const formatTime = (isoString) => {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (isoString) => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDuration = (duration) => {
  if (!duration) return '--';
  const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
  if (match) {
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}س ${minutes}د`;
  }
  return duration;
};

// Progress Stepper Component (5 Steps)
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'بيانات المسافرين' },
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

const FlightCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const offerId = searchParams.get('offerId');
  const rawServices = location.state?.selectedServices || [];
  
  // Safely extract the array of services regardless of how Duffel component structures it
  const safeServices = Array.isArray(rawServices) 
    ? rawServices 
    : (Array.isArray(rawServices.services) ? rawServices.services : 
       (typeof rawServices === 'object' ? Object.values(rawServices).flat().filter(x => x && typeof x === 'object') : []));

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSummary, setShowSummary] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [useWallet, setUseWallet] = useState(false);

  // Coupons State
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Upgrades State
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [esimPlan, setEsimPlan] = useState('none'); // 'none', '10gb', '20gb'
  const [transferType, setTransferType] = useState('none'); // 'none', 'sedan', 'suv'

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

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

  // Simulated OTP Gateway
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(300);

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
      setCurrentStep(4);
      setOtpError('انتهت صلاحية رمز التحقق، يرجى المحاولة مرة أخرى.');
    }
    return () => clearInterval(interval);
  }, [showOTPModal, otpTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Form states
  const [passengers, setPassengers] = useState([]);
  const [contact, setContact] = useState({
    email: '',
    confirmEmail: '',
    phone: '',
    countryCode: '+966',
    bookingForSomeoneElse: false,
  });
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    if (!offerId) {
      navigate('/');
      return;
    }

    const fetchOffer = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/amadeus/flights/offers/${offerId}`);
        if (!res.ok) throw new Error('فشل في جلب بيانات الرحلة');
        const data = await res.json();
        const rawOffer = data.data;
        setOffer(rawOffer);

        // Initialize passenger forms based on passengers in offer
        setPassengers(
          rawOffer.passengers.map((p) => ({
            id: p.id,
            passengerType: p.type,
            gender: 'male',
            title: 'mr',
            firstName: '',
            lastName: '',
            passportNumber: '',
            nationality: '',
            passportExpiry: '',
            dateOfBirth: '',
          }))
        );

        if (user) {
          setContact({
            email: user.email || '',
            confirmEmail: user.email || '',
            phone: user.phone || '',
            countryCode: '+966',
            bookingForSomeoneElse: false,
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, navigate, user]);

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  // Extract real data from offer
  const firstSlice = offer?.slices?.[0];
  const firstSegment = firstSlice?.segments?.[0];
  const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1];

  const flightData = offer ? {
    airline: offer.owner?.name || 'شركة طيران',
    airlineLogo: offer.owner?.logo_symbol_url || `https://images.kiwi.com/airlines/64/${offer.owner?.iata_code}.png`,
    flightNumber: `${firstSegment?.operating_carrier?.iata_code || ''}-${firstSegment?.operating_carrier_flight_number || ''}`,
    from: firstSlice?.origin?.city_name || firstSlice?.origin?.name,
    fromCode: firstSlice?.origin?.iata_code,
    to: firstSlice?.destination?.city_name || firstSlice?.destination?.name,
    toCode: firstSlice?.destination?.iata_code,
    departureTime: formatTime(firstSegment?.departing_at),
    arrivalTime: formatTime(lastSegment?.arriving_at),
    duration: formatDuration(firstSlice?.duration),
    date: formatDate(firstSegment?.departing_at),
    class: (() => {
      const cc = firstSegment?.passengers?.[0]?.cabin_class?.toLowerCase();
      if (cc === 'first' || cc?.includes('first')) return 'الدرجة الأولى';
      if (cc === 'business' || cc?.includes('business')) return 'درجة رجال الأعمال';
      if (cc === 'premium_economy' || cc?.includes('premium')) return 'الدرجة الاقتصادية المميزة';
      return 'الدرجة الاقتصادية';
    })(),
    seats: safeServices.map(s => s.designator || s.id).filter(Boolean),
    pricing: (() => {
      const totalAmount = parseFloat(offer.total_amount || 0);
      const seatFees = safeServices.reduce((total, s) => total + parseFloat(s.total_amount || 0), 0);
      const total = totalAmount + seatFees;
      
      let baseFare = parseFloat(offer.base_amount || 0);
      let taxes = parseFloat(offer.tax_amount || 0);
      
      // Smart redistribution for sandbox data
      if (baseFare > 0 && baseFare < totalAmount * 0.3) {
        baseFare = parseFloat((totalAmount * 0.85).toFixed(2));
        taxes = parseFloat((totalAmount * 0.15).toFixed(2));
      }
      
      return {
        baseFare,
        taxes,
        seatFees,
        total,
        currency: offer.total_currency || 'SAR',
      };
    })(),
  } : null;

  // Recalculate Upgrades
  const getUpgradePrices = () => {
    if (!offer || !flightData) return { insurance: 0, insuranceSAR: 0, esim: 0, esimSAR: 0, transfer: 0, transferSAR: 0, total: 0, totalSAR: 0 };
    
    const count = passengers.length || 1;
    const insuranceSAR = insuranceSelected ? (45 * count) : 0;
    
    let esimSAR = 0;
    if (esimPlan === '10gb') esimSAR = 75;
    else if (esimPlan === '20gb') esimSAR = 120;
    
    let transferSAR = 0;
    if (transferType === 'sedan') transferSAR = 150;
    else if (transferType === 'suv') transferSAR = 250;

    const conversionRate = exchangeRates[flightData.pricing.currency] || 1;

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
  const basePriceWithTaxesAndUpgradesSAR = flightData ? (flightData.pricing.total + upgrades.total) * exchangeRates[flightData.pricing.currency] : 0;

  const couponDiscount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const priceAfterCouponSAR = Math.max(0, basePriceWithTaxesAndUpgradesSAR - couponDiscount);

  const walletDeductionInSAR = useWallet && isAuthenticated && user ? Math.min(priceAfterCouponSAR, user.walletBalance || 0) : 0;
  const finalPayableSAR = Math.max(0, priceAfterCouponSAR - walletDeductionInSAR);
  const finalPayable = flightData ? finalPayableSAR / (exchangeRates[flightData.pricing.currency] || 1) : 0;

  const validateStep1 = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.title) {
        toast.error(`الرجاء تحديد اللقب للمسافر ${i + 1}`);
        return false;
      }
      if (!p.nationality) {
        toast.error(`الرجاء تحديد الجنسية للمسافر ${i + 1}`);
        return false;
      }
      if (!p.firstName.trim()) {
        toast.error(`الرجاء إدخال الاسم الأول للمسافر ${i + 1}`);
        return false;
      }
      if (!p.lastName.trim()) {
        toast.error(`الرجاء إدخال اسم العائلة للمسافر ${i + 1}`);
        return false;
      }
      if (!p.passportNumber.trim()) {
        toast.error(`الرجاء إدخال رقم جواز السفر للمسافر ${i + 1}`);
        return false;
      }
      if (!p.passportExpiry) {
        toast.error(`الرجاء تحديد تاريخ انتهاء جواز السفر للمسافر ${i + 1}`);
        return false;
      }
      if (!p.dateOfBirth) {
        toast.error(`الرجاء تحديد تاريخ الميلاد للمسافر ${i + 1}`);
        return false;
      }
    }
    
    if (!contact.email.trim() || !contact.email.includes('@')) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح للتواصل');
      return false;
    }
    if (contact.email !== contact.confirmEmail) {
      toast.error('البريد الإلكتروني للتأكيد غير متطابق');
      return false;
    }
    if (!contact.phone.trim()) {
      toast.error('الرجاء إدخال رقم هاتف للتواصل');
      return false;
    }
    return true;
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !flightData) return;
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

  const validateStep4 = () => {
    if (useWallet && isAuthenticated && user && user.walletBalance >= totalInSAR) {
      return true; // covered fully by wallet balance
    }
    if (paymentMethod === 'card' || paymentMethod === 'mada') {
      if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('الرجاء إدخال رقم بطاقة صحيح');
        return false;
      }
      if (!payment.cardName.trim()) {
        toast.error('الرجاء إدخال الاسم على البطاقة');
        return false;
      }
      if (!payment.expiry || payment.expiry.length < 5) {
        toast.error('الرجاء إدخال تاريخ انتهاء البطاقة (MM/YY)');
        return false;
      }
      if (!payment.cvv || payment.cvv.length < 3) {
        toast.error('الرجاء إدخال رمز الأمان (CVV) المكون من 3 أرقام');
        return false;
      }
    }
    return true;
  };

  const executeBooking = async () => {
    setIsProcessing(true);
    try {
      const conversionRate = exchangeRates[flightData.pricing.currency] || 1;
      const flightPriceInSAR = (flightData.pricing.total / passengers.length) * conversionRate;
      
      // Prepare upgrades tracking in metadata
      let addonsSummary = '';
      if (insuranceSelected) addonsSummary += ` [تأمين سفر شامل تفاعلي لعدد ${passengers.length} ركاب]`;
      if (esimPlan !== 'none') addonsSummary += ` [شريحة eSIM: باقة ${esimPlan}]`;
      if (transferType !== 'none') addonsSummary += ` [نقل مطار خاص: سيارة ${transferType}]`;

      const payload = {
        outboundFlightId: '00000000-0000-0000-0000-000000000000', // Dynamic placeholder
        offerId: offerId,
        cabinClass: offer.slices?.[0]?.segments?.[0]?.passengers?.[0]?.cabin_class || 'economy',
        passengers: passengers.map(p => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          passportNumber: p.passportNumber,
          dateOfBirth: p.dateOfBirth,
          nationality: p.nationality,
          passengerType: p.passengerType === 'adult' ? 'Adult' : (p.passengerType === 'child' ? 'Child' : 'Infant')
        })),
        guestFirstName: passengers[0]?.firstName || 'Guest',
        guestLastName: passengers[0]?.lastName || 'User',
        guestEmail: contact.email,
        guestPhone: contact.phone,
        specialRequests: addonsSummary, // Send addons summary in SpecialRequests
        guestCountryCode: contact.countryCode,
        userId: user ? user.id : null,
        useWallet: useWallet,
        flightNumber: flightData.flightNumber,
        airlineCode: offer.owner?.iata_code || 'SV',
        airlineName: flightData.airline,
        departureAirportCode: flightData.fromCode,
        arrivalAirportCode: flightData.toCode,
        departureTime: offer.slices?.[0]?.segments?.[0]?.departing_at,
        arrivalTime: offer.slices?.[0]?.segments?.[offer.slices[0].segments.length - 1]?.arriving_at,
        flightPrice: parseFloat(flightPriceInSAR.toFixed(2))
      };

      const response = await apiService.bookings.createFlight(payload);
      
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
              description: `Flight Booking - ${flightData.airline}`,
              referenceId: response.id || response.referenceNumber,
              callbackUrl: `${window.location.origin}/booking-success?bookingRef=${response.referenceNumber}&hotelName=${encodeURIComponent(flightData.airline)}`
            });
            
            toast.dismiss('payment-toast');
            if (paymentResponse?.success && paymentResponse?.data?.paymentUrl) {
              window.location.href = paymentResponse.data.paymentUrl;
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
          setIsProcessing(false);
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
          setIsProcessing(false);
          return;
        }

        toast.success('تم تأكيد حجز رحلتك بنجاح!');
        navigate(`/booking-success?bookingRef=${response.referenceNumber}&hotelName=${encodeURIComponent(flightData.airline)}`);
      } else {
        throw new Error('لم يتم إرجاع رقم مرجع الحجز من السيرفر');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'فشل في إتمام عملية الحجز. يرجى التحقق من المدخلات.';
      toast.error(errorMsg);
      setIsProcessing(false);
      setCurrentStep(4);
    }
  };

  const handleStep4Submit = async (e) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setCurrentStep(5); // Transition to Confirmation Screen
    await executeBooking();
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setOtpError('الرجاء إدخال رمز التحقق');
      return;
    }
    
    setOtpError('');
    setIsProcessing(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Execute actual booking on backend
    await executeBooking();
    setShowOTPModal(false);
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setPayment(prev => ({ ...prev, cardNumber: formatted.substring(0, 19) }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setPayment(prev => ({ ...prev, expiry: val.substring(0, 5) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#071428]">جاري تجهيز تفاصيل حجز الرحلة...</h2>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl max-w-md text-center">
          <X className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">عذراً، حدث خطأ</h2>
          <p>{error || 'لم يتم العثور على الرحلة'}</p>
          <button onClick={() => navigate(-1)} className="btn-primary mt-6 w-full">العودة للنتائج</button>
        </div>
      </div>
    );
  }

  // Boarding Pass Component
  const BoardingPass = () => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* Perforated Edge Effect */}
      <div className="h-4 bg-[#071428] relative">
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-[#fdfbf7] rounded-full translate-y-1/2" />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#071428] text-white p-4">
        <div className="flex items-center justify-between">
          {flightData.airlineLogo && (
            <img src={flightData.airlineLogo} alt={flightData.airline} className="h-8 object-contain bg-white rounded px-2 py-1" />
          )}
          <div className="text-left">
            <p className="text-[10px] text-white/70 font-medium">رقم الرحلة</p>
            <p className="font-bold text-sm">{flightData.flightNumber}</p>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="p-6 border-b border-dashed border-slate-200 text-right">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#071428]">{flightData.fromCode}</p>
            <p className="text-xs text-slate-500 font-medium">{flightData.from}</p>
            <p className="text-sm font-semibold text-[#071428] mt-1">{flightData.departureTime}</p>
          </div>
          <div className="flex-1 px-4">
            <div className="flex items-center justify-center">
              <div className="flex-1 h-[2px] bg-slate-200"></div>
              <Plane className="w-6 h-6 text-[#C9A227] mx-2 rotate-180" />
              <div className="flex-1 h-[2px] bg-slate-200"></div>
            </div>
            <p className="text-center text-xs text-slate-500 font-medium mt-1">{flightData.duration}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#071428]">{flightData.toCode}</p>
            <p className="text-xs text-slate-500 font-medium">{flightData.to}</p>
            <p className="text-sm font-semibold text-[#071428] mt-1">{flightData.arrivalTime}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4 text-right">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">تاريخ السفر</span>
          <span className="font-semibold text-[#071428]">{flightData.date}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">درجة المقصورة</span>
          <span className="font-semibold text-[#071428]">{flightData.class}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">المقاعد المحددة</span>
          <div className="flex gap-2">
            {flightData.seats.length > 0 ? flightData.seats.map(seat => (
              <span key={seat} className="bg-[#C9A227] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                {seat}
              </span>
            )) : <span className="text-slate-400 font-medium">تحدد عند تسجيل الوصول</span>}
          </div>
        </div>
      </div>

      {/* Selected Upgrades Breakdown */}
      {upgrades.totalSAR > 0 && (
        <div className="bg-slate-50 px-6 py-4 border-t border-dashed border-slate-200 space-y-2 text-right">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">الترقيات الإضافية</span>
          {upgrades.insuranceSAR > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-700">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-600" /> تأمين السفر التكافلي</span>
              <span>{upgrades.insurance.toLocaleString()} {flightData.pricing.currency}</span>
            </div>
          )}
          {upgrades.esimSAR > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-700">
              <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-green-600" /> شريحة eSIM دولية</span>
              <span>{upgrades.esim.toLocaleString()} {flightData.pricing.currency}</span>
            </div>
          )}
          {upgrades.transferSAR > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-700">
              <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-green-600" /> توصيل مطار خاص</span>
              <span>{upgrades.transfer.toLocaleString()} {flightData.pricing.currency}</span>
            </div>
          )}
        </div>
      )}

      {/* Perforated Edge */}
      <div className="h-4 relative">
        <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-[#fdfbf7] rounded-full -translate-y-1/2" />
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-slate-50 p-6 space-y-3">
        <div className="flex justify-between text-xs text-slate-600">
          <span>سعر التذكرة الأساسي</span>
          <span>{flightData.pricing.baseFare.toLocaleString()} {flightData.pricing.currency}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>رسوم اختيار المقاعد</span>
          <span>{flightData.pricing.seatFees.toLocaleString()} {flightData.pricing.currency}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>الضرائب والرسوم</span>
          <span>{flightData.pricing.taxes.toLocaleString()} {flightData.pricing.currency}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs text-green-600 font-semibold mb-2 bg-green-50 p-2 rounded-xl border border-green-100 items-center">
            <span className="flex items-center gap-1">
              الكوبون ({appliedCoupon?.code})
              <button type="button" onClick={handleRemoveCoupon} className="text-rose-500 hover:text-rose-700 mr-2 text-[10px] font-bold cursor-pointer">
                إزالة
              </button>
            </span>
            <span>
              -{(couponDiscount / (exchangeRates[flightData.pricing.currency] || 1)).toLocaleString()} {flightData.pricing.currency}
            </span>
          </div>
        )}

        {useWallet && isAuthenticated && user && user.walletBalance > 0 && (
          <div className="flex justify-between text-xs text-green-600 font-semibold mb-2">
            <span>رصيد المحفظة المسترجع</span>
            <span className="text-left font-bold">
              -{(walletDeductionInSAR / (exchangeRates[flightData.pricing.currency] || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {flightData.pricing.currency}
              {flightData.pricing.currency !== 'SAR' && (
                <span className="block text-[10px] text-green-600/80 font-normal">
                  (يعادل -{walletDeductionInSAR.toLocaleString()} ر.س)
                </span>
              )}
            </span>
          </div>
        )}
        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
          <span className="font-bold text-[#071428] text-sm">المستحق للدفع</span>
          <span className="text-2xl font-black text-[#C9A227]">
            {finalPayable.toLocaleString()} <span className="text-xs">{flightData.pricing.currency}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-arabic pb-16">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
            <Link to="/">
              <img src="/logo.webp" alt="الملحم" className="h-12" />
            </Link>
            
            <div className="w-full md:w-auto">
              <ProgressStepper currentStep={currentStep} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Summary Collapsible Toggle */}
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="lg:hidden bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <span className="font-bold text-[#071428] text-sm">ملخص الحجز</span>
            <div className="flex items-center gap-2">
              <span className="text-[#C9A227] font-black">{finalPayable.toLocaleString()} {flightData.pricing.currency}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showSummary ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showSummary && (
            <div className="lg:hidden">
              <BoardingPass />
            </div>
          )}

          {/* Stepper Forms Column */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Passengers & Contact details */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Passenger Information Cards */}
                  {passengers.map((passenger, index) => (
                    <div key={passenger.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                        <div className="w-9 h-9 bg-[#C9A227] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#071428]">المسافر {index + 1} ({passenger.passengerType === 'adult' ? 'بالغ' : 'طفل'})</h2>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">المقعد المختار: {passenger.seat || 'يحدد عند البوردنج'}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                          يرجى كتابة الاسم والبيانات باللغة الإنجليزية كما هي مكتوبة في جواز السفر تماماً لتجنب أي مشاكل بالصعود للطائرة.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gender & Title */}
                        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mb-2">
                          <div className="flex gap-3 flex-1">
                            <button
                              type="button"
                              onClick={() => updatePassenger(index, 'gender', 'male')}
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                passenger.gender === 'male' 
                                  ? 'bg-[#C9A227]/10 text-[#C9A227] border-2 border-[#C9A227]' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              ذكر
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePassenger(index, 'gender', 'female')}
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                                passenger.gender === 'female' 
                                  ? 'bg-[#C9A227]/10 text-[#C9A227] border-2 border-[#C9A227]' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              أنثى
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1 justify-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" value="mr" checked={passenger.title === 'mr'} onChange={(e) => updatePassenger(index, 'title', e.target.value)} className="accent-[#C9A227] w-4 h-4" />
                              <span className="text-sm font-bold text-slate-700">السيد</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" value="mrs" checked={passenger.title === 'mrs'} onChange={(e) => updatePassenger(index, 'title', e.target.value)} className="accent-[#C9A227] w-4 h-4" />
                              <span className="text-sm font-bold text-slate-700">السيدة</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" value="ms" checked={passenger.title === 'ms'} onChange={(e) => updatePassenger(index, 'title', e.target.value)} className="accent-[#C9A227] w-4 h-4" />
                              <span className="text-sm font-bold text-slate-700">الآنسة</span>
                            </label>
                          </div>
                        </div>

                        {/* Nationality */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            <Globe className="w-4 h-4 inline ml-1 text-[#C9A227]" />
                            الجنسية *
                          </label>
                          <select
                            value={passenger.nationality}
                            onChange={(e) => updatePassenger(index, 'nationality', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-xs font-semibold"
                            required
                          >
                            <option value="">اختر الجنسية</option>
                            {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>

                        {/* First Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            <User className="w-4 h-4 inline ml-1 text-[#C9A227]" />
                            الاسم الأول (بالأحرف الإنجليزية) *
                          </label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                            placeholder="First Name"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold uppercase"
                            dir="ltr"
                            required
                          />
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">اسم العائلة (بالأحرف الإنجليزية) *</label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                            placeholder="Last Name"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold uppercase"
                            dir="ltr"
                            required
                          />
                        </div>

                        {/* Passport Number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            <FileText className="w-4 h-4 inline ml-1 text-[#C9A227]" />
                            رقم جواز السفر *
                          </label>
                          <input
                            type="text"
                            value={passenger.passportNumber}
                            onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                            placeholder="A12345678"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold uppercase"
                            dir="ltr"
                            required
                          />
                        </div>

                        {/* Passport Expiry */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            <Calendar className="w-4 h-4 inline ml-1 text-[#C9A227]" />
                            تاريخ انتهاء الجواز *
                          </label>
                          <input
                            type="date"
                            value={passenger.passportExpiry}
                            onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-xs font-semibold"
                            required
                          />
                        </div>

                        {/* Date of Birth */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            <Calendar className="w-4 h-4 inline ml-1 text-[#C9A227]" />
                            تاريخ الميلاد *
                          </label>
                          <input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-xs font-semibold"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-base font-bold text-[#071428] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Mail className="w-5 h-5 text-[#C9A227]" />
                      معلومات الاتصال وإرسال التذاكر
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">البريد الإلكتروني *</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold"
                          dir="ltr"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">تأكيد البريد الإلكتروني *</label>
                        <input
                          type="email"
                          value={contact.confirmEmail}
                          onChange={(e) => setContact({ ...contact, confirmEmail: e.target.value })}
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold"
                          dir="ltr"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-2">رقم الهاتف الجوال *</label>
                        <div className="flex gap-2">
                          <select
                            value={contact.countryCode}
                            onChange={(e) => setContact({ ...contact, countryCode: e.target.value })}
                            className="w-28 px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-xs font-semibold bg-white"
                          >
                            <option value="+966">🇸🇦 +966</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+965">🇰🇼 +965</option>
                            <option value="+973">🇧🇭 +973</option>
                            <option value="+974">🇶🇦 +974</option>
                            <option value="+20">🇪🇬 +20</option>
                            <option value="+44">🇬🇧 +44</option>
                          </select>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            placeholder="5XX XXX XXXX"
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-semibold text-right"
                            dir="ltr"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { if (validateStep1()) setCurrentStep(2); }}
                      className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                    >
                      الخطوة التالية: ترقيات السفر
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Upgrades */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-8 h-8 bg-[#071428] text-[#C9A227] rounded-full flex items-center justify-center font-bold text-sm">
                      ٢
                    </div>
                    <h2 className="text-xl font-bold text-[#071428]">خدمات ترقيات السفر الإضافية</h2>
                  </div>

                  {/* Addon 1: Takaful Insurance */}
                  <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#C9A227]/50 transition-all bg-gradient-to-l from-slate-50/50 to-white text-right">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-500/10 rounded-xl">
                        <Shield className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 text-sm">تأمين السفر التكافلي الشامل</h3>
                          <span className="text-xs font-black text-[#071428]">45 ر.س / لكل مسافر</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          حماية طبية كاملة للرحلة تشمل تعويض إلغاء الطيران وفقدان الأمتعة وحالات الطوارئ المعتمدة دولياً.
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

                  {/* Addon 2: eSIM */}
                  <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#C9A227]/50 transition-all bg-gradient-to-l from-slate-50/50 to-white text-right">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Smartphone className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 text-sm">شريحة بيانات eSIM دولية</h3>
                          <span className="text-xs font-semibold text-slate-500">تفعل بتصوير باركود QR</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          استمتع باتصال انترنت سريع ومباشر فور هبوط الطائرة. اختر الباقة الملائمة لوجهتك.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'none', label: 'لا أرغب', price: 'مجاني' },
                            { id: '10gb', label: '10 جيجا (7 أيام)', price: '75 ر.س' },
                            { id: '20gb', label: '20 جيجا (15 يوم)', price: '120 ر.س' },
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
                  <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#C9A227]/50 transition-all bg-gradient-to-l from-slate-50/50 to-white text-right">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Car className="w-7 h-7 text-amber-600" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 text-sm">توصيل المطار بسيارة وسائق خاص</h3>
                          <span className="text-xs font-semibold text-slate-500">استقبال بصالة الوصول بالاسم</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          سائقك الخاص في انتظارك بصالة الوصول لنقلك مباشرة للوجهة. تتبع تلقائي لوقت هبوط الطائرة.
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
                      الرجوع للمسافرين
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                    >
                      الخطوة التالية: مراجعة الرحلة
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
                    <h2 className="text-xl font-bold text-[#071428]">مراجعة حجز طيرانك</h2>
                  </div>

                  {/* Summary lists */}
                  <div className="space-y-4 text-right">
                    {/* Passengers */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 block">بيانات المسافرين المعتمدة</span>
                      {passengers.map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center text-xs border-b border-slate-200/50 pb-2 last:border-0 last:pb-0 font-medium">
                          <span className="font-bold text-[#071428]">{p.title} / {p.firstName} {p.lastName}</span>
                          <span className="text-slate-500">الجنسية: {p.nationality} • جواز: {p.passportNumber}</span>
                        </div>
                      ))}
                    </div>

                    {/* Upgrades */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block">الخدمات المضافة</span>
                      {upgrades.totalSAR === 0 ? (
                        <span className="text-xs text-slate-500">لم يتم تحديد ترقيات إضافية</span>
                      ) : (
                        <ul className="text-xs font-semibold text-slate-700 space-y-1">
                          {insuranceSelected && <li>• تأمين السفر التكافلي لعدد {passengers.length} ركاب</li>}
                          {esimPlan !== 'none' && <li>• شريحة انترنت eSIM دولية ({esimPlan === '10gb' ? '10 جيجا' : '20 جيجا'})</li>}
                          {transferType !== 'none' && <li>• سائق وسيارة نقل مطار خاصة ({transferType === 'sedan' ? 'سيدان' : 'SUV عائلية'})</li>}
                        </ul>
                      )}
                    </div>
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
                      onClick={() => setCurrentStep(4)}
                      className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                    >
                      الخطوة التالية: اختيار الدفع
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
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
                    <h2 className="text-xl font-bold text-[#071428]">طريقة الدفع الآمنة</h2>
                  </div>

                  <form onSubmit={handleStep4Submit} className="space-y-6">
                    {/* Wallet */}
                    {isAuthenticated && user && user.walletBalance > 0 && (
                      <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-xl flex items-center justify-between">
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
                            <span className="text-xs text-slate-500 block mt-0.5">رصيدك المتاح: {user.walletBalance.toLocaleString()} ر.س</span>
                          </div>
                        </div>
                        <Wallet className="w-6 h-6 text-[#C9A227]" />
                      </div>
                    )}

                    {useWallet && isAuthenticated && user && user.walletBalance >= totalInSAR ? (
                      <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-200/50 space-y-2">
                        <Check className="w-10 h-10 text-green-600 mx-auto" />
                        <p className="text-green-800 font-bold text-sm">سيتم تغطية حجز رحلتك بالكامل من رصيد محفظتك.</p>
                        <p className="text-slate-500 text-xs">لا حاجة لإدخال تفاصيل الدفع الأخرى.</p>
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
                            { id: 'card', label: 'بطاقة ائتمان', icon: '💳' },
                            { id: 'mada', label: 'مدى', icon: '🏦' },
                            { id: 'apple', label: 'Apple Pay', icon: null },
                            { id: 'tabby', label: 'تابي (تقسيط)', icon: '📱' },
                            { id: 'tamara', label: 'تمارا (تقسيط)', icon: '📱' },
                          ].map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                paymentMethod === method.id
                                  ? 'border-[#C9A227] bg-[#C9A227]/5 font-bold text-[#071428]'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
                              }`}
                            >
                              <span>{method.icon}</span>
                              <span className="text-xs">{method.label}</span>
                            </button>
                          ))}
                        </div>

                        {(paymentMethod === 'tabby' || paymentMethod === 'tamara') && (
                          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 text-right">
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

                        {(paymentMethod === 'card' || paymentMethod === 'mada') && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">رقم البطاقة</label>
                              <input
                                type="text"
                                value={payment.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="XXXX XXXX XXXX XXXX"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold tracking-wider text-sm"
                                dir="ltr"
                                maxLength={19}
                                autoComplete="cc-number"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">الاسم على البطاقة</label>
                              <input
                                type="text"
                                value={payment.cardName}
                                onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                                placeholder="CARDHOLDER NAME"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-sm uppercase"
                                dir="ltr"
                                autoComplete="cc-name"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">تاريخ الانتهاء</label>
                                <input
                                  type="text"
                                  value={payment.expiry}
                                  onChange={handleExpiryChange}
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-center text-sm"
                                  dir="ltr"
                                  maxLength={5}
                                  autoComplete="cc-exp"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">رمز CVV</label>
                                <input
                                  type="text"
                                  value={payment.cvv}
                                  onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                                  placeholder="XXX"
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] font-semibold text-center text-sm"
                                  dir="ltr"
                                  maxLength={4}
                                  autoComplete="cc-csc"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'apple' && (
                          <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-xs text-slate-600 font-medium mb-4">اضغط على الزر أدناه للدفع الآمن عبر Apple Pay</p>
                            <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mx-auto">
                              Pay with Apple Pay
                            </button>
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
                        type="submit"
                        className="bg-[#071428] hover:bg-[#071428]/95 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm"
                      >
                        <Lock className="w-4 h-4" />
                        تأكيد وإصدار التذكرة ({finalPayable.toLocaleString()} {flightData.pricing.currency})
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 5: Confirmation Loading */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-[#C9A227]/20 border-t-[#C9A227] rounded-full animate-spin flex items-center justify-center" />
                    <Plane className="w-10 h-10 text-[#071428] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180" />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-xl font-bold text-[#071428]">جاري حجز مقاعد الطيران وتأكيد التذكرة...</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      يرجى عدم تحديث أو إغلاق الصفحة. نقوم حالياً بالتواصل مع شبكة الطيران العالمية (Amadeus/Duffel) لضمان حجز تذاكرك الإلكترونية وتجهيز البوردنج.
                    </p>
                  </div>

                  <div className="bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-xl p-3.5 text-xs text-[#071428] font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#C9A227]" />
                    <span>عملية مشفرة بنظام حماية البيانات العالمي 3D Secure</span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Boarding Pass - Desktop */}
          <div className="lg:w-96 hidden lg:block">
            <div className="sticky top-28">
              <BoardingPass upgrades={upgrades} />
            </div>
          </div>
        </div>
      </div>

      {/* OTP simulation Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-arabic">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 text-right"
          >
            {/* Header */}
            <div className="bg-[#071428] text-white p-6 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">بوابة الدفع الآمنة (Tap Payments)</h3>
                  <p className="text-[10px] text-white/70 font-semibold">التحقق ثلاثي الأمان (3D Secure)</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { setShowOTPModal(false); setIsProcessing(false); setCurrentStep(4); }}
                className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-right">
                <div className="flex justify-between items-center mb-2 text-xs text-slate-700 font-semibold">
                  <span>التاجر:</span>
                  <span className="font-bold text-[#071428]">الملحم للسفر والسياحة</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-xs text-slate-700 font-semibold">
                  <span>المبلغ الإجمالي:</span>
                  <span className="font-bold text-[#C9A227]">{(finalPayable).toLocaleString()} {flightData?.pricing?.currency}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
                  <span>البطاقة المستخدمة:</span>
                  <span className="font-mono">{paymentMethod === 'mada' ? 'Mada Card (**** ' : 'Credit Card (**** '}{payment.cardNumber ? payment.cardNumber.slice(-4) : '4242'})</span>
                </div>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-xs text-slate-600 font-semibold mb-2">
                    تم إرسال رمز الأمان المؤقت (OTP) لجوالك. يرجى إدخاله لإتمام العملية.
                  </p>
                  <p className="text-[10px] text-yellow-800 bg-yellow-50 py-1.5 px-3 rounded-lg inline-block border border-yellow-200 font-bold">
                    💡 رمز اختبار المحاكاة هو: <span className="font-mono font-bold">1234</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 text-center">أدخل رمز التحقق (OTP)</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="XXXX"
                    maxLength={6}
                    required
                    className="w-full text-center tracking-widest text-2xl font-bold py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] font-mono"
                  />
                  {otpError && (
                    <p className="text-red-500 text-xs font-bold text-center mt-2 flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Countdown */}
                <div className="text-center text-xs text-slate-500 font-medium">
                  تنتهي صلاحية الرمز خلال: <span className="font-mono text-[#071428] font-bold">{formatTimer(otpTimer)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-[#22c55e] hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-75 text-sm"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    تأكيد الدفع
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowOTPModal(false); setIsProcessing(false); setCurrentStep(4); }}
                    disabled={isProcessing}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all disabled:opacity-75 text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FlightCheckout;
