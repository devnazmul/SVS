import React from "react";
import CheckPermission from "../../../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../../../constant/permissions";

export default function SalaryOverview() {
  return (
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div>SalaryOverview</div>
    </CheckPermission>
  );
}
