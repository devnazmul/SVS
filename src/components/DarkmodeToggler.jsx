import React, { useEffect, useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useAuth, useNav } from "../context/AuthContext";

export default function DarkmodeToggler() {
  const { isDark, setIsDark } = useNav();
  const { user } = useAuth();
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      `${
        isDark
          ? `${user?.color_theme_name}Dark`
          : `${user?.color_theme_name ? user?.color_theme_name : "default"}`
      }`
    );
  }, [user, isDark]);

  const handleToggle = () => {
    setIsDark(!isDark);
  };
  return (
    <button
      className="w-11 h-10 rounded-xl bg-base-100 btn p-0"
      onClick={handleToggle}
    >
      {!isDark ? (
        <BsFillSunFill className="text-primary text-2xl " />
      ) : (
        <BsFillMoonFill className="text-primary text-2xl " />
      )}
      <input className="hidden" type="checkbox" />
    </button>
  );
}
