import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getDaysInMonth,
  startOfMonth,
  format as formatDate,
  addMonths,
  subMonths,
} from "date-fns";
import { OutsideClickHandler } from "../OutsideClickHandler";

const CustomDatePicker = ({
  format = "dd-LL-yyyy",
  defaultDate,
  fieldClassName,
  id,
  label = "label",
  required = false,
  name,
  value,
  placeholder,
  onChange = (e) => {
    return e;
  },
  error,
  defaultValue,
  wrapperClassName,
}) => {
  const [selectedDate, setSelectedDate] = useState({
    start: new Date(),
    end: new Date(),
  });
  var currentDate = new Date();
  const [currentMonths, setCurrentMonths] = useState({
    one: new Date(),
    two: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
  });
  const [isDatePickerActive, setDatePickerActive] = useState(false);

  useEffect(() => {
    if (selectedDate?.start && selectedDate?.end) {
      onChange({
        start: formatDate(selectedDate?.start, format),
        end: formatDate(selectedDate?.end, format),
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate({
      start: defaultDate?.start || new Date(),
      end: defaultDate?.end || new Date(),
    });
  }, [defaultDate]);
  function isFirstDateAfterSecondDate(date1, date2) {
    console.log(date1 > date2);
    return date1 > date2;
  }
  const handleDateClick = (day) => {
    if (!selectedDate?.start && !selectedDate?.end) {
      setSelectedDate({ start: day, end: "" });
    } else {
      if (selectedDate?.start && !selectedDate?.end) {
        if (isFirstDateAfterSecondDate(day, selectedDate?.start)) {
          setSelectedDate({ ...selectedDate, end: day });
        } else {
          setSelectedDate({ start: day, end: "" });
        }
      } else if (!selectedDate?.start && selectedDate?.end) {
        setSelectedDate({ ...selectedDate, start: day });
      } else {
        setSelectedDate({ start: "", end: "" });
      }
    }
  };

  const handleMonthChange = (newMonth) => {
    setCurrentMonths(newMonth);
  };

  const handleInputClick = () => {
    setDatePickerActive(!isDatePickerActive);
  };

  const renderCalendar = (month) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDayOfMonth = startOfMonth(month);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function isDateBetween(startDate, endDate, checkDate) {
      return startDate <= checkDate && checkDate <= endDate;
    }
    return (
      <>
        <div className="grid grid-cols-7 text-xs ">
          {weekDays.map((weekDay) => (
            <div key={weekDay} className="text-center py-2 font-bold">
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
                className={`text-center h-7 w-7 rounded-full hover:bg-primary-content flex justify-center items-center cursor-pointer border border-base-300 ${
                  selectedDate?.start &&
                  selectedDate.start.getDate() === day &&
                  selectedDate.start.getMonth() === month.getMonth()
                    ? "bg-primary text-white hover:text-black rounded-l-full"
                    : ""
                } ${
                  selectedDate?.end &&
                  selectedDate.end.getDate() === day &&
                  selectedDate.end.getMonth() === month.getMonth()
                    ? "bg-primary text-white  hover:text-black rounded-r-full"
                    : ""
                } ${
                  isDateBetween(
                    selectedDate.start,
                    selectedDate.end,
                    new Date(month.getFullYear(), month.getMonth(), day)
                  ) && "bg-primary text-white  hover:text-black rounded-none"
                }`}
                onClick={() =>
                  handleDateClick(
                    new Date(month.getFullYear(), month.getMonth(), day)
                  )
                }
              >
                {day}
              </div>
            )
          )}
        </div>
      </>
    );
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => setDatePickerActive(false)}
      className={`relative ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text text-md font-bold">
            {label}{" "}
            {required && (
              <span className="text-error font-bold text-md">*</span>
            )}
          </span>
        </label>
      )}
      {/* FIELD  */}
      <input
        id={id}
        type={"text"}
        name={name}
        defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`input rounded-md input-bordered w-full ${fieldClassName}`}
        value={
          selectedDate.start && selectedDate.end
            ? `${formatDate(selectedDate?.start, format)} - ${formatDate(
                selectedDate?.end,
                format
              )}`
            : selectedDate.start
            ? `${formatDate(selectedDate?.start, format)}- `
            : ""
        }
        onClick={handleInputClick}
        readOnly
      />
      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}

      {isDatePickerActive && (
        <div className="bg-base-300 top-full absolute shadow-md rounded-xl w-[80%] px-5 py-5 z-30 md:flex sm:w-auto">
          <div className="md:border-r md:pr-2">
            <div className="">
              <div className="mb-4 flex justify-between items-center">
                <button
                  className="text-lg w-7 h-7 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                  onClick={() =>
                    handleMonthChange({
                      one: subMonths(currentMonths?.one, 1),
                      two: subMonths(currentMonths?.two, 1),
                    })
                  }
                >
                  {"<"}
                </button>
                <p className="text-lg font-bold">
                  {formatDate(currentMonths?.one, "MMMM yyyy")}
                </p>
                <div></div>
              </div>
            </div>
            {isDatePickerActive && renderCalendar(currentMonths?.one)}
          </div>

          <div className="md:border-l md:pl-2 mt-5 md:mt-0">
            <div>
              <div className="mb-4 flex justify-between items-center">
                <div></div>
                <p className="text-lg font-bold">
                  {formatDate(currentMonths?.two, "MMMM yyyy")}
                </p>
                <button
                  className="text-lg w-7 h-7 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                  onClick={() =>
                    handleMonthChange({
                      one: addMonths(currentMonths?.one, 1),
                      two: addMonths(currentMonths?.two, 1),
                    })
                  }
                >
                  {">"}
                </button>
              </div>
            </div>
            {isDatePickerActive && renderCalendar(currentMonths?.two)}
          </div>

          <div className="text-xs px-2 md:pl-5 flex md:flex-col gap-5 mt-5 md:mt-0 flex-row  justify-center items-center">
            <label className="inline-flex flex-row gap-2">
              <input
                name="range"
                type="radio"
                className="radio radio-xs radio-primary"
              />{" "}
              This Week
            </label>
            <label className="inline-flex flex-row gap-2">
              <input
                name="range"
                type="radio"
                className="radio radio-xs radio-primary"
              />{" "}
              This Month
            </label>
            <label className="inline-flex flex-row gap-2">
              <input
                name="range"
                type="radio"
                className="radio radio-xs radio-primary"
              />{" "}
              This Year
            </label>
          </div>
        </div>
      )}
    </OutsideClickHandler>
  );
};

CustomDatePicker.propTypes = {
  format: PropTypes.string,
  defaultDate: PropTypes.instanceOf(Date),
};

export default CustomDatePicker;
