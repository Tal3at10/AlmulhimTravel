import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome,
    HiOutlinePhotograph,
    HiOutlineGlobeAlt,
    HiOutlineBriefcase,
    HiOutlineClipboardList,
    HiOutlineUsers,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineStar,
    HiOutlineFilm,
    HiOutlineUserGroup,
    HiOutlineOfficeBuilding,
    HiOutlineDocumentText,
    HiOutlineChat,
    HiOutlineLightBulb,
    HiOutlineDocumentSearch,
} from 'react-icons/hi';

const navSections = [
    {
        title: 'الرئيسية',
        links: [
            { to: '/', icon: HiOutlineHome, label: 'لوحة التحكم', exact: true },
        ],
    },
    {
        title: 'إدارة المحتوى',
        links: [
            { to: '/hero-slides', icon: HiOutlinePhotograph, label: 'السلايدر الرئيسي' },
            { to: '/testimonials', icon: HiOutlineStar, label: 'آراء العملاء' },
            { to: '/partners', icon: HiOutlineOfficeBuilding, label: 'الشركاء' },
            { to: '/board-members', icon: HiOutlineUserGroup, label: 'أعضاء مجلس الإدارة' },
            { to: '/customer-videos', icon: HiOutlineFilm, label: 'فيديوهات العملاء' },
            { to: '/blog-posts', icon: HiOutlineDocumentText, label: 'المدونة والمقالات' },
        ],
    },
    {
        title: 'إدارة الكتالوج',
        links: [
            { to: '/destinations', icon: HiOutlineGlobeAlt, label: 'الوجهات' },
            { to: '/packages', icon: HiOutlineBriefcase, label: 'الباقات' },
        ],
    },
    {
        title: 'العمليات',
        links: [
            { to: '/customer-requests', icon: HiOutlineDocumentSearch, label: 'طلبات التسعير' },
            { to: '/bookings', icon: HiOutlineClipboardList, label: 'الحجوزات' },
            { to: '/users', icon: HiOutlineUsers, label: 'المستخدمين' },
        ],
    },
    {
        title: 'وكيل الواتساب 🤖',
        links: [
            { to: '/whatsapp-chats', icon: HiOutlineChat, label: 'المحادثات الحية' },
            { to: '/whatsapp-knowledge', icon: HiOutlineLightBulb, label: 'قاعدة المعرفة' },
            { to: '/whatsapp-analytics', icon: HiOutlineClipboardList, label: 'التحليلات والأداء' },
        ],
    },
    {
        title: 'النظام',
        links: [
            { to: '/settings', icon: HiOutlineCog, label: 'الإعدادات' },
        ],
    },
];

export default function Sidebar({ collapsed, onToggle }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-logo">م</div>
                <div className="sidebar-brand-text">
                    <h2>الملحم للسفر</h2>
                    <span>لوحة التحكم</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navSections.map((section, i) => (
                    <div key={i} className="sidebar-section">
                        <div className="sidebar-section-title">{section.title}</div>
                        {section.links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.exact}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="sidebar-link-icon">
                                    <link.icon />
                                </span>
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer / User */}
            <div className="sidebar-footer">
                <div className="sidebar-user" onClick={logout} title="تسجيل الخروج">
                    <div className="sidebar-user-avatar">
                        <HiOutlineLogout />
                    </div>
                    <div className="sidebar-user-info">
                        <h4>{user?.fullName || 'مدير النظام'}</h4>
                        <span>تسجيل الخروج</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
