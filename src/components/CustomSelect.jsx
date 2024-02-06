// ===========================================
// #00133
// ===========================================

import React, { Fragment, useEffect, useRef, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiSquareRemove } from "react-icons/ci";
import { truncateString } from "../utils/trancate";
import ButtonLoading from "./ButtonLoading";
const CustomSelect = ({
  isOpenItemsList = false,
  disabled = false,
  isIcon = false,
  isMulti = false,
  isAddNewItemActive = false,
  isExpandForm = false,
  handleAddNewItemActive,
  options,
  setOptions,
  selectedOptions,
  setSelectedOptions,
  searchTerm = "",
  setSearchTerm,
  placeholder,
  className,
  classForField,
  classForItems,
  itemFontSize,
  isLoading = false,
}) => {
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleOptionClick = (option) => {
    if (isMulti) {
      if (selectedOptions.includes(option)) {
        setSearchTerm("");
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      } else {
        setSearchTerm("");
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      setSelectedOptions([option]);
      setSearchTerm("");
    }
  };
  const filteredOptions = options.filter(
    (option) =>
      option.label &&
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isFocused, setIsFocused] = useState(isOpenItemsList);
  const elementRef = useRef(null);
  const dropdownRef = useRef(null);
  const inpRef = useRef(null);
  const [padding, setPadding] = useState(5);

  const [elementWidth, setElementWidth] = useState(null);
  const [currentWith, setCurrentWith] = useState(null);

  useEffect(() => {
    const updatePadding = () => {
      if (elementRef.current) {
        const width = elementRef.current.offsetWidth;

        console.log({ object: selectedOptions.length });
        setPadding(
          selectedOptions.length > 1 ? selectedOptions.length * 25 + 30 : 40
        );
      }
    };

    updatePadding();
  }, [
    // options,
    // isFocused,
    //  searchTerm,
    selectedOptions,
    // elementWidth
  ]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (elementRef.current) {
        setElementWidth(elementRef.current.offsetWidth);
      }
    };
    // Initial width update
    updateWidth();
    // Attach event listener to window resize
    window.addEventListener("resize", updateWidth);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`${className ? className : "w-full"} relative`}
    >
      <div
        onClick={() => {
          if (!isMulti && !disabled) {
            setSelectedOptions([]);
            setIsFocused(true);
          }
        }}
        className={`w-full overflow-hidden ${
          disabled ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <input
          onFocus={() => {
            !disabled && setIsFocused(true);
          }}
          ref={inpRef}
          type="text"
          style={{
            paddingTop: !isMulti ? 2 : selectedOptions.length > 0 ? padding : 2,
            paddingBottom: isMulti ? (selectedOptions.length > 0 ? 20 : 0) : 0,
            minHeight: "40px",
          }}
          className={`${classForField} ${
            !disabled
              ? " border-base-100 ext-primary shadow-md cursor-pointer"
              : "border-gray-100 text-primary"
          }  transition-all duration-200 text-base-100 placeholder:text-base-400 bg-transparent border-2 outline-none rounded-md py-2 px-2 w-full`}
          placeholder={
            !isMulti && selectedOptions.length > 0 ? "" : placeholder
          }
          value={searchTerm}
          onChange={handleSearch}
        />

        {selectedOptions.length > 0 && (
          <div
            ref={elementRef}
            className={`absolute items-center ${
              !isMulti ? "top-1/2 ml-1 " : "top-1/3"
            } -translate-y-1/2 px-2 ${
              !isMulti ? "flex" : "block"
            } gap-1 overflow-x-auto w-[95%] h-auto scrollbarX`}
          >
            {selectedOptions.map((option, i) => (
              <div key={i}>
                {isIcon ? (
                  <div
                    key={option.id}
                    className={`${itemFontSize} single-line-div bg-base-100 border border-primary text-primary text-xs px-1 py-0.5 rounded-md items-center  gap-2 ${classForItems}`}
                  >
                    <i className={`fa ${option.label}`} aria-hidden="true"></i>{" "}
                    {option.label
                      .split("-")
                      .filter((w) => w !== "fa")
                      .join(" ")}
                    {isMulti && (
                      <CiSquareRemove
                        onClick={() => {
                          setSelectedOptions(
                            selectedOptions.filter(
                              (so) => so?.id !== option?.id
                            )
                          );
                        }}
                        className={`cursor-pointer text-primary hover:text-error`}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    key={option.id}
                    className="bg-base-100 w-auto single-line-div border border-primary text-primary text-xs px-1 py-0.5  rounded-md justify-between flex items-center gap-1"
                  >
                    <span className="hidden xs:hidden md:block">
                      {/* {option.label && truncateString(option.label, 20)} */}
                      {option.label}
                    </span>
                    <span className="hidden xs:block sm:block  md:hidden">
                      {option.label && truncateString(option.label, 45)}
                      {/* {option.label} */}
                    </span>

                    <span className="block xs:hidden sm:hidden md:hidden">
                      {option.label && truncateString(option.label, 30)}
                      {/* {option.label} */}
                    </span>
                    {isMulti && (
                      <CiSquareRemove
                        onClick={() =>
                          setSelectedOptions(
                            selectedOptions.filter(
                              (so) => so?.id !== option?.id
                            )
                          )
                        }
                        className={`cursor-pointer text-primary hover:text-error`}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DROPDOWN  */}
      <div
        className={`${
          isFocused ? "block" : "hidden"
        } absolute w-full bg-primary mt-2 border-2 border-gray-400 overflow-hidden shadow-lg rounded-md  max-h-80 z-10`}
      >
        <ul className={`max-h-80 scrollbar overflow-y-auto bg-primary`}>
          {!isExpandForm && (
            <>
              {isLoading ? (
                <li
                  className={`px-4 hover:bg-info hover:bg-opacity-50 py-2 border-b text-center text-error`}
                >
                  <ButtonLoading />
                </li>
              ) : (
                <>
                  {filteredOptions.length > 0 ? (
                    <>
                      {filteredOptions.map((option, i) => (
                        <Fragment key={i}>
                          {isIcon ? (
                            <li
                              key={option.id}
                              className={`px-4 items-center hover:bg-info hover:bg-opacity-50 flex gap-5 py-2 cursor-pointer border-b text-left ${
                                selectedOptions.includes(option)
                                  ? "bg-base-100 text-primary font-medium"
                                  : "text-neutral"
                              }`}
                              onClick={() => {
                                handleOptionClick(option);
                                setIsFocused(false);
                                setSearchTerm("");
                              }}
                            >
                              <i
                                className={`fa ${option.label}`}
                                aria-hidden="true"
                              ></i>{" "}
                              {option.label
                                .split("-")
                                .filter((w) => w !== "fa")
                                .join(" ")}
                            </li>
                          ) : (
                            <li
                              key={option.id}
                              className={`px-4 hover:bg-info hover:bg-opacity-50 py-2 cursor-pointer border-b text-left ${
                                selectedOptions.includes(option)
                                  ? "bg-base-100 text-primary font-medium"
                                  : "text-neutral"
                              }`}
                              onClick={() => {
                                handleOptionClick(option);
                                setIsFocused(false);
                                setSearchTerm("");
                              }}
                            >
                              {option.label}
                            </li>
                          )}
                        </Fragment>
                      ))}
                    </>
                  ) : (
                    <li className={`px-4 py-2 border-b text-center text-error`}>
                      No Item found !
                    </li>
                  )}
                </>
              )}
            </>
          )}
        </ul>

        {!isExpandForm && isAddNewItemActive && (
          <>
            <li className="w-full text-center flex justify-center items-center hover:bg-blue-100">
              <button
                className="w-full py-1 flex gap-2 justify-center items-center font-semibold"
                onClick={handleAddNewItemActive}
              >
                <AiOutlinePlusCircle className="text-xl" /> Add new
              </button>
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
