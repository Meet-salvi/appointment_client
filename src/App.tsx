import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Unauthorized from './pages/Unauthorized';
import Preloader from './components/Preloader';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Preloader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'PATIENT' ? '/patient' : '/doctor'} />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Patient Routes */}
        <Route
          path="/patient/*"
          element={user?.role === 'PATIENT' ? <PatientDashboard /> : <Navigate to="/login" />}
        />

        {/* Protected Doctor Routes */}
        <Route
          path="/doctor/*"
          element={user?.role === 'DOCTOR' ? <DoctorDashboard /> : <Navigate to="/login" />}
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
