import moment from "moment";
import React from "react";

export default function PathLeft({ data }) {
  return (
    <div className="w-full px-2 md:px-5 py-2 ">
      <div>
        <h2 className="text-primary font-semibold">{data?.degree}</h2>
        <p className="text-xs md:text-sm">
          {moment(data?.start_date, "DD-MM-YYYY").format("MMM, YYYY")}
        </p>
        <p className="text-xs md:text-sm">To</p>
        <p className="text-xs md:text-sm">
          {data?.graduation_date
            ? moment(data?.graduation_date, "DD-MM-YYYY").format("MMM, YYYY")
            : "Present"}
        </p>
      </div>
    </div>
  );
}
