import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const linksByRole = {
    student: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/student/face-register', label: 'Face Register' },
      { to: '/student/mark-attendance', label: 'Mark Attendance' },
      { to: '/student/logs', label: 'My Logs' }
    ],
    teacher: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/teacher/sessions/new', label: 'Create Session' },
      { to: '/teacher/sessions', label: 'My Sessions' },
      { to: '/teacher/suspicious', label: 'Suspicious' }
    ],
    admin: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/suspicious', label: 'Suspicious' },
      { to: '/admin/analytics', label: 'Analytics' },
      { to: '/admin/fraud-summary', label: 'Fraud Summary' }
    ]
  };

  const roleLinks = linksByRole[user?.role] || [{ to: '/dashboard', label: 'Dashboard' }];

  const isLinkActive = (to) => {
    const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
    const normalizedTo = to.replace(/\/+$/, '') || '/';

    if (normalizedTo === '/teacher/sessions/new') {
      return normalizedPath === '/teacher/sessions/new';
    }

    if (normalizedTo === '/teacher/sessions') {
      return normalizedPath.startsWith('/teacher/sessions') && normalizedPath !== '/teacher/sessions/new';
    }

    return normalizedPath === normalizedTo;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <Link to="/dashboard" className="logo">Smart Attendance</Link>
        <nav className="header-nav">
          <div className="top-nav">
            {roleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link${isLinkActive(link.to) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
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
