// ===========================================
// #00101
// ===========================================

import React, { createContext, useEffect, useState } from "react";
import { getUserByToken, logout } from "../apis/auth/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create the authentication context
export const NavContext = createContext();

// Create the authentication provider component
export const NavProvider = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  return (
    <NavContext.Provider
      value={{
        isNavOpen,
        setIsNavOpen,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const { isNavOpen, setIsNavOpen } = useContext(NavContext);
  const [isDark, setIsDark] = useState(false);
  return {
    isNavOpen,
    setIsNavOpen,
    isDark,
    setIsDark,
  };
};
