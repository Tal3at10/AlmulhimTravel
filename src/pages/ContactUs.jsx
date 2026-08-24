import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Navigation, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // إرسال البيانات للواتساب مباشرة
    const whatsappNumber = '966535727771';
    const msg = `مرحباً، لدي استفسار جديد من الموقع:

*الموضوع*: ${formData.subject}

*بيانات المرسل:*
- الاسم: ${formData.name}
- الجوال: ${formData.phone}

*الرسالة:*
${formData.message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('تم تحويلك للواتساب لإرسال رسالتك ✈️');
    
    // Reset form after sending
    setFormData({
      name: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'اتصل بنا',
      value: '+966 53 572 7771',
      subtitle: 'متاحون على مدار الساعة للرد الفوري',
      color: 'text-[#C9A227]'
    },
    {
      icon: Mail,
      title: 'راسلنا إلكترونياً',
      value: 'almulhim_travel@yahoo.com',
      subtitle: 'نرد على كافة الاستفسارات خلال 24 ساعة',
      color: 'text-[#C9A227]'
    },
    {
      icon: MapPin,
      title: 'المقر الرئيسي',
      value: 'الأمير سعود بن جلوي، المبرز 36421',
      subtitle: 'الهفوف والمبرز، المملكة العربية السعودية',
      color: 'text-[#C9A227]'
    }
  ];

  const branches = [
    {
      city: 'الهفوف والمبرز',
      address: '7830 5212 الأمير سعود بن جلوي، الهفوف، المبرز 36421',
      hours: 'السبت - الخميس: 9 ص - 10 م',
      mapUrl: 'https://maps.google.com/?q=25.3833,49.5869'
    }
  ];

  return (
    <div className="bg-[#fdfbf7]">
      <SEO
        title="تواصل معنا"
        description="تواصل مع شركة الملحم للسفر والسياحة. فريقنا متاح على مدار الساعة للإجابة على استفساراتكم وحجوزاتكم."
        keywords="تواصل معنا, خدمة العملاء, رقم الملحم, فروع الملحم, حجز, استفسار"
      />
      {/* Hero Section with adaptive padding instead of fixed height to prevent overlaps */}
      <section className="relative py-28 sm:py-36 md:py-44 flex items-center justify-center overflow-hidden bg-[#071428]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/tourism.jpg')`,
            animation: 'about-ken-burns 25s infinite alternate ease-in-out'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071428]/95 via-[#071428]/75 to-[#071428]" />

        <div className="relative z-10 text-center px-4 pt-10">
          <motion.h1
            className="text-4xl md:text-6xl font-black text-[#C9A227] mb-4 tracking-tight drop-shadow-[0_4px_12px_rgba(7,20,40,0.5)] font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            تواصل معنا
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/95 font-bold max-w-xl mx-auto drop-shadow-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            نحن هنا لخدمتكم على مدار الساعة بأسلوب الضيافة الفاخرة
          </motion.p>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-5 rounded-full" />
        </div>
      </section>

      {/* Contact Cards - Floating */}
      <section className="container mx-auto px-4 -mt-16 sm:-mt-20 md:-mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="bg-white rounded-3xl p-8 text-center border border-[#C9A227]/25 shadow-[0_12px_35px_rgba(201,162,39,0.06)] hover:border-[#C9A227] hover:shadow-[0_18px_45px_rgba(201,162,39,0.15)] transition-all duration-350 relative group overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -6 }}
            >
              {/* Gold border top accent */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              {/* Circular Dark Container with Gold Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#071428] flex items-center justify-center shadow-lg shadow-black/10 group-hover:rotate-6 transition-all duration-300">
                <card.icon className="w-6.5 h-6.5 text-[#C9A227]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-black text-[#071428] mb-3 font-serif">{card.title}</h3>
              <p className="text-base font-black text-[#071428] mb-2 hover:text-[#C9A227] transition-colors break-words select-all" dir="ltr">{card.value}</p>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{card.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Split Section: Form & Branches */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Form Column */}
          <motion.div
            className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(180,139,62,0.1)]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif text-[#071428] mb-2">أرسل استفسارك</h2>
            <div className="w-16 h-1 bg-[#C9A227] mb-8" />

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#C9A227] py-3 text-[#071428] outline-none transition-colors duration-300 peer"
                  placeholder=" "
                  required
                />
                <label
                  className={`absolute right-0 transition-all duration-300 pointer-events-none
                    ${formData.name || focusedField === 'name'
                      ? '-top-5 text-sm text-[#C9A227]'
                      : 'top-3 text-slate-600 font-medium'}`}
                >
                  الاسم الكامل
                </label>
              </div>

              {/* Phone Field */}
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#C9A227] py-3 text-[#071428] outline-none transition-colors duration-300"
                  placeholder=" "
                  required
                />
                <label
                  className={`absolute right-0 transition-all duration-300 pointer-events-none
                    ${formData.phone || focusedField === 'phone'
                      ? '-top-5 text-sm text-[#C9A227]'
                      : 'top-3 text-slate-600 font-medium'}`}
                >
                  رقم الجوال
                </label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#C9A227] py-3 text-[#071428] outline-none transition-colors duration-300"
                  placeholder=" "
                  required
                />
                <label
                  className={`absolute right-0 transition-all duration-300 pointer-events-none
                    ${formData.subject || focusedField === 'subject'
                      ? '-top-5 text-sm text-[#C9A227]'
                      : 'top-3 text-slate-600 font-medium'}`}
                >
                  الموضوع
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#C9A227] py-3 text-[#071428] outline-none transition-colors duration-300 resize-none"
                  placeholder=" "
                  required
                />
                <label
                  className={`absolute right-0 transition-all duration-300 pointer-events-none
                    ${formData.message || focusedField === 'message'
                      ? '-top-5 text-sm text-[#C9A227]'
                      : 'top-3 text-slate-600 font-medium'}`}
                >
                  رسالتك
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-3 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                إرسال الرسالة
              </motion.button>
            </form>
          </motion.div>

          {/* Branches Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif text-[#071428] mb-2">فروعنا</h2>
            <div className="w-16 h-1 bg-[#C9A227] mb-8" />

            <div className="space-y-6">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.city}
                  className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(180,139,62,0.08)] hover:shadow-[0_8px_30px_rgb(180,139,62,0.12)] transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#C9A227] shrink-0">
                      <Building2 className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#071428] mb-2">{branch.city}</h3>
                      <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <MapPin className="w-4 h-4 text-[#C9A227]" />
                        <span className="text-sm font-medium">{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <Clock className="w-4 h-4 text-[#C9A227]" />
                        <span className="text-sm font-medium">{branch.hours}</span>
                      </div>
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2 !px-5 !py-2"
                      >
                        <Navigation className="w-4 h-4" />
                        احصل على الاتجاهات
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-[0_4px_20px_rgb(180,139,62,0.08)]">
              <h3 className="text-lg font-semibold text-[#071428] mb-4">تابعنا على</h3>
              <div className="flex gap-4">
                <a
                  href="https://x.com/almulhimtravel?lang=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#071428] hover:bg-[#071428] hover:text-[#C9A227] transition-all duration-300"
                  title="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/almulhimtravel/?hl=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#071428] hover:bg-[#071428] hover:text-[#C9A227] transition-all duration-300"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@almulhimtravel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#071428] hover:bg-[#071428] hover:text-[#C9A227] transition-all duration-300"
                  title="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.snapchat.com/@almulhimtravel?locale=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#071428] hover:bg-[#071428] hover:text-[#C9A227] transition-all duration-300"
                  title="Snapchat"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.809-.329-1.224-.72-1.227-1.153-.015-.345.284-.675.734-.825.15-.061.329-.09.51-.09.119 0 .283.015.435.104.389.18.748.3 1.048.3.149 0 .27-.029.374-.074-.009-.18-.019-.359-.034-.535l-.004-.075c-.104-1.628-.229-3.654.3-4.847C7.86 1.069 11.216.793 12.206.793z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] relative">
        <div className="absolute inset-0 bg-slate-200">
          <iframe
            src="https://maps.google.com/maps?q=25.3833,49.5869&hl=ar&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'contrast(1.1)' }}
            allowFullScreen=""
            loading="lazy"
            title="موقع الملحم للسفر والسياحة - الهفوف"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#fdfbf7] via-transparent to-transparent h-20 bottom-0 top-auto" />
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
