export function convertTo24HourFormat(time) {
  if (time) {
    const [rawTime, meridiem] = time.split(" ");
    const [hours, minutes] = rawTime.split(":");

    let convertedHours = parseInt(hours, 10);

    if (meridiem === "PM" && convertedHours !== 12) {
      convertedHours += 12;
    } else if (meridiem === "AM" && convertedHours === 12) {
      convertedHours = 0;
    }

    const formattedHours = convertedHours.toString().padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:00`;
  } else {
    return "";
  }
}
