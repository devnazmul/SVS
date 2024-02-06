import { useState } from "react";
import CheckPermission from "../../../CheckPermission";
import Headings from "../../../components/Headings/Headings";
import {
  JOB_PLATFORM_CREATE,
  JOB_PLATFORM_VIEW,
  JOB_TYPE_CREATE,
  JOB_TYPE_VIEW,
  SOCIAL_SITE_CREATE,
  WORK_LOCATION_CREATE,
  WORK_LOCATION_VIEW,
} from "../../../constant/permissions";
import AllJobType from "./AllJobType";
import { BiSolidInfoCircle } from "react-icons/bi";
import { VscTypeHierarchy } from "react-icons/vsc";
import { MdOutlineWorkHistory, MdPolicy } from "react-icons/md";
import { TiLocation } from "react-icons/ti";
import { checkPermissions } from "../../../utils/checkPermissions";
import AllWorkLocation from "./AllWorkLocation";
import AllJobPlatform from "./JobPlatform/AllJobPlatform";

export default function BusinessSettings() {
  const [tabName, setTabName] = useState("job-type");
  const [isNoteOpened, setIsNoteOpened] = useState(false);
  const permissions = localStorage?.getItem("permissions");
  return (
    <CheckPermission permissionArray={[SOCIAL_SITE_CREATE]}>
      <div className="w-full">
        <div className="flex items-center justify-start">
          <Headings level={1}>Business Settings</Headings>{" "}
        </div>

        <div>
          {/* TAB BUTTONS  */}
          <div
            className={`py-5 my-5 flex flex-row justify-center items-center gap-5`}
          >
            {checkPermissions(
              [JOB_TYPE_CREATE, JOB_TYPE_VIEW],
              permissions
            ) && (
              <button
                data-tip="Job Type"
                className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-72 btn-primary shadow-xl shadow-primary-content ${
                  tabName === "job-type" ? "text-base-300" : "btn-outline"
                }`}
                onClick={() => setTabName("job-type")}
              >
                <MdOutlineWorkHistory className="text-2xl" />{" "}
                <span className="hidden md:inline-block">Job Type</span>
              </button>
            )}
            {checkPermissions(
              [JOB_PLATFORM_CREATE, JOB_PLATFORM_VIEW],
              permissions
            ) && (
              <button
                data-tip="Job Platform"
                className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-72 btn-primary shadow-xl shadow-primary-content ${
                  tabName === "job-platform" ? "text-base-300" : "btn-outline"
                }`}
                onClick={() => setTabName("job-platform")}
              >
                <MdOutlineWorkHistory className="text-2xl" />{" "}
                <span className="hidden md:inline-block">Job Platform</span>
              </button>
            )}
            {checkPermissions(
              [WORK_LOCATION_CREATE, WORK_LOCATION_VIEW],
              permissions
            ) && (
              <button
                data-tip="Work Location"
                className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 md:w-72 btn-primary shadow-xl shadow-primary-content  ${
                  tabName === "work-location" ? "text-base-300" : "btn-outline"
                }`}
                onClick={() => setTabName("work-location")}
              >
                <TiLocation className="text-2xl" />{" "}
                <span className="hidden md:inline-block">Work Location</span>
              </button>
            )}
          </div>
          <div>
            {tabName === "job-type" && <AllJobType />}
            {tabName === "job-platform" && <AllJobPlatform/>}
            {tabName === "work-location" && <AllWorkLocation />}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
