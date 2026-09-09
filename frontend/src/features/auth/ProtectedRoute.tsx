import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./session";

export const ProtectedRoute = () => {
  const { user, loading } = useSession();

  if (loading) {
    return <p className="p-6 text-[0.875rem] text-[#525252]">Chargement...</p>;
  }

  if (user === null) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
