// ===========================================
// #00101
// ===========================================

import React, { createContext, useEffect, useState } from "react";
import { getUserByToken, logout } from "../apis/auth/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create the authentication context
export const AuthContext = createContext();

// Create the authentication provider component
export const AuthProvider = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();
  // State to store the token validity
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isRouteChange, setIsRouteChange] = useState(Math.random());

  const setLogout = () => {
    logout()
      .then((res) => {
        navigate("/auth/login");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("permissions");
        localStorage.removeItem("intendedPath");
        setIsAuthenticated(false);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  useEffect(() => {
    if (location.pathname.split("/")[1] !== "auth") {
      const verifyUser = async () => {
        await getUserByToken()
          .then((res) => {
            setIsAuthenticated(true);
            localStorage.setItem("userData", JSON.stringify(res));
            localStorage.setItem("token", res?.token);
          })
          .catch((error) => {
            navigate("/auth/login");
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.removeItem("permissions");
            localStorage.removeItem("intendedPath");
            setIsAuthenticated(false);
          });
      };

      if (token) {
        verifyUser();
      } else {
        navigate("/auth/login");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("permissions");
        localStorage.removeItem("intendedPath");
        setIsAuthenticated(false);
      }
    }
  }, [isRouteChange, token]);

  const user = JSON.parse(localStorage.getItem("userData"));
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setLogout,
        setIsAuthenticated,
        setIsRouteChange,

        isNavOpen,
        setIsNavOpen,

        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { setLogout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return {
    setLogout,
    user,
    isOpen,
    setIsOpen,
  };
};
export const useNav = () => {
  const { isNavOpen, setIsNavOpen } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false);
  return {
    isNavOpen,
    setIsNavOpen,
    isDark,
    setIsDark,
  };
};
