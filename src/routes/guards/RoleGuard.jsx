import { Navigate, Outlet, useRouteLoaderData } from "react-router-dom";

export default function RoleGuard({ allow }) {
  const user = useRouteLoaderData("root");
  const userRoles = (user.roles || []).map(r => r.toLowerCase());

  const hasAccess = userRoles.some(r => allow.includes(r));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
