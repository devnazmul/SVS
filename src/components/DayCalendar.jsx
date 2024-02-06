import { getDaysInMonth, startOfMonth } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function DayCalendar({
  startDate = "20-12-2023",
  endDate = "20-12-2023",
  spacialDates = [],
}) {
  // Parse the date strings using Moment.js
  const parsedStartDate = moment(startDate, "DD-MM-YYYY");

  return (
    <div className="flex flex-col justify-center items-start">
      <h1 className={`text-center font-semibold text-xl mb-2`}>
        On {moment(spacialDates[0]?.date, "DD-MM-YYYY").format("LL")}
      </h1>

      <div>{spacialDates[0]?.CustomComponent}</div>
    </div>
  );
}
