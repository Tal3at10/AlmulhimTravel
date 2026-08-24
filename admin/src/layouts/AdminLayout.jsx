import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function AdminLayout() {
    const { isAuthenticated, loading } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
            }}>
                <div className="sidebar-brand-logo" style={{
                    width: 56,
                    height: 56,
                    fontSize: 24,
                    animation: 'pulse 1.5s ease-in-out infinite',
                }}>
                    م
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className="main-content">
                <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
