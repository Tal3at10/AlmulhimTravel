import { useState, useEffect } from 'react';
import { cmsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineDocumentText,
    HiOutlineX,
} from 'react-icons/hi';

export default function BlogPostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        coverImageUrl: '',
        shortDescription: '',
        content: '',
        tags: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: true,
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const res = await cmsAPI.getBlogPosts();
            setPosts(res.data || []);
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]
                || err.response?.data?.message
                || err.message
                || 'فشل في تحميل المقالات';
            console.error('Blog posts error:', err.response?.data || err);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            slug: '',
            coverImageUrl: '',
            shortDescription: '',
            content: '',
            tags: '',
            metaTitle: '',
            metaDescription: '',
            isPublished: true,
        });
        setShowModal(true);
    };

    const openEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title || '',
            slug: post.slug || '',
            coverImageUrl: post.coverImageUrl || '',
            shortDescription: post.shortDescription || '',
            content: post.content || '',
            tags: post.tags || '',
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
            isPublished: post.isPublished !== undefined ? post.isPublished : true,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPost) {
                await cmsAPI.updateBlogPost(editingPost.id, formData);
                toast.success('تم تحديث المقال بنجاح');
            } else {
                await cmsAPI.createBlogPost(formData);
                toast.success('تم إضافة المقال بنجاح');
            }
            setShowModal(false);
            loadPosts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'حدث خطأ. تأكد من أن الرابط المقروء (Slug) غير مكرر.');
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await cmsAPI.deleteBlogPost(confirmDelete.id);
            toast.success('تم حذف المقال');
            setConfirmDelete(null);
            loadPosts();
        } catch (err) {
            toast.error('فشل في الحذف');
        }
    };

    // Auto-generate slug from title (optional helper)
    const generateSlug = (title) => {
        if (!title) return '';
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF-]/g, '-') // Replace spaces and special chars with hyphens
            .replace(/-+/g, '-') // Remove multiple hyphens
            .replace(/^-|-$/g, ''); // Trim hyphens
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setFormData(prev => ({
            ...prev,
            title: newTitle,
            // Only auto-update slug if creating a new post
            slug: !editingPost ? generateSlug(newTitle) : prev.slug
        }));
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info">
                        <h1>المدونة والمقالات</h1>
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
                    <h1>المدونة والمقالات (Blog)</h1>
                    <p>إدارة مقالات السفر، النصائح السياحية، وأخبار الشركة</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus />
                        إضافة مقال
                    </button>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <HiOutlineDocumentText className="empty-state-icon" />
                        <h3>لا توجد مقالات</h3>
                        <p>ابدأ بكتابة أول مقال في المدونة</p>
                        <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
                            <HiOutlinePlus /> إضافة مقال
                        </button>
                    </div>
                </div>
            ) : (
                <div className="table-container card" style={{ padding: 0 }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>المقال</th>
                                <th>الرابط (Slug)</th>
                                <th>تاريخ النشر</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '8px',
                                                background: post.coverImageUrl ? `url(${post.coverImageUrl}) center/cover` : 'var(--navy-light)',
                                                flexShrink: 0
                                            }} />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{post.title}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{post.shortDescription?.substring(0, 50)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td dir="ltr" style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        /{post.slug}
                                    </td>
                                    <td>
                                        {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td>
                                        <span className={`badge ${post.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                            {post.isPublished ? 'منشور' : 'مسودة'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(post)}>
                                                <HiOutlinePencil />
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(post)}>
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ zIndex: 1000 }}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
                        <div className="modal-header">
                            <h2>{editingPost ? 'تعديل المقال' : 'مقال جديد'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <HiOutlineX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label className="form-label">عنوان المقال *</label>
                                        <input
                                            className="form-input"
                                            value={formData.title}
                                            onChange={handleTitleChange}
                                            placeholder="مثال: أفضل 10 أماكن لزيارة ماليزيا في 2025"
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '30px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.isPublished}
                                                onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontWeight: 600 }}>نشر المقال (مرئي للمستخدمين)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">محتوى المقال (المقال بالكامل) *</label>
                                    <textarea
                                        className="form-input"
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="<h2>مقدمة</h2><p>اكتب محتوى المقال هنا...</p>"
                                        rows={10}
                                        dir="ltr"
                                        style={{ fontFamily: 'monospace' }}
                                        required
                                    />
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                                        يدعم وسوم HTML لتنسيق النص (العناوين، القوائم، الروابط).
                                    </small>
                                </div>

                                <details style={{ marginTop: 16 }}>
                                    <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                                        حقول إضافية وتفعيل الـ SEO 🔍 (الصورة، الوصف، الرابط)
                                    </summary>
                                    <div style={{ marginTop: 12, padding: 16, background: 'var(--bg-input)', borderRadius: 8 }}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">الرابط المقروء المتصل (Slug) *</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.slug}
                                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                    placeholder="best-places"
                                                    dir="ltr"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">رابط صورة الغلاف</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.coverImageUrl}
                                                    onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                                    placeholder="https://..."
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">وصف قصير</label>
                                            <textarea
                                                className="form-input"
                                                value={formData.shortDescription}
                                                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                                                placeholder="نبذة مختصرة..."
                                                rows={2}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">عنوان الـ SEO</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.metaTitle}
                                                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                                    placeholder="العنوان الذي يظهر في جوجل"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">الكلمات المفتاحية (Tags)</label>
                                                <input
                                                    className="form-input"
                                                    value={formData.tags}
                                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                                    placeholder="سفر, ماليزيا (مفصولة بفاصلة)"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">وصف الـ SEO (Meta Description)</label>
                                            <textarea
                                                className="form-input"
                                                value={formData.metaDescription}
                                                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                placeholder="وصف مختصر لمحرك البحث"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </details>

                            </div>
                            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)' }}>
                                <button type="submit" className="btn btn-primary">
                                    {editingPost ? 'حفظ التغييرات' : 'نشر المقال'}
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
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmDelete(null)} style={{ zIndex: 1100 }}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon">
                                <HiOutlineTrash />
                            </div>
                            <div className="confirm-title">حذف المقال؟</div>
                            <div className="confirm-message">
                                سيتم حذف مقال "{confirmDelete.title}" نهائياً من قاعدة البيانات.
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
