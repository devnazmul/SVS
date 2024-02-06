import React, { Fragment, useEffect, useState } from "react";
import { AiFillAlert } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { FiPlus, FiSearch } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { OutsideClickHandler } from "../OutsideClickHandler";
import ButtonLoading from "../ButtonLoading";
import { MdOutlineChangeCircle } from "react-icons/md";
import { TfiExchangeVertical } from "react-icons/tfi";
import { iconArray } from "../../constant/icons";
export default function CustomMultiSelectIcon({
  options = iconArray, // required []
  defaultSelectedValues = [], // []
  showCheckbox = true,
  loading = false,
  inputStyleClass = "",
  optionStyleClass = "",
  optionContainerClass = "",
  emptyRecordMsg = "No option found!",
  onSelect = (e) => {
    return e;
  },
  onRemove = (e) => {
    return e;
  },
  onSearch = (e) => {
    return e;
  },
  singleSelect = false,
  caseSensitiveSearch = false,
  closeOnSelect = true,
  CustomCloseIcon = RxCrossCircled,
  CustomCheckIcon = TiTick,
  disable = false,
  required = false,
  addButtonLabel = "Select",
  AddButtonIcon = FiPlus,
  ChangeButtonIcon = TfiExchangeVertical,
  label,
  error,
  id,
  top = false,
  left = true,
  right = false,
  bottom = true,

  selectAllOption = false,
}) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [filteredOptions, setFilterdOptions] = useState([]);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [searchFieldValue, setSearchFieldValue] = useState("");

  const [isAllSelected, setIsAllSelected] = useState(
    options.length === selectedValues.length
  );

  useEffect(() => {
    setComponentLoading(true);
    if (!loading) {
      setComponentLoading(true);
      setSelectedValues(defaultSelectedValues);
      setFilterdOptions(options);
      setComponentLoading(false);
    }
  }, [loading]);

  const [isFirstTime, setIsFirstTime] = useState(true);
  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
    } else {
      onSelect(selectedValues);
      onRemove(selectedValues);
      closeOnSelect && setIsOptionOpen(false);
      setFilterdOptions(options);
      setSearchFieldValue("");
    }
    if (options.length > 0) {
      if (options.length === selectedValues.length) {
        setIsAllSelected(true);
      } else {
        setIsAllSelected(false);
      }
    } else {
      setIsAllSelected(false);
    }
  }, [selectedValues]);

  //  SEARCH
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchFieldValue(searchTerm);
    setFilterdOptions(
      options.filter(
        (option) =>
          option.label &&
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="w-full relative">
      {/* LABEL */}
      <div className="flex gap-5 items-center justify-between">
        <label htmlFor={id} className={`label`}>
          <span className="label-text  text-md font-bold">
            {label}{" "}
            {required && (
              <span className="text-error font-bold text-md">*</span>
            )}
          </span>
        </label>
        {selectAllOption ? (
          <div className="mt-2 flex items-center gap-2">
            <label role="button" htmlFor="">
              Select all
            </label>
            <input
              id=""
              name=""
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedValues(options);
                } else {
                  setSelectedValues([]);
                }
              }}
              checked={isAllSelected}
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary mr-2"
            />
          </div>
        ) : (
          ""
        )}
      </div>

      {/* FIELD  */}
      <div
        disabled={disable}
        style={{ display: "inline-block" }}
        className={`z-10 h-auto w-full input rounded-md bg-base-300  input-bordered focus:outline-none py-1 px-1 ${
          isOptionOpen ? "border-2 border-primary" : ""
        }`}
      >
        {/* SELECTED OPTIONS  */}
        {selectedValues.map((opt, index) => (
          <span
            key={index}
            className="bg-primary-content z-10 px-5 py-1 rounded-full my-1 mx-1 shadow-md inline-flex gap-2 items-center"
          >
            {opt?.Icon && <opt.Icon />} {opt?.label}{" "}
            {!disable && (
              <button
                onClick={() =>
                  setSelectedValues(
                    selectedValues.filter((s_opt) => s_opt?.id !== opt?.id)
                  )
                }
              >
                <CustomCloseIcon />
              </button>
            )}
          </span>
        ))}

        {/* ADD MORE BUTTON  */}
        {!disable && (
          <button
            onClick={() => {
              setIsOptionOpen(!isOptionOpen);
            }}
            className={`${
              selectedValues?.length === 0
                ? "w-full justify-start"
                : "justify-center"
            }  px-3 gap-1 py-1 my-1 inline-flex  items-center rounded-full text-gray-600 `}
          >
            {singleSelect && selectedValues?.length > 0 ? (
              <>
                <ChangeButtonIcon className="" /> <>Change</>
              </>
            ) : (
              <>
                {!singleSelect && <AddButtonIcon className="" />}{" "}
                <>{addButtonLabel}</>
              </>
            )}
          </button>
        )}
      </div>
      {/* OPTIONS  */}
      <OutsideClickHandler
        className={`absolute ${
          top ? "bottom-full -mb-7" : "top-full mt-2"
        } z-30 bg-base-300 duration-200 transition-all overflow-hidden  ${
          isOptionOpen ? "opacity-100 h-auto block" : "opacity-0 h-0 hidden"
        } pt-2 shadow-sm border border-primary rounded-xl w-full left-0`}
        onOutsideClick={() => {
          setIsOptionOpen(false);
        }}
      >
        <div className="flex px-5 pt-2 pb-4">
          <input
            type="text"
            value={searchFieldValue}
            disabled={options?.length === 0}
            onChange={handleSearch}
            className="w-full py-1 rounded-full bg-base-300  focus:outline-none border-primary-content pl-9 pr-2 border-2 "
          />
          <FiSearch className="text-primary absolute top-[25px] left-8" />
        </div>

        <hr className="border-primary-content" />

        <div className="overflow-y-auto px-5 py-2 overflow-x-hidden max-h-[200px] scrollbar scrollbar-thumb-primary-content scrollbar-track-gray-100">
          {componentLoading ? (
            <div className="flex justify-center items-center py-5">
              <ButtonLoading />
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <Fragment key={index}>
                <button
                  onClick={() => {
                    if (selectedValues.some((s_opt) => s_opt?.id === opt?.id)) {
                      // IF ALREADY SELECTED
                      setSelectedValues(
                        selectedValues.filter((s_opt) => s_opt?.id !== opt?.id)
                      );
                    } else {
                      // IF NOT SELECTED
                      if (singleSelect) {
                        setSelectedValues([opt]);
                      } else {
                        setSelectedValues([...selectedValues, opt]);
                      }
                    }
                  }}
                  className={`px-5 py-1 rounded-full  justify-between w-full flex gap-2 items-center   ${
                    showCheckbox &&
                    selectedValues.some((s_opt) => s_opt?.id === opt?.id)
                      ? "bg-primary text-base-300"
                      : "hover:bg-primary-content"
                  }`}
                >
                  <span className="inline-flex gap-2 items-center w-full">
                    {opt?.Icon && <opt.Icon />} {opt?.label}
                  </span>
                  {selectedValues.some((s_opt) => s_opt?.id === opt?.id) &&
                    showCheckbox && (
                      <CustomCheckIcon
                        className={`${
                          selectedValues.some((s_opt) => s_opt?.id === opt?.id)
                            ? "text-base-300"
                            : ""
                        }`}
                      />
                    )}
                </button>
                {index + 1 < filteredOptions.length ? <hr /> : ""}
              </Fragment>
            ))
          ) : (
            <div className="flex justify-center items-center py-5">
              <span>{emptyRecordMsg}</span>
            </div>
          )}
        </div>
      </OutsideClickHandler>

      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
