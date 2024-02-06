// ===========================================
// #00102
// ===========================================
import { NavLink } from "react-router-dom";
import { useAuth, useNav } from "../../context/AuthContext";

import SidebarGenerator from "../../utils/SidebarGenerator";
import { menus } from "../../constant/menus";
import { usePermission } from "../../context/PermissionContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { isNavOpen, isDark, setIsDark } = useNav();
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  const user = JSON.parse(localStorage.getItem("userData"));

  const [htmlMode, setHtmlMode] = useState("");
  useEffect(() => {
    setHtmlMode(document.documentElement.getAttribute("data-theme"));
  }, [isDark]);

  return (
    <div
      className={`absolute z-50 hidden md:block transition-all duration-300 ${
        isNavOpen ? "md:w-[220px]" : "md:w-[90px]"
      }   rounded-r-xl md:rounded-xl scrollbar h-full md:h-[95vh] bg-base-300 shadow-xl text-base-100 flex-col hidden md:flex`}
    >
      <div className={``}>
        <NavLink
          to={"/"}
          className={`justify-center w-full flex  items-center py-3 px-5 gap-2`}
        >
          {htmlMode === "default" ? (
            <img
              className={`w-[40px] h-auto hidden md:block duration-300`}
              src={`/assets/lightLogo.png`}
              alt=""
            />
          ) : (
            <img
              className={`w-[40px] h-auto hidden md:block duration-300`}
              src={`/assets/darkLogo.png`}
              alt=""
            />
          )}

          <span
            className={`text-primary hidden  duration-300 font-bold ${
              isNavOpen ? "text-md" : "text-[0px]"
            }`}
          >
            {user?.business_id ? user?.business?.name : "WebTec"}
          </span>
        </NavLink>
      </div>
      <div
        className={`nav_menu flex flex-col gap-2 items-center md:items-start`}
      >
        <SidebarGenerator
          links={menus({ permissions, userData: user })}
          isNested={false}
        />
      </div>
    </div>
  );
}
