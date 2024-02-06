// =================================
// #00167
// =================================
import React from "react";

export default function CustomPerPageSelector({ setPerPage, perPage }) {
  return (
    <div className="px-2  rounded-xl flex flex-col justify-center md:justify-start items-start gap-2">
      {/* <label htmlFor="perPage">per page:</label> */}
      <select
        id="perPage"
        name="perPage"
        className="select shadow-xl input-sm w-20 h-5 bg-base-300 text-primary"
        onChange={(e) => setPerPage(e.target.value)}
        defaultValue={perPage ? perPage : 10}
      >
        <option value={1}>1</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
}
