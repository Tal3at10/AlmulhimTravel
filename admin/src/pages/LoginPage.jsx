import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function LoginPage() {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (loading) return null;
    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.title
                || 'بيانات الدخول غير صحيحة';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card animate-in">
                <div className="login-header">
                    <div className="login-logo">م</div>
                    <h1>لوحة التحكم</h1>
                    <p>الملحم للسفر والسياحة</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">البريد الإلكتروني</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="admin@almulhemtravel.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                dir="ltr"
                                style={{ paddingRight: 40 }}
                            />
                            <HiOutlineMail style={{
                                position: 'absolute',
                                right: 14,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                fontSize: 18,
                            }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">كلمة المرور</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                dir="ltr"
                                style={{ paddingRight: 40, paddingLeft: 40 }}
                            />
                            <HiOutlineLockClosed style={{
                                position: 'absolute',
                                right: 14,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                fontSize: 18,
                            }} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    left: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    padding: 4,
                                }}
                            >
                                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <span className="spinner" style={{
                                    width: 18,
                                    height: 18,
                                    border: '2px solid rgba(0,31,63,0.2)',
                                    borderTopColor: 'var(--navy-dark)',
                                    borderRadius: '50%',
                                    animation: 'spin 0.6s linear infinite',
                                    display: 'inline-block',
                                }} />
                                جاري تسجيل الدخول...
                            </span>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 24,
                }}>
                    © {new Date().getFullYear()} الملحم للسفر والسياحة
                </p>
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
        </div>
    );
}
