export const getFullImageLink = (url) => {
  return `${import.meta.env.VITE_BASE_URL_FOR_IMAGES}${url}`;
};
