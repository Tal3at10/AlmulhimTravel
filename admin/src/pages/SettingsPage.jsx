import { useState, useEffect } from 'react';
import { cmsAPI, whatsappAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    HiOutlineCog,
    HiOutlineSave,
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineLocationMarker,
    HiOutlineGlobe,
    HiOutlineClock,
    HiOutlineCurrencyDollar,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineLockClosed,
} from 'react-icons/hi';

export default function SettingsPage() {
    const { logout } = useAuth();
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [botEnabled, setBotEnabled] = useState(true);
    const [botLoading, setBotLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const settingGroups = {
        general: ['CompanyName', 'CompanyTagline', 'WebsiteUrl', 'DefaultCurrency'],
        contact: ['ContactEmail', 'ContactPhone', 'WhatsAppNumber', 'SupportEmail'],
        location: ['Address', 'City', 'Country', 'GoogleMapsUrl'],
        social: ['FacebookUrl', 'TwitterUrl', 'InstagramUrl', 'YoutubeUrl', 'LinkedinUrl'],
        business: ['WorkingHours', 'BookingDeadline', 'CancellationPolicy', 'RefundPolicy'],
        security: [], // Special tab for password change
    };

    const groupLabels = {
        general: 'معلومات عامة',
        contact: 'معلومات الاتصال',
        location: 'الموقع',
        social: 'وسائل التواصل',
        business: 'سياسات العمل',
        security: 'الأمان',
    };

    const settingLabels = {
        CompanyName: 'اسم الشركة',
        CompanyTagline: 'الشعار',
        WebsiteUrl: 'رابط الموقع',
        DefaultCurrency: 'العملة الافتراضية',
        ContactEmail: 'البريد الإلكتروني للتواصل',
        ContactPhone: 'رقم الهاتف',
        WhatsAppNumber: 'رقم واتساب',
        SupportEmail: 'بريد الدعم الفني',
        Address: 'العنوان',
        City: 'المدينة',
        Country: 'الدولة',
        GoogleMapsUrl: 'رابط Google Maps',
        FacebookUrl: 'رابط فيسبوك',
        TwitterUrl: 'رابط تويتر',
        InstagramUrl: 'رابط إنستقرام',
        YoutubeUrl: 'رابط يوتيوب',
        LinkedinUrl: 'رابط لينكد إن',
        WorkingHours: 'ساعات العمل',
        BookingDeadline: 'موعد آخر حجز',
        CancellationPolicy: 'سياسة الإلغاء',
        RefundPolicy: 'سياسة الاسترداد',
    };

    const settingIcons = {
        CompanyName: HiOutlineCog,
        ContactPhone: HiOutlinePhone,
        ContactEmail: HiOutlineMail,
        SupportEmail: HiOutlineMail,
        WhatsAppNumber: HiOutlinePhone,
        Address: HiOutlineLocationMarker,
        City: HiOutlineLocationMarker,
        Country: HiOutlineLocationMarker,
        WebsiteUrl: HiOutlineGlobe,
        FacebookUrl: HiOutlineGlobe,
        TwitterUrl: HiOutlineGlobe,
        InstagramUrl: HiOutlineGlobe,
        YoutubeUrl: HiOutlineGlobe,
        LinkedinUrl: HiOutlineGlobe,
        WorkingHours: HiOutlineClock,
        DefaultCurrency: HiOutlineCurrencyDollar,
    };

    useEffect(() => { loadSettings(); loadBotStatus(); }, []);

    const loadBotStatus = async () => {
        try {
            const res = await whatsappAPI.getBotStatus();
            setBotEnabled(res.data.enabled);
        } catch (err) {
            console.error('Failed to load bot status', err);
        }
    };

    const handleToggleBot = async () => {
        const newState = !botEnabled;
        const action = newState ? 'تشغيل' : 'إيقاف';
        if (!window.confirm(`هل أنت متأكد من ${action} البوت؟`)) return;
        
        setBotLoading(true);
        try {
            const res = await whatsappAPI.toggleBot(newState);
            setBotEnabled(res.data.enabled);
            toast.success(res.data.message);
        } catch (err) {
            toast.error('فشل في تغيير حالة البوت');
        } finally {
            setBotLoading(false);
        }
    };

    const loadSettings = async () => {
        try {
            const res = await cmsAPI.getSettings();
            const settingsMap = {};
            (res.data || []).forEach(s => {
                settingsMap[s.key] = s.value;
            });
            setSettings(settingsMap);
        } catch (err) {
            toast.error('فشل في تحميل الإعدادات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key) => {
        setSaving(true);
        try {
            await cmsAPI.updateSetting(key, { value: settings[key] });
            toast.success(`تم حفظ ${settingLabels[key] || key}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const currentGroup = settingGroups[activeTab];
            for (const key of currentGroup) {
                if (settings[key] !== undefined) {
                    await cmsAPI.updateSetting(key, { value: settings[key] });
                }
            }
            toast.success('تم حفظ جميع الإعدادات');
        } catch (err) {
            toast.error('فشل في حفظ بعض الإعدادات');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('كلمة المرور الجديدة غير متطابقة');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            await axios.post('/api/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('تم تغيير كلمة المرور وتسجيل الخروج من جميع الأجهزة');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            
            // Logout after 2 seconds
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في تغيير كلمة المرور');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info"><h1>الإعدادات</h1></div>
                </div>
                <div className="card">
                    <div className="skeleton" style={{ height: 400 }} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>الإعدادات</h1>
                    <p>إدارة إعدادات النظام العامة</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
                        <HiOutlineSave /> {saving ? 'جاري الحفظ...' : 'حفظ الكل'}
                    </button>
                </div>
            </div>

            {/* Bot Kill Switch Card */}
            <div className="card" style={{
                marginBottom: 24,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `2px solid ${botEnabled ? 'var(--success, #22c55e)' : 'var(--danger, #ef4444)'}`,
                background: botEnabled
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)'
                    : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 100%)',
                transition: 'all 0.4s ease',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24,
                        background: botEnabled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    }}>
                        {botEnabled ? '🤖' : '⛔'}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 16 }}>
                            بوت الواتساب: <span style={{ color: botEnabled ? 'var(--success, #22c55e)' : 'var(--danger, #ef4444)' }}>
                                {botEnabled ? 'يعمل' : 'متوقف'}
                            </span>
                        </h3>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)', opacity: 0.8 }}>
                            {botEnabled
                                ? 'البوت يرد على العملاء تلقائياً عبر الواتساب'
                                : 'البوت متوقف — الرسائل ستصل للموظفين فقط بدون رد تلقائي'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleToggleBot}
                    disabled={botLoading}
                    style={{
                        padding: '10px 24px',
                        borderRadius: 10,
                        border: 'none',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: botLoading ? 'wait' : 'pointer',
                        color: '#fff',
                        background: botEnabled
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #22c55e, #16a34a)',
                        boxShadow: botEnabled
                            ? '0 4px 14px rgba(239,68,68,0.3)'
                            : '0 4px 14px rgba(34,197,94,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: 120,
                    }}
                >
                    {botLoading ? '⏳ جاري...' : botEnabled ? '⛔ إيقاف البوت' : '✅ تشغيل البوت'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {/* Sidebar Tabs */}
                <div style={{ width: 200, flexShrink: 0 }}>
                    <div className="card" style={{ padding: 8 }}>
                        {Object.keys(settingGroups).map(group => (
                            <button
                                key={group}
                                onClick={() => setActiveTab(group)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: 'none',
                                    borderRadius: 8,
                                    background: activeTab === group ? 'var(--gold)' : 'transparent',
                                    color: activeTab === group ? '#1A2332' : 'var(--text-secondary)',
                                    fontWeight: activeTab === group ? 600 : 400,
                                    cursor: 'pointer',
                                    textAlign: 'right',
                                    marginBottom: 4,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {groupLabels[group]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Form */}
                <div style={{ flex: 1, minWidth: 300 }}>
                    <div className="card">
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>{groupLabels[activeTab]}</h2>
                        </div>
                        <div style={{ padding: 24 }}>
                            {activeTab === 'security' ? (
                                <form onSubmit={handleChangePassword}>
                                    <div style={{ maxWidth: 500 }}>
                                        <div style={{ marginBottom: 24, padding: 16, background: 'rgba(212,175,55,0.1)', borderRadius: 8 }}>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                                                <HiOutlineLockClosed style={{ width: 20, height: 20, color: 'var(--gold)' }} />
                                                <h3 style={{ fontSize: 15, fontWeight: 600 }}>تغيير كلمة المرور</h3>
                                            </div>
                                            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                                                عند تغيير كلمة المرور، سيتم تسجيل الخروج من جميع الأجهزة تلقائياً
                                            </p>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">كلمة المرور الحالية *</label>
                                            <input
                                                className="form-input"
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">كلمة المرور الجديدة *</label>
                                            <input
                                                className="form-input"
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">تأكيد كلمة المرور الجديدة *</label>
                                            <input
                                                className="form-input"
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            <HiOutlineLockClosed />
                                            {saving ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                            <div style={{ display: 'grid', gap: 20 }}>
                                {settingGroups[activeTab].map(key => {
                                    const Icon = settingIcons[key] || HiOutlineCog;
                                    const isUrl = key.toLowerCase().includes('url') || key.toLowerCase().includes('website');
                                    const isLongText = ['CancellationPolicy', 'RefundPolicy'].includes(key);

                                    return (
                                        <div key={key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10,
                                                background: 'rgba(212,175,55,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Icon style={{ width: 20, height: 20, color: 'var(--gold)' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    color: 'var(--text-secondary)',
                                                    marginBottom: 8,
                                                }}>
                                                    {settingLabels[key] || key}
                                                </label>
                                                {isLongText ? (
                                                    <textarea
                                                        className="form-input"
                                                        rows={4}
                                                        value={settings[key] || ''}
                                                        onChange={e => updateSetting(key, e.target.value)}
                                                        placeholder={`أدخل ${settingLabels[key] || key}...`}
                                                    />
                                                ) : (
                                                    <input
                                                        className="form-input"
                                                        type={isUrl ? 'url' : 'text'}
                                                        value={settings[key] || ''}
                                                        onChange={e => updateSetting(key, e.target.value)}
                                                        placeholder={`أدخل ${settingLabels[key] || key}...`}
                                                        dir={isUrl ? 'ltr' : 'rtl'}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleSave(key)}
                                                disabled={saving}
                                                style={{ marginTop: 26 }}
                                                title="حفظ"
                                            >
                                                <HiOutlineCheck />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
