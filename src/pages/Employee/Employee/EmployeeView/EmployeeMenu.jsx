import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encryptID } from "../../../../utils/encryptAndDecryptID";
import { formatRole } from "../../../../utils/formatRole";

export default function EmployeeMenu({ id, tab }) {
  const navigate = useNavigate();
  // CHANGE NAVBAR COLLAPSE
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleClick = (e) => {
    if (e.target.checked) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="mb-5">
      {/* FOR MOBILE  */}
      <div className="collapse lg:hidden collapse-arrow bg-base-200 shadow-md shadow-primary-content">
        <input
          onChange={handleClick}
          checked={isMenuOpen}
          type="checkbox"
          name="my-accordion-2"
        />
        <div className="collapse-title text-xl font-medium bg-primary text-base-300">
          {formatRole(tab)}
        </div>
        <div className="collapse-content ">
          <div className="mt-4 flex flex-col gap-1 justify-between items-center  py-2">
            <button
              className={`${
                tab !== "personal_details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(
                  `/employee/view/${encryptID(id)}?tab=personal_details`
                );
              }}
            >
              Personal Details
            </button>

            {/*  <button
              className={`${
                selectedMenu !== "Activity Log" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Activity Log")}
            >
              Activity Log
            </button> */}

            <button
              className={`${
                tab !== "leave_allowance" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=leave_allowance`);
              }}
            >
              Leave Allowance
            </button>

            <button
              className={`${
                tab !== "attendance" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=attendance`);
              }}
            >
              Attendance
            </button>

            <button
              className={`${
                tab !== "leave" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=leave`);
              }}
            >
              Leave
            </button>

            <button
              className={`${
                tab !== "documents" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=documents`);
              }}
            >
              Documents
            </button>

            <button
              className={`${
                tab !== "assets" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=assets`);
              }}
            >
              Assets
            </button>

            <button
              className={`${
                tab !== "education_history" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(
                  `/employee/view/${encryptID(id)}?tab=education_history`
                );
              }}
            >
              Education History
            </button>

            <button
              className={`${
                tab !== "job_history" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=job_history`);
              }}
            >
              Job History
            </button>

            <button
              className={`${
                tab !== "immigration_details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(
                  `/employee/view/${encryptID(
                    id
                  )}?tab=immigration_details&sub_tab=cos`
                );
              }}
            >
              Immigration Details
            </button>

            {/* <button
              className={`${
                selectedMenu !== "Salary Overview" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Salary Overview")}
            >
              Salary Overview
            </button> */}

            {/* <button
              className={`${
                selectedMenu !== "Payrun & Badge" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Payrun & Badge")}
            >
              Payrun & Badge
            </button> */}

            {/* <button
              className={`${
                selectedMenu !== "Pay Slip" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Pay Slip")}
            >
              Pay Slip
            </button> */}

            <button
              className={`${
                tab !== "address_details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=address_details`);
              }}
            >
              Address details
            </button>

            <button
              className={`${
                tab !== "contact" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=contact`);
              }}
            >
              Contact
            </button>

            <button
              className={`${
                tab !== "notes" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=notes`);
              }}
            >
              Notes
            </button>

            <button
              className={`${
                tab !== "social_links" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => {
                navigate(`/employee/view/${encryptID(id)}?tab=social_links`);
              }}
            >
              Social Links
            </button>
          </div>
        </div>
      </div>

      {/* FOR DESKTOP  */}
      <div className="mt-1 hidden lg:grid md:grid-cols-5 lg:grid-cols-6 gap-2">
        <button
          className={`${
            tab !== "personal_details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=personal_details`);
          }}
        >
          Personal Details
        </button>

        {/* <button
          className={`${selectedMenu !== "Activity Log"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
            } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Activity Log")}
        >
          Activity Log
        </button> */}

        <button
          className={`${
            tab !== "leave_allowance"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=leave_allowance`);
          }}
        >
          Leave Allowance
        </button>

        <button
          className={`${
            tab !== "attendance"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=attendance`);
          }}
        >
          Attendance
        </button>

        <button
          className={`${
            tab !== "leave" ? "btn-outline" : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=leave`);
          }}
        >
          Leave
        </button>

        <button
          className={`${
            tab !== "documents"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=documents`);
          }}
        >
          Documents
        </button>

        <button
          className={`${
            tab !== "assets"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=assets`);
          }}
        >
          Assets
        </button>

        <button
          className={`${
            tab !== "education_history"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=education_history`);
          }}
        >
          Education History
        </button>

        <button
          className={`${
            tab !== "job_history"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=job_history`);
          }}
        >
          Job History
        </button>

        <button
          className={`${
            tab !== "immigration_details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(
              `/employee/view/${encryptID(
                id
              )}?tab=immigration_details&sub_tab=cos`
            );
          }}
        >
          Immigration Details
        </button>

        {/* <button
          className={`${
            selectedMenu !== "Salary Overview"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Salary Overview")}
        >
          Salary Overview
        </button> */}

        {/* <button
          className={`${
            selectedMenu !== "Pay Run & Badge"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Pay Run & Badge")}
        >
          Pay Run & Badge
        </button> */}
        {/*
        <button
          className={`${
            selectedMenu !== "Pay Slip"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => setSelectedMenu("Pay Slip")}
        >
          Pay Slip
        </button> */}

        <button
          className={`${
            tab !== "address_details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=address_details`);
          }}
        >
          Address details
        </button>

        <button
          className={`${
            tab !== "contact"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=contact`);
          }}
        >
          Contact
        </button>

        <button
          className={`${
            tab !== "notes" ? "btn-outline" : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=notes`);
          }}
        >
          Notes
        </button>

        <button
          className={`${
            tab !== "social_links"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=social_links`);
          }}
        >
          Social Links
        </button>
      </div>
    </div>
  );
}
