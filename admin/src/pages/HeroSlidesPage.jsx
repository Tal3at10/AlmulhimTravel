import { useState, useEffect } from 'react';
import { cmsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePhotograph,
    HiOutlineX,
} from 'react-icons/hi';

export default function HeroSlidesPage() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        titleAr: '',
        titleEn: '',
        subtitleAr: '',
        subtitleEn: '',
        imageUrl: '',
        videoUrl: '',
        buttonText: '',
        buttonLink: '',
        sortOrder: 0,
    });

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        try {
            const res = await cmsAPI.getHeroSlides();
            setSlides(res.data || []);
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]
                || err.response?.data?.message
                || err.message
                || 'فشل في تحميل السلايدات';
            console.error('Hero slides error:', err.response?.data || err);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingSlide(null);
        setFormData({
            titleAr: '', titleEn: '', subtitleAr: '', subtitleEn: '',
            imageUrl: '', videoUrl: '', buttonText: '', buttonLink: '',
            sortOrder: slides.length, isActive: true
        });
        setShowModal(true);
    };

    const openEdit = (slide) => {
        setEditingSlide(slide);
        setFormData({
            titleAr: slide.titleAr || '',
            titleEn: slide.titleEn || '',
            subtitleAr: slide.subtitleAr || '',
            subtitleEn: slide.subtitleEn || '',
            imageUrl: slide.imageUrl || '',
            videoUrl: slide.videoUrl || '',
            buttonText: slide.buttonText || '',
            buttonLink: slide.buttonLink || '',
            sortOrder: slide.sortOrder || 0,
            isActive: slide.isActive !== undefined ? slide.isActive : true
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
            if (editingSlide) {
                await cmsAPI.updateHeroSlide(editingSlide.id, payload);
                toast.success('تم تحديث السلايد بنجاح');
            } else {
                await cmsAPI.createHeroSlide(payload);
                toast.success('تم إضافة السلايد بنجاح');
            }
            setShowModal(false);
            loadSlides();
        } catch (err) {
            toast.error(err.response?.data?.message || 'حدث خطأ');
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await cmsAPI.deleteHeroSlide(confirmDelete.id);
            toast.success('تم حذف السلايد');
            setConfirmDelete(null);
            loadSlides();
        } catch (err) {
            toast.error('فشل في الحذف');
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info">
                        <h1>السلايدر الرئيسي</h1>
                    </div>
                </div>
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
                    <h1>السلايدر الرئيسي</h1>
                    <p>إدارة الصور والعناوين في الشريط الرئيسي للموقع</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus />
                        إضافة سلايد
                    </button>
                </div>
            </div>

            {slides.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <HiOutlinePhotograph className="empty-state-icon" />
                        <h3>لا توجد سلايدات</h3>
                        <p>ابدأ بإضافة سلايد جديد للشريط الرئيسي</p>
                        <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
                            <HiOutlinePlus /> إضافة سلايد
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-grid-3">
                    {slides.map((slide) => (
                        <div key={slide.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Image Preview */}
                            <div style={{
                                height: 160,
                                background: slide.imageUrl
                                    ? `url(${slide.imageUrl}) center/cover no-repeat`
                                    : 'linear-gradient(135deg, var(--navy), var(--navy-light))',
                                position: 'relative',
                            }}>
                                {!slide.isActive && (
                                    <span className="badge badge-warning" style={{ position: 'absolute', top: 10, right: 10 }}>
                                        غير نشط
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: 16 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                                    {slide.titleAr || 'بدون عنوان'}
                                </h3>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                                    {slide.subtitleAr || 'بدون وصف'}
                                </p>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(slide)}>
                                        <HiOutlinePencil /> تعديل
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(slide)}>
                                        <HiOutlineTrash /> حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingSlide ? 'تعديل السلايد' : 'إضافة سلايد جديد'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <HiOutlineX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">رابط الصورة *</label>
                                    <input
                                        className="form-input"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        dir="ltr"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">الترتيب</label>
                                        <input
                                            className="form-input"
                                            type="number"
                                            value={formData.sortOrder}
                                            onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <details style={{ marginTop: 24 }}>
                                    <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 'bold', color: '#000', backgroundColor: 'var(--gold)', padding: '12px 16px', borderRadius: '8px', marginBottom: 16, display: 'inline-block' }}>
                                        + إظهار حقول اختيارية (عنوان، وصف، زر، فيديو)
                                    </summary>
                                    <div style={{ marginTop: 12 }}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">العنوان (عربي)</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.titleAr}
                                                    onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                                                    placeholder="عنوان السلايد بالعربي"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">العنوان (إنجليزي)</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.titleEn}
                                                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                                    placeholder="Slide title in English"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">الوصف (عربي)</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.subtitleAr}
                                                    onChange={e => setFormData({ ...formData, subtitleAr: e.target.value })}
                                                    placeholder="وصف مختصر"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">الوصف (إنجليزي)</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.subtitleEn}
                                                    onChange={e => setFormData({ ...formData, subtitleEn: e.target.value })}
                                                    placeholder="Short description"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">نص الزر</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.buttonText}
                                                    onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                                                    placeholder="اكتشف المزيد"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">رابط الزر</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.buttonLink}
                                                    onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                                                    placeholder="/packages"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">رابط الفيديو</label>
                                            <input
                                                className="form-input"
                                                value={formData.videoUrl}
                                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                                placeholder="https://youtube.com/..."
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                </details>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    {editingSlide ? 'حفظ التغييرات' : 'إضافة'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    إلغاء
                                </button>
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
                            <div className="confirm-icon">
                                <HiOutlineTrash />
                            </div>
                            <div className="confirm-title">هل أنت متأكد؟</div>
                            <div className="confirm-message">
                                سيتم حذف السلايد "{confirmDelete.titleAr}" نهائياً
                            </div>
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
