import React from "react";
import moment from "moment";
import { getDaysInMonth, startOfMonth } from "date-fns";
import DayCalendar from "./DayCalendar";
import WeekCalendar from "./WeekCalendar";
import YearCalendar from "./YearCalendar";
import MonthCalendar from "./MonthCalendar";
import RenderCalendarForWeek from "./RenderCalendarForWeek";
import { formatRole } from "../utils/formatRole";

const CustomLeaveCalender = ({
  startDate = null, // DD-MM-YYYY
  endDate = null, // DD-MM-YYYY
  spacialDates = [], // [ { date:"DD-MM-YYYY",bgColorClassName:`tailwind css bg color className`, textColorClassName:`tailwind css text color className`, borderColorClassName:`tailwind css border color className`, CustomComponent:<ReactComponent/> } ]
  type, // Today / This Week / Last Week / This Month / Last Month / This Year / Last Year
  userId = null, // User Id
  handleClosePopup, // Handle Close Popup
  rowData,
}) => {
  console.log({ spacialDates });
  return (
    <div className="bg-base-300 p-5 rounded">
      {rowData ? (
        <h1
          className={`${
            type !== "Today" ? "text-center" : "text-xl"
          }  font-bold text-primary mb-2`}
        >
          Employee Name :{" "}
          {`${formatRole(rowData?.first_Name)} ${
            rowData?.middle_Name ? formatRole(rowData?.middle_Name) : ""
          } ${formatRole(rowData?.last_Name)}`}
        </h1>
      ) : (
        ""
      )}
      {type === "Today" ? (
        <DayCalendar
          startDate={startDate}
          endDate={endDate}
          spacialDates={spacialDates}
        />
      ) : (
        ""
      )}
      {type === "This Week" || type === "Last Week" ? (
        <WeekCalendar
          startDate={startDate}
          endDate={endDate}
          spacialDates={spacialDates}
        />
      ) : (
        ""
      )}
      {type === "This Month" || type === "Last Month" ? (
        <MonthCalendar
          startDate={startDate}
          endDate={endDate}
          spacialDates={spacialDates}
        />
      ) : (
        ""
      )}
      {type === "This Year" || type === "Last Year" ? (
        <YearCalendar
          startDate={startDate}
          endDate={endDate}
          spacialDates={spacialDates}
        />
      ) : (
        ""
      )}

      {/* CLOSE BUTTON  */}
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
        <button
          // disabled={isPendingSubmit}
          onClick={handleClosePopup}
          className="btn w-full md:btn-wide btn-primary"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomLeaveCalender;
