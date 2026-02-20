export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-branding">
          <div className="auth-title-wrap">
            <span className="auth-title-accent" />
            <h1 className="auth-title">Smart Attendance</h1>
          </div>
          <p className="auth-bio">Secure attendance with live face matching, location validation, and fraud detection built for classrooms.</p>
          <div className="auth-features">
            <span className="auth-feature">Face Recognition</span>
            <span className="auth-feature">Geolocation</span>
            <span className="auth-feature">Device ID</span>
          </div>
        </div>
        <div className="auth-form-area">
          {children}
        </div>
      </div>
    </div>
  );
}
