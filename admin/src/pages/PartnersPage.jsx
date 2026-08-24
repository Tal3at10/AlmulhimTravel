import { useState, useEffect } from 'react';
import { cmsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineGlobeAlt,
    HiOutlineX,
} from 'react-icons/hi';

export default function PartnersPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        website: '',
        sortOrder: 0,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await cmsAPI.getPartners();
            setItems(res.data || []);
        } catch { toast.error('فشل في تحميل الشركاء'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ name: '', logoUrl: '', website: '', sortOrder: items.length });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({
            name: item.name || '',
            logoUrl: item.logoUrl || '',
            website: item.website || '',
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
                await cmsAPI.updatePartner(editing.id, payload);
                toast.success('تم تحديث الشريك بنجاح');
            } else {
                await cmsAPI.createPartner(payload);
                toast.success('تم إضافة الشريك بنجاح');
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
            await cmsAPI.deletePartner(confirmDelete.id);
            toast.success('تم حذف الشريك');
            setConfirmDelete(null);
            loadData();
        } catch { toast.error('فشل في الحذف'); }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header"><div className="page-header-info"><h1>الشركاء</h1></div></div>
                <div className="content-grid-3">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 180 }} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>الشركاء</h1>
                    <p>إدارة الشركاء والمؤسسات</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus /> إضافة شريك
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <HiOutlineGlobeAlt className="empty-state-icon" />
                        <h3>لا يوجد شركاء</h3>
                        <p>ابدأ بإضافة شريك جديد</p>
                        <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
                            <HiOutlinePlus /> إضافة شريك
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-grid-3">
                    {items.map((item) => (
                        <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{
                                height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.03)', padding: 20,
                            }}>
                                {item.logoUrl ? (
                                    <img src={item.logoUrl} alt={item.name}
                                        style={{ maxWidth: '80%', maxHeight: 80, objectFit: 'contain' }} />
                                ) : (
                                    <HiOutlineGlobeAlt style={{ width: 48, height: 48, color: 'var(--text-muted)' }} />
                                )}
                            </div>
                            <div style={{ padding: 16 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.name}</h3>
                                {item.website && (
                                    <a href={item.website} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'none' }}>
                                        {item.website}
                                    </a>
                                )}
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
                            <h2>{editing ? 'تعديل الشريك' : 'إضافة شريك جديد'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">اسم الشريك</label>
                                    <input className="form-input" value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required placeholder="اسم الشركة" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رابط الشعار</label>
                                    <input className="form-input" value={formData.logoUrl}
                                        onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                                        required placeholder="https://..." dir="ltr" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">الموقع الإلكتروني</label>
                                        <input className="form-input" value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="https://..." dir="ltr" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">الترتيب</label>
                                        <input className="form-input" type="number" value={formData.sortOrder}
                                            onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
                                    </div>
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
                            <div className="confirm-message">سيتم حذف الشريك "{confirmDelete.name}" نهائياً</div>
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
