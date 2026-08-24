import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api';
import {
    HiOutlineUsers,
    HiOutlineClipboardList,
    HiOutlineBriefcase,
    HiOutlineGlobeAlt,
    HiOutlineTrendingUp,
    HiOutlineCalendar,
} from 'react-icons/hi';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getRecentBookings(8),
            ]);
            setStats(statsRes.data.data);
            setRecentBookings(bookingsRes.data.data || []);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats ? [
        {
            label: 'إجمالي المستخدمين',
            value: stats.totalUsers,
            subLabel: `${stats.newUsersThisMonth} هذا الشهر`,
            icon: HiOutlineUsers,
            color: 'gold',
        },
        {
            label: 'إجمالي الحجوزات',
            value: stats.totalBookings,
            subLabel: `${stats.bookingsThisMonth} هذا الشهر`,
            icon: HiOutlineClipboardList,
            color: 'blue',
        },
        {
            label: 'الباقات المتاحة',
            value: stats.totalPackages,
            subLabel: `${stats.activePackages} نشطة`,
            icon: HiOutlineBriefcase,
            color: 'green',
        },
        {
            label: 'الوجهات',
            value: stats.totalDestinations,
            subLabel: `${stats.totalHotels} فندق`,
            icon: HiOutlineGlobeAlt,
            color: 'orange',
        },
    ] : [];

    const getStatusBadge = (status) => {
        const map = {
            Pending: { class: 'badge-warning', label: 'قيد الانتظار' },
            Confirmed: { class: 'badge-success', label: 'مؤكد' },
            Cancelled: { class: 'badge-danger', label: 'ملغي' },
        };
        const s = map[status] || { class: 'badge-neutral', label: status };
        return <span className={`badge ${s.class}`}>{s.label}</span>;
    };

    const getTypeBadge = (type) => {
        const map = {
            Package: 'باقة',
            Hotel: 'فندق',
            Flight: 'طيران',
        };
        return <span className="badge badge-info">{map[type] || type}</span>;
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info">
                        <h1>لوحة التحكم</h1>
                        <p>مرحباً بك في لوحة تحكم الملهم للسفر</p>
                    </div>
                </div>
                <div className="stats-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton skeleton-card" />
                    ))}
                </div>
                <div className="card">
                    <div className="skeleton skeleton-text" style={{ width: '30%' }} />
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton skeleton-text" style={{ marginTop: 16 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-info">
                    <h1>لوحة التحكم</h1>
                    <p>نظرة عامة على أداء الملهم للسفر والسياحة</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-secondary">
                        <HiOutlineCalendar />
                        {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className={`stat-card ${card.color}`}>
                        <div className="stat-card-info">
                            <h3>{card.label}</h3>
                            <div className="stat-card-value">{card.value?.toLocaleString('ar-SA')}</div>
                            <div className="stat-card-change up">
                                <HiOutlineTrendingUp />
                                <span>{card.subLabel}</span>
                            </div>
                        </div>
                        <div className="stat-card-icon">
                            <card.icon />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bookings Summary */}
            {stats && (
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
                    <div className="stat-card green" style={{ padding: 18 }}>
                        <div className="stat-card-info">
                            <h3>حجوزات مؤكدة</h3>
                            <div className="stat-card-value" style={{ fontSize: 24 }}>{stats.confirmedBookings}</div>
                        </div>
                    </div>
                    <div className="stat-card orange" style={{ padding: 18 }}>
                        <div className="stat-card-info">
                            <h3>قيد الانتظار</h3>
                            <div className="stat-card-value" style={{ fontSize: 24 }}>{stats.pendingBookings}</div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ padding: 18, borderColor: 'rgba(239,68,68,0.15)' }}>
                        <div className="stat-card-info">
                            <h3 style={{ color: 'var(--danger)' }}>ملغية</h3>
                            <div className="stat-card-value" style={{ fontSize: 24 }}>{stats.cancelledBookings}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Bookings Table */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">آخر الحجوزات</div>
                        <div className="card-subtitle">أحدث الحجوزات الواردة</div>
                    </div>
                </div>

                {recentBookings.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineClipboardList className="empty-state-icon" />
                        <h3>لا توجد حجوزات</h3>
                        <p>لم يتم تسجيل أي حجوزات حتى الآن</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>رقم الحجز</th>
                                    <th>العميل</th>
                                    <th>النوع</th>
                                    <th>المبلغ</th>
                                    <th>الحالة</th>
                                    <th>التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td style={{ fontWeight: 600, fontFamily: 'monospace', direction: 'ltr', textAlign: 'right' }}>
                                            {booking.referenceNumber}
                                        </td>
                                        <td>
                                            <div>{booking.customerName}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', direction: 'ltr', textAlign: 'right' }}>
                                                {booking.customerEmail}
                                            </div>
                                        </td>
                                        <td>{getTypeBadge(booking.bookingType)}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            {booking.totalAmount?.toLocaleString('ar-SA')} {booking.currency}
                                        </td>
                                        <td>{getStatusBadge(booking.status)}</td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                            {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
