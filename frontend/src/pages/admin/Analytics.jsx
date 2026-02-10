import { useState, useEffect } from 'react';
import { getAnalytics } from '../../api/admin';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then((res) => setData(res.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Failed to load analytics</div>;

  return (
    <div className="page">
      <h1>Attendance Analytics</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{data.totalSessions}</span>
          <span className="stat-label">Total Sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.totalLogs}</span>
          <span className="stat-label">Total Attendance Logs</span>
        </div>
        <div className="stat-card stat-present">
          <span className="stat-value">{data.presentCount}</span>
          <span className="stat-label">Present</span>
        </div>
        <div className="stat-card stat-suspicious">
          <span className="stat-value">{data.suspiciousCount}</span>
          <span className="stat-label">Suspicious</span>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-value">{data.rejectedCount}</span>
          <span className="stat-label">Rejected</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.studentCount}</span>
          <span className="stat-label">Students</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.teacherCount}</span>
          <span className="stat-label">Teachers</span>
        </div>
      </div>
    </div>
  );
}
