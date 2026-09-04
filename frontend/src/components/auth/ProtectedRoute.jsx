import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  // User login nahi hai
  if (!token) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location }}
      />
    );
  }

  // User authenticated hai
  return <Outlet />;
}

export default ProtectedRoute;