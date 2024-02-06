import React, { useState } from "react";
import { OutsideClickHandler } from "../OutsideClickHandler";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ActinDropdownButton({
  options,
  buttonText = "Actions",
  buttonColorClaass = `bg-primary`,
  buttonClass,
}) {
  const [open, setOpen] = useState(false);
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setOpen(false);
      }}
      className="relative"
    >
      <button
        // data-tip={buttonText}
        className={`tooltip tooltip-left tooltip-primary px-5 py-2 rounded-xl text-base-300 flex items-center gap-2 justify-between ${buttonClass} ${buttonColorClaass}`}
        onClick={() => setOpen(!open)}
      >
        {buttonText}{" "}
        {open ? (
          <IoIosArrowUp className="text-lg" />
        ) : (
          <IoIosArrowDown className="text-lg" />
        )}
      </button>
      {open && (
        <div
          style={{
            zIndex: 999,
          }}
          className="absolute top-full right-0 mt-1 w-[200px]  bg-base-300 flex flex-col  shadow-md rounded-xl overflow-hidden "
        >
          {options.map((opt, index) => (
            <button
              data-tip={opt?.title}
              className="tooltip tooltip-left tooltip-primary inline-block hover:bg-primary-content px-5 py-2 w-full text-left"
              onClick={opt?.handler}
            >
              {opt?.title}
            </button>
          ))}
        </div>
      )}
    </OutsideClickHandler>
  );
}
