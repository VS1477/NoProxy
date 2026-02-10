import { useState, useEffect } from 'react';
import { getFraudSummary } from '../../api/admin';

export default function FraudSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFraudSummary().then((res) => setData(res.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Failed to load fraud summary</div>;

  const { summary, byReason } = data;

  return (
    <div className="page">
      <h1>Fraud Summary</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{(summary.avgFraudScore || 0).toFixed(1)}</span>
          <span className="stat-label">Avg Fraud Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{summary.maxFraudScore || 0}</span>
          <span className="stat-label">Max Fraud Score</span>
        </div>
        <div className="stat-card stat-suspicious">
          <span className="stat-value">{summary.suspiciousCount || 0}</span>
          <span className="stat-label">Suspicious</span>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-value">{summary.rejectedCount || 0}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>
      <h2>Fraud by Reason</h2>
      {byReason?.length === 0 ? (
        <p>No fraud reasons recorded.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Reason</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {byReason?.map((r) => (
              <tr key={r._id}>
                <td>{r._id}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
