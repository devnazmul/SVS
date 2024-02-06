import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useNav } from "../context/AuthContext";

export default function SidebarMenuItem({
  isNested,
  show,
  link,
  i,
  title,
  Icon,
  isLast = false,
}) {
  const { isNavOpen } = useNav();
  return (
    <Fragment key={i}>
      {show && (
        <div
          className={`flex items-center w-full ${
            isNavOpen
              ? `justify-start`
              : `${
                  isNested
                    ? "justify-start border-b border-base-300"
                    : " justify-center "
                }`
          } `}
        >
          <NavLink
            data-tip={title}
            key={i}
            to={link}
            className={({ isActive }) =>
              `tooltip tooltip-primary tooltip-right w-full transition-all duration-200 flex items-center gap-3 ${
                isNavOpen
                  ? `justify-start py-3 px-5`
                  : `${isNested ? "py-3" : "justify-center py-3"}`
              } ${
                isActive
                  ? `${
                      isNested
                        ? "text-primary bg-base-300"
                        : "text-primary bg-gradient-to-r from-primary-content to-transparent activeNavLink"
                    }`
                  : `${
                      isNested
                        ? "text-base-300 hover:text-primary hover:bg-base-100 font-normal border-b border-base-300"
                        : "text-accent font-normal"
                    }`
              }`
            }
          >
            {!isNested ? (
              <span className={`inline-block `}>
                <Icon className={`Icon text-2xl`} />
              </span>
            ) : (
              ""
            )}

            <span
              className={` text-sm duration-300 ${
                isNavOpen
                  ? `${isNested ? "block" : "block"}  `
                  : `${isNested ? "block pl-5  " : "hidden"}`
              }  border-base-100`}
            >
              {title}
            </span>
          </NavLink>
        </div>
      )}
    </Fragment>
  );
}
