export const createOrgStructureObj = (data) => {
  console.log({data})
  return data.map((dep) => ({
    name: dep?.name,
    attributes: {
      Admin:
        Object.keys(dep?.manager || {}).length > 0
          ? `${dep?.manager?.first_Name} ${
              dep?.manager?.middle_Name ? dep?.manager?.middle_Name : ""
            } ${dep?.manager?.last_Name}`
          : `No Admin Found`,
      ["Total Employees"]: dep?.total_users_count,
    },
    children: dep?.children_recursive
      ? createOrgStructureObj(dep?.children_recursive)
      : [],
  }));
};
