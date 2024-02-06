export const calculateNextNthDay = (givenDate, nthDay) => {
  const dateObj = moment(givenDate);
  const currentDay = dateObj.date();
  const dayDifference = nthDay - currentDay;

  if (dayDifference >= 0) {
    const nextNthDay = dateObj.date(nthDay).format("DD-MM-YYYY");
    return nextNthDay;
  } else {
    const daysAfterNthDay = currentDay - nthDay;
    const nextNthDay = dateObj
      .date(nthDay)
      .add(1, "month")
      .subtract(daysAfterNthDay, "days")
      .format("DD-MM-YYYY");
    return nextNthDay;
  }
};
