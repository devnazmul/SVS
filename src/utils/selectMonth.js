import { setMonth } from "date-fns";

export function selectMonth(currentDate, selectedMonth) {
  // Ensure currentDate is a Date object
  const date = new Date(currentDate);

  // Set the month to the selected month
  const newDate = setMonth(date, selectedMonth);

  return newDate;
}
