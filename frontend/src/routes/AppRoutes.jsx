import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../features/auth/Signup";
import Login from "../features/auth/Login";
import VerifyOtp from "../features/auth/VerifyOtp";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/dashboard/DashboardLayout";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={ <PublicLayout><Home /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Signup /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/verify-otp" element={<PublicLayout><VerifyOtp /></PublicLayout>} />
      <Route path="/forgetpassword" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/resetpass" element={<PublicLayout><ResetPassword /></PublicLayout>} />


      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } /> 
    </Routes>
  );
}

