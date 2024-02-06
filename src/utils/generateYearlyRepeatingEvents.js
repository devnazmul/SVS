import moment from "moment";

export const generateYearlyRepeatingEvents = (event) => {
  if (event.repeats_annually === 1) {
    // Create an array of events for the next few years
    const recurringEvents = Array.from({ length: 5 }, (_, index) => {
      const start = moment(event.start).add(index, "years").toDate();
      const end = moment(event.end).add(index, "years").toDate();

      return {
        ...event,
        start,
        end,
      };
    });

    return recurringEvents;
  }
  console.log([event]);
  return [event];
};
