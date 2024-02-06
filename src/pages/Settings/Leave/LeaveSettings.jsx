// =====================================
// #00141
// =====================================

import React, { useEffect, useState } from "react";
import Headings from "../../../components/Headings/Headings";
import { BiSolidInfoCircle } from "react-icons/bi";
import LeaveTypeList from "./LeaveType/AllLeaveTypeList";
import { VscTypeHierarchy } from "react-icons/vsc";
import { MdOutlineApproval, MdPolicy } from "react-icons/md";
import Approval from "./ApprovalAndAllowancePolicy";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import ApprovalAndAllowancePolicy from "./ApprovalAndAllowancePolicy";
import CheckPermission from "../../../CheckPermission";
import { SETTING_LEAVE_TYPE_VIEW } from "../../../constant/permissions";

export default function LeaveSettings() {
  const [tabName, setTabName] = useState("leave-type");
  const [isNoteOpened, setIsNoteOpened] = useState(false);

  return (
    <CheckPermission permissionArray={[SETTING_LEAVE_TYPE_VIEW]}>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <Headings level={1}>Leave Settings</Headings>{" "}
          <button
            onClick={() => setIsNoteOpened(!isNoteOpened)}
            data-tip="note"
            className="tooltip tooltip-left tooltip-primary"
          >
            <BiSolidInfoCircle className="text-primary text-2xl" />
          </button>
        </div>

        {/* NOTE  */}
        <div
          className={`bg-primary-content w-full transition-all duration-300 rounded-xl overflow-hidden ${
            isNoteOpened ? "h-auto  p-5 pl-10" : "h-0"
          }`}
        >
          <ol className="list-decimal  transition-all duration-300">
            <li>Any type of change will be effective on the next day.</li>
            <li>
              You must setup the cron job in your hosted server for assigning
              work shift, generating payslip, sending bulk emails, assigning
              leaves and renew holidays.
            </li>
            <li>Remained leave will not carry forward to next leave year.</li>
          </ol>
        </div>

        <div>
          {/* TAB BUTTONS  */}
          <div
            className={`py-5 my-5 flex flex-row justify-center items-center gap-5`}
          >
            <button
              data-tip="Leave Type"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-72 btn-primary shadow-xl shadow-primary-content ${
                tabName === "leave-type" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("leave-type")}
            >
              <VscTypeHierarchy className="text-2xl" />{" "}
              <span className="hidden md:inline-block">Leave Type</span>
            </button>
            <button
              data-tip="Approval & Allowance Policy"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-72 btn-primary shadow-xl shadow-primary-content  ${
                tabName === "approval-allowance-policy"
                  ? "text-base-300"
                  : "btn-outline"
              }`}
              onClick={() => setTabName("approval-allowance-policy")}
            >
              <MdPolicy className="text-2xl" />{" "}
              <span className="hidden md:inline-block">
                Approval & Allowance Policy
              </span>
            </button>
          </div>
          <div>
            {tabName === "leave-type" && <LeaveTypeList />}
            {tabName === "approval-allowance-policy" && (
              <ApprovalAndAllowancePolicy tabName={tabName} />
            )}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
