export function validateDynamicInputFields(
  arr,
  setError,
  setErrors,
  scrollToTop
) {
  const errorsByUniqueId = {};
  for (const obj of arr) {
    if (!obj.name) {
      if (!errorsByUniqueId[obj.id]) {
        errorsByUniqueId[obj.id] = { id: obj.id, fields: [] };
      }
      errorsByUniqueId[obj.id].fields.push("name");
    }
    if (isNaN(parseFloat(obj.price)) || parseFloat(obj.price) <= 0) {
      if (!errorsByUniqueId[obj.id]) {
        errorsByUniqueId[obj.id] = { id: obj.id, fields: [] };
      }
      if (!errorsByUniqueId[obj.id].fields.includes("price")) {
        errorsByUniqueId[obj.id].fields.push("price");
      }
    }
    if (
      typeof parseInt(obj.quantity) !== "number" ||
      isNaN(parseInt(obj.quantity)) ||
      parseInt(obj.quantity) <= 0
    ) {
      if (!errorsByUniqueId[obj.id]) {
        errorsByUniqueId[obj.id] = { id: obj.id, fields: [] };
      }
      if (!errorsByUniqueId[obj.id].fields.includes("quantity")) {
        errorsByUniqueId[obj.id].fields.push("quantity");
      }
    }
  }

  setError(Object.values(errorsByUniqueId));

  if (Object.values(errorsByUniqueId).length > 0) {
    return false;
  } else {
    return true;
  }
}

export function validateBillItems(arr, setError) {
  const errorsByUniqueId = {};

  for (const obj of arr) {
    if (!obj?.item) {
      if (!errorsByUniqueId[obj.id]) {
        errorsByUniqueId[obj.id] = { id: obj.id, fields: [] };
      }
      errorsByUniqueId[obj.id].fields.push("item");
    }
    if (isNaN(parseFloat(obj.amount)) || parseFloat(obj.amount) <= 0) {
      if (!errorsByUniqueId[obj.id]) {
        errorsByUniqueId[obj.id] = { id: obj.id, fields: [] };
      }
      if (!errorsByUniqueId[obj.id].fields.includes("amount")) {
        errorsByUniqueId[obj.id].fields.push("amount");
      }
    }
  }

  setError(Object.values(errorsByUniqueId));

  if (Object.values(errorsByUniqueId).length > 0) {
    return false;
  } else {
    return true;
  }
}
