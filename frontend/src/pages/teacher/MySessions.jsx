import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMySessions } from '../../api/teacher';

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySessions().then((res) => setSessions(res.data)).catch(() => setSessions([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1>My Sessions</h1>
      <Link to="/teacher/sessions/new" className="btn btn-primary">Create New Session</Link>
      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Start</th>
              <th>End</th>
              <th>Radius</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{s.subject}</td>
                <td>{new Date(s.startTime).toLocaleString()}</td>
                <td>{new Date(s.endTime).toLocaleString()}</td>
                <td>{s.radius}m</td>
                <td><Link to={`/teacher/sessions/${s._id}/report`}>View Report</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
