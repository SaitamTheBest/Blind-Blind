import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getUserRole } from "./auth";

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const role = getUserRole();

  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}