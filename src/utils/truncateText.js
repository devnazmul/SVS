export default function truncateText(text, maxChar) {
  if (text.length <= maxChar) {
    return text;
  } else {
    const truncatedText = text.slice(0, maxChar);
    return `${truncatedText}...`;
  }
}
