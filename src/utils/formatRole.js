export const formatRole = (inputString) => {
  let formattedString = inputString;
  if (inputString?.includes("#")) {
    // IF HAVE  BUSINESS ID
    formattedString = inputString?.split("#")[0];
  }
  formattedString = formattedString?.replace(/_/g, " ");
  return (
    formattedString?.slice(0, 1)?.toUpperCase() + formattedString?.slice(1)
  );
};
