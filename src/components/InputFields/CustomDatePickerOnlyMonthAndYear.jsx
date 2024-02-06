import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getDaysInMonth,
  startOfMonth,
  format as formatDate,
  addMonths,
  subMonths,
  setYear,
  isValid,
} from "date-fns";
import { OutsideClickHandler } from "../OutsideClickHandler";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import moment from "moment";
import { selectMonth } from "../../utils/selectMonth";
import { BiReset } from "react-icons/bi";
import { button } from "@material-tailwind/react";

const CustomDatePickerOnlyMonthAndYear = ({
  disabledDates = [],
  format = "dd-LL-yyyy",
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

  minDate = "10-02-2024",
  maxDate = "20-02-2024",

  daySelection = false,
  monthSelection = true,
  yearSelection = true,
}) => {
  const [step, setStep] = useState(
    daySelection ? "day" : monthSelection ? "month" : "year"
  );
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState();

  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(moment(value, "DD-MM-YYYY")) : new Date()
  );

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date());
  const [isDatePickerActive, setDatePickerActive] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (daySelection) {
      if (!isInitial) {
        if (selectedDate) {
          onChange(formatDate(selectedDate, format));
        } else {
          onChange("");
        }
      } else {
        setIsInitial(false);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!daySelection) {
      if (!isInitial) {
        if (currentYear) {
          let date = `01-${
            moment(currentMonth).format("DD-MM-YYYY").split("-")[1]
          }-${moment(currentYear).format("DD-MM-YYYY").split("-")[2]}`;
          setSelectedDate(formatDate(new Date(date), format));
          onChange(date);
        } else {
          onChange("");
        }
      } else {
        setIsInitial(false);
      }
    }
  }, [currentYear]);

  useEffect(() => {
    setSelectedDate(defaultDate ? new Date(defaultDate) : "");
  }, [defaultDate]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setDatePickerActive(false);
    setIsInitial(false);
  };

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
    setStep(daySelection ? "day" : "year");
  };

  const handleYearChange = (newYear) => {
    setCurrentYear(newYear);
    setStep("day");
  };

  const handleInputClick = () => {
    setDatePickerActive(!isDatePickerActive);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = startOfMonth(currentMonth);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((weekDay) => (
          <div key={weekDay} className="text-center py-2 font-bold">
            {weekDay}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="py-2"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
          (day, i) => (
            <button
              key={i}
              disabled={disabledDates.some(
                (obj) =>
                  obj ===
                  moment(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    )
                  ).format("DD-MM-YYYY")
              )}
              className={`text-center h-7 md:h-10 w-7 md:w-10 rounded-md  flex justify-center items-center   ${
                disabledDates.some(
                  (obj) =>
                    obj ===
                    moment(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    ).format("DD-MM-YYYY")
                )
                  ? "text-error group border relative"
                  : `${
                      moment(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                      ).format("DD-MM-YYYY") ===
                      moment(new Date()).format("DD-MM-YYYY")
                        ? "bg-primary"
                        : ""
                    } cursor-pointer ${
                      selectedDate
                        ? selectedDate &&
                          selectedDate.getDate() === day &&
                          selectedDate.getMonth() === currentMonth.getMonth() &&
                          selectedDate.getFullYear() ===
                            currentMonth.getFullYear()
                          ? "bg-primary text-base-300 border-primary"
                          : "bg-gray-500  bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content"
                        : new Date(moment(value, "DD-MM-YYYY")) &&
                          new Date(moment(value, "DD-MM-YYYY")).getDate() ===
                            day &&
                          new Date(moment(value, "DD-MM-YYYY")).getMonth() ===
                            currentMonth.getMonth() &&
                          new Date(
                            moment(value, "DD-MM-YYYY")
                          ).getFullYear() === currentMonth.getFullYear()
                        ? "bg-primary text-base-300 border-primary"
                        : "bg-gray-500  bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content"
                    }
                  ${
                    today.getFullYear() === currentMonth.getFullYear() &&
                    today.getDate() === day &&
                    today.getMonth() === currentMonth.getMonth()
                  }`
              }  border-2
              `}
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
              {day}
            </button>
          )
        )}
      </div>
    );
  };

  const [allYear, setAllYear] = useState(
    Array.from(
      {
        length:
          parseInt(formatDate(currentMonth, "yyyy")) +
          11 -
          parseInt(formatDate(currentMonth, "yyyy")) +
          1,
      },
      (_, index) => parseInt(formatDate(currentMonth, "yyyy")) + index
    )
  );

  const [startYear, setStartYear] = useState(
    parseInt(formatDate(currentMonth, "yyyy"))
  );
  const [endYear, setEndYear] = useState(
    parseInt(formatDate(currentMonth, "yyyy")) + 11
  );

  useEffect(() => {
    setStartYear(parseInt(formatDate(currentMonth, "yyyy")));
    setEndYear(parseInt(formatDate(currentMonth, "yyyy")) + 11);

    setAllYear(
      Array.from(
        {
          length:
            parseInt(formatDate(currentMonth, "yyyy")) +
            11 -
            parseInt(formatDate(currentMonth, "yyyy")) +
            1,
        },
        (_, index) => parseInt(formatDate(currentMonth, "yyyy")) + index
      )
    );
  }, [currentMonth]);

  // HANDLE CHANGE YEAR
  const handleChangeYear = (start, end) => {
    setStartYear(start);
    setEndYear(end);
    setAllYear(
      Array.from({ length: end - start + 1 }, (_, index) => start + index)
    );
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setStep("day");
        setDatePickerActive(false);
      }}
      className={`relative ${wrapperClassName}`}
    >
      {selectedDate ? (
        <button
          data-tip="reset"
          className={`tooltip tooltip-bottom absolute right-2 ${
            label ? "top-[50px]" : "top-[14px]"
          } text-xl text-primary `}
          onClick={() => setSelectedDate(null)}
        >
          <BiReset />
        </button>
      ) : (
        <button
          data-tip="calender"
          className={`tooltip tooltip-bottom absolute right-2 ${
            label ? "top-[50px]" : "top-[14px]"
          } text-xl text-primary `}
          onClick={!disabled && handleInputClick}
        >
          <FaRegCalendarAlt />
        </button>
      )}

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
        disabled={disabled}
        id={id}
        type={"text"}
        name={name}
        defaultValue={
          defaultValue
            ? daySelection
              ? formatDate(new Date(defaultValue), format)
              : moment(new Date(defaultValue)).format("MM,YYYY")
            : ""
        }
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`bg-base-300  focus:outline-primary input rounded-md input-bordered w-full ${fieldClassName}`}
        value={
          selectedDate
            ? daySelection
              ? formatDate(selectedDate, format)
              : moment(new Date(selectedDate)).format("MMMM,YYYY")
            : value
            ? daySelection
              ? formatDate(new Date(moment(value, "DD-MM-YYYY")), format)
              : moment(new Date(value)).format("MMMM,YYYY")
            : ""
        }
        onClick={!disabled && handleInputClick}
        readOnly
      />
      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7 mt-2">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
      {isDatePickerActive && !disabled && (
        <div
          className={`${top ? "bottom-full -mb-6" : "top-full mt-2"} ${
            right ? "right-0" : "left-0"
          } bg-base-300 border border-primary-content absolute rounded-xl w-[250px] md:w-[350px] px-3 md:px-5  py-3 md:py-5 text-sm z-30`}
        >
          <div className="">
            {step === "day" && (
              <div className="mb-4 flex justify-between items-center">
                <button
                  className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                  onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
                >
                  {"<"}
                </button>

                <p className="text-lg font-bold flex items-center gap-2">
                  <button
                    onClick={() => {
                      setStep("month");
                    }}
                  >
                    {formatDate(currentMonth, "MMMM")}
                  </button>
                  <button
                    onClick={() => {
                      setStep("year");
                    }}
                  >
                    {!daySelection
                      ? formatDate(currentYear, "yyyy")
                      : formatDate(currentYear, "yyyy")}
                  </button>
                </p>

                <button
                  className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                  onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
                >
                  {">"}
                </button>
              </div>
            )}
          </div>
          {daySelection && monthSelection && yearSelection && (
            <>
              {step === "day" && (
                <>{isDatePickerActive && !disabled && renderCalendar()}</>
              )}
              {step === "month" && (
                <>
                  <h3
                    className={`text-center mb-2 text-primary text-lg font-medium`}
                  >
                    Select Month
                  </h3>

                  <div className={`grid grid-cols-3 gap-1`}>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 0));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      January
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 1));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      February
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 2));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      March
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 3));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      April
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 4));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      May
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 5));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      June
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 6));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      July
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 7));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      August
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 8));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      September
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 9));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      October
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 10));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      November
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 11));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      December
                    </button>
                  </div>
                </>
              )}
              {step === "year" && (
                <>
                  {
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <button
                          className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                          onClick={() =>
                            handleChangeYear(startYear - 12, startYear - 1)
                          }
                        >
                          {"<"}
                        </button>

                        <p className="text-lg font-bold flex items-center gap-2">
                          {formatDate(currentMonth, "yyyy")}
                        </p>

                        <button
                          className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                          onClick={() =>
                            handleChangeYear(startYear + 12, endYear + 12)
                          }
                        >
                          {">"}
                        </button>
                      </div>
                      <div className={`grid grid-cols-3 gap-1`}>
                        {allYear.map((year, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              daySelection
                                ? handleMonthChange(setYear(new Date(), year))
                                : handleMonthChange(setYear(new Date(), year));
                            }}
                            className={`btn btn-primary ${
                              parseInt(formatDate(currentMonth, "yyyy")) ===
                              year
                                ? ""
                                : "btn-outline"
                            }  text-xs w-18`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  }
                </>
              )}
            </>
          )}
          {!daySelection && monthSelection && yearSelection && (
            <>
              {step === "month" && (
                <>
                  <h3
                    className={`text-center mb-2 text-primary text-lg font-medium`}
                  >
                    Select Month
                  </h3>

                  <div className={`grid grid-cols-3 gap-1`}>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 0));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      January
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 1));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      February
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 2));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      March
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 3));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      April
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 4));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      May
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 5));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      June
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 6));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      July
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 7));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      August
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 8));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      September
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 9));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      October
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 10));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      November
                    </button>
                    <button
                      onClick={() => {
                        handleMonthChange(selectMonth(new Date(), 11));
                      }}
                      className={`btn btn-primary btn-outline text-xs w-18`}
                    >
                      December
                    </button>
                  </div>
                </>
              )}
              {step === "year" && (
                <>
                  {
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <button
                          className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                          onClick={() =>
                            handleChangeYear(startYear - 12, startYear - 1)
                          }
                        >
                          {"<"}
                        </button>

                        <p className="text-lg font-bold flex items-center gap-2">
                          {daySelection
                            ? formatDate(currentMonth, "yyyy")
                            : formatDate(currentYear, "yyyy")}
                        </p>

                        <button
                          className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                          onClick={() =>
                            handleChangeYear(startYear + 12, endYear + 12)
                          }
                        >
                          {">"}
                        </button>
                      </div>
                      <div className={`grid grid-cols-3 gap-1`}>
                        {allYear.map((year, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              handleYearChange(setYear(new Date(), year));
                            }}
                            className={`btn btn-primary ${
                              parseInt(formatDate(currentMonth, "yyyy")) ===
                              year
                                ? ""
                                : "btn-outline"
                            }  text-xs w-18`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  }
                </>
              )}
            </>
          )}
        </div>
      )}
    </OutsideClickHandler>
  );
};

CustomDatePickerOnlyMonthAndYear.propTypes = {
  format: PropTypes.string,
  defaultDate: PropTypes.instanceOf(Date),
};

export default CustomDatePickerOnlyMonthAndYear;
