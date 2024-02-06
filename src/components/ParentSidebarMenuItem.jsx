import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarGenerator from "../utils/SidebarGenerator";
import { FragmentOutsideClickHandler } from "./FragmentOutsideClickHandler";
import { useNav } from "../context/AuthContext";
export default function ParentSidebarMenuItem({
  total,
  show,
  link,
  i,
  title,
  Icon,
  childrens,
  isNested,
  isScrollable,
}) {
  const { isNavOpen, setIsNavOpen } = useNav();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navDropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      navDropdownRef.current &&
      !navDropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isFirstime, setIsFirstTime] = useState(true);
  useEffect(() => {
    if (isFirstime) {
      setIsFirstTime(false);
    } else {
      // setTimeout(() => {
      //   if (navDropdownRef.current) {
      //     navDropdownRef.current.removeAttribute("open");
      //     setIsNavOpen(false);
      //   }
      // }, 10);
    }
  }, [location.pathname]);
  return (
    <FragmentOutsideClickHandler
      className={`w-full block `}
      onOutsideClick={() => {
        navDropdownRef.current.removeAttribute("open");
        setIsOpen(false);
      }}
      key={i}
    >
      {show && (
        <details
          ref={navDropdownRef}
          className={`dropdown dropdown-right ${
            total <= i + 2 ? "dropdown-top" : "dropdown-bottom"
          } w-full dropdown-open ${
            location.pathname.split("/")[1] === link.split("/")[1]
              ? "text-primary bg-gradient-to-r from-primary-content to-transparent"
              : "text-accent"
          }`}
        >
          <summary tabIndex={i} className=" cursor-pointer text-transparent">
            <div
              data-tip={title}
              className={`${
                location.pathname.split("/")[1] === link.split("/")[1]
                  ? "text-primary"
                  : "text-accent"
              } tooltip tooltip-primary tooltip-right py-3 w-full transition-all font-normal duration-150 flex ${
                isNavOpen ? "justify-start px-5" : "justify-center"
              }  items-center gap-4`}
            >
              <span className={`inline-block -mt-5`}>
                <Icon className={`Icon text-2xl`} />
              </span>

              <span
                className={`text-sm duration-300 ${
                  isNavOpen ? `hidden md:block` : `hidden`
                }  duration-150  border-base-100 -mt-5`}
              >
                {title}
              </span>
            </div>
          </summary>

          <ul
            tabIndex={i}
            className={`scrollbar rounded-r-md shadow-md overflow-x-hidden ${
              total <= i + 2 ? "mb-[-2.5rem]" : "-mt-10"
            }  dropdown-content z-[1] bg-primary w-52 ${
              isScrollable ? "max-h-[160px]" : ""
            } `}
          >
            <SidebarGenerator links={childrens} isNested={true} />
          </ul>
        </details>
      )}
    </FragmentOutsideClickHandler>
  );
}
