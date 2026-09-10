import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./session";

export const ProtectedRoute = () => {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="pc-app flex items-center justify-center text-[0.9375rem] text-pc-muted">
        Chargement…
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
