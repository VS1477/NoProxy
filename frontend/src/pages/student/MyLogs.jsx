import { useState, useEffect } from 'react';
import { getMyLogs } from '../../api/student';

export default function MyLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLogs().then((res) => setLogs(res.data)).catch(() => setLogs([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1>My Attendance Logs</h1>
      {logs.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Time</th>
              <th>Status</th>
              <th>Distance (m)</th>
              <th>Fraud Score</th>
              {logs.some((l) => l.fraudReasons?.length) && <th>Reasons</th>}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const effectiveStatus = log.teacherDecision === 'accepted' ? 'Present' : log.teacherDecision === 'ignored' ? 'Rejected' : log.status;
              return (
              <tr key={log._id}>
                <td>{log.sessionId?.subject}</td>
                <td>{log.sessionId?.createdBy?.name || '-'}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td><span className={`badge status-${effectiveStatus?.toLowerCase()}`}>{effectiveStatus}</span></td>
                <td>{log.distanceFromClass?.toFixed(1)}</td>
                <td>{log.fraudScore}</td>
                {logs.some((l) => l.fraudReasons?.length) && (
                  <td>{log.fraudReasons?.join(', ') || '-'}</td>
                )}
              </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
