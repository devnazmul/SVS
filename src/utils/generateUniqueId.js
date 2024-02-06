export const generateUniqueNumericId = (existingIds) => {
  const maxId = Math.max(...existingIds, 0); // Get the maximum existing ID
  const newId = maxId + 1;
  return newId;
};
