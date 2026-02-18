import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useQueries";
import { ColdStartLoader } from "./ui/cold-start-loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user, isLoading, isError } = useAuthUser();

  if (isLoading) {
    return <ColdStartLoader />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
