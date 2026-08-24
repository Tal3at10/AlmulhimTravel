import { useState, useEffect } from 'react';
import { whatsappAPI } from '../api';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlinePhotograph,
  HiOutlineStar,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';

export default function WhatsAppKnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'عام',
    title: '',
    content: '',
    imageUrl: '',
    isActive: true,
    priority: 0,
  });

  const categories = ['عام', 'باقات', 'تأشيرات', 'أسعار', 'سياسة الإلغاء'];

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await whatsappAPI.getKnowledge();
      setKnowledgeList(res.data);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل قاعدة المعرفة');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        category: 'عام',
        title: '',
        content: '',
        imageUrl: '',
        isActive: true,
        priority: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await whatsappAPI.updateKnowledge(editingItem.id, formData);
        toast.success('تم التحديث بنجاح');
      } else {
        await whatsappAPI.addKnowledge(formData);
        toast.success('تمت الإضافة بنجاح');
      }
      fetchKnowledge();
      handleCloseModal();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المعلومة؟')) return;
    try {
      await whatsappAPI.deleteKnowledge(id);
      toast.success('تم الحذف بنجاح');
      fetchKnowledge();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <HiOutlineBookOpen className="text-gold" />
            قاعدة معرفة سفر
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
            تحكم في المعلومات التي يتعلمها الوكيل الذكي لتحسين جودة الردود.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary shadow-lg"
        >
          <HiOutlinePlus className="w-5 h-5" />
          إضافة معلومة جديدة
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <span className="text-gray-500 font-bold">جاري تحميل البيانات...</span>
        </div>
      ) : knowledgeList.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-20 text-center border border-dashed border-gray-300 dark:border-gray-700">
           <HiOutlineBookOpen className="text-6xl text-gray-200 dark:text-gray-800 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-900 dark:text-white">قاعدة المعرفة فارغة</h3>
           <p className="text-gray-500 mt-2">ابدأ بإضافة أول معلومة للوكيل الآن.</p>
        </div>
      ) : (
        <div className="knowledge-grid">
          {knowledgeList.map((item) => (
            <div key={item.id} className="knowledge-card group">
              <div className="flex justify-between items-start">
                <div className="knowledge-icon">
                  <HiOutlineBadgeCheck />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-gold transition-colors">
                    <HiOutlinePencilAlt className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-info">{item.category}</span>
                  {!item.isActive && <span className="badge badge-danger text-[10px]">معطل</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
              </div>

              <p className="knowledge-content font-medium">
                {item.content}
              </p>

              {item.imageUrl && (
                <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-gray-500 font-bold border-t border-gray-100 dark:border-gray-700">
                  <HiOutlinePhotograph className="text-lg text-gold" />
                  تحتوي على صورة مرفقة
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-in">
            <div className="modal-header">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {editingItem ? <HiOutlinePencilAlt className="text-gold" /> : <HiOutlinePlus className="text-gold" />}
                {editingItem ? 'تعديل معلومة' : 'إضافة معلومة جديدة'}
              </h2>
              <button onClick={handleCloseModal} className="modal-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-5">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">الفئة</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-input form-select"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">الأولوية (0-100)</label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">العنوان</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مواعيد العمل، سياسة الاسترجاع..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">المحتوى التفصيلي</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="اكتب هنا المعلومات التي سيستخدمها الوكيل في الرد..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="form-input form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">رابط صورة توضيحية (اختياري)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="form-input"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">هذه المعلومة نشطة ومتاحة للوكيل</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary px-10 shadow-lg shadow-gold/20">
                  حفظ البيانات
                </button>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

