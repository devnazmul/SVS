import React, { useState } from "react";
import TimePicker from "react-time-picker";

const TPicker = () => {
  const [time, setTime] = useState("12:00"); // Initial time

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  return (
    <div>
      <h1>Select Time</h1>
      <TimePicker
        onChange={handleTimeChange}
        value={time}
        clearIcon={null} // To hide the clear icon
      />
      <p>Selected Time: {time}</p>
    </div>
  );
};

export default TPicker;
