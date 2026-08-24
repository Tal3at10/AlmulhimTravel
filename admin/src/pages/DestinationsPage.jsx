import { useState, useEffect } from 'react';
import { destinationsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineGlobeAlt,
    HiOutlineX,
} from 'react-icons/hi';

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        nameAr: '', nameEn: '', slug: '', country: '',
        imageUrl: '', description: '', sortOrder: 0,
        isFeatured: false, featuredOrder: 0,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await destinationsAPI.getAll();
            setDestinations(res.data || []);
        } catch { toast.error('فشل في تحميل الوجهات'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ nameAr: '', nameEn: '', slug: '', country: '', imageUrl: '', description: '', sortOrder: 0, isFeatured: false, featuredOrder: 0, isActive: true });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({
            nameAr: item.nameAr || '', nameEn: item.nameEn || '',
            slug: item.slug || '', country: item.country || '',
            imageUrl: item.imageUrl || '', description: item.description || '',
            sortOrder: item.sortOrder || 0,
            isFeatured: item.isFeatured || false,
            featuredOrder: item.featuredOrder || 0,
            isActive: item.isActive !== undefined ? item.isActive : true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting destination data:', formData);
            if (editing) {
                await destinationsAPI.update(editing.id, formData);
                toast.success('تم تحديث الوجهة بنجاح');
            } else {
                await destinationsAPI.create(formData);
                toast.success('تم إضافة الوجهة بنجاح');
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            console.error('Destination error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            
            // Extract error message
            let errorMsg = 'حدث خطأ';
            if (err.response?.data) {
                const data = err.response.data;
                if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                    errorMsg = data.errors.join(', ');
                } else if (data.message) {
                    errorMsg = data.message;
                } else if (typeof data === 'string') {
                    errorMsg = data;
                }
            }
            toast.error(errorMsg);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await destinationsAPI.delete(confirmDelete.id);
            toast.success('تم حذف الوجهة');
            setConfirmDelete(null);
            loadData();
        } catch { toast.error('فشل في الحذف'); }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header"><div className="page-header-info"><h1>الوجهات</h1></div></div>
                <div className="card"><div className="skeleton" style={{ height: 300 }} /></div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>الوجهات</h1>
                    <p>إدارة وجهات السفر ({destinations.length} وجهة)</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus /> إضافة وجهة
                    </button>
                </div>
            </div>

            {destinations.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <HiOutlineGlobeAlt className="empty-state-icon" />
                        <h3>لا توجد وجهات</h3>
                        <p>ابدأ بإضافة وجهة سفر جديدة</p>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>الصورة</th>
                                    <th>الاسم</th>
                                    <th>الاسم (EN)</th>
                                    <th>الدولة</th>
                                    <th>الرابط</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {destinations.map((dest) => (
                                    <tr key={dest.id}>
                                        <td>
                                            <div style={{
                                                width: 48, height: 36, borderRadius: 6,
                                                background: dest.imageUrl
                                                    ? `url(${dest.imageUrl}) center/cover`
                                                    : 'var(--bg-input)',
                                            }} />
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {dest.nameAr}
                                            {dest.isFeatured && <span style={{ marginLeft: 8, color: 'var(--gold)' }}>⭐</span>}
                                        </td>
                                        <td style={{ direction: 'ltr', textAlign: 'right' }}>{dest.nameEn}</td>
                                        <td>{dest.country}</td>
                                        <td style={{ fontFamily: 'monospace', direction: 'ltr', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>
                                            /{dest.slug}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(dest)}>
                                                    <HiOutlinePencil />
                                                </button>
                                                <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDelete(dest)}>
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'تعديل الوجهة' : 'إضافة وجهة جديدة'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label className="form-label">الاسم (عربي) *</label>
                                        <input className="form-input" value={formData.nameAr}
                                            onChange={e => setFormData({ ...formData, nameAr: e.target.value })} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">الدولة</label>
                                        <input className="form-input" value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رابط الصورة</label>
                                    <input className="form-input" value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} dir="ltr" />
                                </div>
                                <div className="form-row" style={{ alignItems: 'center', marginTop: 16 }}>
                                    <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                                        <input type="checkbox" id="isFeatured" checked={formData.isFeatured}
                                            onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} 
                                            style={{ width: 18, height: 18, accentColor: 'var(--gold)' }} />
                                        <label htmlFor="isFeatured" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 'bold' }}>عرض كوجهة مميزة في الرئيسية</label>
                                    </div>
                                    {formData.isFeatured && (
                                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                            <label className="form-label" style={{ fontSize: 12 }}>ترتيب العرض (1, 2, 3...)</label>
                                            <input type="number" className="form-input" value={formData.featuredOrder}
                                                onChange={e => setFormData({ ...formData, featuredOrder: parseInt(e.target.value) || 0 })} />
                                        </div>
                                    )}
                                </div>
                                
                                <details style={{ marginTop: 24 }}>
                                    <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 'bold', color: '#000', backgroundColor: 'var(--gold)', padding: '12px 16px', borderRadius: '8px', marginBottom: 16, display: 'inline-block' }}>
                                        + إظهار حقول إضافية (الاسم الانجليزي، الرابط slug، الوصف)
                                    </summary>
                                    <div style={{ marginTop: 12 }}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">الاسم (إنجليزي)</label>
                                                <input className="form-input" value={formData.nameEn}
                                                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })} dir="ltr" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">الرابط (slug)</label>
                                                <input className="form-input" value={formData.slug}
                                                    onChange={e => setFormData({ ...formData, slug: e.target.value })} dir="ltr" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">الوصف</label>
                                            <textarea className="form-input form-textarea" value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                    </div>
                                </details>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    {editing ? 'حفظ التغييرات' : 'إضافة'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {confirmDelete && (
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon"><HiOutlineTrash /></div>
                            <div className="confirm-title">هل أنت متأكد؟</div>
                            <div className="confirm-message">سيتم حذف الوجهة "{confirmDelete.nameAr}" نهائياً</div>
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
