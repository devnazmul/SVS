import moment from "moment";
export const formatDate = (date) => {
  return moment(date, "DD-MM-YYYY").format("DD-MM-YYYY");
};
