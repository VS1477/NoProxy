import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionReport, setAttendanceDecision } from '../../api/teacher';

export default function SessionReport() {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchReport = () => {
    getSessionReport(sessionId)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const handleDecision = async (logId, decision) => {
    setUpdating(logId);
    try {
      await setAttendanceDecision(logId, decision);
      fetchReport();
    } catch (err) {
      // refresh anyway
      fetchReport();
    } finally {
      setUpdating(null);
    }
  };

  const getEffectiveStatus = (log) => {
    if (log.teacherDecision === 'accepted') return 'Present';
    if (log.teacherDecision === 'ignored') return 'Rejected';
    return log.status;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Report not found</div>;

  const { session, logs } = data;

  return (
    <div className="page">
      <h1>Report: {session?.subject}</h1>
      <p>Start: {new Date(session?.startTime).toLocaleString()} | End: {new Date(session?.endTime).toLocaleString()}</p>
      {logs.length === 0 ? (
        <p>No attendance records.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Time</th>
              <th>Status</th>
              <th>Distance (m)</th>
              <th>Fraud Score</th>
              <th>Reasons</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const effectiveStatus = getEffectiveStatus(log);
              const hasDecision = !!log.teacherDecision;
              return (
                <tr key={log._id}>
                  <td>{log.studentId?.name}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`badge status-${effectiveStatus?.toLowerCase()}`}>
                      {effectiveStatus} {hasDecision && '(Teacher)'}
                    </span>
                  </td>
                  <td>{log.distanceFromClass?.toFixed(1)}</td>
                  <td>{log.fraudScore}</td>
                  <td>{log.fraudReasons?.join(', ') || '-'}</td>
                  <td>
                    {!hasDecision ? (
                      <span className="decision-btns">
                        <button
                          type="button"
                          className="btn btn-accept btn-sm"
                          onClick={() => handleDecision(log._id, 'accepted')}
                          disabled={updating === log._id}
                        >
                          {updating === log._id ? '...' : 'Accept'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ignore btn-sm"
                          onClick={() => handleDecision(log._id, 'ignored')}
                          disabled={updating === log._id}
                        >
                          Ignore
                        </button>
                      </span>
                    ) : (
                      <span className="decided">Decided</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
