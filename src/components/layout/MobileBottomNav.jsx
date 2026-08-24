import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, PhoneCall, MessageCircle } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const navItems = [
    {
      path: '/',
      label: 'الرئيسية',
      icon: Home
    },
    {
      path: '/destinations',
      label: 'باقاتنا',
      icon: Compass
    },
    {
      path: 'whatsapp',
      label: 'واتساب',
      icon: MessageCircle,
      isExternal: true,
      url: 'https://wa.me/966535727771?text=' + encodeURIComponent('مرحباً، أود الاستفسار عن باقات السفر المتاحة')
    },
    {
      path: '/contact',
      label: 'اتصل بنا',
      icon: PhoneCall
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#071428]/95 backdrop-blur-md border-t border-white/10 z-[45] flex items-center justify-around px-4 shadow-[0_-8px_30px_rgba(7,20,40,0.3)] pb-safe">
      {navItems.map((item) => {
        const isActive = activePath === item.path;
        const Icon = item.icon;

        if (item.isExternal) {
          return (
            <motion.a
              key={item.path}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 active:text-[#25D366] transition-colors relative"
              whileTap={{ scale: 0.9 }}
            >
              <div className="p-1 rounded-full bg-[#25D366]/10 text-[#25D366]">
                <Icon className="w-5.5 h-5.5" />
              </div>
              <span className="text-[10px] font-black mt-0.5 text-slate-300">{item.label}</span>
            </motion.a>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 relative"
          >
            <motion.div
              className={`flex flex-col items-center justify-center transition-colors duration-300 ${
                isActive ? 'text-[#C9A227]' : 'text-slate-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className={`text-[10px] font-black mt-1 ${isActive ? 'text-[#C9A227]' : 'text-slate-300'}`}>
                {item.label}
              </span>
            </motion.div>

            {/* Premium Gold Active Indicator Dot */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute top-0 w-8 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
