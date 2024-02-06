import moment from "moment";

export function formatOrRelativeTime(date, fromFormat, format, thresholdDays) {
  const createdDate = moment(date, fromFormat);
  const currentDate = moment();

  const daysDifference = currentDate.diff(createdDate, "days");

  if (daysDifference >= thresholdDays) {
    // If the date is older than or equal to the threshold
    return createdDate.format(format);
  } else {
    // If the date is within the threshold
    return createdDate.fromNow();
  }
}
