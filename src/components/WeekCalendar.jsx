import moment from "moment";
import React from "react";
import RenderCalendarForWeek from "./RenderCalendarForWeek";

export default function WeekCalendar({
  startDate = "20-12-2023",
  endDate = "27-12-2023",
  spacialDates = [],
}) {
  return (
    <div>
      <h1 className="text-center font-semibold mb-5">
        {moment(startDate, "DD-MM-YYYY").format("DD-MM-YYYY")} To{" "}
        {moment(endDate, "DD-MM-YYYY").format("DD-MM-YYYY")}
      </h1>
      <div>
        <RenderCalendarForWeek
          startDateString={startDate}
          endDateString={endDate}
          spacialDates={spacialDates}
          type="sm"
        />
      </div>
    </div>
  );
}
