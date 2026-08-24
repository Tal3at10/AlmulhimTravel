import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import AlmulhemLogo from '../ui/AlmulhemLogo';
import AnnouncementBar from './AnnouncementBar';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/destinations', label: 'الباقات' },
  // { to: '/custom-package', label: 'صمم رحلتك' },
  { to: '/offers', label: 'الوجهات' },
  { to: '/visas', label: 'التأشيرات' },
  { to: '/transfers', label: 'الانتقالات' },
  // { to: '/hotels', label: 'الفنادق' },
  // { to: '/flights', label: 'الطيران' },
  { to: '/about', label: 'من نحن' },
  { to: '/blog', label: 'المدونة' },
  { to: '/contact', label: 'اتصل بنا' },
];

const Navbar = () => {
  const SHOW_ANNOUNCEMENT_BAR = false; // Set to true to show the promo announcement banner at the top
  const headerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(50);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    handleResize();

    if (typeof ResizeObserver !== 'undefined' && headerRef.current) {
      const observer = new ResizeObserver(handleResize);
      observer.observe(headerRef.current);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Check path matches
  const pathname = location.pathname;

  // Pages with dark hero (transparent navbar at top, white navbar when scrolled)
  const darkHeroPaths = ['/', '/contact', '/package', '/destinations', '/offers', '/privacy', '/terms'];
  const hasDarkHero = darkHeroPaths.some(path => 
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  // Pages with light backgrounds (always white navbar, dark text)
  const lightBgPaths = [
    '/about', 
    '/dashboard', 
    '/hotels', 
    '/compare-hotels', 
    '/flights', 
    '/flight-hotel-packages', 
    '/seat-selection', 
    '/manage-booking', 
    '/blog', 
    '/visas', 
    '/transfers', 
    '/faq', 
    '/hotel',
    '/custom-package'
  ];
  const hasLightBg = lightBgPaths.some(path => pathname.startsWith(path));

  // Determine if it is a 404 page (not matching either category)
  const is404Page = !hasDarkHero && !hasLightBg;

  // Background: always white for light bg pages; white on scroll for dark hero pages; transparent for 404
  const showWhiteBg = hasLightBg || (isScrolled && hasDarkHero);

  // Text color: dark text on light bg pages or scrolled dark hero pages; white text on 404 pages or top of dark hero pages
  const useWhiteText = is404Page || (hasDarkHero && !isScrolled);

  // Button style: White bg + Navy text (no border), gold border on hover
  const getButtonStyle = () => {
    if (is404Page) {
      return 'bg-white text-[#071428] border-2 border-transparent hover:border-[#C9A227]';
    }
    if (isScrolled || hasLightBg) {
      return 'bg-[#071428] text-white border-2 border-transparent hover:border-[#C9A227]';
    }
    // Default state (at top): Glassmorphism
    // border-white/20 adds a subtle border, bg-white/10 + backdrop-blur gives glass effect
    return 'bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/60 shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-300';
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 right-0 left-0 z-50 transition-[background-color,shadow] duration-200 ${showWhiteBg
        ? 'bg-white shadow-sm'
        : 'bg-transparent'
        }`}
    >
      {SHOW_ANNOUNCEMENT_BAR && <AnnouncementBar />}
      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo - Right Side */}
          <Link to="/" className="flex items-center group">
            <div className={`transition-[background-color,box-shadow] duration-300 rounded-lg ${showWhiteBg
              ? 'p-0.5 bg-gradient-to-r from-[#071428] via-[#C9A227] to-[#071428] shadow-md'
              : 'p-0.5'
              }`}>
              <div className={`${showWhiteBg ? 'bg-white rounded-md px-1 py-0.5 md:px-2 md:py-1' : ''}`}>
                <AlmulhemLogo
                  isDarkBg={useWhiteText}
                  className="h-11 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <ul className="hidden lg:flex items-center gap-3 xl:gap-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`transition-colors duration-200 text-base xl:text-lg font-bold hover:text-gold-light ${useWhiteText ? 'text-white' : 'text-slate-700'
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA / Auth - Left Side (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                    useWhiteText
                      ? 'border-white/20 hover:border-white/50 text-white bg-white/10 hover:bg-white/20'
                      : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4 text-[#C9A227]" />
                  <span className="font-semibold text-sm">{user.firstName || user.fullName?.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2 w-64 bg-[#071428]/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden text-right p-4 backdrop-blur-xl"
                      >
                        <div className="pb-3 border-b border-white/10 mb-3 text-right">
                          <p className="font-bold text-white text-sm">{user.fullName}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4 bg-white/5 rounded-lg p-2.5">
                          <div className="text-center border-l border-white/10 pl-1">
                            <span className="text-[10px] text-slate-400 block">المحفظة</span>
                            <span className="font-bold text-white text-xs block truncate">{user.walletBalance || 0} ر.س</span>
                          </div>
                          <div className="text-center pr-1">
                            <span className="text-[10px] text-slate-400 block">نقاط الولاء</span>
                            <span className="font-bold text-[#C9A227] text-xs block truncate">{user.loyaltyPoints || 0} ن</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <span className="font-medium">لوحة التحكم</span>
                            <LayoutDashboard className="w-4 h-4 text-[#C9A227]" />
                          </Link>
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              logout();
                            }}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          >
                            <span className="font-medium">تسجيل الخروج</span>
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`hidden md:block px-5 py-2 rounded-lg transition-[background-color,border-color,color,box-shadow,transform] duration-300 ${getButtonStyle()}`}
                style={{ fontWeight: 800 }}
              >
                تسجيل الدخول
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 transition-colors duration-300 ${useWhiteText ? 'text-white' : 'text-slate-800'
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white overflow-y-auto max-h-[80vh] border-t border-slate-100"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={closeMobileMenu}
                    className="text-slate-600 hover:text-primary transition-colors duration-200 font-medium text-lg block w-full text-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="text-slate-600 hover:text-primary transition-colors duration-200 font-medium text-lg flex items-center justify-center gap-2 block w-full"
                    >
                      <LayoutDashboard className="w-5 h-5 text-[#C9A227]" />
                      لوحة التحكم
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        logout();
                      }}
                      className="text-rose-500 hover:text-rose-600 transition-colors duration-200 font-medium text-lg flex items-center justify-center gap-2 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      تسجيل الخروج
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-[#071428] hover:bg-[#001529] text-white px-8 py-3 rounded-lg font-semibold transition-[background-color,ring] duration-200 mt-2 inline-block hover:ring-2 hover:ring-[#C9A227] w-full"
                  >
                    تسجيل الدخول
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;
