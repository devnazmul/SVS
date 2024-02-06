import moment from "moment";

export function formatRelativeDate(date) {
  const today = moment().startOf("day");
  const inputDate = moment(date, "DD-MM-YYYY").startOf("day");
  const diffDays = today.diff(inputDate, "days");

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`;
  } else {
    return moment(date).format("MMMM D, YYYY");
  }
}
