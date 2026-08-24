import { useState, useEffect } from 'react';
import { cmsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUserGroup,
    HiOutlineX,
} from 'react-icons/hi';

export default function BoardMembersPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        nameAr: '', nameEn: '', positionAr: '', positionEn: '',
        imageUrl: '', bio: '', sortOrder: 0,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await cmsAPI.getBoardMembers();
            setItems(res.data || []);
        } catch { toast.error('فشل في تحميل أعضاء مجلس الإدارة'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({
            nameAr: '', nameEn: '', positionAr: '', positionEn: '',
            imageUrl: '', bio: '', sortOrder: items.length,
        });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({
            nameAr: item.nameAr || '', nameEn: item.nameEn || '',
            positionAr: item.positionAr || '', positionEn: item.positionEn || '',
            imageUrl: item.imageUrl || '', bio: item.bio || '',
            sortOrder: item.sortOrder || 0,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                sortOrder: parseInt(formData.sortOrder) || 0,
            };
            if (editing) {
                await cmsAPI.updateBoardMember(editing.id, payload);
                toast.success('تم تحديث العضو بنجاح');
            } else {
                await cmsAPI.createBoardMember(payload);
                toast.success('تم إضافة العضو بنجاح');
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'حدث خطأ');
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await cmsAPI.deleteBoardMember(confirmDelete.id);
            toast.success('تم حذف العضو');
            setConfirmDelete(null);
            loadData();
        } catch { toast.error('فشل في الحذف'); }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header"><div className="page-header-info"><h1>أعضاء مجلس الإدارة</h1></div></div>
                <div className="content-grid-3">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 250 }} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>أعضاء مجلس الإدارة</h1>
                    <p>إدارة أعضاء مجلس الإدارة</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus /> إضافة عضو
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <HiOutlineUserGroup className="empty-state-icon" />
                        <h3>لا يوجد أعضاء</h3>
                        <p>ابدأ بإضافة عضو جديد لمجلس الإدارة</p>
                        <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
                            <HiOutlinePlus /> إضافة عضو
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-grid-3">
                    {items.map((item) => (
                        <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', textAlign: 'center' }}>
                            <div style={{
                                width: 90, height: 90, borderRadius: '50%', margin: '24px auto 12px',
                                background: item.imageUrl
                                    ? `url(${item.imageUrl}) center/cover`
                                    : 'linear-gradient(135deg, var(--navy-light), var(--gold))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 28, fontWeight: 700,
                                border: '3px solid rgba(212,175,55,0.3)',
                            }}>
                                {!item.imageUrl && item.nameAr?.charAt(0)}
                            </div>
                            <div style={{ padding: '0 16px 20px' }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{item.nameAr}</h3>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{item.nameEn}</div>
                                <div style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 8 }}>{item.positionAr}</div>
                                {item.bio && (
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, maxHeight: 48, overflow: 'hidden' }}>
                                        {item.bio}
                                    </p>
                                )}
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                                        <HiOutlinePencil /> تعديل
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(item)}>
                                        <HiOutlineTrash /> حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'تعديل العضو' : 'إضافة عضو جديد'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">الاسم (عربي)</label>
                                        <input className="form-input" value={formData.nameAr}
                                            onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                            required placeholder="الاسم بالعربي" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">الاسم (إنجليزي)</label>
                                        <input className="form-input" value={formData.nameEn}
                                            onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                            placeholder="Name in English" dir="ltr" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">المنصب (عربي)</label>
                                        <select 
                                            className="form-input" 
                                            value={formData.positionAr}
                                            onChange={e => setFormData({ ...formData, positionAr: e.target.value })}
                                            required
                                        >
                                            <option value="">اختر المنصب</option>
                                            <option value="رئيس مجلس الإدارة">رئيس مجلس الإدارة</option>
                                            <option value="الرئيس التنفيذي">الرئيس التنفيذي</option>
                                            <option value="عضو مجلس الإدارة">عضو مجلس الإدارة</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">المنصب (إنجليزي)</label>
                                        <select 
                                            className="form-input" 
                                            value={formData.positionEn}
                                            onChange={e => setFormData({ ...formData, positionEn: e.target.value })}
                                            dir="ltr"
                                        >
                                            <option value="">Select Position</option>
                                            <option value="Chairman">Chairman</option>
                                            <option value="CEO">CEO</option>
                                            <option value="Board Member">Board Member</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رابط الصورة</label>
                                    <input className="form-input" value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..." dir="ltr" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">نبذة</label>
                                    <textarea className="form-input" rows={3} value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="نبذة عن العضو..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">الترتيب</label>
                                    <input className="form-input" type="number" value={formData.sortOrder}
                                        onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">{editing ? 'حفظ التغييرات' : 'إضافة'}</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon"><HiOutlineTrash /></div>
                            <div className="confirm-title">هل أنت متأكد؟</div>
                            <div className="confirm-message">سيتم حذف العضو "{confirmDelete.nameAr}" نهائياً</div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button className="btn btn-danger" onClick={handleDelete}>نعم، احذف</button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>إلغاء</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
