// =====================================
// #00141
// =====================================

import React from "react";
import CustomField from "../../../components/InputFields/CustomField";

const Definitions = ({ formData, handleInputChange, setFormData }) => {
  return (
    <div className="w-full mx-auto my-10 border-b border-primary-content lg:border-b-0 lg:rounded-xl lg:shadow-xl p-5 lg:shadow-primary-content lg:border lg:border-gray-300">
      {/* Clock in time tolerance(Minutes) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
        <div className="col-span-1">
          <p>Clock in time tolerance(Minutes)</p>
          <p className="italic text-gray-500 text-sm">
            The adjustment considers the punch in time based on a work shift.
          </p>
        </div>
        <div className="col-span-4">
          <CustomField
            disable={false}
            fieldClassName={"w-full"}
            id={"punch_in_time_tolerance"}
            name={"punch_in_time_tolerance"}
            onChange={handleInputChange}
            value={formData?.punch_in_time_tolerance}
            placeholder={""}
            type={"number"}
            wrapperClassName={"w-full"}
          />
          <div className="flex items-center mt-5">
            <div className="flex flex-col items-start md:items-center">
              <p
                className={`bg-[#f97316] rounded-full inline px-5 py-1 shadow-md text-white`}
              >
                Early
              </p>
              <p className="text-gray-500">Before on time</p>
            </div>
            <div className="flex flex-col items-start md:items-center mx-10">
              <p
                className={`bg-[#22c55e] rounded-full inline-block px-5 py-1 shadow-md text-white`}
              >
                Regular
              </p>
              <p className="text-gray-500">On time to tolerance Late</p>
            </div>
            <div className="flex flex-col md:items-center">
              <p
                className={`bg-[#ef4444] rounded-full w-16 text-center inline-block py-1 shadow-md text-white`}
              >
                Late
              </p>
              <p className="text-gray-500">After tolerance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Work availability definition(Percentage) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
        <div className="col-span-1">
          <p>Work availability definition(Percentage)</p>
          <p className="italic text-gray-500 text-sm">
            The attendance percentage that defines an employee Good or Bad.
          </p>
        </div>
        <div className="col-span-4">
          <CustomField
            disable={false}
            fieldClassName={"w-full"}
            id={"work_availability_definition"}
            name={"work_availability_definition"}
            onChange={handleInputChange}
            value={formData?.work_availability_definition}
            placeholder={""}
            type={"number"}
            wrapperClassName={"w-full"}
          />
          <div className="flex items-center mt-5">
            <div className="flex flex-col items-start md:items-center mr-10">
              <p
                className={`bg-[#22c55e] rounded-full inline-block px-5 py-1 shadow-md text-white`}
              >
                Good
              </p>
              <p className="text-gray-500">Equal or above of the percent</p>
            </div>
            <div className="flex flex-col items-start md:items-center">
              <p
                className={`bg-[#ef4444] rounded-full inline-block px-5 py-1 shadow-md text-white`}
              >
                Bad
              </p>
              <p className="text-gray-500">Bellow the percent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clock In/Out alert */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-8 mb-10">
        <div className="col-span-1">
          <p>Clock In/Out alert</p>
          <p className="italic text-gray-500 text-sm">
            System will show a popup message in defined interval if a user does
            not punch in or out according to his work shift.
          </p>
        </div>
        <div className="col-span-4">
          <input
            type="checkbox"
            id={"punch_in_out_alert"}
            name={"punch_in_out_alert"}
            value={formData?.punch_in_out_alert}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                punch_in_out_alert: e.target.checked,
              }))
            }
            checked={
              formData?.punch_in_out_alert || formData?.punch_in_out_alert === 1
            }
            className="toggle block toggle-primary checked:bg-primary"
          />
        </div>
      </div>

      {/* Alert area */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
        <div className="col-span-1">
          <p>Alert area</p>
          <p className="italic text-gray-500 text-sm">
            Selecting web will only show popup on browser tab and selecting
            system will show alert on your system.
          </p>
        </div>
        <div className="col-span-4">
          <div className="flex gap-5">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="toggle toggle-sm md:toggle-md toggle-primary mr-2"
                id={"alert_area"}
                name={"alert_area"}
                value={"web"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      alert_area: [...prev?.alert_area, e.target.value],
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      alert_area: prev?.alert_area?.filter(
                        (fill) => fill !== "web"
                      ),
                    }));
                  }
                }}
                checked={formData?.alert_area?.includes("web")}
              />
              <label htmlFor="web">Web</label>
            </div>
            <div className="flex items-center ml-2">
              <input
                type="checkbox"
                className="toggle toggle-sm md:toggle-md toggle-primary mr-2"
                id={"alert_area"}
                name={"alert_area"}
                value={"system"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      alert_area: [...prev?.alert_area, e.target.value],
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      alert_area: prev?.alert_area?.filter(
                        (fill) => fill !== "system"
                      ),
                    }));
                  }
                }}
                checked={formData?.alert_area?.includes("system")}
              />
              <label htmlFor="web">System</label>
            </div>
          </div>
        </div>
      </div>

      {/* CLOCK ALERT INTERVAL  */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
        <div className="col-span-1">
          <p>Clock alert interval</p>
          <p className="italic text-gray-500 text-sm">(In second)</p>
        </div>
        <div className="col-span-4">
          <CustomField
            disable={false}
            fieldClassName={"w-full"}
            id={"punch_in_out_interval"}
            name={"punch_in_out_interval"}
            onChange={handleInputChange}
            value={formData?.punch_in_out_interval}
            placeholder={""}
            type={"number"}
            wrapperClassName={"w-full"}
          />
        </div>
      </div>
    </div>
  );
};

export default Definitions;
