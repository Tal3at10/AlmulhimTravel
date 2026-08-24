import { useState, useEffect } from 'react';
import { packagesAPI } from '../api';
import toast from 'react-hot-toast';
import {
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineX,
    HiOutlineOfficeBuilding,
} from 'react-icons/hi';

export default function PackageHotelsModal({ package: selectedPackage, onClose }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [hotelFormData, setHotelFormData] = useState({
        name: '',
        location: '',
        stars: 5,
        nightsCount: 1,
        dayImageUrl: '',
        nightImageUrl: '',
        sortOrder: 1
    });

    useEffect(() => {
        if (selectedPackage) {
            loadHotels();
        }
    }, [selectedPackage]);

    const loadHotels = async () => {
        setLoading(true);
        try {
            const res = await packagesAPI.getHotels(selectedPackage.id);
            setHotels(res.data || []);
        } catch {
            toast.error('فشل في تحميل الفنادق');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name: hotelFormData.name.trim(),
                location: hotelFormData.location.trim(),
                stars: parseInt(hotelFormData.stars) || 5,
                nightsCount: parseInt(hotelFormData.nightsCount) || 1,
                dayImageUrl: hotelFormData.dayImageUrl.trim(),
                nightImageUrl: hotelFormData.nightImageUrl.trim(),
                sortOrder: parseInt(hotelFormData.sortOrder) || 1,
            };

            if (editingHotel) {
                await packagesAPI.updateHotel(selectedPackage.id, editingHotel.id, data);
                toast.success('تم تحديث الفندق بنجاح');
            } else {
                await packagesAPI.addHotel(selectedPackage.id, data);
                toast.success('تم إضافة الفندق بنجاح');
            }

            cancelEdit();
            loadHotels();
        } catch (err) {
            toast.error(err.response?.data?.message || 'حدث خطأ');
        }
    };

    const editHotel = (hotel) => {
        setEditingHotel(hotel);
        setHotelFormData({
            name: hotel.name || '',
            location: hotel.location || '',
            stars: hotel.stars || 5,
            nightsCount: hotel.nightsCount || 1,
            dayImageUrl: hotel.dayImageUrl || '',
            nightImageUrl: hotel.nightImageUrl || '',
            sortOrder: hotel.sortOrder || 1
        });
    };

    const deleteHotel = async (hotelId) => {
        if (!confirm('هل أنت متأكد من حذف هذا الفندق؟')) return;
        try {
            await packagesAPI.deleteHotel(selectedPackage.id, hotelId);
            toast.success('تم حذف الفندق');
            loadHotels();
        } catch {
            toast.error('فشل في الحذف');
        }
    };

    const cancelEdit = () => {
        setEditingHotel(null);
        setHotelFormData({ name: '', location: '', stars: 5, nightsCount: 1, dayImageUrl: '', nightImageUrl: '', sortOrder: 1 });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>إدارة فنادق: {selectedPackage.titleAr}</h2>
                    <button className="modal-close" onClick={onClose}><HiOutlineX /></button>
                </div>
                <div className="modal-body">
                    {loading ? (
                        <div className="skeleton" style={{ height: 200 }} />
                    ) : (
                        <>
                            {/* Hotel Form */}
                            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">اسم الفندق *</label>
                                        <input 
                                            className="form-input" 
                                            value={hotelFormData.name}
                                            onChange={e => setHotelFormData({ ...hotelFormData, name: e.target.value })} 
                                            placeholder="فندق فور سيزونز السلطان أحمد"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">الموقع *</label>
                                        <input 
                                            className="form-input" 
                                            value={hotelFormData.location}
                                            onChange={e => setHotelFormData({ ...hotelFormData, location: e.target.value })} 
                                            placeholder="إسطنبول"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group" style={{ width: 100 }}>
                                        <label className="form-label">النجوم *</label>
                                        <select 
                                            className="form-input form-select" 
                                            value={hotelFormData.stars}
                                            onChange={e => setHotelFormData({ ...hotelFormData, stars: e.target.value })}
                                        >
                                            <option value="3">3 نجوم</option>
                                            <option value="4">4 نجوم</option>
                                            <option value="5">5 نجوم</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ width: 100 }}>
                                        <label className="form-label">الليالي *</label>
                                        <input 
                                            className="form-input" 
                                            type="number" 
                                            min="1"
                                            value={hotelFormData.nightsCount}
                                            onChange={e => setHotelFormData({ ...hotelFormData, nightsCount: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group" style={{ width: 100 }}>
                                        <label className="form-label">الترتيب</label>
                                        <input 
                                            className="form-input" 
                                            type="number" 
                                            min="1"
                                            value={hotelFormData.sortOrder}
                                            onChange={e => setHotelFormData({ ...hotelFormData, sortOrder: e.target.value })} 
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رابط صورة النهار *</label>
                                    <input 
                                        className="form-input" 
                                        value={hotelFormData.dayImageUrl}
                                        onChange={e => setHotelFormData({ ...hotelFormData, dayImageUrl: e.target.value })} 
                                        placeholder="https://images.unsplash.com/photo-..."
                                        dir="ltr"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رابط صورة الليل *</label>
                                    <input 
                                        className="form-input" 
                                        value={hotelFormData.nightImageUrl}
                                        onChange={e => setHotelFormData({ ...hotelFormData, nightImageUrl: e.target.value })} 
                                        placeholder="https://images.unsplash.com/photo-..."
                                        dir="ltr"
                                        required 
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                    <button type="submit" className="btn btn-primary">
                                        {editingHotel ? 'تحديث الفندق' : 'إضافة فندق'}
                                    </button>
                                    {editingHotel && (
                                        <button type="button" className="btn btn-secondary" onClick={cancelEdit}>إلغاء</button>
                                    )}
                                </div>
                            </form>

                            {/* Hotels List */}
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>الفنادق المضافة</h3>
                            {hotels.length === 0 ? (
                                <div className="empty-state" style={{ padding: 32 }}>
                                    <HiOutlineOfficeBuilding className="empty-state-icon" />
                                    <p>لا يوجد فنادق مضافة للباقة</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {hotels.sort((a, b) => a.sortOrder - b.sortOrder).map((hotel) => (
                                        <div key={hotel.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {hotel.dayImageUrl && (
                                                    <img 
                                                        src={hotel.dayImageUrl} 
                                                        alt={`${hotel.name} - نهاراً`} 
                                                        style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 6 }} 
                                                    />
                                                )}
                                                {hotel.nightImageUrl && (
                                                    <img 
                                                        src={hotel.nightImageUrl} 
                                                        alt={`${hotel.name} - ليلاً`} 
                                                        style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 6 }} 
                                                    />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{hotel.name}</div>
                                                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                                    {hotel.location} • {'⭐'.repeat(hotel.stars)} • {hotel.nightsCount} ليالي
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-secondary btn-sm btn-icon" onClick={() => editHotel(hotel)}>
                                                    <HiOutlinePencil />
                                                </button>
                                                <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteHotel(hotel.id)}>
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
    );
}
