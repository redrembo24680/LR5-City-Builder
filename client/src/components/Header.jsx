import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header>
            <div className="logo">
                <h1>🏙️ City Builder (React)</h1>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Моє Місто</Link>
                    </li>
                    <li>
                        <Link to="/build" className={location.pathname === '/build' ? 'active' : ''}>Будівництво</Link>
                    </li>
                </ul>
            </nav>
            <div className="user-info">
                {user ? (
                    <>
                        <span className="user-email">👤 {user.email}</span>
                        <button className="logout-btn" onClick={handleLogout}>Вийти</button>
                    </>
                ) : (
                    <Link to="/login" className="login-link">🔑 Увійти</Link>
                )}
            </div>
        </header>
    );
}

export default Header;
