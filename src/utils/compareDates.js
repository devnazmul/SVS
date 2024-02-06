export function compareDates(date1, date2) {
  const [day1, month1, year1] = date1.split("-").map(Number);
  const [day2, month2, year2] = date2.split("-").map(Number);

  const dateObject1 = new Date(year1, month1 - 1, day1); // Month is zero-based
  const dateObject2 = new Date(year2, month2 - 1, day2);

  if (dateObject1 < dateObject2) {
    return 1; // date1 is before date2
  } else if (dateObject1 > dateObject2) {
    return -1; // date1 is after date2
  } else {
    return 0; // date1 and date2 are equal
  }
}
