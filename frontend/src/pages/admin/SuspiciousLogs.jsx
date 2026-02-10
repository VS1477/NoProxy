import { useState, useEffect } from 'react';
import { getSuspiciousLogs } from '../../api/admin';

export default function SuspiciousLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuspiciousLogs().then((res) => setLogs(res.data)).catch(() => setLogs([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1>Suspicious Logs</h1>
      {logs.length === 0 ? (
        <p>No suspicious logs.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Status</th>
              <th>Distance</th>
              <th>Fraud Score</th>
              <th>Reasons</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.studentId?.name}</td>
                <td>{log.sessionId?.subject}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td><span className={`badge status-${log.status?.toLowerCase()}`}>{log.status}</span></td>
                <td>{log.distanceFromClass?.toFixed(1)}m</td>
                <td>{log.fraudScore}</td>
                <td>{log.fraudReasons?.join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
