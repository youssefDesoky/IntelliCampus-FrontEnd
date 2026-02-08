import { Navigate, Outlet, useRouteLoaderData } from "react-router-dom";

export default function RoleGuard({ allow }) {
  const user = useRouteLoaderData("root");

  if (!allow.includes(user.role?.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
