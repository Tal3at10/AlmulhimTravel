import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Check, FileText, CreditCard, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerProposalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiService.bookings.getById(id);
        setBooking(res.data);
      } catch (err) {
        toast.error('لم نتمكن من العثور على طلبك. الرجاء التأكد من الرابط.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      // Initiate payment gateway session using existing payments endpoint
      const res = await apiService.payments.initiate({
        bookingId: booking.id,
        amount: booking.totalAmount,
        currency: booking.currency
      });
      // Assuming res.data contains checkoutUrl from payment gateway
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        // Fallback for demo purposes
        await apiService.bookings.confirm(booking.id);
        toast.success('تم تأكيد الحجز بنجاح!');
        navigate('/booking-success');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء معالجة الدفع.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  if (!booking) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">العرض غير متوفر</h2>
      <p className="text-gray-500 mt-2">قد يكون الرابط غير صحيح أو انتهت صلاحية العرض.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4">اقتراح الرحلة المخصص لك</h1>
        <p className="text-lg text-gray-600">أهلاً بك، تم إعداد هذا العرض خصيصاً لتلبية متطلباتك.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Proposal Details (Markdown / Text rendering or PDF link) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <FileText className="text-3xl text-primary" />
              <h2 className="text-2xl font-bold text-gray-800">تفاصيل العرض</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              {/* If we have an AI-extracted Markdown, we can render it here. 
                  For now we will show generic info + link to view full Voucher PDF. */}
              <p className="mb-4 text-lg">
                لقد قمنا بتجهيز أفضل خيارات الطيران والفنادق بناءً على طلبك. يمكنك الاطلاع على الفاوتشر الكامل بكافة التفاصيل.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-blue-800 font-medium">رقم المرجع: {booking.referenceNumber}</p>
              </div>

              {booking.voucherReference && (
                <a 
                  href={`/api/bookings/voucher/${booking.referenceNumber}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors border border-gray-300"
                >
                  <Download className="text-xl" />
                  تحميل الفاوتشر المخصص (PDF)
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Payment & Summary Side */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -z-10"></div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-6">ملخص التكلفة</h3>
            
            <div className="flex justify-between items-end mb-8 border-b pb-6">
              <div>
                <span className="block text-sm text-gray-500 mb-1">المبلغ الإجمالي المطلـوب</span>
                <span className="text-4xl font-black text-primary">{booking.totalAmount.toLocaleString()}</span>
                <span className="text-lg font-bold text-gray-600 ml-2">{booking.currency}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="text-green-500 text-lg flex-shrink-0" />
                <span>شامل جميع الضرائب والرسوم</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="text-green-500 text-lg flex-shrink-0" />
                <span>دعم فني على مدار الساعة</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="text-green-500 text-lg flex-shrink-0" />
                <span>خيارات دفع آمنة ومرنة</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handlePayment}
                disabled={processingPayment || booking.status !== 'Pending'}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {processingPayment ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : booking.status === 'Pending' ? (
                  <>
                    <CreditCard className="text-2xl" />
                    المتابعة للدفع
                  </>
                ) : (
                  <>تم تأكيد الحجز مسبقاً</>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
