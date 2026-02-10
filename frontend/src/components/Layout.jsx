import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <Link to="/dashboard" className="logo">Smart Attendance</Link>
        <nav>
          <span className="user-info">{user?.name} ({user?.role})</span>
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </nav>
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}
