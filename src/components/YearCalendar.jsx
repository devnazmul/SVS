import moment from "moment";
import React, { useEffect, useState } from "react";
import RenderCalendar from "./RenderCalendar";

export default function YearCalendar({
  startDate = "01-01-2022",
  endDate = "31-12-2023",
  spacialDates = [],
}) {
  // Parse the date strings using Moment.js
  const parsedStartDate = moment(startDate, "DD-MM-YYYY");
  const parsedEndDate = moment(endDate, "DD-MM-YYYY");
  const [months, setMonths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the list of months between the two dates
  let currentDate = parsedStartDate.clone();

  useEffect(() => {
    const monthss = [];
    setIsLoading(true);
    while (currentDate.isSameOrBefore(parsedEndDate)) {
      monthss.push(new Date(currentDate));
      setMonths(monthss);
      currentDate.add(1, "month");
    }
    setIsLoading(false);
  }, [startDate]);

  return (
    <div className="w-full p-5">
      <h1 className="text-center font-semibold mb-10">
        {moment(startDate, "DD-MM-YYYY").format("DD-MM-YYYY")} To{" "}
        {moment(endDate, "DD-MM-YYYY").format("DD-MM-YYYY")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-10">
        {!isLoading
          ? months.map((month, index) => {
              return (
                <RenderCalendar
                  key={index}
                  currentMonth={month}
                  spacialDates={spacialDates}
                />
              );
            })
          : ""}
      </div>
    </div>
  );
}
