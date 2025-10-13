import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/context/auth-context";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  //console.log("useAuth", user?.role);

  // Check if user exists and role is either admin or staff
  if (user && (user.role === "admin" || user.role === "staff")) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
