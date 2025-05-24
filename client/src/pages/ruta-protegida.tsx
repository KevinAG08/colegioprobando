import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "@/pages/layout";

interface RutaProtegidaProps {
  allowedRol?: UserRole;
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ allowedRol }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if ("rol" in user) {
    if (allowedRol && user.rol !== allowedRol) {
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default RutaProtegida;
