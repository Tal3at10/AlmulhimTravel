import { useLocation } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';

const routeTitles = {
    '/admin': 'لوحة التحكم',
    '/admin/hero-slides': 'السلايدر الرئيسي',
    '/admin/testimonials': 'آراء العملاء',
    '/admin/partners': 'الشركاء',
    '/admin/board-members': 'أعضاء مجلس الإدارة',
    '/admin/customer-videos': 'فيديوهات العملاء',
    '/admin/destinations': 'الوجهات',
    '/admin/packages': 'الباقات',
    '/admin/bookings': 'الحجوزات',
    '/admin/users': 'المستخدمين',
    '/admin/settings': 'الإعدادات',
};

export default function TopBar({ onToggleSidebar }) {
    const location = useLocation();
    const currentTitle = routeTitles[location.pathname] || 'لوحة التحكم';

    return (
        <header className="topbar">
            <div className="topbar-right">
                <button className="topbar-toggle" onClick={onToggleSidebar}>
                    <HiOutlineMenu />
                </button>
                <div className="topbar-breadcrumb">
                    <span>الرئيسية</span>
                    <span className="topbar-breadcrumb-sep">/</span>
                    <span>{currentTitle}</span>
                </div>
            </div>

            <div className="topbar-left">
                <div className="topbar-search">
                    <HiOutlineSearch className="topbar-search-icon" />
                    <input type="text" placeholder="بحث..." />
                </div>

                <div className="topbar-actions">
                    <button className="topbar-btn">
                        <HiOutlineBell />
                        <span className="topbar-notification-badge"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
