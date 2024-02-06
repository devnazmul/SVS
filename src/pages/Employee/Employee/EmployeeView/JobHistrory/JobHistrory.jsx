import React, { useEffect, useState } from "react";
import {
  deleteJobHistory,
  getAllJobHistoriesWithoutPerPageForAUser,
} from "../../../../../apis/employee/jobHistory";
import CustomToaster from "../../../../../components/CustomToaster";
import toast from "react-hot-toast";
import CustomPathComponent from "../../../../../components/Path/CustomPathComponent";
import { PiGlobeStandFill } from "react-icons/pi";
import PathLeft from "./components/PathLeft";
import PathRight from "./components/PathRight";
import { MdOutlineBusinessCenter } from "react-icons/md";
import NoDataFound from "../../../../../components/NoDataFound";
import Headings from "../../../../../components/Headings/Headings";
import { BiPlus } from "react-icons/bi";
import CustomPopup from "../../../../../components/CustomPopup";
import AddJobHistory from "./components/AddAndUpdateJobHistory";
import CustomLoading from "../../../../../components/CustomLoading";
import UpdateJobHistory from "./components/UpdateJobHistory";
import AddAndUpdateJobHistory from "./components/AddAndUpdateJobHistory";
import Swal from "sweetalert2";
import CheckPermission from "../../../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../../../constant/permissions";

export default function JobHistory({ userInfo, setUserInfo }) {
  const [jobHistory, setJobHistory] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(Math.random());
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
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

  // DELETE API
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteFunc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        title: "text-primary",
        container: "",
        popup: "bg-base-300 shadow-xl rounded-xl border border-primary",
        icon: "text-red-500",
        cancelButton: "bg-green-500",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleteLoading(true);
        deleteJobHistory(id)
          .then((res) => {
            setIsUpdated(Math.random());
            Swal.fire({
              title: "Deleted!",
              text: "Job history has been deleted.",
              icon: "success",
            });
            setIsDeleteLoading(false);
          })
          .catch((error) => {
            setIsDeleteLoading(false);
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"error"}
                text={`ID: #00119 - ${error?.response?.data?.message}`}
                errors={error?.response?.data?.errors}
              />
            ));
          });
      }
    });
  };

  // HANDLER FUNCTIONS
  // CREATE HANDLER
  const handleCreate = () => {
    setPopupOption({
      title: "Add Job History",
      open: true,
      type: "add",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };
  // UPDATE HANDLER
  const handleUpdate = (id) => {
    setPopupOption({
      title: "Update Job History",
      open: true,
      type: "edit",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteFunc(id);
  };

  useEffect(() => {
    setIsDataLoading(true);
    getAllJobHistoriesWithoutPerPageForAUser(userInfo?.id)
      .then((res) => {
        if (res.length > 0) {
          setJobHistory(
            res.map((jh) => ({
              id: jh?.id,
              Icon: MdOutlineBusinessCenter,
              LeftSection: <PathLeft data={jh} />,
              RightSection: (
                <PathRight
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  data={jh}
                />
              ),
            }))
          );
        } else {
          setJobHistory([]);
        }
        setIsDataLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setIsDataLoading(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [userInfo, isUpdated]);

  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[USER_VIEW]}>
        <div className="py-5 ">
          {/* POPUP  */}
          <CustomPopup
            popupClasses={`w-[70vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {popupOption?.type === "add" && (
                  <AddAndUpdateJobHistory
                    userId={userInfo?.id}
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
                {popupOption?.type === "edit" && (
                  <AddAndUpdateJobHistory
                    userId={userInfo?.id}
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
          {/* TITLE  */}
          <div className="flex items-center justify-between mb-5">
            <Headings level={2}>Job History</Headings>
            <button
              onClick={handleCreate}
              className="btn btn-primary w-1/3 md:w-16 lg:w-32"
            >
              <BiPlus className="text-xl" />{" "}
              <span className="block sm:hidden md:block">Add</span>
            </button>
          </div>

          {/* MAIN  */}
          {jobHistory.length > 0 ? (
            <CustomPathComponent values={jobHistory} />
          ) : (
            <NoDataFound
              h="h-[400px]"
              text={`No Job History Found!`}
              backButton={false}
            />
          )}
        </div>
      </CheckPermission>
    );
  }
}
