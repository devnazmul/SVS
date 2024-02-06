export function convertTo12HourFormat(time, line) {
  if (time && typeof time === "string") {
    const [hours, minutes] = time?.split(":");
    let convertedHours = parseInt(hours, 10);
    let meridiem = "AM";

    if (convertedHours >= 12) {
      meridiem = "PM";
      if (convertedHours > 12) {
        convertedHours -= 12;
      }
    } else if (convertedHours === 0) {
      convertedHours = 12;
    }

    const formattedHours = convertedHours.toString().padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${meridiem}`;
  } else {
    return "";
  }
}
