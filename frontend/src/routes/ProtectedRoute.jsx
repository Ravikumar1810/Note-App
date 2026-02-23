import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

export default function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
