export const checkPermissions = (permissionForCheck, permissions) => {
  if (permissions) {
    return permissionForCheck.some((el) => {
      return permissions.includes(el);
    });
  }
};
