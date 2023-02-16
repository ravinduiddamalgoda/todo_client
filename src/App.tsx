import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthGuard, GuestGuard } from './components/authGuard';
import { LoginPage } from './screens/LoginScreen';
import { ProfilePage } from './screens/ProfileScreen';
import { RegisterPage } from './screens/RegisterScreen';

function ProtectedRoutes() {
  return (
    <AuthGuard>
      <Routes>
        <Route path="" element={<ProfilePage />} />
      </Routes>
    </AuthGuard>
  );
}

function GuestRoutes() {
  return (
    <GuestGuard>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </GuestGuard>
  );
}

function App() {
  

  return (
    <Routes>
      <Route path="app/*" element={<ProtectedRoutes />} />
      <Route path="*" element={<GuestRoutes />} />
    </Routes>
  );
}

export default App;
