import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // ดึง token จาก localStorage

  return token ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoute;
