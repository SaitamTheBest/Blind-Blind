import type { ReactNode } from "react";
import { getUserRole } from "./auth";
import Error404 from "../components/errors/Error404";

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const role = getUserRole();

  if (role !== "Admin") {
    return <Error404 />;
  }

  return <>{children}</>;
}