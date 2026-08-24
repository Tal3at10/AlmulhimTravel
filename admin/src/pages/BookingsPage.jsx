import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlineClipboardList,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineEye,
    HiOutlineSearch,
    HiOutlineFilter,
} from 'react-icons/hi';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
    });

    useEffect(() => { loadBookings(); }, [pagination.pageNumber, statusFilter, typeFilter]);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const params = {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                status: statusFilter || undefined,
                type: typeFilter || undefined,
                searchQuery: searchQuery || undefined,
            };
            const res = await bookingsAPI.getAll(params);
            const data = res.data;
            setBookings(data?.items || data || []);
            if (data?.totalCount !== undefined) {
                setPagination(prev => ({
                    ...prev,
                    totalCount: data.totalCount,
                    totalPages: data.totalPages || Math.ceil(data.totalCount / prev.pageSize),
                }));
            }
        } catch (err) {
            toast.error('فشل في تحميل الحجوزات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, pageNumber: 1 }));
        loadBookings();
    };

    const handleConfirm = async (id) => {
        try {
            await bookingsAPI.confirm(id);
            toast.success('تم تأكيد الحجز بنجاح');
            setConfirmAction(null);
            loadBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في تأكيد الحجز');
        }
    };

    const handleCancel = async (id) => {
        try {
            await bookingsAPI.cancel(id);
            toast.success('تم إلغاء الحجز بنجاح');
            setConfirmAction(null);
            loadBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في إلغاء الحجز');
        }
    };

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
            Package: { class: 'badge-info', label: 'باقة' },
            Hotel: { class: 'badge-blue', label: 'فندق' },
            Flight: { class: 'badge-purple', label: 'طيران' },
        };
        const t = map[type] || { class: 'badge-neutral', label: type };
        return <span className={`badge ${t.class}`}>{t.label}</span>;
    };

    if (loading && bookings.length === 0) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info"><h1>الحجوزات</h1></div>
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
                    <h1>الحجوزات</h1>
                    <p>إدارة ومتابعة جميع الحجوزات</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 24, padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
                        <input
                            className="form-input"
                            placeholder="بحث برقم الحجز أو اسم العميل..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-secondary">
                            <HiOutlineSearch />
                        </button>
                    </form>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <HiOutlineFilter style={{ color: 'var(--text-muted)' }} />
                        <select
                            className="form-input"
                            value={statusFilter}
                            onChange={e => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, pageNumber: 1 })); }}
                            style={{ width: 130 }}
                        >
                            <option value="">كل الحالات</option>
                            <option value="Pending">قيد الانتظار</option>
                            <option value="Confirmed">مؤكد</option>
                            <option value="Cancelled">ملغي</option>
                        </select>
                        <select
                            className="form-input"
                            value={typeFilter}
                            onChange={e => { setTypeFilter(e.target.value); setPagination(prev => ({ ...prev, pageNumber: 1 })); }}
                            style={{ width: 120 }}
                        >
                            <option value="">كل الأنواع</option>
                            <option value="Package">باقة</option>
                            <option value="Hotel">فندق</option>
                            <option value="Flight">طيران</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="card">
                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineClipboardList className="empty-state-icon" />
                        <h3>لا توجد حجوزات</h3>
                        <p>لم يتم تسجيل أي حجوزات حتى الآن</p>
                    </div>
                ) : (
                    <>
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
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td style={{ fontWeight: 600, fontFamily: 'monospace', direction: 'ltr', textAlign: 'right' }}>
                                                {booking.referenceNumber || booking.id?.slice(0, 8)}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{booking.customerName || booking.userName || 'غير معروف'}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                    {booking.customerEmail || booking.userEmail}
                                                </div>
                                            </td>
                                            <td>{getTypeBadge(booking.bookingType || booking.type)}</td>
                                            <td style={{ fontWeight: 600 }}>
                                                {(booking.totalAmount || 0).toLocaleString('ar-SA')} {booking.currency || 'ر.س'}
                                            </td>
                                            <td>{getStatusBadge(booking.status)}</td>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                                {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('ar-SA') : '-'}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setSelectedBooking(booking)}
                                                        title="عرض التفاصيل"
                                                    >
                                                        <HiOutlineEye />
                                                    </button>
                                                    {booking.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => setConfirmAction({ type: 'confirm', booking })}
                                                                title="تأكيد"
                                                            >
                                                                <HiOutlineCheck />
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => setConfirmAction({ type: 'cancel', booking })}
                                                                title="إلغاء"
                                                            >
                                                                <HiOutlineX />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={pagination.pageNumber === 1}
                                    onClick={() => setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }))}
                                >
                                    السابق
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-secondary)' }}>
                                    صفحة {pagination.pageNumber} من {pagination.totalPages}
                                </span>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={pagination.pageNumber >= pagination.totalPages}
                                    onClick={() => setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
                                >
                                    التالي
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h2>تفاصيل الحجز #{selectedBooking.referenceNumber || selectedBooking.id?.slice(0, 8)}</h2>
                            <button className="modal-close" onClick={() => setSelectedBooking(null)}><HiOutlineX /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>العميل</span>
                                    <span style={{ fontWeight: 500 }}>{selectedBooking.customerName || selectedBooking.userName || 'غير معروف'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>البريد الإلكتروني</span>
                                    <span>{selectedBooking.customerEmail || selectedBooking.userEmail || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>نوع الحجز</span>
                                    {getTypeBadge(selectedBooking.bookingType || selectedBooking.type)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>المبلغ الإجمالي</span>
                                    <span style={{ fontWeight: 600, color: 'var(--gold)' }}>
                                        {(selectedBooking.totalAmount || 0).toLocaleString('ar-SA')} {selectedBooking.currency || 'ر.س'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>الحالة</span>
                                    {getStatusBadge(selectedBooking.status)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>تاريخ الإنشاء</span>
                                    <span>{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString('ar-SA') : '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {selectedBooking.status === 'Pending' && (
                                <>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => { setSelectedBooking(null); setConfirmAction({ type: 'confirm', booking: selectedBooking }); }}
                                    >
                                        <HiOutlineCheck /> تأكيد الحجز
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => { setSelectedBooking(null); setConfirmAction({ type: 'cancel', booking: selectedBooking }); }}
                                    >
                                        <HiOutlineX /> إلغاء الحجز
                                    </button>
                                </>
                            )}
                            <button className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>إغلاق</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Action Dialog */}
            {confirmAction && (
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmAction(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon" style={{ color: confirmAction.type === 'confirm' ? 'var(--success)' : 'var(--danger)' }}>
                                {confirmAction.type === 'confirm' ? <HiOutlineCheck /> : <HiOutlineX />}
                            </div>
                            <div className="confirm-title">
                                {confirmAction.type === 'confirm' ? 'تأكيد الحجز؟' : 'إلغاء الحجز؟'}
                            </div>
                            <div className="confirm-message">
                                هل أنت متأكد من {confirmAction.type === 'confirm' ? 'تأكيد' : 'إلغاء'} الحجز
                                <br />
                                <strong>#{confirmAction.booking.referenceNumber || confirmAction.booking.id?.slice(0, 8)}</strong>
                                <br />
                                للعميل {confirmAction.booking.customerName || confirmAction.booking.userName || 'غير معروف'}؟
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button
                                    className={confirmAction.type === 'confirm' ? 'btn btn-success' : 'btn btn-danger'}
                                    onClick={() => confirmAction.type === 'confirm'
                                        ? handleConfirm(confirmAction.booking.id)
                                        : handleCancel(confirmAction.booking.id)
                                    }
                                >
                                    نعم، {confirmAction.type === 'confirm' ? 'تأكيد' : 'إلغاء'}
                                </button>
                                <button className="btn btn-secondary" onClick={() => setConfirmAction(null)}>إلغاء</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
