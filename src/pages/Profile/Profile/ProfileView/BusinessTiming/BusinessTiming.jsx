import { useEffect, useState } from "react";
import { getSingleBusiness } from "../../../../../apis/userAndBusiness/business";
import CustomLoading from "../../../../../components/CustomLoading";
import CustomTimePicker from "../../../../../components/InputFields/CustomTimePicker";
import { compareTimes } from "../../../../../utils/compareTimes";

export default function BusinessTiming({ userInfo }) {
  const [timingData, setTimingData] = useState([
    {
      day: 0,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: true,
    },
    {
      day: 1,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 2,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 3,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 4,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 5,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 6,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
  ]);
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

  // GETTING ALL DATA
  const [isDataPending, setIsDataPending] = useState(true);
  useEffect(() => {
    setIsDataPending(true);
    getSingleBusiness(userInfo?.business_id)
      .then((res) => {
        console.log({ r: res });

        setIsDataPending(false);
      })
      .catch((error) => {
        setIsDataPending(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00124 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [userInfo]);

  // CHANGE TIMING DATA
  const onChangeTimingData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setTimingData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    timingData.forEach((detail, index) => {
      if (detail.start_at && detail.end_at) {
        if (
          compareTimes(detail.start_at, detail.end_at) === 1 ||
          compareTimes(detail.start_at, detail.end_at) === 0
        ) {
          newErrors.times = newErrors.times || [];
          newErrors.times.push({
            id: index,
            start_at: "Start time must be before the end time",
            end_at: "End time must be after the start time",
          });
        }
      } else {
        if (!detail.start_at && detail.is_weekend === false) {
          newErrors.times = newErrors.times || [];
          newErrors.times.push({
            id: index,
            start_at: "Start time is required",
          });
        }

        if (!detail.end_at && detail.is_weekend === false) {
          newErrors.times = newErrors.times || [];
          newErrors.times.push({
            id: index,
            end_at: "End time is required",
          });
        }
      }
    });

    setErrors(newErrors);
    console.log({ err3: newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  if (isDataPending) {
    return <CustomLoading />;
  } else {
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
                    <span className={`hidden md:inline-block`}>
                      {dayArray[day?.day]?.name}
                    </span>
                    <span className={`md:hidden inline-block`}>
                      {dayArray[day?.day]?.sortName}
                    </span>
                  </div>
                  <div className={`w-[10%] md:w-[20%] mt-2`}>
                    <input
                      className={`toggle toggle-primary toggle-xs md:toggle-md`}
                      onChange={(e) => {
                        if (e.target.checked) {
                          mediumTimingData[day.day].is_weekend = true;
                          setTimingData(mediumTimingData);
                        } else {
                          mediumTimingData[day.day].is_weekend = false;
                          setTimingData(mediumTimingData);
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
                      disable={timingData[day.day].is_weekend}
                    />
                  </div>

                  {/* END TIME  */}
                  <div
                    className={`w-[40%] md:w-[30%] block ${
                      errors?.times?.find((e) => e?.id === day?.day)
                        ?.start_at &&
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
                      disable={timingData[day.day].is_weekend}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
