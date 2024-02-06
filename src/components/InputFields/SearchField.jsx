import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchField({ fieldClassName, handleChange }) {
  return (
    <div className="flex w-auto">
      <span className="bg-primary rounded-l-xl w-12 text-base-100 flex justify-center items-center">
        <FiSearch className="text-xl" />
      </span>
      <input
        onChange={handleChange}
        type={"text"}
        name={"search"}
        autoComplete="off"
        placeholder={`search here`}
        className={`bg-base-100 input rounded-r-xl rounded-l-none outline-none w-full md:w-[300px] border-primary focus:outline-none input-bordered ${fieldClassName}`}
      />
    </div>
  );
}
