export function hasNumber(inputString) {
  // Regular expression to match any digit (0-9) in the string
  const regex = /\d/;
  return regex.test(inputString);
}
