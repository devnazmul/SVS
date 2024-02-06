import React, { useEffect, useState } from "react";
import CustomToaster from "../../../../../components/CustomToaster";
import toast from "react-hot-toast";
import CustomPathComponent from "../../../../../components/Path/CustomPathComponent";
import PathLeft from "./components/PathLeft";
import PathRight from "./components/PathRight";
import { MdOutlineBusinessCenter } from "react-icons/md";
import NoDataFound from "../../../../../components/NoDataFound";
import Headings from "../../../../../components/Headings/Headings";
import { BiPlus } from "react-icons/bi";
import CustomPopup from "../../../../../components/CustomPopup";
import CustomLoading from "../../../../../components/CustomLoading";
import Swal from "sweetalert2";
import CheckPermission from "../../../../../CheckPermission";
import { USER_VIEW } from "../../../../../constant/permissions";
import {
  deleteEducationHistory,
  getAllEducationHistoriesWithoutPerPageForAUser,
} from "../../../../../apis/employee/educationHistory";
import AddAndUpdateEducationHistory from "./components/AddAndUpdateEducationHistory";
import { FaGraduationCap } from "react-icons/fa";

export default function EducationHistory({ userInfo, setUserInfo }) {
  const [educationHistory, setEducationHistory] = useState([]);
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
        deleteEducationHistory(id)
          .then((res) => {
            setIsUpdated(Math.random());
            Swal.fire({
              title: "Deleted!",
              text: "Education history has been deleted.",
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
      title: "Education",
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
      title: "Update Education",
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
    getAllEducationHistoriesWithoutPerPageForAUser(userInfo?.id)
      .then((res) => {
        if (res.length > 0) {
          setEducationHistory(
            res.map((eh) => ({
              id: eh?.id,
              Icon: FaGraduationCap,
              LeftSection: <PathLeft data={eh} />,
              RightSection: (
                <PathRight
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  data={eh}
                />
              ),
            }))
          );
        } else {
          setEducationHistory([]);
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
                  <AddAndUpdateEducationHistory
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
                  <AddAndUpdateEducationHistory
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
            <Headings level={2}>Education History</Headings>
            <button
              onClick={handleCreate}
              className="btn btn-primary w-1/3 md:w-16 lg:w-32"
            >
              <BiPlus className="text-xl" />{" "}
              <span className="block sm:hidden md:block">Add</span>
            </button>
          </div>

          {/* MAIN  */}
          {educationHistory.length > 0 ? (
            <CustomPathComponent values={educationHistory} />
          ) : (
            <NoDataFound
              h="h-[400px]"
              text={`No Education History Found!`}
              backButton={false}
            />
          )}
        </div>
      </CheckPermission>
    );
  }
}
