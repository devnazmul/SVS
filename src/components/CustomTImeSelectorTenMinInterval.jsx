import moment from "moment";
import React from "react";

export default function CustomTImeSelectorTenMinInterval({
  className,
  name,
  defaultValue,
  id,
  register,
  required,
  dataTestid,
  onChange,
  displayText,
  value,
  restrictionTime,
}) {
  const timeOptionsArray = [
    { value: "00:00", displayText: "12:00 AM" },
    { value: "00:10", displayText: "12:10 AM" },
    { value: "00:20", displayText: "12:20 AM" },
    { value: "00:30", displayText: "12:30 AM" },
    { value: "00:40", displayText: "12:40 AM" },
    { value: "00:50", displayText: "12:50 AM" },
    { value: "01:00", displayText: "01:00 AM" },
    { value: "01:10", displayText: "01:10 AM" },
    { value: "01:20", displayText: "01:20 AM" },
    { value: "01:30", displayText: "01:30 AM" },
    { value: "01:40", displayText: "01:40 AM" },
    { value: "01:50", displayText: "01:50 AM" },
    { value: "02:00", displayText: "02:00 AM" },
    { value: "02:10", displayText: "02:10 AM" },
    { value: "02:20", displayText: "02:20 AM" },
    { value: "02:30", displayText: "02:30 AM" },
    { value: "02:40", displayText: "02:40 AM" },
    { value: "02:50", displayText: "02:50 AM" },
    { value: "03:00", displayText: "03:00 AM" },
    { value: "03:10", displayText: "03:10 AM" },
    { value: "03:20", displayText: "03:20 AM" },
    { value: "03:30", displayText: "03:30 AM" },
    { value: "03:40", displayText: "03:40 AM" },
    { value: "03:50", displayText: "03:50 AM" },
    { value: "04:00", displayText: "04:00 AM" },
    { value: "04:10", displayText: "04:10 AM" },
    { value: "04:20", displayText: "04:20 AM" },
    { value: "04:30", displayText: "04:30 AM" },
    { value: "04:40", displayText: "04:40 AM" },
    { value: "04:50", displayText: "04:50 AM" },
    { value: "05:00", displayText: "05:00 AM" },
    { value: "05:10", displayText: "05:10 AM" },
    { value: "05:20", displayText: "05:20 AM" },
    { value: "05:30", displayText: "05:30 AM" },
    { value: "05:40", displayText: "05:40 AM" },
    { value: "05:50", displayText: "05:50 AM" },
    { value: "06:00", displayText: "06:00 AM" },
    { value: "06:10", displayText: "06:10 AM" },
    { value: "06:20", displayText: "06:20 AM" },
    { value: "06:30", displayText: "06:30 AM" },
    { value: "06:40", displayText: "06:40 AM" },
    { value: "06:50", displayText: "06:50 AM" },
    { value: "07:00", displayText: "07:00 AM" },
    { value: "07:10", displayText: "07:10 AM" },
    { value: "07:20", displayText: "07:20 AM" },
    { value: "07:30", displayText: "07:30 AM" },
    { value: "07:40", displayText: "07:40 AM" },
    { value: "07:50", displayText: "07:50 AM" },
    { value: "08:00", displayText: "08:00 AM" },
    { value: "08:10", displayText: "08:10 AM" },
    { value: "08:20", displayText: "08:20 AM" },
    { value: "08:30", displayText: "08:30 AM" },
    { value: "08:40", displayText: "08:40 AM" },
    { value: "08:50", displayText: "08:50 AM" },
    { value: "09:00", displayText: "09:00 AM" },
    { value: "09:10", displayText: "09:10 AM" },
    { value: "09:20", displayText: "09:20 AM" },
    { value: "09:30", displayText: "09:30 AM" },
    { value: "09:40", displayText: "09:40 AM" },
    { value: "09:50", displayText: "09:50 AM" },
    { value: "10:00", displayText: "10:00 AM" },
    { value: "10:10", displayText: "10:10 AM" },
    { value: "10:20", displayText: "10:20 AM" },
    { value: "10:30", displayText: "10:30 AM" },
    { value: "10:40", displayText: "10:40 AM" },
    { value: "10:50", displayText: "10:50 AM" },
    { value: "11:00", displayText: "11:00 AM" },
    { value: "11:10", displayText: "11:10 AM" },
    { value: "11:20", displayText: "11:20 AM" },
    { value: "11:30", displayText: "11:30 AM" },
    { value: "11:40", displayText: "11:40 AM" },
    { value: "11:50", displayText: "11:50 AM" },
    { value: "12:00", displayText: "12:00 PM" },
    { value: "12:10", displayText: "12:10 PM" },
    { value: "12:20", displayText: "12:20 PM" },
    { value: "12:30", displayText: "12:30 PM" },
    { value: "12:40", displayText: "12:40 PM" },
    { value: "12:50", displayText: "12:50 PM" },
    { value: "13:00", displayText: "01:00 PM" },
    { value: "13:10", displayText: "01:10 PM" },
    { value: "13:20", displayText: "01:20 PM" },
    { value: "13:30", displayText: "01:30 PM" },
    { value: "13:40", displayText: "01:40 PM" },
    { value: "13:50", displayText: "01:50 PM" },
    { value: "14:00", displayText: "02:00 PM" },
    { value: "14:10", displayText: "02:10 PM" },
    { value: "14:20", displayText: "02:20 PM" },
    { value: "14:30", displayText: "02:30 PM" },
    { value: "14:40", displayText: "02:40 PM" },
    { value: "14:50", displayText: "02:50 PM" },
    { value: "15:00", displayText: "03:00 PM" },
    { value: "15:10", displayText: "03:10 PM" },
    { value: "15:20", displayText: "03:20 PM" },
    { value: "15:30", displayText: "03:30 PM" },
    { value: "15:40", displayText: "03:40 PM" },
    { value: "15:50", displayText: "03:50 PM" },
    { value: "16:00", displayText: "04:00 PM" },
    { value: "16:10", displayText: "04:10 PM" },
    { value: "16:20", displayText: "04:20 PM" },
    { value: "16:30", displayText: "04:30 PM" },
    { value: "16:40", displayText: "04:40 PM" },
    { value: "16:50", displayText: "04:50 PM" },
    { value: "17:00", displayText: "05:00 PM" },
    { value: "17:10", displayText: "05:10 PM" },
    { value: "17:20", displayText: "05:20 PM" },
    { value: "17:30", displayText: "05:30 PM" },
    { value: "17:40", displayText: "05:40 PM" },
    { value: "17:50", displayText: "05:50 PM" },
    { value: "18:00", displayText: "06:00 PM" },
    { value: "18:10", displayText: "06:10 PM" },
    { value: "18:20", displayText: "06:20 PM" },
    { value: "18:30", displayText: "06:30 PM" },
    { value: "18:40", displayText: "06:40 PM" },
    { value: "18:50", displayText: "06:50 PM" },
    { value: "19:00", displayText: "07:00 PM" },
    { value: "19:10", displayText: "07:10 PM" },
    { value: "19:20", displayText: "07:20 PM" },
    { value: "19:30", displayText: "07:30 PM" },
    { value: "19:40", displayText: "07:40 PM" },
    { value: "19:50", displayText: "07:50 PM" },
    { value: "20:00", displayText: "08:00 PM" },
    { value: "20:10", displayText: "08:10 PM" },
    { value: "20:20", displayText: "08:20 PM" },
    { value: "20:30", displayText: "08:30 PM" },
    { value: "20:40", displayText: "08:40 PM" },
    { value: "20:50", displayText: "08:50 PM" },
    { value: "21:00", displayText: "09:00 PM" },
    { value: "21:10", displayText: "09:10 PM" },
    { value: "21:20", displayText: "09:20 PM" },
    { value: "21:30", displayText: "09:30 PM" },
    { value: "21:40", displayText: "09:40 PM" },
    { value: "21:50", displayText: "09:50 PM" },
    { value: "22:00", displayText: "10:00 PM" },
    { value: "22:10", displayText: "10:10 PM" },
    { value: "22:20", displayText: "10:20 PM" },
    { value: "22:30", displayText: "10:30 PM" },
    { value: "22:40", displayText: "10:40 PM" },
    { value: "22:50", displayText: "10:50 PM" },
    { value: "23:00", displayText: "11:00 PM" },
    { value: "23:10", displayText: "11:10 PM" },
    { value: "23:20", displayText: "11:20 PM" },
    { value: "23:30", displayText: "11:30 PM" },
    { value: "23:40", displayText: "11:40 PM" },
    { value: "23:50", displayText: "11:50 PM" },
  ];

  return (
    <>
      {value === undefined ? (
        <select
          className={"input"}
          defaultValue={defaultValue}
          name={name}
          id={id}
          onChange={onChange}
        >
          <option value="">{displayText ? displayText : "Select Time"}</option>

          {timeOptionsArray.map((item, index) => {
            const isDisabled =
              moment(restrictionTime?.startingTime, "HH:mm:ss").isAfter(
                moment(item?.value, "HH:mm:ss")
              ) ||
              moment(restrictionTime?.closingTime, "HH:mm:ss").isBefore(
                moment(item?.value, "HH:mm:ss")
              );

            if (!isDisabled) {
              return (
                <option
                  disabled={
                    moment(restrictionTime?.startingTime, "HH:mm:ss").isAfter(
                      moment(item?.value, "HH:mm:ss")
                    ) ||
                    moment(restrictionTime?.closingTime, "HH:mm:ss").isBefore(
                      moment(item?.value, "HH:mm:ss")
                    )
                  }
                  style={{
                    color: `${
                      moment(restrictionTime?.startingTime, "HH:mm:ss").isAfter(
                        moment(item?.value, "HH:mm:ss")
                      ) ||
                      moment(restrictionTime?.closingTime, "HH:mm:ss").isBefore(
                        moment(item?.value, "HH:mm:ss")
                      )
                        ? "#ddd"
                        : "#000"
                    }`,
                  }}
                  key={index}
                  value={item?.value}
                >
                  {item?.displayText}
                </option>
              );
            }
          })}
        </select>
      ) : (
        <>
          <select
            className={"input"}
            defaultValue={defaultValue}
            name={name}
            id={id}
            onChange={onChange}
            value={value}
          >
            <option value="">
              {displayText ? displayText : "Select Time"}
            </option>
            {timeOptionsArray.map((item, index) => {
              const isDisabled =
                moment(restrictionTime?.startingTime, "HH:mm:ss").isAfter(
                  moment(item?.value, "HH:mm:ss")
                ) ||
                moment(restrictionTime?.closingTime, "HH:mm:ss").isBefore(
                  moment(item?.value, "HH:mm:ss")
                );
              if (!isDisabled) {
                return (
                  <option
                    disabled={
                      moment(restrictionTime?.startingTime, "HH:mm:ss").isAfter(
                        moment(item?.value, "HH:mm:ss")
                      ) ||
                      moment(restrictionTime?.closingTime, "HH:mm:ss").isBefore(
                        moment(item?.value, "HH:mm:ss")
                      )
                    }
                    key={index}
                    value={item?.value}
                  >
                    {item?.displayText}
                  </option>
                );
              }
            })}
          </select>
        </>
      )}
    </>
  );
}
