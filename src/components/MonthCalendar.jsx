import moment from "moment";
import React, { useEffect, useState } from "react";
import RenderCalendar from "./RenderCalendar";

export default function MonthCalendar({
  startDate = "01-12-2023",
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
    <div>
      <h1 className="text-center font-semibold mb-2">
        {moment(startDate, "DD-MM-YYYY").format("DD-MM-YYYY")} To{" "}
        {moment(endDate, "DD-MM-YYYY").format("DD-MM-YYYY")}
      </h1>
      <div>
        {!isLoading
          ? months.map((month, index) => {
              return (
                <RenderCalendar
                  currentMonth={month}
                  spacialDates={spacialDates}
                  type="sm"
                />
              );
            })
          : ""}
      </div>
    </div>
  );
}
