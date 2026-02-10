import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FaceRegister from './pages/student/FaceRegister';
import MarkAttendance from './pages/student/MarkAttendance';
import MyLogs from './pages/student/MyLogs';
import CreateSession from './pages/teacher/CreateSession';
import MySessions from './pages/teacher/MySessions';
import SessionReport from './pages/teacher/SessionReport';
import SuspiciousAttempts from './pages/teacher/SuspiciousAttempts';
import AllUsers from './pages/admin/AllUsers';
import SuspiciousLogs from './pages/admin/SuspiciousLogs';
import Analytics from './pages/admin/Analytics';
import FraudSummary from './pages/admin/FraudSummary';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      {/* Student routes */}
      <Route path="/student/face-register" element={
        <ProtectedRoute roles={['student']}>
          <Layout><FaceRegister /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/mark-attendance" element={
        <ProtectedRoute roles={['student']}>
          <Layout><MarkAttendance /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/logs" element={
        <ProtectedRoute roles={['student']}>
          <Layout><MyLogs /></Layout>
        </ProtectedRoute>
      } />
      {/* Teacher routes */}
      <Route path="/teacher/sessions/new" element={
        <ProtectedRoute roles={['teacher']}>
          <Layout><CreateSession /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/sessions" element={
        <ProtectedRoute roles={['teacher']}>
          <Layout><MySessions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/sessions/:sessionId/report" element={
        <ProtectedRoute roles={['teacher']}>
          <Layout><SessionReport /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/suspicious" element={
        <ProtectedRoute roles={['teacher']}>
          <Layout><SuspiciousAttempts /></Layout>
        </ProtectedRoute>
      } />
      {/* Admin routes */}
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AllUsers /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/suspicious" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><SuspiciousLogs /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><Analytics /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/fraud-summary" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><FraudSummary /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
