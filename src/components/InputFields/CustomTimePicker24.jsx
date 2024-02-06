import React, { useEffect, useState } from "react";

const TimePicker = ({ minTime = "00:00:00", maxTime = "23:59:59" }) => {
  const [selectedTime, setSelectedTime] = useState("");

  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    // Check if the new time is within the allowed range
    if (newTime >= minTime && newTime <= maxTime) {
      setSelectedTime(newTime);
    } else {
      console.warn("Selected time is outside the allowed range.");
    }
  };

  useEffect(() => {
    console.log({ selectedTime });
  }, [selectedTime]);
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="timePicker">Select Time:</label>
      <input
        type="time"
        id="timePicker"
        value={selectedTime}
        onChange={handleTimeChange}
        step="1800" // 30-minute intervals
        className="border border-gray-300 p-2 rounded-md input"
      />
    </div>
  );
};

export default TimePicker;
