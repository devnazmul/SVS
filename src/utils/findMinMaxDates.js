export function findMinMaxDates(dateArray) {
  if (!dateArray || dateArray.length === 0) {
    return { minDate: null, maxDate: null };
  }

  // Convert the date strings to Date objects
  const dateObjects = dateArray.map((dateString) => new Date(dateString));

  // Find the minimum and maximum dates
  const minDate = new Date(Math.min(...dateObjects));
  const maxDate = new Date(Math.max(...dateObjects));

  return { minDate, maxDate };
}
