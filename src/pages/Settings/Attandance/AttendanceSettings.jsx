// =====================================
// #00141
// =====================================

import React, { useEffect, useState } from "react";
import Headings from "../../../components/Headings/Headings";
import { MdRoomPreferences } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { RiMapPinRangeFill } from "react-icons/ri";
import GeoLocationAndIp from "./GeoLocationAndIp";
import Definitions from "./Definitions";
import Preferences from "./Preferences";
import CustomToaster from "../../../components/CustomToaster";
import {
  getAttendanceSettings,
  updateAttendanceSettings,
} from "../../../apis/attendence/attendence";
import CustomLoading from "../../../components/CustomLoading";
import toast from "react-hot-toast";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import CheckPermission from "../../../CheckPermission";
import {
  ATTENDANCE_VIEW,
  EMPLOYEE_VIEW,
  SETTING_ATTENDANCE_CREATE,
  SETTING_ATTENDANCE_VIEW,
} from "../../../constant/permissions";

export default function AttendanceSettings() {
  const [tabName, setTabName] = useState("preference");
  const [loadingFetchData, setLoadingFetchData] = useState(false);
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  // initialize the form data stata
  const [formData, setFormData] = useState({
    alert_area: [],
    punch_in_time_tolerance: null,
    work_availability_definition: null,
    punch_in_out_alert: false,
    punch_in_out_interval: null,
    auto_approval: false,
    special_users: [],
    special_roles: [],
  });

  // onChange update formdata
  const handleInputChange = (event) => {
    setFormData((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const getAllAttendenceSettings = () => {
    setLoadingFetchData(true);
    // GETTING ATTENDANCE
    getAttendanceSettings()
      .then((res) => {
        console.log({ r: res[0] });
        setFormData(
          res?.length > 0
            ? {
                ...res[0],
                special_roles:
                  res[0]?.special_roles?.length > 0
                    ? res[0]?.special_roles?.map((res) => {
                        return res?.id;
                      })
                    : [],
                special_users:
                  res[0]?.special_users?.length > 0
                    ? res[0]?.special_users?.map((res) => {
                        return res?.id;
                      })
                    : [],
                alert_area: res[0]?.alert_area || [],
                punch_in_time_tolerance:
                  res[0]?.punch_in_time_tolerance * 60 || 0,
              }
            : {}
        );

        setLoadingFetchData(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingFetchData(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  // fetch settings
  useEffect(() => {
    getAllAttendenceSettings();
  }, []);

  // update the data
  const handleAttendenceSettingUpdate = () => {
    setIsPendingSubmit(true);
    updateAttendanceSettings({
      ...formData,
      punch_in_time_tolerance: formData?.punch_in_time_tolerance / 60,
    })
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Settings updated successfully!`}
          />
        ));
        getAllAttendenceSettings();
      })
      .catch((error) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  useEffect(() => {
    console.log({ formData });
  }, [formData]);
  return (
    <CheckPermission permissionArray={[SETTING_ATTENDANCE_CREATE]}>
      <div className="w-full">
        <div>
          <Headings level={1}>Attendance Settings</Headings>{" "}
        </div>

        <div>
          {/* TAB BUTTONS  */}
          <div
            className={`py-5 my-5 flex flex-row justify-center items-center gap-5`}
          >
            <button
              data-tip="Preference"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 lg:w-72 btn-primary shadow-xl shadow-primary-content ${
                tabName === "preference" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("preference")}
            >
              <MdRoomPreferences className="text-2xl" />{" "}
              <span className="hidden lg:inline-block">Preference</span>
            </button>
            <button
              data-tip="Definitions"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 lg:w-72 btn-primary shadow-xl shadow-primary-content  ${
                tabName === "definitions" ? "text-base-300" : "btn-outline"
              }`}
              onClick={() => setTabName("definitions")}
            >
              <TbListDetails className="text-2xl" />{" "}
              <span className="hidden lg:inline-block">Definitions</span>
            </button>
            <button
              data-tip="Geolocation & IP"
              className={`tooltip tooltip-primary flex justify-center items-center  btn w-16 lg:w-72 btn-primary shadow-xl shadow-primary-content  ${
                tabName === "geolocation-and-ip"
                  ? "text-base-300"
                  : "btn-outline"
              }`}
              onClick={() => setTabName("geolocation-and-ip")}
            >
              <RiMapPinRangeFill className="text-2xl" />{" "}
              <span className="hidden lg:inline-block">Geolocation & IP</span>
            </button>
          </div>
          {loadingFetchData ? (
            <CustomLoading />
          ) : (
            <div className="w-full md:w-5/6 mx-auto mb-10">
              {tabName === "preference" && (
                <Preferences
                  isPendingSubmit={isPendingSubmit}
                  loadingFetchData={loadingFetchData}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {tabName === "definitions" && (
                <Definitions
                  handleInputChange={handleInputChange}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {tabName === "geolocation-and-ip" && (
                <GeoLocationAndIp
                  handleInputChange={handleInputChange}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              <div className="w-full flex justify-end">
                <button
                  onClick={handleAttendenceSettingUpdate}
                  className="btn w-1/2 lg:btn-wide btn-primary mt-5"
                >
                  {isPendingSubmit ? <ButtonSpinner /> : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CheckPermission>
  );
}
