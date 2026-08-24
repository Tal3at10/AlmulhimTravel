import { useState, useEffect } from 'react';
import { cmsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineStar,
    HiOutlineX,
} from 'react-icons/hi';

export default function TestimonialsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerTitle: '',
        customerImage: '',
        content: '',
        rating: 5,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await cmsAPI.getTestimonials();
            setItems(res.data || []);
        } catch { toast.error('فشل في تحميل آراء العملاء'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ customerName: '', customerTitle: '', customerImage: '', content: '', rating: 5 });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({
            customerName: item.customerName || '',
            customerTitle: item.customerTitle || '',
            customerImage: item.customerImage || '',
            content: item.content || '',
            rating: item.rating || 5,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                rating: parseInt(formData.rating) || 5,
            };
            if (editing) {
                await cmsAPI.updateTestimonial(editing.id, payload);
                toast.success('تم تحديث الرأي بنجاح');
            } else {
                await cmsAPI.createTestimonial(payload);
                toast.success('تم إضافة الرأي بنجاح');
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
            await cmsAPI.deleteTestimonial(confirmDelete.id);
            toast.success('تم حذف الرأي');
            setConfirmDelete(null);
            loadData();
        } catch { toast.error('فشل في الحذف'); }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <HiOutlineStar
                key={i}
                style={{
                    width: 14, height: 14,
                    fill: i < rating ? 'var(--gold)' : 'transparent',
                    color: i < rating ? 'var(--gold)' : 'var(--text-muted)',
                }}
            />
        ));
    };

    if (loading) {
        return (
            <div>
                <div className="page-header"><div className="page-header-info"><h1>آراء العملاء</h1></div></div>
                <div className="content-grid-3">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>آراء العملاء</h1>
                    <p>إدارة تقييمات وآراء العملاء</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus /> إضافة رأي
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <HiOutlineStar className="empty-state-icon" />
                        <h3>لا توجد آراء عملاء</h3>
                        <p>ابدأ بإضافة رأي عميل جديد</p>
                        <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
                            <HiOutlinePlus /> إضافة رأي
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-grid-3">
                    {items.map((item) => (
                        <div key={item.id} className="card" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '50%',
                                    background: item.customerImage
                                        ? `url(${item.customerImage}) center/cover`
                                        : 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                                    flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: 18, fontWeight: 700,
                                }}>
                                    {!item.customerImage && item.customerName?.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.customerName}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.customerTitle}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>{renderStars(item.rating)}</div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, minHeight: 60 }}>
                                "{item.content}"
                            </p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                                    <HiOutlinePencil /> تعديل
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(item)}>
                                    <HiOutlineTrash /> حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'تعديل رأي العميل' : 'إضافة رأي جديد'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label className="form-label">اسم العميل *</label>
                                        <input className="form-input" value={formData.customerName}
                                            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                            required placeholder="أحمد محمد" />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">التقييم</label>
                                        <select className="form-input" value={formData.rating}
                                            onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} نجوم</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رأي العميل *</label>
                                    <textarea className="form-input" rows={4} value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        required placeholder="اكتب رأيك هنا..." />
                                </div>

                                <details style={{ marginTop: 24 }}>
                                    <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 'bold', color: '#000', backgroundColor: 'var(--gold)', padding: '12px 16px', borderRadius: '8px', marginBottom: 16, display: 'inline-block' }}>
                                        + إظهار حقول إضافية (المسمى الوظيفي، صورة العميل)
                                    </summary>
                                    <div style={{ marginTop: 12 }}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">المسمى الوظيفي</label>
                                                <input className="form-input" value={formData.customerTitle}
                                                    onChange={e => setFormData({ ...formData, customerTitle: e.target.value })}
                                                    placeholder="مثال: رجل أعمال" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">رابط الصورة</label>
                                                <input className="form-input" value={formData.customerImage}
                                                    onChange={e => setFormData({ ...formData, customerImage: e.target.value })}
                                                    placeholder="https://..." dir="ltr" />
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">{editing ? 'حفظ التغييرات' : 'إضافة'}</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {confirmDelete && (
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon"><HiOutlineTrash /></div>
                            <div className="confirm-title">هل أنت متأكد؟</div>
                            <div className="confirm-message">سيتم حذف رأي "{confirmDelete.customerName}" نهائياً</div>
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
