import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./session";

export const ProtectedRoute = () => {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pc-page font-body text-[0.9375rem] text-pc-muted">
        Chargement…
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
