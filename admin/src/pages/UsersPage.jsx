import { useState, useEffect } from 'react';
import { usersAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlineUsers,
    HiOutlinePencil,
    HiOutlineBan,
    HiOutlineCheck,
    HiOutlineEye,
    HiOutlineSearch,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineX,
} from 'react-icons/hi';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await usersAPI.getAll();
            setUsers(res.data || []);
        } catch (err) {
            toast.error('فشل في تحميل المستخدمين');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            !searchQuery ||
            (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.includes(searchQuery);
        const matchesStatus = !statusFilter ||
            (statusFilter === 'active' && user.isActive) ||
            (statusFilter === 'inactive' && !user.isActive);
        return matchesSearch && matchesStatus;
    });

    const handleToggleActive = async (id) => {
        try {
            await usersAPI.toggleActive(id);
            toast.success('تم تحديث حالة المستخدم');
            setConfirmAction(null);
            loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في تحديث الحالة');
        }
    };

    const getStatusBadge = (isActive) => {
        return isActive
            ? <span className="badge badge-success"><HiOutlineCheck style={{ width: 12, height: 12, marginLeft: 4 }} />نشط</span>
            : <span className="badge badge-danger"><HiOutlineBan style={{ width: 12, height: 12, marginLeft: 4 }} />معطل</span>;
    };

    const getInitials = (user) => {
        return (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info"><h1>المستخدمين</h1></div>
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
                    <h1>المستخدمين</h1>
                    <p>إدارة حسابات المستخدمين ({users.length} مستخدم)</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 24, padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
                        <HiOutlineSearch style={{ color: 'var(--text-muted)', width: 20, height: 20 }} />
                        <input
                            className="form-input"
                            placeholder="بحث بالاسم أو البريد أو الهاتف..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1 }}
                        />
                    </div>
                    <select
                        className="form-input"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ width: 140 }}
                    >
                        <option value="">كل الحالات</option>
                        <option value="active">نشط</option>
                        <option value="inactive">معطل</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="card">
                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineUsers className="empty-state-icon" />
                        <h3>لا يوجد مستخدمين</h3>
                        <p>{searchQuery ? 'لا توجد نتائج مطابقة للبحث' : 'لم يتم تسجيل أي مستخدمين حتى الآن'}</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>المستخدم</th>
                                    <th>معلومات الاتصال</th>
                                    <th>الحالة</th>
                                    <th>تاريخ التسجيل</th>
                                    <th>آخر دخول</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: '50%',
                                                    background: user.profileImage
                                                        ? `url(${user.profileImage}) center/cover`
                                                        : 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#fff', fontSize: 14, fontWeight: 600,
                                                    flexShrink: 0,
                                                }}>
                                                    {!user.profileImage && getInitials(user)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</div>
                                                    {user.role && <span className="badge badge-info" style={{ fontSize: 10 }}>{user.role}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                                    <HiOutlineMail style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                                                    <span dir="ltr" style={{ textAlign: 'left' }}>{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                                        <HiOutlinePhone style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                                                        <span dir="ltr" style={{ textAlign: 'left' }}>{user.countryCode || '+966'} {user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(user.isActive)}</td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ar-SA') : 'لم يسبق له'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setSelectedUser(user)}
                                                    title="عرض التفاصيل"
                                                >
                                                    <HiOutlineEye />
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                                                    onClick={() => setConfirmAction({ user, action: user.isActive ? 'deactivate' : 'activate' })}
                                                    title={user.isActive ? 'تعطيل' : 'تفعيل'}
                                                >
                                                    {user.isActive ? <HiOutlineBan /> : <HiOutlineCheck />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
                        <div className="modal-header">
                            <h2>تفاصيل المستخدم</h2>
                            <button className="modal-close" onClick={() => setSelectedUser(null)}><HiOutlineX /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
                                    background: selectedUser.profileImage
                                        ? `url(${selectedUser.profileImage}) center/cover`
                                        : 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: 28, fontWeight: 700,
                                }}>
                                    {!selectedUser.profileImage && getInitials(selectedUser)}
                                </div>
                                <h3 style={{ marginBottom: 4 }}>{selectedUser.firstName} {selectedUser.lastName}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{selectedUser.email}</p>
                                {selectedUser.role && <span className="badge badge-info" style={{ marginTop: 8 }}>{selectedUser.role}</span>}
                            </div>
                            <div style={{ display: 'grid', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}><HiOutlineMail style={{ marginLeft: 6 }} />البريد الإلكتروني</span>
                                    <span dir="ltr">{selectedUser.email}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}><HiOutlinePhone style={{ marginLeft: 6 }} />رقم الهاتف</span>
                                    <span dir="ltr">{selectedUser.phone ? `${selectedUser.countryCode || '+966'} ${selectedUser.phone}` : '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}><HiOutlineCalendar style={{ marginLeft: 6 }} />تاريخ التسجيل</span>
                                    <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString('ar-SA') : '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>الحالة</span>
                                    {getStatusBadge(selectedUser.isActive)}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className={selectedUser.isActive ? 'btn btn-danger' : 'btn btn-success'}
                                onClick={() => { setSelectedUser(null); setConfirmAction({ user: selectedUser, action: selectedUser.isActive ? 'deactivate' : 'activate' }); }}
                            >
                                {selectedUser.isActive ? <><HiOutlineBan /> تعطيل</> : <><HiOutlineCheck /> تفعيل</>}
                            </button>
                            <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>إغلاق</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Action Dialog */}
            {confirmAction && (
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmAction(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon" style={{ color: confirmAction.action === 'activate' ? 'var(--success)' : 'var(--danger)' }}>
                                {confirmAction.action === 'activate' ? <HiOutlineCheck /> : <HiOutlineBan />}
                            </div>
                            <div className="confirm-title">
                                {confirmAction.action === 'activate' ? 'تفعيل المستخدم؟' : 'تعطيل المستخدم؟'}
                            </div>
                            <div className="confirm-message">
                                هل أنت متأكد من {confirmAction.action === 'activate' ? 'تفعيل' : 'تعطيل'} حساب المستخدم
                                <br />
                                <strong>{confirmAction.user.firstName} {confirmAction.user.lastName}</strong>
                                <br />
                                ({confirmAction.user.email})؟
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button
                                    className={confirmAction.action === 'activate' ? 'btn btn-success' : 'btn btn-danger'}
                                    onClick={() => handleToggleActive(confirmAction.user.id)}
                                >
                                    نعم، {confirmAction.action === 'activate' ? 'تفعيل' : 'تعطيل'}
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
