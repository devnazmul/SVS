import React, { createContext, useContext, useState } from "react";

export const PermissionContext = createContext();
export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
export const usePermission = () => {
  const { permissions, setPermissions } = useContext(PermissionContext);

  return {
    permissions,
    setPermissions,
  };
};
