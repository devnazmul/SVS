export function encryptID(id) {
  function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomChars = "";
    for (let i = 0; i < length; i++) {
      randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomChars;
  }
  const startChars = generateRandomString(10);
  const endChars = generateRandomString(10);

  // Return the new string with random chars at the start and the end of the ID
  return startChars + id + endChars;
}

export function decryptID(encryptedString) {
  const idString = encryptedString.substring(10, encryptedString.length - 10);

  // Return the ID as a number
  return Number(idString);
}
