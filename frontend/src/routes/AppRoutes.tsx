import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import Auth0CallbackPage from '../pages/Auth0CallbackPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/auth/callback" element={<Auth0CallbackPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
