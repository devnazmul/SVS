import React from "react";

export default function PathLeft({ data }) {
  return (
    <div className="w-full px-2 md:px-5 py-2 ">
      <div>
        <h2 className="text-primary font-semibold">Joining Date:</h2>
        <p className="text-xs md:text-sm">{data?.employment_start_date}</p>
        <p className="text-xs md:text-sm">To</p>
        <p className="text-xs md:text-sm">
          {data?.employment_end_date ? data?.employment_end_date : "Present"}
        </p>
      </div>
    </div>
  );
}
