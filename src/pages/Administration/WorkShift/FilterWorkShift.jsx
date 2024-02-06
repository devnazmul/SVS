import React from "react";
import { FiX } from "react-icons/fi";
import Headings from "../../../components/Headings/Headings";

export default function FilterWorkShift({
  isOpen,
  toggleHandler,
  filters,
  setFilters,
}) {
  return (
    <div
      className={`h-full transition-all overflow-hidden duration-100 ease-linear bg-base-300 shadow-2xl rounded-xl shadow-primary-content absolute top-0 ${
        isOpen ? "-right-0 w-[300px]  pt-20 px-5" : "-right-0 w-0  pt-0 px-0"
      } z-10 `}
    >
      <button
        onClick={toggleHandler}
        className="absolute top-3 left-3 w-9 h-9 rounded-full bg-primary-content flex justify-center items-center"
      >
        <FiX className="text-primary text-xl" />
      </button>

      <div className="flex justify-between items-end">
        <Headings level={2}>Filters</Headings>{" "}
        <span
          onClick={() => {
            setFilters({
              start_date: "",
              end_date: "",
              country_code: "",
              address: "",
              city: "",
              start_lat: "",
              end_lat: "",
              start_long: "",
              end_long: "",
              order_by: "",
            });
          }}
          className="text-primary underline cursor-pointer"
        >
          Reset All
        </span>
      </div>
    </div>
  );
}
