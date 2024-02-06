import React, { useState, useRef, useEffect, Fragment } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { usePermission } from "../context/PermissionContext";
import { checkPermissions } from "../utils/checkPermissions";
const CustomDropDownForTable = ({
  fullData,
  index,
  isDataLoading,
  isShareDataLoading,
  data,
  actions,
  disabled,
  name,
  isDeleteDisabled = false,
}) => {
  const permissions = localStorage.getItem("permissions");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left mt-2`} ref={dropdownRef}>
      <button
        disabled={disabled}
        onClick={toggleDropdown}
        className="text-primary"
      >
        {isOpen ? (
          <RxCross2 className="text-xl text-error" />
        ) : (
          <FiMoreVertical className="text-xl" />
        )}
      </button>

      {isOpen && (
        <div
          className={`${
            fullData.length - 1 < index
              ? "origin-bottom-right"
              : "origin-top-right"
          } py-2 px-2 z-20 ${
            fullData.length - 3 < index || (fullData.length < 2 && "bottom-10")
          } absolute right-0 mt-2 w-48 rounded-xl shadow-lg shadow-primary-content border border-primary text-primary bg-base-300 ring-opacity-5 focus:outline-none`}
        >
          {/* Dropdown content goes here */}
          <ul className="overflow-hidden">
            {actions.map((action, i) => (
              <Fragment key={i}>
                {checkPermissions(action?.permissions, permissions) &&
                  !(action.name === "delete" && isDeleteDisabled) && (
                    <li
                      onClick={() => action.handler(data?.id)}
                      className={`hover:bg-primary hover:text-base-300 rounded-md cursor-pointer opacity-100 h-5 px-2 py-4 flex items-center`}
                    >
                      <button
                        disabled={isDeleteDisabled && action.name === "delete"}
                        className={`w-full h-full flex gap-3 items-center `}
                      >
                        <action.Icon className={`text-lg`} />
                        {action.name}
                      </button>
                    </li>
                  )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropDownForTable;
