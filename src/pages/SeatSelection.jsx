import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Check, X, Users, Loader2 } from 'lucide-react';
import { DuffelAncillaries } from '@duffel/components';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../config/api.config';

const SeatSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offerId');
  const travelClass = searchParams.get('travelClass') || 'economy';
  
  const [offer, setOffer] = useState(null);
  const [clientKey, setClientKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payloadData, setPayloadData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!offerId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch raw offer
        const offerRes = await fetch(`${API_CONFIG.BASE_URL}/amadeus/flights/offers/${offerId}`);
        if (!offerRes.ok) throw new Error('فشل في جلب تفاصيل الرحلة');
        const offerData = await offerRes.json();
        
        // Fetch client key
        const keyRes = await fetch(`${API_CONFIG.BASE_URL}/amadeus/flights/client-key`, { method: 'POST' });
        if (!keyRes.ok) throw new Error('فشل في جلب مفتاح التحقق');
        const keyData = await keyRes.json();
        
        // The offer response from Duffel has a nested 'data' object
        setOffer(offerData.data);
        setClientKey(keyData.data.component_client_key);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offerId, navigate]);

  const handlePayloadReady = (data, metadata) => {
    // Save payload data
    setPayloadData(data);
    setIsReady(true);
    
    // We do NOT auto-navigate here because if the flight has no seats available,
    // Duffel fires this immediately on mount and the user gets skipped.
    // The user must click the button manually.
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center pt-header-offset">
        <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#071428]">جاري تحميل خريطة المقاعد الحقيقية...</h2>
        <p className="text-slate-600">يرجى الانتظار للحظات</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center pt-header-offset px-4">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl max-w-md text-center">
          <X className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">عذراً، حدث خطأ</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary mt-6 w-full">العودة للنتائج</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-header-offset pb-20">
      {/* Header */}
      <div className="bg-[#071428] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-2">اختر مقعدك المفضل</h1>
          <p className="text-slate-300">نظام اختيار المقاعد الحقيقي المدعوم من Duffel</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
          {offer && clientKey ? (
            <div className="flex flex-col items-center">
              <div className="duffel-components-wrapper w-full" dir="ltr">
                {/* Force LTR for Duffel components to ensure correct layout */}
                <DuffelAncillaries
                  offer={offer}
                  services={['seats']}
                  passengers={offer.passengers}
                  client_key={clientKey}
                  onPayloadReady={handlePayloadReady}
                />
              </div>
              
              {/* Fallback info and manual continue button */}
              <div className="mt-8 text-center border-t border-slate-100 pt-8 w-full">
                {isReady && payloadData?.length > 0 && (
                  <p className="text-green-600 font-bold mb-4">تم حفظ المقاعد بنجاح!</p>
                )}
                {isReady && (!payloadData || payloadData.length === 0) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-right">
                    <p className="text-slate-800 font-bold mb-1">اختيار المقعد غير متاح مسبقاً لهذه الرحلة</p>
                    <p className="text-slate-500 text-sm">سيتم تخصيص مقعدك تلقائياً عند إصدار بطاقة الصعود (Check-in)، أو يمكنك اختياره لاحقاً عبر موقع شركة الطيران باستخدام رقم الحجز (PNR).</p>
                  </div>
                )}
                
                <button 
                  onClick={() => navigate(`/flights/checkout?offerId=${offerId}`, { state: { selectedServices: payloadData } })}
                  className="btn-primary px-10 py-4 text-lg w-full md:w-auto"
                >
                  المتابعة لصفحة الدفع
                </button>
              </div>
            </div>
          ) : (
             <div className="text-center py-10">تعذر تحميل بيانات الرحلة.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
