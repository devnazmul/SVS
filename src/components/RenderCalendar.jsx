import { getDaysInMonth, startOfMonth } from "date-fns";
import moment from "moment";
import React from "react";

export default function RenderCalendar({
  currentMonth,
  spacialDates = [],
  type = "xs",
}) {
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  return (
    <div className="w-full">
      <h1 className="text-center font-semibold text-sm w-full mb-2">
        {moment(currentMonth).format("MMMM YYYY")}
      </h1>

      <div className="grid grid-cols-7 gap-1 w-full">
        {weekDays.map((weekDay) => (
          <div
            key={weekDay}
            className={`text-center py-2 font-semibold   ${
              type === "xs" && "h-5 w-5 text-xs"
            } ${type === "sm" && "h-10 w-10 text-sm"} ${
              type === "md" && "h-20 w-20 text-md"
            }
             mb-2`}
          >
            {weekDay}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="py-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
          (day) => (
            <div
              key={day}
              className={`text-center ${
                spacialDates.some(
                  (obj) =>
                    obj["date"] ===
                    moment(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
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
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day
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
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day
                          )
                        ).format("DD-MM-YYYY")
                    )
                  ]?.borderColorClassName || "border-primary"
                }
                 cursor-pointer`
              }  ${type === "xs" && "h-5 w-5 text-xs"} ${
                type === "sm" && "h-10 w-10 text-sm"
              } ${
                type === "md" && "h-20 w-20 text-md"
              } rounded-xl group flex relative justify-center cursor-default items-center  border-2 bg-base-300  bg-opacity-40`}
              onClick={() =>
                handleDateClick(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  )
                )
              }
            >
              <div
                className={`absolute bg-base-300 border hidden ${
                  spacialDates.some(
                    (obj) =>
                      obj["date"] ===
                      moment(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                      ).format("DD-MM-YYYY")
                  ) && "group-hover:block"
                }  w-[200px] shadow-md rounded-md z-50 px-3 py-2 bottom-[105%]`}
              >
                <span
                  className={`text-xl font-medium mb-2 block ${
                    spacialDates[
                      spacialDates.findIndex(
                        (obj) =>
                          obj["date"] ===
                          moment(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            )
                          ).format("DD-MM-YYYY")
                      )
                    ]?.textColorClassName || ""
                  }`}
                >
                  {
                    spacialDates[
                      spacialDates.findIndex(
                        (obj) =>
                          obj["date"] ===
                          moment(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
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
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            )
                          ).format("DD-MM-YYYY")
                      )
                    ]?.CustomComponent
                  }
                </>
              </div>
              {day}
            </div>
          )
        )}
      </div>
    </div>
  );
}
