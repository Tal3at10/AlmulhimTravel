import { useState, useEffect, useRef } from 'react';
import { whatsappAPI } from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { HiOutlineUser, HiOutlineLightningBolt, HiOutlineChatAlt2, HiOutlineUserCircle, HiOutlineSearch, HiFilter, HiPaperAirplane } from 'react-icons/hi';

export default function WhatsAppChatsPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // all, bot, human
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations(page);
    const interval = setInterval(() => fetchConversations(page), 10000);
    return () => clearInterval(interval);
  }, [page]);

  const fetchConversations = async (currentPage = 1) => {
    try {
      const res = await whatsappAPI.getConversations(currentPage, 50);
      
      // Update state with paginated response
      if (res.data && res.data.items) {
        setConversations(res.data.items);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || 0);
      } else {
        // Fallback for unexpected data format
        setConversations(Array.isArray(res.data) ? res.data : []);
      }
      
      // Auto-update selected chat if open
      if (selectedChat) {
          handleSelectChat(selectedChat.id, true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (id, isSilent = false) => {
    try {
      if (!isSilent) setLoadingChat(true);
      const res = await whatsappAPI.getConversationDetails(id);
      setSelectedChat(res.data);
      if (!isSilent) setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      if (!isSilent) toast.error('حدث خطأ أثناء تحميل المحادثة');
    } finally {
      if (!isSilent) setLoadingChat(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTakeover = async () => {
    if (!selectedChat) return;
    try {
      await whatsappAPI.takeoverConversation(selectedChat.id);
      toast.success('تم التدخل، البوت متوقف الآن!');
      handleSelectChat(selectedChat.id);
      fetchConversations();
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  const handleRelease = async () => {
    if (!selectedChat) return;
    try {
      await whatsappAPI.releaseConversation(selectedChat.id);
      toast.success('تم إعادة المحادثة للبوت');
      handleSelectChat(selectedChat.id);
      fetchConversations();
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;
    
    try {
      setSending(true);
      await whatsappAPI.sendMessage(selectedChat.id, { content: messageInput });
      setMessageInput('');
      handleSelectChat(selectedChat.id);
      fetchConversations();
    } catch (error) {
      toast.error('فشل إرسال الرسالة');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const matchesMode = filterMode === 'all' ? true : filterMode === 'bot' ? c.mode === 0 : c.mode === 1;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (c.customerName || '').toLowerCase().includes(searchLower) || 
                          (c.customerPhone || '').toLowerCase().includes(searchLower);
    return matchesMode && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in">
      
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiOutlineChatAlt2 className="text-gold w-6 h-6" />
              المحادثات الحية
            </h2>
            <span className="badge badge-info">{filteredConversations.length}</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو الرقم..." 
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterMode('all')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${filterMode === 'all' ? 'bg-gold text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => setFilterMode('bot')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${filterMode === 'bot' ? 'bg-blue-500 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <HiOutlineLightningBolt className="w-4 h-4" /> ذكي
              </button>
              <button 
                onClick={() => setFilterMode('human')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${filterMode === 'human' ? 'bg-yellow-500 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <HiOutlineUserCircle className="w-4 h-4" /> موظف
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
              <span className="text-sm text-gray-500">جاري تحميل المحادثات...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">لا توجد محادثات تطابق بحثك</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredConversations.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => handleSelectChat(chat.id)}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                >
                  <div className="chat-avatar">
                    <HiOutlineUser />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {chat.customerName || chat.customerPhone}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap mr-2">
                        {format(new Date(chat.lastMessageAt), 'hh:mm a', { locale: ar })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]" dir="ltr">
                        {chat.customerPhone}
                      </p>
                      {chat.mode === 0 ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                          <HiOutlineLightningBolt /> ذكي
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                          <HiOutlineUserCircle /> موظف
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-xs text-gray-500">
              صفحة {page} من {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>

      {/* Main Area - Chat History */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-950">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="chat-avatar !w-10 !h-10">
                  <HiOutlineUser />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">{selectedChat.customerName || selectedChat.customerPhone}</h2>
                  <p className="text-xs text-gray-500" dir="ltr">{selectedChat.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {selectedChat.mode === 0 ? (
                  <button onClick={handleTakeover} className="btn btn-danger btn-sm">
                    إيقاف الوكيل والتدخل
                  </button>
                ) : (
                  <button onClick={handleRelease} className="btn btn-primary btn-sm">
                    إعادة المحادثة للوكيل
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#efe7de] dark:bg-gray-900/40 pattern-bg">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
                </div>
              ) : (
                <>
                  {selectedChat.messages?.map(msg => {
                    const isOutbound = msg.direction === 1;
                    return (
                      <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex flex-col max-w-[75%]">
                          <div className={`chat-bubble ${isOutbound ? 'outbound' : 'inbound'} ${msg.senderType === 1 ? 'bot' : ''}`}>
                            {msg.senderType === 1 && (
                              <div className="text-[10px] font-bold text-gold-light mb-1 flex items-center gap-1">
                                <HiOutlineLightningBolt /> الوكيل سفر
                              </div>
                            )}
                            {msg.senderType === 2 && (
                              <div className="text-[10px] font-bold text-blue-200 mb-1 flex items-center gap-1">
                                <HiOutlineUserCircle /> الموظف
                              </div>
                            )}
                            
                            {msg.mediaUrl && (
                              <img src={msg.mediaUrl} alt="Media" className="rounded-lg mb-2 w-full object-cover border border-white/10" />
                            )}
                            {(() => {
                              const content = msg.content || '';
                              const imgMatch = content.match(/\[IMAGE:\s*(.*?)\]/s);
                              if (imgMatch) {
                                const imgSrc = imgMatch[1].trim();
                                const restText = content.replace(imgMatch[0], '').trim();
                                return (
                                  <div>
                                    <img src={imgSrc} alt="صورة مرفقة" className="rounded-lg mb-2 max-w-full max-h-60 object-cover border border-white/20" />
                                    {restText && <div className="whitespace-pre-wrap font-medium">{restText}</div>}
                                  </div>
                                );
                              }
                              return <div className="whitespace-pre-wrap font-medium">{content}</div>;
                            })()}
                            
                            <div className={`chat-meta ${isOutbound ? 'text-blue-100/70' : ''}`}>
                              {format(new Date(msg.sentAt), 'hh:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area (Only visible when Human or can be used to Takeover implicitly) */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {selectedChat.mode === 0 && (
                 <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3 bg-gray-50 dark:bg-gray-900/50 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
                    الوكيل <b className="text-gold">سفر</b> يقوم بالرد تلقائياً. إرسال أي رسالة سيوقف الوكيل ويحول المحادثة للموظف.
                 </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-3 relative">
                <input
                  type="text"
                  placeholder="اكتب رسالتك للعميل هنا..."
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  disabled={sending}
                  dir="rtl"
                />
                <button 
                  type="submit" 
                  disabled={!messageInput.trim() || sending}
                  className="bg-gold hover:bg-gold-dark text-white rounded-xl px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                >
                  {sending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <HiPaperAirplane className="w-5 h-5 rotate-180" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-12 text-center">
            <HiOutlineChatAlt2 className="text-6xl text-gray-200 dark:text-gray-800 mb-4" />
            <h3 className="text-lg font-bold">ابدأ إدارة محادثاتك</h3>
            <p className="text-sm max-w-xs mt-2">اختر محادثة من القائمة الجانبية لمتابعة التفاصيل أو التحدث مع العميل.</p>
          </div>
        )}
      </div>
    </div>
  );
}

