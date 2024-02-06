import React from "react";
import CustomTextareaField from "../../components/InputFields/CustomTextareaField";
import CustomTimePicker from "../../components/InputFields/CustomTimePicker";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import CustomField from "../../components/InputFields/CustomField";
import { convertTo24HourFormat } from "../../utils/convertTo24HourFormat";

const CreateBusinessTiming = ({
  errors,
  onChangeTimingData,
  timingData,
  setTimingData,
  type,
  idDisabledAll = false,
}) => {
  const mediumTimingData = [...timingData];
  const dayArray = [
    { name: "Sun", sortName: "Sunday" },
    { name: "Mon", sortName: "Monday" },
    { name: "Tue", sortName: "Tuesday" },
    { name: "Wed", sortName: "Wednesday" },
    { name: "Thu", sortName: "Thursday" },
    { name: "Fri", sortName: "Friday" },
    { name: "Sat", sortName: "Saturday" },
  ];
  return (
    <div className="px-2 py-5">
      <div className="flex flex-col w-full">
        <div>
          <div className="flex items-center py-5 text-[0.8rem] font-semibold bg-base-200 md:px-5 shadow-md px-2">
            <div className={`block w-[7%] md:w-[20%]`}>Days</div>
            <div className={`w-[18%] md:w-[20%] pl-5 md:pl-0 inline-block`}>
              Day Off
            </div>
            <div className={`block w-[40%] md:w-[30%] pl-5 md:pl-5`}>
              Start at
            </div>
            <div className={`block w-[40%] md:w-[30%] pl-5 md:pl-5`}>
              End at
            </div>
          </div>

          <div className={`flex flex-col`}>
            {timingData.map((day, value) => (
              <div
                key={value}
                className={`flex items-center md:px-5  px-2 pt-2 gap-5 pb-2 bg-base-300 duration-200 hover:bg-base-100`}
              >
                {/* DAY TITLE  */}
                <div className={`w-[10%] md:w-[20%]`}>
                  <span className={`md:hidden inline-block`}>
                    {dayArray[day?.day]?.name}
                  </span>
                  <span className={`hidden md:inline-block`}>
                    {dayArray[day?.day]?.sortName}
                  </span>
                </div>
                <div className={`w-[10%] md:w-[20%] mt-2`}>
                  <input
                    className={`toggle toggle-primary toggle-xs md:toggle-md`}
                    onChange={(e) => {
                      if (!idDisabledAll) {
                        if (e.target.checked) {
                          mediumTimingData[day.day].is_weekend = true;
                          setTimingData(mediumTimingData);
                        } else {
                          mediumTimingData[day.day].is_weekend = false;
                          setTimingData(mediumTimingData);
                        }
                      }
                    }}
                    checked={mediumTimingData[day.day].is_weekend}
                    type="checkbox"
                    name=""
                    id=""
                  />
                </div>

                {/* START TIME  */}
                <div
                  className={`w-[40%] md:w-[30%] block ${
                    errors?.times?.find((e) => e?.id === day?.day)?.end_at &&
                    !timingData[day.day].is_weekend &&
                    "h-[80px]"
                  } `}
                >
                  <CustomTimePicker
                    id={`start_at`}
                    value={mediumTimingData[day.day].start_at}
                    required={mediumTimingData[day.day].end_at}
                    name={"start_at"}
                    placeholder="Start at"
                    onChange={(e) => {
                      mediumTimingData[day.day].start_at =
                        convertTo24HourFormat(e);
                      setTimingData(mediumTimingData);
                    }}
                    error={
                      !timingData[day.day].is_weekend
                        ? errors?.times
                          ? errors?.times?.length > 0
                            ? errors?.times?.find((e) => e?.id === day?.day)
                                ?.start_at
                            : ""
                          : ""
                        : ""
                    }
                    disable={timingData[day.day].is_weekend || idDisabledAll}
                  />
                </div>

                {/* END TIME  */}
                <div
                  className={`w-[40%] md:w-[30%] block ${
                    errors?.times?.find((e) => e?.id === day?.day)?.start_at &&
                    !timingData[day.day].is_weekend &&
                    "h-[80px]"
                  } `}
                >
                  <CustomTimePicker
                    id={`end_at`}
                    required={timingData[day.day].start_at}
                    value={mediumTimingData[day.day].end_at}
                    name={"end_at"}
                    placeholder="End at"
                    onChange={(e) => {
                      mediumTimingData[day.day].end_at =
                        convertTo24HourFormat(e);
                      setTimingData(mediumTimingData);
                    }}
                    error={
                      !timingData[day.day].is_weekend
                        ? errors?.times
                          ? errors?.times?.length > 0
                            ? errors?.times?.find((e) => e?.id === day?.day)
                                ?.end_at
                            : ""
                          : ""
                        : ""
                    }
                    disable={timingData[day.day].is_weekend || idDisabledAll}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBusinessTiming;
