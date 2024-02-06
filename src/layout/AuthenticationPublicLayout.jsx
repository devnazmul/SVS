// ===========================================
// #00103
// ===========================================

import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { PermissionProvider } from "../context/PermissionContext";

export default function AuthenticationPublicLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
