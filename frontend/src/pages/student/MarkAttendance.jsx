import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRef } from 'react';
import { markAttendance, getActiveSessions } from '../../api/student';
import { getFaceEmbedding } from '../../utils/faceApi';
import { getDeviceFingerprint } from '../../utils/deviceFingerprint';

export default function MarkAttendance() {
  const webcamRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    getActiveSessions().then((res) => setSessions(res.data)).catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError('Could not get location')
    );
  }, []);

  const handleMark = async () => {
    if (!selectedSession || !webcamRef.current) return;
    if (!location && !locationError) {
      setError('Waiting for location...');
      return;
    }
    if (locationError) {
      setError('Please enable location to mark attendance');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);
    try {
      const image = webcamRef.current.getScreenshot();
      if (!image) {
        setError('Could not capture image');
        return;
      }
      const img = new Image();
      img.src = image;
      await new Promise((r) => { img.onload = r; });

      const faceEmbedding = await getFaceEmbedding(img);
      const deviceId = getDeviceFingerprint();

      const res = await markAttendance({
        sessionId: selectedSession._id,
        location,
        faceEmbedding: faceEmbedding || [],
        deviceId
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Mark Attendance</h1>
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          className="webcam"
        />
      </div>
      {location && (
        <p className="location-info">Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
      )}
      {locationError && <p className="error-small">{locationError}</p>}
      <div className="form-group">
        <label>Select Session</label>
        <select
          value={selectedSession?._id || ''}
          onChange={(e) => setSelectedSession(sessions.find((s) => s._id === e.target.value) || null)}
        >
          <option value="">Choose session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>{s.subject}</option>
          ))}
        </select>
      </div>
      {result && (
        <div className={`result-card status-${result.status?.toLowerCase()}`}>
          <h3>Status: {result.status}</h3>
          <p>Fraud Score: {result.fraudScore}</p>
          {result.fraudReasons?.length > 0 && (
            <ul>
              {result.fraudReasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <button onClick={handleMark} disabled={loading || !selectedSession} className="btn btn-primary">
        {loading ? 'Marking...' : 'Mark Attendance'}
      </button>
    </div>
  );
}
