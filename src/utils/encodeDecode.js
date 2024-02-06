import CryptoJS from "crypto-js";

// Encrypt
export const encrypt = (value) => {
  return CryptoJS.AES.encrypt(
    value,
    `${import.meta.env.VITE_ENCRIPTION_KEY}`
  ).toString();
};

// Decrypt
export const decrypt = (incriptedString) => {
  const bytes = CryptoJS.AES.decrypt(
    incriptedString,
    `${import.meta.env.VITE_ENCRIPTION_KEY}`
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
