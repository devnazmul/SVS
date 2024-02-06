import React, { useEffect, useState } from "react";
import moment from "moment";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const FilterByDate = ({
  onChange = (e) => {
    return e;
  },
}) => {
  const [isInitial, setIsInitial] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf("month"),
    endDate: moment().endOf("month"),
  });
  const [buttonName, setButtonName] = useState("Today");

  const handleDateChange = (amount) => {
    setDateRange((prevDateRange) => ({
      startDate: prevDateRange.startDate.clone().add(amount, "days"),
      endDate: prevDateRange.endDate.clone().add(amount, "days"),
    }));
  };

  const handleButtonClick = (preset) => {
    let startDate, endDate;

    switch (preset) {
      case "today":
        setButtonName("Today");
        startDate = moment().startOf("day");
        endDate = moment().endOf("day");
        break;
      case "thisWeek":
        setButtonName("This Week");
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");
        break;
      case "lastWeek":
        setButtonName("Last Week");
        startDate = moment().subtract(1, "week").startOf("week");
        endDate = moment().subtract(1, "week").endOf("week");
        break;
      case "thisMonth":
        setButtonName("This Month");
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");
        break;
      case "lastMonth":
        setButtonName("Last Month");
        startDate = moment().subtract(1, "month").startOf("month");
        endDate = moment().subtract(1, "month").endOf("month");
        break;
      case "thisYear":
        setButtonName("This Year");
        startDate = moment().startOf("year");
        endDate = moment().endOf("year");
        break;
      case "lastYear":
        setButtonName("Last Year");
        startDate = moment().subtract(1, "year").startOf("year");
        endDate = moment().subtract(1, "year").endOf("year");
        break;
      default:
        break;
    }

    setDateRange({ startDate, endDate });
  };

  useEffect(() => {
    if (isInitial) {
      handleButtonClick("thisMonth");
    }
  }, []);

  const formattedDateRange = () => {
    if (
      dateRange.startDate.format("MMMM D, YYYY") ===
      dateRange.endDate.format("MMMM D, YYYY")
    ) {
      return `${dateRange.startDate.format("MMMM D, YYYY")}`;
    } else {
      return `${dateRange.startDate.format(
        "MMMM D, YYYY"
      )} - ${dateRange.endDate.format("MMMM D, YYYY")}`;
    }
  };

  useEffect(() => {
    if (!isInitial) {
      onChange({
        filterName: buttonName,
        start: dateRange?.startDate?.format("DD-MM-YYYY"),
        end: dateRange?.endDate?.format("DD-MM-YYYY"),
      });
    } else {
      setIsInitial(false);
    }
  }, [dateRange]);
  return (
    <div className="flex flex-col gap-5 md:gap-1 w-full mb-5 md:mb-5 rounded-xl overflow-hidden shadow-md">
      <div className="flex flex-col sm:flex-row gap-5 md:gap-0 justify-between items-center bg-base-300 py-5 px-5 rounded-xl">
        <div className="">{formattedDateRange()}</div>

        <div className="flex justify-between w-full md:w-16 gap-2">
          <button onClick={() => handleDateChange(-1)}>
            <IoMdArrowDropleft className="text-3xl md:text-2xl hover:text-primary" />
          </button>
          <button onClick={() => handleDateChange(1)}>
            <IoMdArrowDropright className="text-3xl md:text-2xl hover:text-primary" />
          </button>
        </div>
      </div>

      {/* Additional div below the parent div */}
      <div className="collapse md:hidden  collapse-arrow bg-base-200 ">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title text-xl font-medium bg-primary text-base-300">
          {buttonName}
        </div>
        <div className="collapse-content">
          <div className="mt-4 flex flex-col gap-1 justify-between items-center py-2">
            <button
              className={`${
                moment().startOf("day").format("DD-MM-YYYY") !==
                  dateRange?.startDate.format("DD-MM-YYYY") && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("today")}
            >
              Today
            </button>
            <button
              className={`${
                buttonName !== "This Week" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("thisWeek")}
            >
              This Week
            </button>
            <button
              className={`${
                buttonName !== "Last Week" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("lastWeek")}
            >
              Last Week
            </button>
            <button
              className={`${
                buttonName !== "This Month" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("thisMonth")}
            >
              This Month
            </button>
            <button
              className={`${
                buttonName !== "Last Month" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("lastMonth")}
            >
              Last Month
            </button>
            <button
              className={`${
                buttonName !== "This Year" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("thisYear")}
            >
              This Year
            </button>
            <button
              className={`${
                buttonName !== "Last Year" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => handleButtonClick("lastYear")}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 hidden md:flex justify-between items-center md:px-5 lg:px-16 pt-2 pb-5">
        <button
          className={`${
            moment().startOf("day").format("DD-MM-YYYY") ==
              dateRange?.startDate.format("DD-MM-YYYY") && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("today")}
        >
          Today
        </button>
        <button
          className={`${
            buttonName === "This Week" && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("thisWeek")}
        >
          This Week
        </button>
        <button
          className={`${
            buttonName === "Last Week" && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("lastWeek")}
        >
          Last Week
        </button>
        <button
          className={`${
            buttonName === "This Month" && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("thisMonth")}
        >
          This Month
        </button>
        <button
          className={`${
            buttonName === "Last Month" && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("lastMonth")}
        >
          Last Month
        </button>
        <button
          className={`${
            buttonName === "This Year" && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("thisYear")}
        >
          This Year
        </button>
        <button
          className={`${
            buttonName === "Last Year" && "text-primary"
          } font-semibold`}
          onClick={() => handleButtonClick("lastYear")}
        >
          Last Year
        </button>
      </div>
    </div>
  );
};

export default FilterByDate;
