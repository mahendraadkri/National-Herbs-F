import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext"; // adjust path if needed

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in → render children
  return children;
}
