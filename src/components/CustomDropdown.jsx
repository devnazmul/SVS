import React, { useState } from "react";
import SidebarGenerator from "../utils/SidebarGenerator";

function CustomDropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="dropdown" onClick={closeDropdown}>
      <label tabIndex={0} className="btn m-1" onClick={toggleDropdown}>
        {label}
      </label>
      <div
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ${
          isOpen ? "" : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarGenerator links={label} isNested={true} />
      </div>
    </div>
  );
}

export default CustomDropdown;
