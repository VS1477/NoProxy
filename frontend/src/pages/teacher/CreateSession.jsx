import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../../api/teacher';

export default function CreateSession() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: '',
    startTime: '',
    endTime: '',
    lat: '',
    lng: '',
    radius: 100
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        }));
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(err.message || 'Could not get location');
        setLocationLoading(false);
      }
    );
  }, []);

  const handleFetchLocation = () => {
    setLocationError('');
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        }));
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(err.message || 'Could not get location');
        setLocationLoading(false);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'radius' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createSession({
        subject: form.subject,
        startTime: form.startTime,
        endTime: form.endTime,
        classroomLocation: { lat: Number(form.lat), lng: Number(form.lng) },
        radius: form.radius
      });
      navigate('/teacher/sessions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Create Attendance Session</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Subject</label>
          <input name="subject" value={form.subject} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Time</label>
            <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Latitude</label>
            <div className="input-with-btn">
              <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required placeholder={locationLoading ? 'Fetching...' : ''} />
              <button type="button" onClick={handleFetchLocation} disabled={locationLoading} className="btn btn-outline btn-sm">
                {locationLoading ? 'Getting...' : 'Use my location'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} required placeholder={locationLoading ? 'Fetching...' : ''} />
          </div>
        </div>
        {locationError && <p className="error-small">{locationError}</p>}
        <div className="form-group">
          <label>Radius (meters)</label>
          <input type="number" name="radius" value={form.radius} onChange={handleChange} min={1} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">Create Session</button>
      </form>
    </div>
  );
}
