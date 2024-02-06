export function smallestTime(timeArray) {
    let smallestSeconds = Infinity;

    timeArray.forEach((inputTime) => {
        const [hours, minutes, seconds] = inputTime.split(':').map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalSeconds < smallestSeconds) {
            smallestSeconds = totalSeconds;
        }
    });

    const smallestHours = Math.floor(smallestSeconds / 3600);
    const remainingSecondsAfterHours = smallestSeconds % 3600;
    const smallestMinutes = Math.floor(remainingSecondsAfterHours / 60);
    const smallestRemainingSeconds = remainingSecondsAfterHours % 60;

    return `${String(smallestHours).padStart(2, '0')}:${String(smallestMinutes).padStart(2, '0')}:${String(smallestRemainingSeconds).padStart(2, '0')}`;
}