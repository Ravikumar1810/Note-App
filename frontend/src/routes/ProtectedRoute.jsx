import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

export default function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    alert("You must be logged in to access this page.");

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
