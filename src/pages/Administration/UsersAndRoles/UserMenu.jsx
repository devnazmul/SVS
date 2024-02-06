import React, { useEffect, useState } from "react";

export default function UserMenu({
  onClick = (e) => {
    return e;
  },
}) {
  const [selectedMenu, setSelectedMenu] = useState("Personal Details");
  useEffect(() => {
    onClick(selectedMenu);
  }, [selectedMenu]);
  return (
    <div className="mb-5">
      {/* FOR MOBILE  */}
      <div className="collapse lg:hidden collapse-arrow bg-base-200 shadow-md shadow-primary-content">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title text-xl font-medium bg-primary text-base-300">
          {selectedMenu}
        </div>
        <div className="collapse-content">
          <div className="mt-4 flex flex-col gap-1 justify-between items-center  py-2">
            <button
              className={`${
                selectedMenu !== "Personal Details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Personal Details")}
            >
              Personal Details
            </button>

            <button
              className={`${
                selectedMenu !== "Activity Log" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Activity Log")}
            >
              Activity Log
            </button>

            {/* <button
              className={`${
                selectedMenu !== "Leave Allowance" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Leave Allowance")}
            >
              Leave Allowance
            </button>

            <button
              className={`${
                selectedMenu !== "Attendance" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Attendance")}
            >
              Attendance
            </button>

            <button
              className={`${
                selectedMenu !== "Leave" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Leave")}
            >
              Leave
            </button>

            <button
              className={`${
                selectedMenu !== "Documents" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Documents")}
            >
              Documents
            </button>

            <button
              className={`${
                selectedMenu !== "Assets" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Assets")}
            >
              Assets
            </button>

            <button
              className={`${
                selectedMenu !== "Job History" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Job History")}
            >
              Job History
            </button>

            <button
              className={`${
                selectedMenu !== "Job History" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Salary Overview")}
            >
              Salary Overview
            </button>

            <button
              className={`${
                selectedMenu !== "Pay Run & Badge" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Pay Run & Badge")}
            >
              Pay Run & Badge
            </button>

            <button
              className={`${
                selectedMenu !== "Pay Slip" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Pay Slip")}
            >
              Pay Slip
            </button>

            <button
              className={`${
                selectedMenu !== "Address details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Address details")}
            >
              Address details
            </button>

            <button
              className={`${
                selectedMenu !== "Contact" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Contact")}
            >
              Contact
            </button>

            <button
              className={`${
                selectedMenu !== "Social Links" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Social Links")}
            >
              Social Links
            </button> */}
          </div>
        </div>
      </div>

      {/* FOR DESKTOP  */}
      <div className="mt-1 hidden lg:grid lg:grid-cols-5 justify-center  gap-2">
        <button
          className={`${
            selectedMenu !== "Personal Details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-52`}
          onClick={() => setSelectedMenu("Personal Details")}
        >
          Personal Details
        </button>

        <button
          className={`${
            selectedMenu !== "Activity Log"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-52`}
          onClick={() => setSelectedMenu("Activity Log")}
        >
          Activity Log
        </button>

        {/* <button
          className={`${
            selectedMenu !== "Leave Allowance"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Leave Allowance")}
        >
          Leave Allowance
        </button>

        <button
          className={`${
            selectedMenu !== "Attendance"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Attendance")}
        >
          Attendance
        </button>

        <button
          className={`${
            selectedMenu !== "Leave"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Leave")}
        >
          Leave
        </button>

        <button
          className={`${
            selectedMenu !== "Documents"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Documents")}
        >
          Documents
        </button>

        <button
          className={`${
            selectedMenu !== "Assets"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Assets")}
        >
          Assets
        </button>

        <button
          className={`${
            selectedMenu !== "Job History"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Job History")}
        >
          Job History
        </button>

        <button
          className={`${
            selectedMenu !== "Job History"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Salary Overview")}
        >
          Salary Overview
        </button>

        <button
          className={`${
            selectedMenu !== "Pay Run & Badge"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Pay Run & Badge")}
        >
          Pay Run & Badge
        </button>

        <button
          className={`${
            selectedMenu !== "Pay Slip"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Pay Slip")}
        >
          Pay Slip
        </button>

        <button
          className={`${
            selectedMenu !== "Address details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Address details")}
        >
          Address details
        </button>

        <button
          className={`${
            selectedMenu !== "Contact"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Contact")}
        >
          Contact
        </button>

        <button
          className={`${
            selectedMenu !== "Social Links"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Social Links")}
        >
          Social Links
        </button> */}
      </div>
    </div>
  );
}
