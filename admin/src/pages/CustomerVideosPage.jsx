import { useState, useEffect } from 'react';
import { cmsAPI, destinationsAPI } from '../api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineVideoCamera, HiOutlineX } from 'react-icons/hi';

export default function CustomerVideosPage() {
    const [items, setItems] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        destinationId: '', thumbnailUrl: '', videoUrl: '',
        customerName: '', location: '', date: '', sortOrder: 0,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [vRes, dRes] = await Promise.all([cmsAPI.getCustomerVideos(), destinationsAPI.getAll()]);
            setItems(vRes.data || []);
            setDestinations(dRes.data || []);
        } catch { toast.error('فشل في تحميل الفيديوهات'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        const defaultDestinationId = destinations.length > 0 ? destinations[0].id : '';
        setFormData({ 
            destinationId: defaultDestinationId, 
            thumbnailUrl: '', 
            videoUrl: '', 
            customerName: '', 
            location: '', 
            date: '', 
            sortOrder: items.length 
        });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({ destinationId: item.destinationId || '', thumbnailUrl: item.thumbnailUrl || '', videoUrl: item.videoUrl || '', customerName: item.customerName || '', location: item.location || '', date: item.date || '', sortOrder: item.sortOrder || 0 });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.destinationId) {
            toast.error('يرجى اختيار الوجهة');
            return;
        }
        if (!formData.videoUrl) {
            toast.error('يرجى إدخال رابط الفيديو');
            return;
        }
        if (!formData.customerName) {
            toast.error('يرجى إدخال اسم العميل');
            return;
        }
        
        // Frontend shows videos using <video src="...">, so YouTube links won't play.
        const videoUrlLower = (formData.videoUrl || '').trim().toLowerCase();
        if (videoUrlLower.includes('youtube.com') || videoUrlLower.includes('youtu.be')) {
            toast.error('Please use a direct MP4 URL (not a YouTube link).');
            return;
        }

        try {
            const payload = {
                destinationId: formData.destinationId,
                videoUrl: formData.videoUrl.trim(),
                thumbnailUrl: formData.thumbnailUrl?.trim() || null,
                customerName: formData.customerName.trim(),
                location: formData.location?.trim() || null,
                date: formData.date?.trim() || null,
                sortOrder: parseInt(formData.sortOrder) || 0,
            };
            
            console.log('Sending payload:', payload);
            
            if (editing) { 
                await cmsAPI.updateCustomerVideo(editing.id, payload); 
                toast.success('تم تحديث الفيديو'); 
            } else { 
                await cmsAPI.createCustomerVideo(payload); 
                toast.success('تم إضافة الفيديو'); 
            }
            
            setShowModal(false); 
            loadData();
        } catch (err) { 
            console.error('Error:', err);
            console.error('Error response:', err.response?.data);
            
            // Show detailed error message
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                if (Array.isArray(errors)) {
                    errors.forEach(error => toast.error(error.message || error));
                } else {
                    toast.error(JSON.stringify(errors));
                }
            } else {
                toast.error(err.response?.data?.message || 'حدث خطأ في الإضافة');
            }
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try { await cmsAPI.deleteCustomerVideo(confirmDelete.id); toast.success('تم حذف الفيديو'); setConfirmDelete(null); loadData(); }
        catch { toast.error('فشل في الحذف'); }
    };

    if (loading) return (<div><div className="page-header"><div className="page-header-info"><h1>فيديوهات العملاء</h1></div></div><div className="content-grid-3">{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}</div></div>);

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info"><h1>فيديوهات العملاء</h1><p>إدارة فيديوهات تجارب العملاء</p></div>
                <div className="page-header-actions"><button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> إضافة فيديو</button></div>
            </div>
            {items.length === 0 ? (
                <div className="card"><div className="empty-state"><HiOutlineVideoCamera className="empty-state-icon" /><h3>لا توجد فيديوهات</h3><p>ابدأ بإضافة فيديو تجربة عميل</p><button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}><HiOutlinePlus /> إضافة فيديو</button></div></div>
            ) : (
                <div className="content-grid-3">
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ height: 140, background: item.thumbnailUrl ? `url(${item.thumbnailUrl}) center/cover` : 'linear-gradient(135deg,var(--navy),var(--navy-light))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiOutlineVideoCamera style={{ width: 24, height: 24, color: '#fff' }} /></div>
                            </div>
                            <div style={{ padding: 16 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.customerName}</h3>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{item.location}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>{item.date}</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}><HiOutlinePencil /> تعديل</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(item)}><HiOutlineTrash /> حذف</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>{editing ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</h2><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">اسم العميل *</label><input className="form-input" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} required placeholder="اسم العميل" /></div>
                                    <div className="form-group"><label className="form-label">الوجهة *</label><select className="form-input form-select" value={formData.destinationId} onChange={e => setFormData({ ...formData, destinationId: e.target.value })} required><option value="">اختر الوجهة</option>{destinations.map(d => <option key={d.id} value={d.id}>{d.nameAr}</option>)}</select></div>
                                </div>
                                <div className="form-group"><label className="form-label">رابط الفيديو (MP4) *</label><input className="form-input" value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} required placeholder="https://..." dir="ltr" /></div>
                                <div className="form-group"><label className="form-label">رابط الصورة المصغرة (Thumbnail) *</label><input className="form-input" value={formData.thumbnailUrl} onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })} required placeholder="https://..." dir="ltr" /></div>
                                
                                <details style={{ marginTop: 24 }}>
                                    <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 'bold', color: '#000', backgroundColor: 'var(--gold)', padding: '12px 16px', borderRadius: '8px', marginBottom: 16, display: 'inline-block' }}>
                                        + إظهار حقول إضافية (الموقع، التاريخ، الترتيب)
                                    </summary>
                                    <div style={{ marginTop: 12 }}>
                                        <div className="form-row">
                                            <div className="form-group"><label className="form-label">الموقع</label><input className="form-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="الرياض" /></div>
                                            <div className="form-group"><label className="form-label">التاريخ</label><input className="form-input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="يناير 2024" /></div>
                                        </div>
                                        <div className="form-group"><label className="form-label">الترتيب</label><input className="form-input" type="number" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} /></div>
                                    </div>
                                </details>
                            </div>
                            <div className="modal-footer"><button type="submit" className="btn btn-primary">{editing ? 'حفظ' : 'إضافة'}</button><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button></div>
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
                            <div className="confirm-message">سيتم حذف فيديو "{confirmDelete.customerName}" نهائياً</div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}><button className="btn btn-danger" onClick={handleDelete}>نعم، احذف</button><button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>إلغاء</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
