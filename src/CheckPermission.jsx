import React from "react";
import { checkPermissions } from "./utils/checkPermissions";
import Headings from "./components/Headings/Headings";
import GoBackButton from "./components/GoBackButton";

export default function CheckPermission({ children, permissionArray = [] }) {
  const permissions = localStorage.getItem("permissions");
  if (checkPermissions(permissionArray, permissions)) {
    return <>{children}</>;
  } else {
    return (
      <div className="h-[80vh] w-full flex flex-col justify-center items-center gap-2">
        <Headings level={1} className="text-center">
          You have no permission!
        </Headings>
        <p className="text-center">
          You have no permission to access this page content please go back.
        </p>
        <GoBackButton />
      </div>
    );
  }
}
