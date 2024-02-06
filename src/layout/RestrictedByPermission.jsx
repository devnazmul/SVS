import React from "react";
import { checkPermissions } from "../utils/checkPermissions";
import Headings from "../components/Headings/Headings";
import GoBackButton from "../components/GoBackButton";

export default function RestrictedByPermission({
  permissionsArray = [],
  children,
}) {
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  const user = JSON.parse(localStorage.getItem("userData"));

  if (
    permissionsArray.length > 0
      ? checkPermissions(permissionsArray, permissions)
      : true
  ) {
    return <>{children}</>;
  } else {
    return (
      <div className="h-[70vh] w-full flex justify-center items-center flex-col gap-5">
        <img
          className="w-[250px] h-auto"
          src={`/assets/permission_denied.svg`}
          alt=""
        />
        <Headings level={1}>
          You have no permission to view this content
        </Headings>

        <GoBackButton textColorClass="text-base-300" />
      </div>
    );
  }
}
