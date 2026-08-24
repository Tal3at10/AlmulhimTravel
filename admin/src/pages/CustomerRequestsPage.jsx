import { useState, useEffect, useRef } from 'react';
import { customerRequestsAPI, quotationsAPI, usersAPI } from '../api';
import toast from 'react-hot-toast';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {
    HiOutlineDocumentSearch,
    HiOutlinePlus,
    HiOutlinePaperAirplane,
    HiOutlineEye,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineBan,
    HiOutlineCurrencyDollar,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineUserGroup,
    HiOutlineDownload,
} from 'react-icons/hi';

export default function CustomerRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    
    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Form states
    const [createForm, setCreateForm] = useState({
        destination: '',
        expectedTravelDate: '',
        expectedReturnDate: '',
        adultsCount: 1,
        childrenCount: 0,
        estimatedBudget: '',
        notes: ''
    });

    const [selectedAgentIds, setSelectedAgentIds] = useState([]);
    
    const [acceptForm, setAcceptForm] = useState({
        quotationId: null,
        customerSellingPrice: '',
        adminMessage: ''
    });

    // Compare state
    const [quotations, setQuotations] = useState([]);
    const connectionRef = useRef(null);

    useEffect(() => {
        loadRequests();
        loadAgents();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const res = await customerRequestsAPI.getAll();
            setRequests(res.data || []);
        } catch (err) {
            toast.error('فشل في تحميل الطلبات');
        } finally {
            setLoading(false);
        }
    };

    const loadAgents = async () => {
        try {
            const res = await usersAPI.getAll();
            const allUsers = res.data || [];
            // Filter users who are active and have 'Agent' role
            const agentUsers = allUsers.filter(u => u.isActive && u.role === 'Agent');
            setAgents(agentUsers);
        } catch (err) {
            console.error('Failed to load agents', err);
        }
    };

    // Form handlers
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await customerRequestsAPI.create(createForm);
            toast.success('تم إنشاء الطلب بنجاح');
            setIsCreateModalOpen(false);
            setCreateForm({ destination: '', expectedTravelDate: '', expectedReturnDate: '', adultsCount: 1, childrenCount: 0, estimatedBudget: '', notes: '' });
            loadRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في إنشاء الطلب');
        }
    };

    const handleSendSubmit = async (e) => {
        e.preventDefault();
        if (selectedAgentIds.length === 0) {
            toast.error('يرجى اختيار وكيل واحد على الأقل');
            return;
        }
        try {
            await customerRequestsAPI.sendToAgents(selectedRequest.id, { agentIds: selectedAgentIds });
            toast.success('تم إرسال الطلبات للوكلاء المحددين (عبر الواتساب)');
            setIsSendModalOpen(false);
            setSelectedAgentIds([]);
            loadRequests(); // Refresh to update status
        } catch (err) {
            toast.error(err.response?.data?.message || 'فشل في الإرسال');
        }
    };

    // Compare SignalR Logic
    const openCompareModal = async (req) => {
        setSelectedRequest(req);
        setIsCompareModalOpen(true);
        setQuotations([]);
        
        try {
            // Initial fetch
            const res = await quotationsAPI.getCompare(req.id);
            setQuotations(res.data || []);

            // Setup SignalR connection
            const connection = new HubConnectionBuilder()
                .withUrl('/hubs/quotations') // Uses proxy in dev
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveQuotationUpdate", (reqId, message) => {
                if (reqId === req.id) {
                    toast.success('تحديث جديد لعروض الأسعار!');
                    // Refresh data
                    quotationsAPI.getCompare(req.id).then(r => setQuotations(r.data || []));
                }
            });

            await connection.start();
            connectionRef.current = connection;

        } catch (err) {
            toast.error('خطأ في تحميل العروض');
            console.error(err);
        }
    };

    const closeCompareModal = async () => {
        setIsCompareModalOpen(false);
        if (connectionRef.current) {
            await connectionRef.current.stop();
            connectionRef.current = null;
        }
    };

    const openAcceptModal = (quote) => {
        setAcceptForm({
            quotationId: quote.id,
            customerSellingPrice: quote.sellingPrice || '', // Default to the agent's price, allows admin to add markup
            adminMessage: ''
        });
        setIsAcceptModalOpen(true);
    };

    const handleAcceptSubmit = async (e) => {
        e.preventDefault();
        try {
            await quotationsAPI.accept(acceptForm.quotationId, {
                customerSellingPrice: parseFloat(acceptForm.customerSellingPrice),
                adminMessage: acceptForm.adminMessage
            });
            toast.success('تم قبول العرض، جاري استخراج الفاوتشر وإرساله للعميل عبر واتساب...');
            setIsAcceptModalOpen(false);
            // Refresh
            const res = await quotationsAPI.getCompare(selectedRequest.id);
            setQuotations(res.data || []);
            loadRequests(); // Update request status
        } catch (err) {
            toast.error('فشل في قبول العرض');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="badge badge-warning">قيد الانتظار</span>;
            case 'SentToAgents': return <span className="badge badge-info">أرسل للوكلاء</span>;
            case 'Completed': return <span className="badge badge-success">مكتمل</span>;
            case 'Cancelled': return <span className="badge badge-danger">ملغي</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const getQuotationStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="badge badge-warning">بانتظار التسعير</span>;
            case 'Submitted': return <span className="badge badge-info">مقدم</span>;
            case 'Accepted': return <span className="badge badge-success">مقبول</span>;
            case 'Rejected': return <span className="badge badge-danger">مرفوض</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-info"><h1>طلبات التسعير</h1></div>
                </div>
                <div className="card"><div className="skeleton" style={{ height: 400 }} /></div>
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="page-header">
                <div className="page-header-info">
                    <h1>طلبات التسعير وعروض الوكلاء</h1>
                    <p>إدارة طلبات العملاء وتوزيعها على الوكلاء والمقارنة الذكية ({requests.length} طلب)</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                        <HiOutlinePlus style={{ marginLeft: 8 }} /> طلب جديد
                    </button>
                </div>
            </div>

            <div className="card">
                {requests.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineDocumentSearch className="empty-state-icon" />
                        <h3>لا توجد طلبات</h3>
                        <p>لم يتم إضافة أي طلبات تسعير حتى الآن.</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th># الطلب</th>
                                    <th>الوجهة</th>
                                    <th>تاريخ السفر المتوقع</th>
                                    <th>عدد الأفراد</th>
                                    <th>الميزانية المتوقعة</th>
                                    <th>الحالة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id}>
                                        <td><strong>{req.id}</strong></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <HiOutlineLocationMarker className="text-muted" />
                                                {req.destination}
                                            </div>
                                        </td>
                                        <td dir="ltr" style={{ textAlign: 'right' }}>
                                            {req.expectedTravelDate ? new Date(req.expectedTravelDate).toLocaleDateString('ar-SA') : '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <HiOutlineUserGroup className="text-muted" />
                                                {req.adultsCount} بالغ ، {req.childrenCount} طفل
                                            </div>
                                        </td>
                                        <td>{req.estimatedBudget ? `${req.estimatedBudget} ريال` : 'غير محدد'}</td>
                                        <td>{getStatusBadge(req.status)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {req.status === 'Pending' && (
                                                    <button 
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => { setSelectedRequest(req); setIsSendModalOpen(true); }}
                                                        title="إرسال للوكلاء"
                                                    >
                                                        <HiOutlinePaperAirplane />
                                                    </button>
                                                )}
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => openCompareModal(req)}
                                                    title="المقارنة الذكية"
                                                >
                                                    <HiOutlineEye />
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

            {/* Create Request Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <div className="modal-header">
                            <h2>إنشاء طلب تسعير جديد</h2>
                            <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>الوجهة المقصودة <span className="text-danger">*</span></label>
                                        <input type="text" className="form-input" required value={createForm.destination} onChange={e => setCreateForm({...createForm, destination: e.target.value})} placeholder="مثال: لندن، باريس..." />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>الميزانية المتوقعة (اختياري)</label>
                                        <input type="number" className="form-input" value={createForm.estimatedBudget} onChange={e => setCreateForm({...createForm, estimatedBudget: e.target.value})} placeholder="بالريال السعودي" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>تاريخ السفر المتوقع</label>
                                        <input type="date" className="form-input" value={createForm.expectedTravelDate} onChange={e => setCreateForm({...createForm, expectedTravelDate: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>تاريخ العودة المتوقع</label>
                                        <input type="date" className="form-input" value={createForm.expectedReturnDate} onChange={e => setCreateForm({...createForm, expectedReturnDate: e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>عدد البالغين <span className="text-danger">*</span></label>
                                        <input type="number" min="1" className="form-input" required value={createForm.adultsCount} onChange={e => setCreateForm({...createForm, adultsCount: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>عدد الأطفال</label>
                                        <input type="number" min="0" className="form-input" value={createForm.childrenCount} onChange={e => setCreateForm({...createForm, childrenCount: e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>ملاحظات إضافية للوكيل</label>
                                    <textarea className="form-input" rows="3" value={createForm.notes} onChange={e => setCreateForm({...createForm, notes: e.target.value})} placeholder="أي تفاصيل خاصة بالطلب..."></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">حفظ الطلب</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Send to Agents Modal */}
            {isSendModalOpen && selectedRequest && (
                <div className="modal-overlay" onClick={() => setIsSendModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h2>إرسال الطلب #{selectedRequest.id} للوكلاء</h2>
                            <button className="modal-close" onClick={() => setIsSendModalOpen(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleSendSubmit}>
                            <div className="modal-body">
                                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                    اختر الوكلاء الذين ترغب في إرسال طلب التسعير إليهم. سيتم إرسال رابط آمن (Magic Link) عبر الواتساب.
                                </p>
                                
                                {agents.length === 0 ? (
                                    <div className="empty-state">
                                        <p>لا يوجد وكلاء نشطين في النظام.</p>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                                        {agents.map(agent => (
                                            <label key={agent.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ marginLeft: 12, width: 18, height: 18 }}
                                                    checked={selectedAgentIds.includes(agent.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedAgentIds([...selectedAgentIds, agent.id]);
                                                        else setSelectedAgentIds(selectedAgentIds.filter(id => id !== agent.id));
                                                    }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{agent.firstName} {agent.lastName}</div>
                                                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }} dir="ltr">{agent.phone}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-info" disabled={selectedAgentIds.length === 0 || agents.length === 0}>
                                    <HiOutlinePaperAirplane style={{ marginLeft: 8 }} /> إرسال عبر الواتساب
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsSendModalOpen(false)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Smart Comparison Modal */}
            {isCompareModalOpen && selectedRequest && (
                <div className="modal-overlay" onClick={closeCompareModal}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '90%' }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h2>المقارنة الذكية לעروض الوكلاء - طلب #{selectedRequest.id}</h2>
                                {getStatusBadge(selectedRequest.status)}
                                <span className="badge badge-info" style={{ animation: 'pulse 2s infinite' }}>
                                    <span style={{ display: 'inline-block', width: 8, height: 8, background: '#fff', borderRadius: '50%', marginRight: 6 }}></span>
                                    مباشر SignalR
                                </span>
                            </div>
                            <button className="modal-close" onClick={closeCompareModal}><HiOutlineX /></button>
                        </div>
                        <div className="modal-body" style={{ background: 'var(--bg-primary)', padding: '24px' }}>
                            <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 16 }}>
                                {quotations.length === 0 ? (
                                    <div className="empty-state" style={{ width: '100%', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                                        <HiOutlineCurrencyDollar className="empty-state-icon" />
                                        <h3>لا توجد عروض بعد</h3>
                                        <p>في انتظار قيام الوكلاء بتقديم عروضهم.</p>
                                    </div>
                                ) : (
                                    // Sort by selling price ascending (Smart Comparison)
                                    [...quotations].sort((a, b) => {
                                        if (a.status === 'Submitted' && b.status !== 'Submitted') return -1;
                                        if (a.status !== 'Submitted' && b.status === 'Submitted') return 1;
                                        return (a.sellingPrice || 0) - (b.sellingPrice || 0);
                                    }).map((quote, index) => (
                                        <div key={quote.id} className="card" style={{ 
                                            minWidth: 300, 
                                            flex: '0 0 auto', 
                                            border: index === 0 && quote.status === 'Submitted' ? '2px solid var(--success)' : '1px solid var(--border)',
                                            position: 'relative',
                                            transform: index === 0 && quote.status === 'Submitted' ? 'scale(1.02)' : 'none',
                                            boxShadow: index === 0 && quote.status === 'Submitted' ? '0 10px 25px -5px rgba(34, 197, 94, 0.2)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {index === 0 && quote.status === 'Submitted' && (
                                                <div style={{ position: 'absolute', top: -12, right: 20, background: 'var(--success)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold' }}>
                                                    الأفضل سعراً 🌟
                                                </div>
                                            )}
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                                <h3 style={{ margin: 0, fontSize: 18 }}>وكيل #{quote.agentId}</h3>
                                                {getQuotationStatusBadge(quote.status)}
                                            </div>

                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--primary)', marginBottom: 20, textAlign: 'center' }}>
                                                {quote.sellingPrice ? `${quote.sellingPrice.toLocaleString()} ريال` : 'لم يحدد بعد'}
                                            </div>

                                            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, minHeight: 60 }}>
                                                <strong>الملاحظات:</strong><br/>
                                                {quote.notes || 'لا توجد ملاحظات.'}
                                            </div>

                                            {quote.attachments && quote.attachments.length > 0 && (
                                                <div style={{ marginBottom: 20 }}>
                                                    {quote.attachments.map(att => (
                                                        <a key={att.id} href={att.fileUrl} target="_blank" rel="noreferrer" 
                                                           style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
                                                            <HiOutlineDownload /> {att.fileName || 'عرض الملف PDF'}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            <div style={{ marginTop: 'auto' }}>
                                                {quote.status === 'Submitted' && selectedRequest.status !== 'Completed' && (
                                                    <button 
                                                        className="btn btn-success" 
                                                        style={{ width: '100%' }}
                                                        onClick={() => openAcceptModal(quote)}
                                                    >
                                                        <HiOutlineCheck style={{ marginLeft: 8 }} /> قبول العرض (وإرسال للعميل)
                                                    </button>
                                                )}
                                                {quote.status === 'Accepted' && (
                                                    <div style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 'bold', padding: 12, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8 }}>
                                                        تم قبول هذا العرض
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Accept Quotation Modal */}
            {isAcceptModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAcceptModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h2>إعداد الفاتورة النهائية للعميل</h2>
                            <button className="modal-close" onClick={() => setIsAcceptModalOpen(false)}><HiOutlineX /></button>
                        </div>
                        <form onSubmit={handleAcceptSubmit}>
                            <div className="modal-body">
                                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                    قم بتحديد السعر النهائي (شاملاً العمولة الخاصة بك) واكتب رسالة ترحيبية أو ملاحظات إضافية للعميل. سيتم إرسال الرابط عبر الواتساب فوراً.
                                </p>
                                
                                <div className="form-group">
                                    <label>سعر البيع للعميل (بالريال السعودي) <span className="text-danger">*</span></label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="form-input" 
                                        required 
                                        value={acceptForm.customerSellingPrice} 
                                        onChange={e => setAcceptForm({...acceptForm, customerSellingPrice: e.target.value})} 
                                    />
                                    <small style={{ color: 'var(--text-muted)' }}>* السعر الأصلي للوكيل كان موضحاً في شاشة المقارنة.</small>
                                </div>
                                <div className="form-group" style={{ marginTop: 16 }}>
                                    <label>ملاحظات إضافية للعميل (تظهر في الواتساب والفاتورة)</label>
                                    <textarea 
                                        className="form-input" 
                                        rows="4" 
                                        value={acceptForm.adminMessage} 
                                        onChange={e => setAcceptForm({...acceptForm, adminMessage: e.target.value})} 
                                        placeholder="مثال: يرجى العلم بأن الفندق يشمل الإفطار فقط..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success">
                                    <HiOutlineCheck style={{ marginLeft: 8 }} /> اعتماد وإرسال للعميل
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsAcceptModalOpen(false)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
