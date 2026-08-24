import { useState, useEffect } from 'react';
import api from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  HiOutlineUsers, 
  HiOutlineChatAlt2, 
  HiOutlineExclamationCircle, 
  HiOutlineXCircle, 
  HiOutlineCheckCircle, 
  HiOutlineCurrencyDollar,
  HiOutlineRefresh
} from 'react-icons/hi';

const COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

const PIE_COLORS = ['#10b981', '#6366f1', '#ef4444', '#f59e0b'];

export default function WhatsAppAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(14);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/whatsapp/analytics/dashboard?days=${days}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('فشل في جلب بيانات التحليلات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-info">
            <h1>تحليلات المساعد الذكي</h1>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 120 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-info">
            <h1>تحليلات المساعد الذكي</h1>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={fetchAnalytics}>
              <HiOutlineRefresh /> إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const pieData = [
    { name: 'نجاح الفلترة والتوجيه', value: data.totalRouted || 0 },
    { name: 'حل آلي بدون موظف', value: data.totalBotOnlyResolved || 0 },
    { name: 'إهمال الموظفين', value: data.agentNeglected || 0 },
    { name: 'أخطاء تقنية', value: data.botErrors || 0 },
  ];

  const agentData = (data.agentPerformance || [])
    .filter(a => a.agentName && a.agentName !== 'غير محدد')
    .sort((a, b) => b.conversationsHandled - a.conversationsHandled);

  const totalCheckoutAttempts = agentData.reduce((sum, a) => sum + (a.checkoutAttempts || 0), 0);
  const totalConfirmedSales = agentData.reduce((sum, a) => sum + (a.confirmedSales || 0), 0);
  const dropOffCount = totalCheckoutAttempts > totalConfirmedSales ? totalCheckoutAttempts - totalConfirmedSales : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <h1>تحليلات أداء المساعد الذكي والموظفين</h1>
          <p>بيانات حية من قاعدة البيانات — آخر {days} يوم ({data.totalConversations} محادثة)</p>
        </div>
        <div className="page-header-actions">
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              background: 'var(--bg-input)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              marginLeft: '10px'
            }}
          >
            <option value={7}>آخر أسبوع</option>
            <option value={14}>آخر أسبوعين</option>
            <option value={30}>آخر شهر</option>
            <option value={90}>آخر 3 أشهر</option>
            <option value={180}>آخر 6 أشهر</option>
            <option value={365}>آخر سنة</option>
            <option value={1000}>كل الأوقات</option>
          </select>
          <button className="btn btn-primary" onClick={fetchAnalytics}>
            <HiOutlineRefresh /> تحديث
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-card-info">
            <h3>إجمالي المحادثات</h3>
            <div className="stat-card-value">{data.totalConversations}</div>
            <div className="stat-card-change">
              <span>{days} يوم</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineUsers />
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-card-info">
            <h3>كفاءة البوت (فلترة ناجحة)</h3>
            <div className="stat-card-value">{data.botSuccessRate}%</div>
            <div className="stat-card-change up">
              <span>{data.totalRouted} محادثة محولة بنجاح</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineChatAlt2 />
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-card-info">
            <h3>نسبة أخطاء البوت</h3>
            <div className="stat-card-value">{data.botErrorRate}%</div>
            <div className="stat-card-change">
              <span>{data.botErrors} خطأ فقط</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineExclamationCircle />
          </div>
        </div>

        <div className="stat-card gold">
          <div className="stat-card-info">
            <h3>إهمال الموظفين</h3>
            <div className="stat-card-value">{data.neglectRate}%</div>
            <div className="stat-card-change down">
              <span>{data.agentNeglected} عميل بدون رد</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineXCircle />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-card-info">
            <h3>حل آلي بدون موظف</h3>
            <div className="stat-card-value">{data.totalBotOnlyResolved}</div>
            <div className="stat-card-change">
              <span>البوت أنجزها وحده</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineCheckCircle />
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-card-info">
            <h3>تم تحويلها للموظفين</h3>
            <div className="stat-card-value">{data.totalRouted}</div>
            <div className="stat-card-change up">
              <span>عملاء جاهزين للبيع</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineUsers />
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-card-info">
            <h3>رد عليها الموظفين</h3>
            <div className="stat-card-value">{data.totalRouted - data.agentNeglected}</div>
            <div className="stat-card-change up">
              <span>تم التعامل معها</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineCheckCircle />
          </div>
        </div>

        <div className="stat-card gold">
          <div className="stat-card-info">
            <h3>حجوزات مؤكدة (AI)</h3>
            <div className="stat-card-value">{data.confirmedBookings || 0}</div>
            <div className="stat-card-change">
              <span>{(data.revenueGenerated || 0).toLocaleString()} ر.س</span>
            </div>
          </div>
          <div className="stat-card-icon">
            <HiOutlineCurrencyDollar />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">الأداء اليومي</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.dailyStats || []} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickFormatter={(d) => { const parts = d.split('-'); return `${parts[1]}/${parts[2]}`; }}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', direction: 'rtl' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Legend wrapperStyle={{ direction: 'rtl' }} />
                <Bar dataKey="agentReplied" name="رد الموظف" fill={COLORS.success} radius={[2, 2, 0, 0]} />
                <Bar dataKey="neglected" name="إهمال الموظف" fill={COLORS.danger} radius={[2, 2, 0, 0]} />
                <Bar dataKey="botSuccess" name="حل آلي" fill={COLORS.info} radius={[2, 2, 0, 0]} />
                <Bar dataKey="botErrors" name="أخطاء البوت" fill={COLORS.warning} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">توزيع المحادثات</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', direction: 'rtl' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#1e293b', borderLeft: '4px solid #f59e0b' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineExclamationCircle /> تحليل قمع المبيعات (ملاحظات للاجتماع)
          </h3>
        </div>
        <div style={{ padding: '0 20px 20px 20px', color: '#cbd5e1', lineHeight: '1.6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ color: '#9ca3af', margin: '0 0 8px 0', fontSize: '14px' }}>وصل لمرحلة الدفع (Checkout)</h4>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{totalCheckoutAttempts}</span>
              <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#64748b' }}>العميل وصل لدرجة التفاوض المالي واستلم رابط الدفع</p>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ color: '#9ca3af', margin: '0 0 8px 0', fontSize: '14px' }}>مبيعات أُثبتت نصياً بالواتساب</h4>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{totalConfirmedSales}</span>
              <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#64748b' }}>العميل أرسل الإيصال أو استلم تأكيد/تذكرة داخل الشات</p>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ color: '#9ca3af', margin: '0 0 8px 0', fontSize: '14px' }}>الفجوة البيعية (Drop-off)</h4>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{dropOffCount}</span>
              <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#64748b' }}>الفرق بين من طلب الدفع ومن أكدناه</p>
            </div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ color: '#f59e0b', marginTop: 0 }}>💡 أين المشكلة الحقيقية إذن؟ (The Drop-off Problem)</h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>جودة العملاء ممتازة (حوالي 16% يصلون لطلب السداد). لكن الفارق الضخم بين "من وصل للدفع" و "المبيعات المؤكدة نصياً" يخبرنا كإدارة بأحد الأمرين:</p>
            <ul style={{ margin: 0, paddingRight: '20px', direction: 'rtl', fontSize: '14px' }}>
              <li style={{ marginBottom: '8px' }}><strong>1. البيع يتم خارج الواتساب (الأرجح):</strong> המبيعات تتم فعلياً لكن الموظف يُغلق البيعة عبر الهاتف أو يرسل التذكرة/VoucherPro بالإيميل، فلا تظهر في نصوص الواتساب إطلاقاً. (الحل: ضرورة ربط النظام المالي باللوحة).</li>
              <li><strong>2. انسحاب العميل (Abandoned Cart):</strong> العميل يضغط على رابط الدفع ويهرب في اللحظة الأخيرة بسبب السعر. (الحل: تفعيل رسائل إعادة الاستهداف لمن يستلم رابطاً ولا يدفع).</li>
            </ul>
          </div>
        </div>
      </div>

      {agentData.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">أداء الموظفين</h3>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th style={{ textAlign: 'center' }}>المحادثات</th>
                  <th style={{ textAlign: 'center' }}>الرسائل</th>
                  <th style={{ textAlign: 'center' }}>مبيعات مؤكدة</th>
                  <th style={{ textAlign: 'center' }}>محاولات الدفع</th>
                  <th style={{ textAlign: 'center' }}>وقت الرد (وسيط)</th>
                  <th style={{ textAlign: 'center' }}>رد خلال ساعة</th>
                  <th style={{ textAlign: 'center' }}>النتيجة</th>
                  <th style={{ textAlign: 'center' }}>التقييم</th>
                </tr>
              </thead>
              <tbody>
                {agentData.map((agent, i) => {
                  const responseTime = agent.avgResponseTimeMinutes;
                  let timeLabel = '';
                  let timeBadge = '';
                  if (responseTime < 5) { timeLabel = `${responseTime} دقيقة`; timeBadge = 'badge-success'; }
                  else if (responseTime < 30) { timeLabel = `${responseTime} دقيقة`; timeBadge = 'badge-success'; }
                  else if (responseTime < 60) { timeLabel = `${responseTime} دقيقة`; timeBadge = 'badge-info'; }
                  else if (responseTime < 180) { timeLabel = `${Math.round(responseTime / 60)} ساعة`; timeBadge = 'badge-warning'; }
                  else if (responseTime < 1440) { timeLabel = `${Math.round(responseTime / 60)} ساعة`; timeBadge = 'badge-danger'; }
                  else { timeLabel = 'أكثر من يوم'; timeBadge = 'badge-danger'; }

                  const score = agent.performanceScore || 0;
                  const rating = score >= 75 ? 'ممتاز' : score >= 55 ? 'جيد' : score >= 35 ? 'مقبول' : 'ضعيف';
                  const ratingBadge = score >= 75 ? 'badge-success' : score >= 55 ? 'badge-info' : score >= 35 ? 'badge-warning' : 'badge-danger';

                  const firstHourRate = agent.firstHourResponseRate || 0;
                  const firstHourBadge = firstHourRate >= 70 ? 'badge-success' : firstHourRate >= 40 ? 'badge-warning' : 'badge-danger';

                  const confirmedSales = agent.confirmedSales || 0;
                  const checkoutAttempts = agent.checkoutAttempts || 0;

                  return (
                    <tr key={i}>
                      <td>
                        <strong>{agent.agentName}</strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>{agent.conversationsHandled}</td>
                      <td style={{ textAlign: 'center' }}>{agent.totalMessagesSent}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${confirmedSales > 0 ? 'badge-success' : 'badge-secondary'}`} style={{ fontWeight: 'bold' }}>
                          {confirmedSales > 0 ? `${confirmedSales} بيعة` : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${checkoutAttempts > 0 ? 'badge-info' : 'badge-secondary'}`}>
                          {checkoutAttempts > 0 ? `${checkoutAttempts} محاولة` : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${timeBadge}`}>
                          {timeLabel}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${firstHourBadge}`}>
                          {firstHourRate}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <strong style={{ color: score >= 75 ? '#10b981' : score >= 55 ? '#3b82f6' : score >= 35 ? '#f59e0b' : '#ef4444' }}>
                          {score}/100
                        </strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${ratingBadge}`}>{rating}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #374151', fontSize: '12px', color: '#9ca3af', direction: 'rtl' }}>
              💡 <strong>النتيجة</strong> = سرعة الرد (40%) + حجم المحادثات (30%) + مؤشرات المبيعات (30%) — <strong>مؤشر المبيعات</strong> تقديري من تحليل نصوص المحادثات
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">حجم المحادثات اليومي</h3>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data.dailyStats || []}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(d) => { const parts = d.split('-'); return `${parts[1]}/${parts[2]}`; }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', direction: 'rtl' }}
              />
              <Area type="monotone" dataKey="total" name="إجمالي المحادثات" stroke={COLORS.primary} fill="url(#colorTotal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
