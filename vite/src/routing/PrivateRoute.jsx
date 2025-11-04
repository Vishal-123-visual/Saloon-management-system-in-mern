import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/context/auth-context";
import { toast } from "sonner";


const PrivateRoute = ({ children }) => {
const user  = JSON.parse(sessionStorage.getItem('user'))
const {isAdmin } = useAuth();
  console.log("useAuth", isAdmin);

  // Check if user exists and role is either admin or staff
  if (user && (user.role === "admin" || user.role === "staff")) {
    return children;
  }
else{
  toast.error('You are not authorized!')
}
  return <Navigate to="/" replace />;
};

export default PrivateRoute;
