import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useQueries";
import { ColdStartLoader } from "./ui/cold-start-loader";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return <ColdStartLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
