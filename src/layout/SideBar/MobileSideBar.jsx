// ===========================================
// #00102
// ===========================================
import { NavLink } from "react-router-dom";
import { useNav } from "../../context/AuthContext";
import SidebarGenerator from "../../utils/SidebarGenerator";
import { Menus } from "../../constant/menus";

export default function MobileSidebar() {
  const htmlMode = document.documentElement.getAttribute("data-theme");

  return (
    <div
      className={`z-50 absolute w-[80px] md:w-[90px] rounded-r-xl scrollbar h-full bg-base-300 shadow-xl text-base-100 flex-col md:hidden flex`}
    >
      <NavLink
        to={"/"}
        className="w-full flex justify-center items-center py-3"
      >
        {htmlMode === "default" ? (
          <img
            className={`w-[70%] h-auto hidden md:block`}
            src={`/assets/lightLogo.png`}
            alt=""
          />
        ) : (
          <img
            className={`w-[70%] h-auto hidden md:block`}
            src={`/assets/darkLogo.png`}
            alt=""
          />
        )}
      </NavLink>

      <div
        className={`navmenu flex flex-col gap-2 items-center md:items-start`}
      >
        <SidebarGenerator links={Menus} isNested={false} />
      </div>
    </div>
  );
}
