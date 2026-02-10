import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { registerFace } from '../../api/student';
import { getFaceEmbedding } from '../../utils/faceApi';

export default function FaceRegister() {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    if (!webcamRef.current) return;
    setError('');
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

      const embedding = await getFaceEmbedding(img);
      if (!embedding) {
        setError('No face detected. Please ensure your face is visible.');
        return;
      }

      await registerFace(embedding);
      setStatus('Face registered successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg || 'Failed to register face. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Register Face</h1>
      <p>Position your face in the camera and click Register.</p>
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          className="webcam"
        />
      </div>
      {status && <div className="success">{status}</div>}
      {error && <div className="error">{error}</div>}
      <button onClick={handleCapture} disabled={loading} className="btn btn-primary">
        {loading ? 'Registering...' : 'Register Face'}
      </button>
    </div>
  );
}
