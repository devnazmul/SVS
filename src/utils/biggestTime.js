export function biggestTime(timeArray) {
  let biggestSeconds = -1;

  timeArray.forEach((inputTime) => {
    const [hours, minutes, seconds] = inputTime.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds > biggestSeconds) {
      biggestSeconds = totalSeconds;
    }
  });

  const biggestHours = Math.floor(biggestSeconds / 3600);
  const remainingSecondsAfterHours = biggestSeconds % 3600;
  const biggestMinutes = Math.floor(remainingSecondsAfterHours / 60);
  const biggestRemainingSeconds = remainingSecondsAfterHours % 60;

  return `${String(biggestHours).padStart(2, "0")}:${String(
    biggestMinutes
  ).padStart(2, "0")}:${String(biggestRemainingSeconds).padStart(2, "0")}`;
}
