import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { OutsideClickHandler } from "../OutsideClickHandler";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import moment from "moment"; // Import Moment.js

const CustomLeaveCalendar = ({
  format = "dd-LL-yyyy", // Use Moment.js format
  defaultDate,
  fieldClassName,
  id,
  label,
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
  top = false,
  right = false,
  disabled = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    value ? moment(value) : moment()
  );

  console.log({ value: value });

  const [currentMonth, setCurrentMonth] = useState(moment());
  const [isDatePickerActive, setDatePickerActive] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (!isInitial) {
      onChange(selectedDate.format(format)); // Use Moment.js format
    }
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate(defaultDate ? moment(defaultDate) : "");
  }, [defaultDate]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setDatePickerActive(false);
    setIsInitial(false);
  };

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  const handleInputClick = () => {
    setDatePickerActive(!isDatePickerActive);
  };

  const renderCalendar = () => {
    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = moment(currentMonth).startOf("month");
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = moment();
    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((weekDay) => (
          <div key={weekDay} className="text-center py-2 font-bold">
            {weekDay}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth.day() }).map((_, index) => (
          <div key={`empty-${index}`} className="py-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
          (day) => (
            <div
              key={day}
              className={`text-center h-10 w-10 rounded-md   flex justify-center items-center cursor-pointer border-2 ${
                selectedDate
                  ? selectedDate &&
                    selectedDate.date() === day &&
                    selectedDate.month() === currentMonth.month()
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-500  bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content"
                  : value &&
                    moment(value).date() === day &&
                    moment(value).month() === currentMonth.month()
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-500  bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content"
              }
              ${
                today.year() === currentMonth.year() &&
                today.date() === day &&
                today.month() === currentMonth.month()
              }
              `}
              onClick={() =>
                handleDateClick(
                  moment([currentMonth.year(), currentMonth.month(), day])
                )
              }
            >
              {day}
            </div>
          )
        )}
      </div>
    );
  };

  return <div>{isDatePickerActive && renderCalendar()}</div>;
};

CustomLeaveCalendar.propTypes = {
  format: PropTypes.string,
  defaultDate: PropTypes.instanceOf(Date),
};

export default CustomLeaveCalendar;
