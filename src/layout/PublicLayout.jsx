// ===========================================
// #00103
// ===========================================

import { Outlet } from "react-router-dom";
import { NavProvider } from "../context/NavContext";

export default function PublicLayout() {
  return (
    <NavProvider>
      {/* <PermissionProvider> */}
      <div className={`p-5`}>
        <Outlet />
      </div>
      {/* </PermissionProvider> */}
    </NavProvider>
  );
}
