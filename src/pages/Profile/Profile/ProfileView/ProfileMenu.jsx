import React, { useEffect, useState } from "react";

export default function ProfileMenu({
  onClick = (e) => {
    return e;
  },
  userInfo,
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
        <div className="collapse-content ">
          <div className="mt-4 flex flex-col gap-1 justify-between items-center  py-2">
            <button
              className={`${
                selectedMenu !== "Personal Details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Personal Details")}
            >
              Personal Details
            </button>

            {userInfo?.business_id ? (
              <button
                className={`${
                  selectedMenu !== "Business Details" && "btn-outline"
                } font-semibold btn btn-primary w-full`}
                onClick={() => setSelectedMenu("Business Details")}
              >
                Business Details
              </button>
            ) : (
              ""
            )}
            {userInfo?.business_id ? (
              <button
                className={`${
                  selectedMenu !== "Business Timing" && "btn-outline"
                } font-semibold btn btn-primary w-full`}
                onClick={() => setSelectedMenu("Business Timing")}
              >
                Business Timing
              </button>
            ) : (
              ""
            )}

            {/* <button
              className={`${
                selectedMenu !== "Activity Log" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Activity Log")}
            >
              Activity Log
            </button> */}

            <button
              className={`${
                selectedMenu !== "Change Password" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Change Password")}
            >
              Change Password
            </button>
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
          } font-semibold btn btn-primary w-full mx-auto`}
          onClick={() => setSelectedMenu("Personal Details")}
        >
          Personal Details
        </button>

        {userInfo?.business_id ? (
          <button
            className={`${
              selectedMenu !== "Business Details"
                ? "btn-outline"
                : "shadow-lg shadow-primary-content"
            } font-semibold btn btn-primary w-full mx-auto`}
            onClick={() => setSelectedMenu("Business Details")}
          >
            Business Details
          </button>
        ) : (
          ""
        )}

        {userInfo?.business_id ? (
          <button
            className={`${
              selectedMenu !== "Business Timing"
                ? "btn-outline"
                : "shadow-lg shadow-primary-content"
            } font-semibold btn btn-primary w-full mx-auto`}
            onClick={() => setSelectedMenu("Business Timing")}
          >
            Business Timing
          </button>
        ) : (
          ""
        )}

        {/* <button
          className={`${
            selectedMenu !== "Activity Log"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-full mx-auto`}
          onClick={() => setSelectedMenu("Activity Log")}
        >
          Activity Log
        </button> */}

        <button
          className={`${
            selectedMenu !== "Change Password"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-full mx-auto`}
          onClick={() => setSelectedMenu("Change Password")}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
