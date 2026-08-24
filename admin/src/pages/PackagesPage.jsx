import { useState, useEffect } from 'react';
import { packagesAPI, destinationsAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineBriefcase,
    HiOutlineX,
    HiOutlineClipboardList,
    HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import PackageHotelsModal from '../components/PackageHotelsModal';

export default function PackagesPage() {
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    // Itinerary states
    const [showItineraryModal, setShowItineraryModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [itineraryItems, setItineraryItems] = useState([]);
    const [itineraryLoading, setItineraryLoading] = useState(false);
    const [editingItineraryItem, setEditingItineraryItem] = useState(null);
    const [itineraryFormData, setItineraryFormData] = useState({
        day: 1, title: '', description: '', imageUrl: '', latitude: '', longitude: ''
    });
    // Hotels states
    const [showHotelsModal, setShowHotelsModal] = useState(false);
    const [allHotels, setAllHotels] = useState([]);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        packageId: '', destinationId: '', titleAr: '', titleEn: '', subtitle: '',
        price: 0, currency: 'ر.س', duration: '', durationDays: 0, durationNights: 0,
        imageUrl: '', videoUrl: '', vibe: '', rating: 5, isOffer: false,
        isFeatured: false, featuredOrder: 0,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [pkgRes, destRes] = await Promise.all([
                packagesAPI.getAll({ pageSize: 100 }),
                destinationsAPI.getAll(),
            ]);
            setPackages(pkgRes.data?.items || pkgRes.data || []);
            setDestinations(destRes.data || []);

            // Load all hotels for the dropdown
            try {
                const hotelsRes = await fetch('/api/hotels');
                if (!hotelsRes.ok) {
                    throw new Error('Failed to fetch hotels');
                }
                const hotelsData = await hotelsRes.json();
                console.log('Hotels API response:', hotelsData);
                // API returns PaginatedResult with Items array
                const hotelsList = hotelsData?.items || [];
                console.log('Hotels list:', hotelsList);
                setAllHotels(hotelsList);
            } catch (err) {
                console.error('Failed to load hotels:', err);
                setAllHotels([]);
                toast.error('فشل في تحميل قائمة الفنادق');
            }
        } catch { toast.error('فشل في تحميل الباقات'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({
            packageId: '', destinationId: '', titleAr: '', titleEn: '', subtitle: '',
            price: 0, currency: 'ر.س', duration: '', durationDays: 0, durationNights: 0,
            imageUrl: '', videoUrl: '', vibe: '', rating: 5, isOffer: false,
            isFeatured: false, featuredOrder: 0, isActive: true
        });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({
            packageId: item.packageId || '', destinationId: item.destinationId || '',
            titleAr: item.titleAr || '', titleEn: item.titleEn || '', subtitle: item.subtitle || '',
            price: item.price || 0, currency: item.currency || 'ر.س',
            duration: item.duration || '', durationDays: item.durationDays || 0,
            durationNights: item.durationNights || 0, imageUrl: item.imageUrl || '',
            videoUrl: item.videoUrl || '', vibe: item.vibe || '',
            rating: item.rating || 5, isOffer: item.isOffer || false,
            isFeatured: item.isFeatured || false,
            featuredOrder: item.featuredOrder || 0,
            isActive: item.isActive !== undefined ? item.isActive : true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.destinationId) {
            toast.error('يرجى اختيار الوجهة');
            return;
        }
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                durationDays: parseInt(formData.durationDays) || 0,
                durationNights: parseInt(formData.durationNights) || 0,
                rating: parseFloat(formData.rating) || 5,
            };
            if (editing) {
                await packagesAPI.update(editing.id, payload);
                toast.success('تم تحديث الباقة بنجاح');
            } else {
                await packagesAPI.create(payload);
                toast.success('تم إضافة الباقة بنجاح');
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
            await packagesAPI.delete(confirmDelete.id);
            toast.success('تم حذف الباقة');
            setConfirmDelete(null);
            loadData();
        } catch { toast.error('فشل في الحذف'); }
    };

    // Itinerary handlers
    const openItinerary = async (pkg) => {
        setSelectedPackage(pkg);
        setShowItineraryModal(true);
        setItineraryLoading(true);
        try {
            const res = await packagesAPI.getItinerary(pkg.id);
            setItineraryItems(res.data || []);
        } catch {
            toast.error('فشل في تحميل البرنامج');
        } finally {
            setItineraryLoading(false);
        }
    };

    const handleItinerarySubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                day: parseInt(itineraryFormData.day) || 1,
                title: itineraryFormData.title?.trim() || '',
                description: itineraryFormData.description?.trim() || '',
                imageUrl: itineraryFormData.imageUrl?.trim() || '',
                latitude: itineraryFormData.latitude ? parseFloat(itineraryFormData.latitude) : null,
                longitude: itineraryFormData.longitude ? parseFloat(itineraryFormData.longitude) : null,
            };

            console.log('Sending itinerary data:', data);

            if (editingItineraryItem) {
                // Include id only when updating
                data.id = editingItineraryItem.id;
                await packagesAPI.updateItineraryItem(editingItineraryItem.id, data);
                toast.success('تم تحديث اليوم بنجاح');
            } else {
                // Don't include id when creating
                await packagesAPI.addItineraryItem(selectedPackage.id, data);
                toast.success('تم إضافة اليوم بنجاح');
            }
            setEditingItineraryItem(null);
            setItineraryFormData({ day: 1, title: '', description: '', imageUrl: '', latitude: '', longitude: '' });
            // Reload
            const res = await packagesAPI.getItinerary(selectedPackage.id);
            setItineraryItems(res.data || []);
        } catch (err) {
            console.error('Itinerary error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                fullError: err
            });

            // Extract error message from different possible formats
            let errorMsg = 'حدث خطأ';
            if (err.response?.data) {
                const data = err.response.data;
                if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                    errorMsg = data.errors.join(', ');
                } else if (data.message) {
                    errorMsg = data.message;
                } else if (data.title) {
                    errorMsg = data.title;
                } else if (typeof data === 'string') {
                    errorMsg = data;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            toast.error(errorMsg);
        }
    };

    const editItineraryItem = (item) => {
        setEditingItineraryItem(item);
        setItineraryFormData({
            day: item.day,
            title: item.title || '',
            description: item.description || '',
            imageUrl: item.imageUrl || '',
            latitude: item.latitude || '',
            longitude: item.longitude || '',
        });
    };

    const deleteItineraryItem = async (itemId) => {
        if (!confirm('هل أنت متأكد من حذف هذا اليوم؟')) return;
        try {
            await packagesAPI.deleteItineraryItem(itemId);
            toast.success('تم حذف اليوم');
            const res = await packagesAPI.getItinerary(selectedPackage.id);
            setItineraryItems(res.data || []);
        } catch {
            toast.error('فشل في الحذف');
        }
    };

    const closeItineraryModal = () => {
        setShowItineraryModal(false);
        setSelectedPackage(null);
        setItineraryItems([]);
        setEditingItineraryItem(null);
        setItineraryFormData({ day: 1, title: '', description: '', imageUrl: '', latitude: '', longitude: '' });
    };

    // Hotels handlers
    const openHotels = (pkg) => {
        setSelectedPackage(pkg);
        setShowHotelsModal(true);
    };

    const closeHotelsModal = () => {
        setShowHotelsModal(false);
        setSelectedPackage(null);
    };

    if (loading) {
        return (
            <div>
                <div className="page-header"><div className="page-header-info"><h1>الباقات</h1></div></div>
                <div className="card"><div className="skeleton" style={{ height: 300 }} /></div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>الباقات</h1>
                    <p>إدارة باقات السفر والسياحة ({packages.length} باقة)</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus /> إضافة باقة
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
                <input
                    className="form-input"
                    placeholder="ابحث عن باقة..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: 360 }}
                />
            </div>

            {packages.length === 0 ? (
                <div className="card"><div className="empty-state">
                    <HiOutlineBriefcase className="empty-state-icon" />
                    <h3>لا توجد باقات</h3><p>ابدأ بإضافة باقة سفر جديدة</p>
                </div></div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>الصورة</th>
                                    <th>الباقة</th>
                                    <th>الوجهة</th>
                                    <th>السعر</th>
                                    <th>المدة</th>
                                    <th>عرض</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...packages]
                                    .filter(pkg =>
                                        !search ||
                                        pkg.titleAr?.includes(search) ||
                                        pkg.titleEn?.toLowerCase().includes(search.toLowerCase()) ||
                                        pkg.destinationName?.includes(search)
                                    )
                                    .sort((a, b) => (a.titleAr || '').localeCompare(b.titleAr || '', 'ar'))
                                    .map((pkg) => (
                                    <tr key={pkg.id}>
                                        <td>
                                            <div style={{
                                                width: 56, height: 40, borderRadius: 6,
                                                background: pkg.imageUrl ? `url(${pkg.imageUrl}) center/cover` : 'var(--bg-input)',
                                            }} />
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                {pkg.titleAr}
                                                {pkg.isFeatured && <span style={{ marginLeft: 8, color: 'var(--gold)' }}>⭐</span>}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pkg.subtitle}</div>
                                        </td>
                                        <td>{pkg.destinationName || '-'}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            {pkg.price?.toLocaleString('ar-SA')} {pkg.currency || 'ر.س'}
                                        </td>
                                        <td>{pkg.duration || `${pkg.durationDays}أيام / ${pkg.durationNights}ليالي`}</td>
                                        <td>{pkg.isOffer ? <span className="badge badge-success">عرض</span> : '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(pkg)}>
                                                    <HiOutlinePencil />
                                                </button>
                                                <button className="btn btn-primary btn-sm btn-icon" onClick={() => openItinerary(pkg)} title="إدارة البرنامج">
                                                    <HiOutlineClipboardList />
                                                </button>
                                                <button className="btn btn-success btn-sm btn-icon" onClick={() => openHotels(pkg)} title="إدارة الفنادق">
                                                    <HiOutlineOfficeBuilding />
                                                </button>
                                                <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDelete(pkg)}>
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
                    <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'تعديل الباقة' : 'إضافة باقة جديدة'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">رمز الباقة *</label>
                                        <input className="form-input" value={formData.packageId} dir="ltr"
                                            onChange={e => setFormData({ ...formData, packageId: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">الوجهة *</label>
                                        <select className="form-input form-select" value={formData.destinationId}
                                            onChange={e => setFormData({ ...formData, destinationId: e.target.value })} required>
                                            <option value="">اختر الوجهة</option>
                                            {destinations && destinations.map(d => (
                                                <option key={d.id} value={d.id}>{d.nameAr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">العنوان (عربي) *</label>
                                    <input className="form-input" value={formData.titleAr}
                                        onChange={e => setFormData({ ...formData, titleAr: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">السعر *</label>
                                        <input className="form-input" type="number" value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">المدة</label>
                                        <input className="form-input" value={formData.duration} placeholder="5 أيام / 4 ليالي"
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-row" style={{ alignItems: 'center' }}>
                                    <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <input type="checkbox" id="isOffer" checked={formData.isOffer}
                                            onChange={e => setFormData({ ...formData, isOffer: e.target.checked })} />
                                        <label htmlFor="isOffer" style={{ fontSize: 14, cursor: 'pointer' }}>عرض خاص</label>
                                    </div>
                                    <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <input type="checkbox" id="isFeatured" checked={formData.isFeatured}
                                            onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} 
                                            style={{ width: 18, height: 18, accentColor: 'var(--gold)' }} />
                                        <label htmlFor="isFeatured" style={{ fontSize: 14, cursor: 'pointer', fontWeight: 'bold' }}>مميزة بالرئيسية</label>
                                    </div>
                                    {formData.isFeatured && (
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label className="form-label" style={{ fontSize: 12 }}>الترتيب</label>
                                            <input type="number" className="form-input" value={formData.featuredOrder}
                                                onChange={e => setFormData({ ...formData, featuredOrder: parseInt(e.target.value) || 0 })} />
                                        </div>
                                    )}
                                </div>
                                <div className="form-group" style={{ marginTop: 12 }}>
                                    <label className="form-label">رابط الصورة الرئيسية *</label>
                                    <input className="form-input" value={formData.imageUrl} dir="ltr"
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required />
                                </div>
                                
                                <details style={{ marginTop: 24 }}>
                                    <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 'bold', color: '#000', backgroundColor: 'var(--gold)', padding: '12px 16px', borderRadius: '8px', marginBottom: 16, display: 'inline-block' }}>
                                        + إظهار الحقول الإضافية (تصنيف، فيديو، عناوين فرعية، إنجليزي)
                                    </summary>
                                    <div style={{ marginTop: 12 }}>
                                        <div className="form-group">
                                            <label className="form-label">تصنيف الباقة</label>
                                            <select
                                                className="form-input form-select"
                                                value={formData.vibe || ''}
                                                onChange={e => setFormData({ ...formData, vibe: e.target.value })}
                                            >
                                                <option value="">بدون تصنيف</option>
                                                <option value="honeymoon">شهر عسل</option>
                                                <option value="cruise">كروز</option>
                                                <option value="islands">جزر</option>
                                                <option value="luxury">فاخر</option>
                                                <option value="tropical">استوائي</option>
                                                <option value="cultural">ثقافي</option>
                                                <option value="urban">مدينة</option>
                                                <option value="mountain">جبلي</option>
                                                <option value="arctic">ثلجي</option>
                                            </select>
                                            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                                                يستخدم في فلاتر الموقع (شهر عسل/كروز/جزر) + تأثيرات الخلفية في صفحة التفاصيل.
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">العنوان (إنجليزي)</label>
                                                <input className="form-input" value={formData.titleEn} dir="ltr"
                                                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">العنوان الفرعي</label>
                                                <input className="form-input" value={formData.subtitle}
                                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">رابط الفيديو</label>
                                            <input className="form-input" value={formData.videoUrl} dir="ltr"
                                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
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

            {confirmDelete && (
                <div className="modal-overlay confirm-dialog" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
                            <div className="confirm-icon"><HiOutlineTrash /></div>
                            <div className="confirm-title">هل أنت متأكد؟</div>
                            <div className="confirm-message">سيتم حذف الباقة "{confirmDelete.titleAr}" نهائياً</div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button className="btn btn-danger" onClick={handleDelete}>نعم، احذف</button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>إلغاء</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Itinerary Management Modal */}
            {showItineraryModal && selectedPackage && (
                <div className="modal-overlay" onClick={closeItineraryModal}>
                    <div className="modal" style={{ maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>إدارة برنامج: {selectedPackage.titleAr}</h2>
                            <button className="modal-close" onClick={closeItineraryModal}><HiOutlineX /></button>
                        </div>
                        <div className="modal-body">
                            {itineraryLoading ? (
                                <div className="skeleton" style={{ height: 200 }} />
                            ) : (
                                <>
                                    {/* Itinerary Form */}
                                    <form onSubmit={handleItinerarySubmit} style={{ marginBottom: 24 }}>
                                        <div className="form-row">
                                            <div className="form-group" style={{ width: 80 }}>
                                                <label className="form-label">اليوم *</label>
                                                <input className="form-input" type="number" min="1"
                                                    value={itineraryFormData.day}
                                                    onChange={e => setItineraryFormData({ ...itineraryFormData, day: e.target.value })} required />
                                            </div>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <label className="form-label">العنوان *</label>
                                                <input className="form-input" value={itineraryFormData.title}
                                                    onChange={e => setItineraryFormData({ ...itineraryFormData, title: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">الوصف</label>
                                            <textarea className="form-input" rows="2" value={itineraryFormData.description}
                                                onChange={e => setItineraryFormData({ ...itineraryFormData, description: e.target.value })} />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">رابط الصورة</label>
                                                <input className="form-input" value={itineraryFormData.imageUrl} dir="ltr"
                                                    onChange={e => setItineraryFormData({ ...itineraryFormData, imageUrl: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">خط العرض (Latitude)</label>
                                                <input className="form-input" type="number" step="any" value={itineraryFormData.latitude}
                                                    onChange={e => setItineraryFormData({ ...itineraryFormData, latitude: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">خط الطول (Longitude)</label>
                                                <input className="form-input" type="number" step="any" value={itineraryFormData.longitude}
                                                    onChange={e => setItineraryFormData({ ...itineraryFormData, longitude: e.target.value })} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                            <button type="submit" className="btn btn-primary">
                                                {editingItineraryItem ? 'تحديث اليوم' : 'إضافة يوم'}
                                            </button>
                                            {editingItineraryItem && (
                                                <button type="button" className="btn btn-secondary" onClick={() => {
                                                    setEditingItineraryItem(null);
                                                    setItineraryFormData({ day: 1, title: '', description: '', imageUrl: '', latitude: '', longitude: '' });
                                                }}>إلغاء</button>
                                            )}
                                        </div>
                                    </form>

                                    {/* Itinerary List */}
                                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>البرنامج اليومي</h3>
                                    {itineraryItems.length === 0 ? (
                                        <div className="empty-state" style={{ padding: 32 }}>
                                            <p>لا يوجد أيام مضافة للبرنامج</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {itineraryItems && itineraryItems.sort((a, b) => a.day - b.day).map((item) => (
                                                <div key={item.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                                    <div style={{
                                                        width: 48, height: 48, borderRadius: 24, background: 'var(--primary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', fontWeight: 'bold', fontSize: 18, flexShrink: 0
                                                    }}>
                                                        {item.day}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                                                        {item.description && (
                                                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{item.description}</div>
                                                        )}
                                                        {item.imageUrl && (
                                                            <img src={item.imageUrl} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => editItineraryItem(item)}>
                                                            <HiOutlinePencil />
                                                        </button>
                                                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteItineraryItem(item.id)}>
                                                            <HiOutlineTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hotels Management Modal */}
            {showHotelsModal && selectedPackage && (
                <PackageHotelsModal
                    package={selectedPackage}
                    onClose={closeHotelsModal}
                />
            )}
        </div>
    );
}
