// ===========================================
// #00104
// ===========================================

import { AuthProvider } from "../context/AuthContext";
import { PermissionProvider } from "../context/PermissionContext";
import DashboardLayout from "./DashboardLayout";

export default function ManagerLayout() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <DashboardLayout />
      </PermissionProvider>
    </AuthProvider>
  );
}
