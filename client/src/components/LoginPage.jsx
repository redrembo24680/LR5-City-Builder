import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            navigate('/');
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Цей email вже зареєстрований');
                    break;
                case 'auth/invalid-email':
                    setError('Невірний формат email');
                    break;
                case 'auth/weak-password':
                    setError('Пароль повинен містити мінімум 6 символів');
                    break;
                case 'auth/invalid-credential':
                    setError('Невірний email або пароль');
                    break;
                default:
                    setError('Помилка: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <h2>🔐 {isLogin ? 'Вхід в систему' : 'Реєстрація'}</h2>

            <div className="auth-tabs">
                <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>
                    Вхід
                </button>
                <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>
                    Реєстрація
                </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" className="auth-input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Пароль
                    <input type="password" className="auth-input" placeholder="Мінімум 6 символів" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </label>
                <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? '⏳ Зачекайте…' : isLogin ? '➡️ Увійти' : '📝 Зареєструватися'}
                </button>
            </form>
        </section>
    );
}

export default LoginPage;
