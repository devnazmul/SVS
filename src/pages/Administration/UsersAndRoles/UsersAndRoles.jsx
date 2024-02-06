// =====================================
// #00109
// =====================================

import React, { useEffect, useState } from "react";
import AllUsers from "./AllUsers";
import AllRole from "./Role/AllRole";
import { BiPlus } from "react-icons/bi";
import Headings from "../../../components/Headings/Headings";
import { LuUsers } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import { getAllUsersWIthoutPaginationV2 } from "../../../apis/userAndBusiness/user";
import ButtonLoading from "../../../components/ButtonLoading";
import CustomPopup from "../../../components/CustomPopup";
import AssignRoles from "./Role/AssignRoles";
import { ROLE_VIEW, USER_VIEW } from "../../../constant/permissions";
import CheckPermission from "../../../CheckPermission";

export default function UsersAndRoles() {
  const { user } = useAuth();
  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());
  // HANDLE CREATE
  const [isUserCreateTriggered, setIsUserCreateTriggered] = useState(false);
  const [isRoleCreateTriggered, setIsRoleCreateTriggered] = useState(false);
  const handleCreateUser = () => {
    setIsUserCreateTriggered(true);
  };
  const handleCreateRole = () => {
    setIsRoleCreateTriggered(true);
  };

  const [userAnalytics, setUserAnalytics] = useState();

  const [isGettingData, setIsGettingData] = useState(true);
  useEffect(() => {
    setIsGettingData(true);
    getAllUsersWIthoutPaginationV2()
      .then((res) => {
        setUserAnalytics(res?.data_highlights);
        setIsGettingData(false);
      })
      .catch((error) => {
        setIsGettingData(false);

        console.log({ error });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [isUpdated]);

  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {},
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  // assign role function

  const handleAssignRole = () => {
    setPopupOption({
      open: true,
      type: "assign",
      title: "Assign Role",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };

  return (
    <CheckPermission permissionArray={[USER_VIEW, ROLE_VIEW]}>
      <div className="w-full h-[85vh] pb-5">
        <div>
          {/* PAGE HEADER  */}
          <div className="flex flex-col lg:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center lg:text-left">
              {user?.business_id || user?.roles[0]?.name === "superadmin" ? (
                <Headings level={1}>Users & Roles</Headings>
              ) : (
                <Headings level={1}>Users</Headings>
              )}
            </div>

            <div className="flex flex-col justify-end lg:flex-row gap-5 w-full">
              <div className="flex justify-between md:justify-start gap-5">
                {user?.roles[0]?.name === "superadmin" ? (
                  <button
                    onClick={handleCreateUser}
                    className="btn btn-primary w-1/3 md:w-20 lg:w-36"
                  >
                    <BiPlus />{" "}
                    <span className="block sm:hidden lg:block">
                      Create User
                    </span>
                  </button>
                ) : (
                  ""
                )}

                {/* IF USER IS NOT A ADMIN AND DON"T HAVE A BUSINESS  */}
                {user?.roles[0]?.name === "superadmin" ? (
                  <button
                    onClick={handleCreateRole}
                    className="btn btn-primary w-1/3 md:w-20 lg:w-36"
                  >
                    <BiPlus />{" "}
                    <span className="block sm:hidden lg:block">
                      Create Role
                    </span>
                  </button>
                ) : (
                  ""
                )}

                {/* IF USER IS A BUSINESS OWNER  */}
                {user?.business_id ? (
                  <button
                    onClick={handleAssignRole}
                    className="btn btn-primary w-1/3 md:w-20 lg:w-36"
                  >
                    <BiPlus />{" "}
                    <span className="block sm:hidden lg:block">
                      Assign Role
                    </span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* ANALYTICS  */}
          <div className="flex lg:flex-row flex-col gap-5 mt-10 mb-16">
            <div
              className={`bg-base-300 rounded-xl p-5 w-full lg:w-1/2 shadow-md`}
            >
              <div className="mb-2">
                <span className="text-xl font-medium">Current Users</span>
              </div>
              <div className="flex items-center justify-start gap-3">
                <div className="flex justify-center h-16 w-16 items-center rounded-xl shadow-md shadow-primary-content px-5 py-4 bg-primary">
                  <LuUsers className="text-base-300 text-2xl" />
                </div>
                <div className="font-bold text-5xl">
                  {isGettingData ? (
                    <ButtonLoading />
                  ) : (
                    userAnalytics?.total_users
                  )}
                </div>
              </div>
            </div>

            {/* IF USER IS NOT A ADMIN AND DON"T HAVE A BUSINESS  */}

            <div className="bg-base-300 rounded-xl p-5 w-full lg:w-1/2 shadow-md">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-xl font-medium">Active Users</span>{" "}
                <span className="text-xl font-medium">
                  {isGettingData ? (
                    <ButtonLoading />
                  ) : (
                    userAnalytics?.total_active_users
                  )}
                </span>
              </div>
              <div className="flex flex-col items-start justify-center gap-3">
                <div className="font-bold text-4xl">
                  {isGettingData ? (
                    <ButtonLoading />
                  ) : (
                    <>
                      {userAnalytics?.total_active_users > 0 &&
                      userAnalytics?.total_users > 0
                        ? (
                            (userAnalytics?.total_active_users /
                              userAnalytics?.total_users) *
                            100
                          ).toFixed(2)
                        : 0}
                      %
                    </>
                  )}
                </div>
                <progress
                  className="progress progress-primary h-5 w-11/12"
                  value={
                    (userAnalytics?.total_active_users /
                      userAnalytics?.total_users) *
                    100
                  }
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 flex-col lg:flex-row">
          <div
            className={`${
              user?.business_id || user?.roles[0]?.name === "superadmin"
                ? "lg:w-1/2"
                : ""
            } w-full`}
          >
            <AllUsers
              isUpdated={isUpdated}
              setIsUpdated={setIsUpdated}
              isCreateTriggered={isUserCreateTriggered}
              setIsCreateTriggered={setIsUserCreateTriggered}
            />
          </div>

          {/* IF USER IS NOT A ADMIN AND DON"T HAVE A BUSINESS  */}
          {user?.business_id || user?.roles[0]?.name === "superadmin" ? (
            <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
              <AllRole
                isUpdated={isUpdated}
                setIsUpdated={setIsUpdated}
                isCreateTriggered={isRoleCreateTriggered}
                setIsCreateTriggered={setIsRoleCreateTriggered}
              />
            </div>
          ) : (
            ""
          )}

          {/* ASSIGN ROLE CREATE POPUP */}
          <CustomPopup
            popupClasses={`w-[70vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <AssignRoles
                handleClosePopup={() => {
                  setPopupOption({
                    open: false,
                    type: "",
                    id: null,
                    onClose: () => {
                      setPopupOption({ ...popupOption, open: false });
                      setIsUpdated(Math.random());
                    },
                    overlayStyle: { background: "red" },
                    closeOnDocumentClick: false,
                  });
                }}
              />
            }
          />
        </div>
      </div>
    </CheckPermission>
  );
}
