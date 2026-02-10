export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-branding">
          <div className="auth-title-wrap">
            <span className="auth-title-accent" />
            <h1 className="auth-title">NoProxy</h1>
          </div>
          <p className="auth-bio">Smart Attendance and Proxy Detection System</p>
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
