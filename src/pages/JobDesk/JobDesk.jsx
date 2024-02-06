// =====================================
// #00130
// =====================================

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Headings from "../../components/Headings/Headings";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  JOB_LISTING_DELETE,
  JOB_LISTING_UPDATE,
  JOB_LISTING_VIEW,
} from "../../constant/permissions";
import SearchField from "../../components/InputFields/SearchField";
import CustomPopup from "../../components/CustomPopup";
import {
  deleteDepartment,
  toggleDepartmentActiveDeactive,
} from "../../apis/department/department";
import { BiPlus } from "react-icons/bi";
import CheckPermission from "../../CheckPermission";
import { deleteJobList, getAllJobLists } from "../../apis/jobDesk/jobDesk";
import JobPostCard from "./JobPostCard";
import CreateAndUpdateJobDesk from "./CreateAndUpdateJobDesk";
import CustomLoading from "../../components/CustomLoading";
import CreateAndUpdateCandidate from "./Candidate/CreateAndUpdateCandidate";

export default function JobDesk() {
  const navigate = useNavigate();
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {},
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });
  // LOADINGS
  const [isPending, setIsPending] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    start_date: "",
    end_date: "",
    search_key: "",
    order_by: "DESC",
  });

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(0);

  // GET ALL DATA
  const [data, setData] = useState([]);
  const getAllDepartmentData = () => {
    setIsPending(true);
    setIsDataLoading(true);
    getAllJobLists({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
    })
      .then((res) => {
        setData(res);
        setIsPending(false);
        setIsDataLoading(false);
      })
      .catch((error) => {
        setIsPending(false);
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
  };

  // DELETE API
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteFunction = (id) => {
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
        deleteJobList(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Job has been deleted.",
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

  // TOGGLE API
  const [isToggleLoading, setIsToggleLoading] = useState({
    id: null,
    status: false,
  });
  const toggleFunc = (id) => {
    Swal.fire({
      title: "Are you want to change the status?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        title: "text-primary",
        container: "",
        popup: "bg-base-300 shadow-xl rounded-xl border border-primary",
        icon: "text-red-500",
        cancelButton: "bg-green-500",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsToggleLoading({
          id: id,
          status: true,
        });
        toggleDepartmentActiveDeactive(id)
          .then((res) => {
            setIsUpdated(Math.random());
            Swal.fire({
              title: "Done!",
              text: "Status changed successfully.",
              icon: "success",
            });
            setIsToggleLoading({
              id: null,
              status: true,
            });
          })
          .catch((error) => {
            setIsToggleLoading({
              id: null,
              status: true,
            });
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

  // REFETCH AFTER FILTER AND DATA CHANGE
  useEffect(() => {
    getAllDepartmentData();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create",
      title: "Create Job",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE VIEW
  const handleView = (id) => {};
  // HANDLE EDIT
  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Job",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteFunction(id);
  };
  // HANDLE TOGGLE ACTIVATION
  const handleToggleActivation = (id) => {
    toggleFunc(id);
  };

  // HANDLE APPLY
  const handleApply = (id) => {
    setPopupOption({
      open: true,
      type: "apply",
      title: "Assign Candidate",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [JOB_LISTING_UPDATE],
      disabledOn: [
        {
          attributeName: "parent_id",
          value: null,
        },
      ],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isDeleteLoading,
      permissions: [JOB_LISTING_DELETE],
      disabledOn: [
        {
          attributeName: "parent_id",
          value: null,
        },
      ],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Job Title",
      attribute_name: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Job Location",
      attribute_name: "description",
      minWidth: 20,
      show: true,
    },
    {
      name: "Job Deadline",
      attribute_name: "description",
      minWidth: 20,
      show: true,
    },
    {
      name: "Job Category",
      attribute_name: "is_active",
      minWidth: 20,
      show: true,
    },
  ]);

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // FILTER TOGGLE
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const toggleFilterBar = () => {
    setIsFilterBarOpen(!isFilterBarOpen);
  };

  useEffect(() => {
    console.log({ isDataLoading });
  }, [isDataLoading]);

  return (
    <CheckPermission permissionArray={[JOB_LISTING_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          {/* POPUP  */}
          <CustomPopup
            popupClasses={`w-[70vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {popupOption?.type === "apply" && (
                  <CreateAndUpdateCandidate
                    jobId={popupOption?.id}
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

                {popupOption?.type === "create" && (
                  <CreateAndUpdateJobDesk
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
                  <CreateAndUpdateJobDesk
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

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <Headings level={1}>All Jobs</Headings>
              <h3>
                Total {data?.total} {data?.total > 1 ? "Jobs" : "Job"} Found
              </h3>
            </div>

            <div className="flex flex-col justify-end md:flex-row gap-5 w-full">
              <SearchField
                handleChange={(e) => {
                  setFilters({
                    ...filters,
                    search_key: e.target.value,
                    page: 1,
                  });
                }}
              />
              <div className="flex justify-end md:justify-start gap-5">
                <button
                  onClick={handleCreate}
                  className="btn btn-primary w-1/3 md:w-16 lg:w-32"
                >
                  <BiPlus />{" "}
                  <span className="block sm:hidden lg:block">Create</span>
                </button>
                {/* <button
                  onClick={toggleFilterBar}
                  className="btn btn-primary w-1/3 md:w-16 lg:w-32"
                >
                  <FiFilter />{" "}
                  <span className="block sm:hidden lg:block">Filter</span>
                </button> */}
              </div>
            </div>
          </div>
          {/* ================================================  */}
          {/*================= Job desk list area ============== */}
          <div className={`mt-5`}>
            {isDataLoading ? (
              <CustomLoading />
            ) : data?.data?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-5">
                {data?.data?.map((job, i) => (
                  <>
                    <JobPostCard
                      handleApply={handleApply}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      job={job}
                      key={i}
                    />
                  </>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center flex-col h-[70vh]">
                <div className="w-[200px] flex flex-col gap-2 justify-center items-center">
                  <img
                    className="w-20"
                    src="/assets/nodatafound.svg"
                    alt="no data found"
                  />
                  <div className={`text-center`}>
                    <h4 className="font-medium text-lg">Nothing Found!</h4>
                    <p className="font-light">
                      Please add a new entity to see the content here. Thank
                      you!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ================================================== */}
        </div>
      </div>
    </CheckPermission>
  );
  // }
}
