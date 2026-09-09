import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = !!accessToken;
  const userRole = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole ?? "")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
