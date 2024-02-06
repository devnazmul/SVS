import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchFieldSmall({ fieldClassName, handleChange }) {
  return (
    <div className="flex w-auto">
      <input
        onChange={handleChange}
        type={"type"}
        name={"search"}
        placeholder={`search here`}
        className={`bg-base-300 input h-10 border border-primary rounded-lg outline-none w-full md:w-[350px]  focus:outline-none input-bordered ${fieldClassName}`}
      />
    </div>
  );
}
