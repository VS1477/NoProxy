import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'admin') {
    return (
      <div className="dashboard">
        <h1>Admin Dashboard</h1>
        <p className="welcome">Welcome back, {user.name}. Manage users and view system analytics.</p>
        <div className="dashboard-grid">
          <Link to="/admin/users" className="card">View All Users</Link>
          <Link to="/admin/suspicious" className="card">Suspicious Logs</Link>
          <Link to="/admin/analytics" className="card">Attendance Analytics</Link>
          <Link to="/admin/fraud-summary" className="card">Fraud Summary</Link>
        </div>
      </div>
    );
  }

  if (user.role === 'teacher') {
    return (
      <div className="dashboard">
        <h1>Teacher Dashboard</h1>
        <p className="welcome">Welcome back, {user.name}. Create sessions and track attendance.</p>
        <div className="dashboard-grid">
          <Link to="/teacher/sessions/new" className="card">Create Session</Link>
          <Link to="/teacher/sessions" className="card">My Sessions</Link>
          <Link to="/teacher/suspicious" className="card">Suspicious Attempts</Link>
        </div>
      </div>
    );
  }

  if (user.role === 'student') {
    return (
      <div className="dashboard">
        <h1>Student Dashboard</h1>
        <p className="welcome">Welcome back, {user.name}. Register your face and mark attendance.</p>
        <div className="dashboard-grid">
          <Link to="/student/face-register" className="card">Register Face</Link>
          <Link to="/student/mark-attendance" className="card">Mark Attendance</Link>
          <Link to="/student/logs" className="card">My Attendance Logs</Link>
        </div>
      </div>
    );
  }

  return null;
}
