export function compareTimes(startTime, endTime) {
  const start = new Date(`2022-01-01 ${startTime}`);
  const end = new Date(`2022-01-01 ${endTime}`);

  if (start < end) {
    return -1; // startTime is before endTime
  } else if (start > end) {
    return 1; // startTime is after endTime
  } else {
    return 0; // startTime and endTime are equal
  }
}
