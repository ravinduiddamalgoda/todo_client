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
        <Route path="" element={<h1>Landing Page</h1>} />
      </Routes>
    </GuestGuard>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="app/*" element={<ProtectedRoutes />} />
      <Route path="*" element={<GuestRoutes />} />
    </Routes>
  );
}

export default App;
