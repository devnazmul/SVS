import React from "react";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isWithinInterval,
} from "date-fns";
import moment from "moment";

export default function RenderCalendarForWeek({
  startDateString,
  endDateString,
  spacialDates = [],
  type = "md",
}) {
  const startDate = moment(startDateString, "DD-MM-YYYY").toDate();
  const endDate = moment(endDateString, "DD-MM-YYYY").toDate();

  // Dynamically determine the weekStartsOn based on the day of the week of startDate
  const weekStartsOn = startDate.getDay(); // Sunday is 0, Monday is 1, and so on
  console.log({ day: weekStartsOn });
  const startOfRenderWeek = startOfWeek(startDate, { weekStartsOn });
  const endOfRenderWeek = endOfWeek(endDate, { weekStartsOn });
  const weekDays = [];

  let currentDay = startOfRenderWeek;

  while (currentDay <= endOfRenderWeek) {
    weekDays.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  let dayNames = [];
  if (weekStartsOn === 0) {
    dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }
  if (weekStartsOn === 1) {
    dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }
  if (weekStartsOn === 2) {
    dayNames = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
  }
  if (weekStartsOn === 3) {
    dayNames = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  }
  if (weekStartsOn === 4) {
    dayNames = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
  }
  if (weekStartsOn === 5) {
    dayNames = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];
  }
  if (weekStartsOn === 6) {
    dayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 w-full">
        {dayNames.map((dayName, index) => (
          <div
            key={`dayName-${index}`}
            className={`text-center py-2 font-semibold ${
              type === "xs" && "h-5 w-5 text-xs"
            } ${type === "sm" && "h-10 w-10 text-sm"} ${
              type === "md" && "h-20 w-20 text-md"
            } mb-2`}
          >
            {dayName}
          </div>
        ))}

        {weekDays.map(
          (day) =>
            isWithinInterval(day, { start: startDate, end: endDate }) && (
              <div
                key={day}
                className={`text-center ${
                  spacialDates.some(
                    (obj) =>
                      obj["date"] ===
                      moment(
                        new Date(
                          day.getFullYear(),
                          day.getMonth(),
                          day.getDate()
                        )
                      ).format("DD-MM-YYYY")
                  ) &&
                  `
                ${
                  spacialDates[
                    spacialDates.findIndex(
                      (obj) =>
                        obj["date"] ===
                        moment(
                          new Date(
                            day.getFullYear(),
                            day.getMonth(),
                            day.getDate()
                          )
                        ).format("DD-MM-YYYY")
                    )
                  ]?.bgColorClassName || "bg-primary-content"
                }

                ${
                  spacialDates[
                    spacialDates.findIndex(
                      (obj) =>
                        obj["date"] ===
                        moment(
                          new Date(
                            day.getFullYear(),
                            day.getMonth(),
                            day.getDate()
                          )
                        ).format("DD-MM-YYYY")
                    )
                  ]?.borderColorClassName || "border-primary"
                }
                 cursor-pointer`
                }
                  ${type === "xs" && "h-5 w-5 text-xs"} ${
                  type === "sm" && "h-10 w-10 text-sm"
                } ${
                  type === "md" && "h-20 w-20 text-md"
                } rounded-xl group flex relative justify-center cursor-default items-center  border-2 bg-base-300  bg-opacity-40`}
                onClick={() => handleDateClick(day)}
              >
                <div
                  className={`absolute bg-base-300 border hidden ${
                    spacialDates.some(
                      (obj) =>
                        obj["date"] ===
                        moment(
                          new Date(
                            day.getFullYear(),
                            day.getMonth(),
                            day.getDate()
                          )
                        ).format("DD-MM-YYYY")
                    ) && "group-hover:block"
                  }  w-[200px] shadow-md rounded-md z-50 px-3 py-2 bottom-[105%]`}
                >
                  <span
                    className={`${
                      spacialDates[
                        spacialDates.findIndex(
                          (obj) =>
                            obj["date"] ===
                            moment(
                              new Date(
                                day.getFullYear(),
                                day.getMonth(),
                                day.getDate()
                              )
                            ).format("DD-MM-YYYY")
                        )
                      ]?.textColorClassName || ""
                    } text-xl font-medium mb-2 block`}
                  >
                    {
                      spacialDates[
                        spacialDates.findIndex(
                          (obj) =>
                            obj["date"] ===
                            moment(
                              new Date(
                                day.getFullYear(),
                                day.getMonth(),
                                day.getDate()
                              )
                            ).format("DD-MM-YYYY")
                        )
                      ]?.date
                    }
                  </span>
                  <>
                    {
                      spacialDates[
                        spacialDates.findIndex(
                          (obj) =>
                            obj["date"] ===
                            moment(
                              new Date(
                                day.getFullYear(),
                                day.getMonth(),
                                day.getDate()
                              )
                            ).format("DD-MM-YYYY")
                        )
                      ]?.CustomComponent
                    }
                  </>
                </div>
                {day.getDate()}
              </div>
            )
        )}
      </div>
    </div>
  );
}
