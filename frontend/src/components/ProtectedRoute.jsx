import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("ss_token");

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading...</div>;
  }

  // Agar Token aur User dono gayab hain, tab hi login par bhejo
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "doctor" && user.approvalStatus && user.approvalStatus !== "approved") {
    return <Navigate to="/login" replace />;
  }

  return children;
}