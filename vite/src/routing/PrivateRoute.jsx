import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
const user  = JSON.parse(sessionStorage.getItem('user'))
  //console.log("useAuth", user?.role);

  // Check if user exists and role is either admin or staff
  if (user && (user.role === "admin" || user.role === "staff")) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
