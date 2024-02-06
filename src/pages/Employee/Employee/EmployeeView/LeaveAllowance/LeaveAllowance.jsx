import React, { useEffect, useState } from "react";
import Headings from "../../../../../components/Headings/Headings";
import { IoWarningOutline } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import { getUsersLeaveDetails } from "../../../../../apis/userAndBusiness/user";
import CustomLoading from "../../../../../components/CustomLoading";
import CustomPopup from "../../../../../components/CustomPopup";
import UpdateAllowance from "./components/UpdateAllowance";
import CheckPermission from "../../../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../../../constant/permissions";
import NotFound from "../../../../../NotFound";
import NoDataFound from "../../../../../components/NoDataFound";

export default function LeaveAllowance({ userInfo }) {
  const [leaveAvailabilities, setLeaveAvailabilities] = useState(true);
  const [lsLeaveAvailabilityLoading, setIsLeaveAvailabilityLoading] =
    useState(true);
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    title: "",
    id: null,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
      setIsUpdated(Math.random());
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  useEffect(() => {
    getUsersLeaveDetails(userInfo?.id)
      .then((res) => {
        setLeaveAvailabilities(res);
        setIsLeaveAvailabilityLoading(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLeaveAvailabilityLoading(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [userInfo?.id]);

  // HANDLE EDIT
  const handleEdit = (id, amount) => {
    setPopupOption((prev) => ({
      ...prev,
      open: true,
      type: "edit",
      title: "Update Leave Earn",
      id: id,
      amount: amount,
    }));
  };

  return (
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div>
        {/* POPUP  */}
        <CustomPopup
          popupClasses={`w-[70vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
              {popupOption?.type === "edit" && (
                <UpdateAllowance
                  amount={popupOption?.amount}
                  id={popupOption?.id}
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
              )}
            </>
          }
        />

        <div className="py-5">
          <Headings level={2}>Leave Allowance</Headings>
        </div>
        {lsLeaveAvailabilityLoading ? (
          <CustomLoading />
        ) : (
          <div>
            {/* POLICY  */}
            <div
              className={`bg-primary-content border-2 border-primary w-full gap-2 flex transition-all duration-300 rounded-xl overflow-hidden
           h-auto py-5 px-5 my-5`}
            >
              <div>
                <IoWarningOutline className="text-2xl text-primary" />
              </div>
              <div>
                <p>
                  <span className="font-medium text-xl">Allowance Policy</span>
                  <br />
                  <ul className="list-decimal ml-5">
                    <li>Leave will start from the month of February.</li>
                    <li>
                      Any type of change will be effective on the next day
                    </li>
                  </ul>
                </p>
              </div>
            </div>

            {/* ALLOWANCE LIST  */}
            {leaveAvailabilities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pb-5 gap-5">
                {leaveAvailabilities.map((la, i) => (
                  <div
                    key={i}
                    className="border-2 border-primary-content shadow-md shadow-primary-content bg-base-300 rounded-xl py-5"
                  >
                    <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-primary-content px-5">
                      <h1 className="text-primary font-semibold">{la?.name}</h1>{" "}
                      {/* <button
                    onClick={() => {
                      handleEdit(la?.Id, parseFloat(la?.amount).toFixed(2));
                    }}
                    data-tip="Edit"
                    className="text-primary tooltip tooltip-bottom tooltip-primary"
                  >
                    <RiEdit2Fill />
                  </button> */}
                    </div>

                    <div className="flex items-center justify-between pt-3 px-5">
                      <ul>
                        <li className="block">
                          <span className="text-primary font-light">
                            Type :
                          </span>{" "}
                          <span className=" font-light ">
                            {la?.type.slice(0, 1).toUpperCase() +
                              la?.type.slice(1)}
                          </span>
                        </li>
                        <li className="block">
                          <span className="text-primary font-light">
                            Allowance :
                          </span>
                          <span className=" font-light inline-block">
                            {parseFloat(la?.amount).toFixed(2)} / month
                          </span>
                        </li>
                        <li className="block">
                          <span className="text-primary font-light">
                            Earned :
                          </span>{" "}
                          <span className=" font-light">
                            {parseFloat(la?.already_taken_hours).toFixed(2)}
                          </span>
                        </li>
                        <li className="block">
                          <span className="text-primary font-light">
                            Taken :
                          </span>{" "}
                          <span className=" font-light">
                            {parseFloat(0).toFixed(2)}
                          </span>
                        </li>
                        <li className="block">
                          <span className="text-primary font-light">
                            Availability :
                          </span>
                          <span className="font-light">
                            {parseFloat(
                              parseFloat(la?.amount) -
                                parseFloat(la?.already_taken_hours)
                            ).toFixed(2)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`flex items-center justify-center w-full`}>
                <NoDataFound
                  h="h-[400px]"
                  text={`No Leave Allowance Found!`}
                  backButton={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </CheckPermission>
  );
}
