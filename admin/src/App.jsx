import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeroSlidesPage from './pages/HeroSlidesPage';
import DestinationsPage from './pages/DestinationsPage';
import PackagesPage from './pages/PackagesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import PartnersPage from './pages/PartnersPage';
import BoardMembersPage from './pages/BoardMembersPage';
import CustomerVideosPage from './pages/CustomerVideosPage';
import BlogPostsPage from './pages/BlogPostsPage';
import BookingsPage from './pages/BookingsPage';
import UsersPage from './pages/UsersPage';
import CustomerRequestsPage from './pages/CustomerRequestsPage';
import SettingsPage from './pages/SettingsPage';
import WhatsAppChatsPage from './pages/WhatsAppChatsPage';
import WhatsAppKnowledgePage from './pages/WhatsAppKnowledgePage';
import WhatsAppAnalyticsPage from './pages/WhatsAppAnalyticsPage';

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />

            {/* CMS */}
            <Route path="hero-slides" element={<HeroSlidesPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="board-members" element={<BoardMembersPage />} />
            <Route path="customer-videos" element={<CustomerVideosPage />} />
            <Route path="blog-posts" element={<BlogPostsPage />} />

            {/* Catalog */}
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="packages" element={<PackagesPage />} />

            {/* Operations */}
            <Route path="customer-requests" element={<CustomerRequestsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="users" element={<UsersPage />} />

            {/* WhatsApp Agent */}
            <Route path="whatsapp-chats" element={<WhatsAppChatsPage />} />
            <Route path="whatsapp-knowledge" element={<WhatsAppKnowledgePage />} />
            <Route path="whatsapp-analytics" element={<WhatsAppAnalyticsPage />} />

            {/* System */}
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A2332',
              color: '#F1F5F9',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              fontFamily: 'IBM Plex Sans Arabic, sans-serif',
              direction: 'rtl',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#1A2332' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#1A2332' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
