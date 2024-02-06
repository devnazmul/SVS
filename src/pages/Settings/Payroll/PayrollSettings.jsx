// =====================================
// #00141
// =====================================

import React, { useEffect, useState } from "react";
import CheckPermission from "../../../CheckPermission";
import { SETTING_PAYROLL_CREATE } from "../../../constant/permissions";
import Headings from "../../../components/Headings/Headings";
import { BiSolidBadge, BiSolidInfoCircle } from "react-icons/bi";
import { VscTypeHierarchy } from "react-icons/vsc";
import {
  MdOutlineManageAccounts,
  MdOutlinePayment,
  MdPolicy,
} from "react-icons/md";
import AllLeaveTypeList from "../Leave/LeaveType/AllLeaveTypeList";
import ApprovalAndAllowancePolicy from "../Leave/ApprovalAndAllowancePolicy";
import { SlBadge } from "react-icons/sl";
import DefaultPayrun from "./DefaultPayrun";
import BadgeValue from "./BadgeValue";
import ManageAudience from "./ManageAudience";
import PaySlip from "./PaySlip";
import { IoReceipt } from "react-icons/io5";

export default function PayrollSettings() {
  const [tabName, setTabName] = useState("default-payrun");
  const [isNoteOpened, setIsNoteOpened] = useState(false);

  return (
    <CheckPermission permissionArray={[SETTING_PAYROLL_CREATE]}>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <Headings level={1}>Payroll Settings</Headings>{" "}
          <button
            onClick={() => setIsNoteOpened(!isNoteOpened)}
            data-tip="note"
            className="tooltip tooltip-left tooltip-primary"
          >
            <BiSolidInfoCircle className="text-primary text-2xl" />
          </button>
        </div>

        {/* NOTE  */}
        {/* <div
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
        </div> */}

        <div>
          {/* TAB BUTTONS  */}
          <div
            className={`py-5 my-5 flex flex-row justify-center items-center gap-5`}
          >
            <button
              data-tip="Default Payrun"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-48 btn-primary shadow-xl shadow-primary-content ${
                tabName === "default-payrun" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("default-payrun")}
            >
              <VscTypeHierarchy className="text-2xl" />{" "}
              <span className="hidden md:inline-block">Default Payrun</span>
            </button>
            {/* <button
              data-tip="Badge Value"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-72 btn-primary shadow-xl shadow-primary-content  ${
                tabName === "badge-value" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("badge-value")}
            >
              <SlBadge className="text-2xl" />{" "}
              <span className="hidden md:inline-block">Badge Value</span>
            </button> */}
            {/* <button
              data-tip="Manage Audience"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-48 btn-primary shadow-xl shadow-primary-content  ${
                tabName === "manage-audience" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("manage-audience")}
            >
              <MdOutlineManageAccounts className="text-2xl" />{" "}
              <span className="hidden md:inline-block">Manage Audience</span>
            </button> */}
            <button
              data-tip="Payslip"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-48 btn-primary shadow-xl shadow-primary-content  ${
                tabName === "payslip" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("payslip")}
            >
              <IoReceipt className="text-2xl" />{" "}
              <span className="hidden md:inline-block">Payslip</span>
            </button>
          </div>
          <div>
            {tabName === "default-payrun" && <DefaultPayrun />}
            {tabName === "badge-value" && <BadgeValue tabName={tabName} />}
            {tabName === "manage-audience" && <ManageAudience />}
            {tabName === "payslip" && <PaySlip />}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
