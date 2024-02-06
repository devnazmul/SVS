export function formatNumber(value) {
  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return (value / 1e12).toFixed(1) + "T";
  } else if (absValue >= 1e9) {
    return (value / 1e9).toFixed(1) + "B";
  } else if (absValue >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (absValue >= 1e3) {
    return (value / 1e3).toFixed(1) + "K";
  }

  return value.toString();
}
