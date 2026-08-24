import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Phone, Mail, MapPin, Send } from 'lucide-react';
import AlmulhemLogo from '../ui/AlmulhemLogo';

const TikTokIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11v-3.5a6.39 6.39 0 0 0-3.11.8 6.34 6.34 0 0 0-3.32 5.63 6.34 6.34 0 0 0 6.34 6.34c3.18 0 5.8-2.39 6.22-5.5h.02V8.34a8.37 8.37 0 0 0 5.66 2.1v-3.5a4.86 4.86 0 0 1-2.47-.25z" />
  </svg>
);

const SnapchatIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12.001 2.002c-3.125 0-5.836 1.838-5.836 4.847 0 .532.148.972.33 1.341a.81.81 0 0 1-.223.125c-.244.077-.456.241-.573.491-.186.398-.127.876.155 1.205.18.21.439.324.717.31a1.05 1.05 0 0 0 .341-.059c-.01.078.016.14.079.189.176.136.331.332.428.536.147.311.238.647.241.986 0 .332-.178.61-.439.814-.158.125-.333.208-.517.244a.89.89 0 0 0-.585.5c-.172.384-.092.839.208 1.15.215.223.518.337.818.31a.95.95 0 0 0 .285-.054c.481 1.701 1.764 2.825 3.398 2.929h.063c.092 0 .178.006.27.006h.057c1.65-.104 2.955-1.228 3.447-2.935.127.027.253.045.385.054a.87.87 0 0 0 .809-.32c.287-.311.365-.765.197-1.15a.89.89 0 0 0-.584-.5c-.183-.036-.358-.119-.517-.244-.26-.204-.439-.482-.439-.814.003-.339.094-.675.241-.986.097-.204.252-.4.428-.536.063-.049.089-.111.079-.189.117.027.234.045.341.059.278.014.537-.1.717-.31.282-.329.341-.807.155-1.205-.117-.25-.329-.414-.573-.491-.073-.024-.149-.071-.223-.125.182-.369.33-.809.33-1.341.001-3.009-2.71-4.847-5.835-4.847z" />
  </svg>
);

const socialLinks = [
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@almulhimtravel', label: 'TikTok' },
  { icon: Twitter, href: 'https://x.com/almulhimtravel?lang=ar', label: 'X (Twitter)' },
  { icon: Instagram, href: 'https://www.instagram.com/almulhimtravel/?hl=ar', label: 'Instagram' },
  { icon: SnapchatIcon, href: 'https://www.snapchat.com/@almulhimtravel?locale=ar', label: 'Snapchat' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('شكراً لاشتراكك!');
    setEmail('');
  };

  return (
    <footer className="bg-[#071428] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        {/* Mobile: Compact Layout */}
        <div className="block md:hidden">
          {/* Logo and Social */}
          <div className="text-center mb-6">
            <AlmulhemLogo isDarkBg={true} className="h-10 mx-auto mb-3" />
            <div className="flex justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#C9A15A] flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5 text-[#C9A15A] hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info - 2 Rows */}
          <div className="space-y-3 text-center mb-6">
            <div className="grid grid-cols-2 gap-4">
              <a href="tel:+966535727771" className="flex items-center justify-center gap-2 p-3 text-white hover:text-[#C9A15A] transition-colors rounded-lg bg-white/5">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-semibold" dir="ltr">+966 53 572 7771</span>
              </a>
              <a href="mailto:almulhim_travel@yahoo.com" className="flex items-center justify-center gap-2 p-3 text-white/90 hover:text-[#C9A15A] transition-colors rounded-lg bg-white/5">
                <Mail className="w-5 h-5" />
                <span className="text-xs">almulhim_travel@yahoo.com</span>
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90 p-2">
              <MapPin className="w-5 h-5 text-[#C9A15A]" />
              <span className="text-sm font-medium text-center leading-relaxed">الهفوف والمبرز، المملكة العربية السعودية<br />7830 5212 الأمير سعود بن جلوي، 36421</span>
            </div>
          </div>

          {/* Newsletter - Inline */}
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              required
              className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A15A] transition-colors text-sm"
            />
            <button
              type="submit"
              onClick={handleSubscribe}
              className="bg-[#C9A15A] hover:bg-[#B8924A] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1 transition-colors duration-300"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm">اشترك</span>
            </button>
          </div>
        </div>

        {/* Desktop: Full Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <AlmulhemLogo isDarkBg={true} className="h-16 mb-6" />
            <p className="text-white/90 leading-relaxed mb-6">
              أكثر من 30 عاماً من التميز في صناعة السفر والسياحة. نقدم لكم تجارب سفر استثنائية تجمع بين الفخامة والأصالة.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#C9A15A] flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5 text-[#C9A15A] hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - SEO Internal Linking */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#C9A15A]">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><Link to="/destinations?destName=تركيا" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">باقات سفر إلى تركيا</Link></li>
              <li><Link to="/destinations?destName=ماليزيا" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">رحلات ماليزيا</Link></li>
              <li><Link to="/destinations?destName=جورجيا" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">رحلات جورجيا</Link></li>
              <li><Link to="/destinations?destName=المالديف" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">شهر عسل المالديف</Link></li>
              <li><Link to="/visas" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">خدمات التأشيرات</Link></li>
              <li><Link to="/transfers" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">انتقالات المطار</Link></li>
              <li><Link to="/faq" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">الأسئلة الشائعة</Link></li>
              <li><Link to="/blog" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">مدونة السفر</Link></li>
              <li><Link to="/about" className="text-white/90 hover:text-[#C9A15A] transition-colors font-medium">عن الملحم</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#C9A15A]">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C9A15A]" />
                <a href="tel:+966535727771" className="text-white text-lg font-semibold hover:text-[#C9A15A] transition-colors">
                  <span dir="ltr">+966 53 572 7771</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C9A15A]" />
                <a href="mailto:almulhim_travel@yahoo.com" className="text-white/90 hover:text-[#C9A15A] transition-colors">
                  almulhim_travel@yahoo.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C9A15A] mt-1" />
                <span className="text-white/90 font-medium leading-relaxed">
                  الهفوف والمبرز، المملكة العربية السعودية<br />
                  7830 5212 الأمير سعود بن جلوي، 36421
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#C9A15A]">النشرة البريدية</h3>
            <p className="text-white/90 mb-4">
              اشترك للحصول على أحدث العروض والوجهات
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A15A] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#C9A15A] hover:bg-[#B8924A] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
              >
                <Send className="w-5 h-5" />
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A15A] to-transparent" />

      {/* Copyright Bar */}
      <div className="container mx-auto px-4 py-6 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/90 text-sm">
          <p>© 2026 Almulhem Travel. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="p-2 -m-2 hover:text-[#C9A227] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="p-2 -m-2 hover:text-[#C9A227] transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
