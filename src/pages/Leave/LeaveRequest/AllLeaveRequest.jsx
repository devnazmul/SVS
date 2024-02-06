// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import { MdCancel, MdDelete, MdDeleteSweep } from "react-icons/md";
import CustomDataSet from "../../../components/CustomDataSet";
import Headings from "../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import {
  deleteSingleUser,
  getAllUsers,
} from "../../../apis/userAndBusiness/user";
import FilterLeaveRequest from "./FilterLeaveRequest";
import {
  LEAVE_DELETE,
  LEAVE_UPDATE,
  LEAVE_VIEW,
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../../constant/permissions";
import CustomField from "../../../components/InputFields/CustomField";
import SearchField from "../../../components/InputFields/SearchField";
import { useAuth } from "../../../context/AuthContext";
import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import FilterByDate from "../../../components/FilterByDate";
import moment from "moment";
import AssignLeave from "../CreateLeave";
import CustomPopup from "../../../components/CustomPopup";
import {
  deleteMultipleLeave,
  getAllLeave,
  getAllLeaveV2,
  getAllLeaveV3,
} from "../../../apis/leave/leaveStatus";
import CreateLeave from "../CreateLeave";
import { TbSettings2 } from "react-icons/tb";
import { getFullImageLink } from "../../../utils/getFullImageLink";
import { formatDate } from "../../../utils/formatDate";
import { IoDocumentTextOutline } from "react-icons/io5";
import FileViewer from "../../../components/FileViewer";
import CheckPermission from "../../../CheckPermission";
import Pagination from "../../../components/Pagination";
import { formatRole } from "../../../utils/formatRole";

export default function AllLeaveRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // LOADINGS
  const [isPending, setIsPending] = useState(true);
  const [isPendingDelete, setIsPendingDelete] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    start_date: moment().startOf("month").format("DD-MM-YYYY"),
    end_date: moment().endOf("month").format("DD-MM-YYYY"),
    search_key: "",
    user_id: "",
    order_by: "DESC",
  });

  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    selfId: null,
    userId: null,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
      setIsUpdated(Math.random());
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());

  // GET ALL DATA
  const [data, setData] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const getAllData = () => {
    setIsPending(true);
    getAllLeaveV2({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      user_id: user?.id,
      order_by: filters?.order_by,
    })
      .then((res) => {
        setData(res?.data);
        setAnalyticsData(res?.data_highlights);
        setIsPending(false);
      })
      .catch((error) => {
        setIsPending(false);
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
        deleteMultipleLeave(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Employee has been deleted.",
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

  // REFETCH AFTER FILTER AND DATA CHANGE
  useEffect(() => {
    getAllData();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE CREATE LEAVE
  const handleAssignLeave = () => {
    setPopupOption({
      open: true,
      type: "assignLeave",
      title: "Create Leave",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE REQUEST LEAVE
  const handleRequestLeave = () => {
    setPopupOption({
      open: true,
      type: "requestLeave",
      title: "Request Leave",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      userId: null,
      selfId: user?.id,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE VIEW
  const handleView = (id) => {
    // navigate(`/employee/view/${id}`);
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "requestLeaveEdit",
      title: "Update Requested Leave",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      userId: null,
      selfId: user?.id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteFunction(id);
  };
  // HANDLE VIEW FILES
  const handleViewFiles = (files) => {
    setPopupOption({
      open: true,
      type: "viewFiles",
      title: "View Files",
      files: files,
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };
  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    // {
    //   name: "view",
    //   handler: handleView,
    //   Icon: AiFillEye,
    //   colorClass: "text-green-500",
    //   backgroundColorClass: "bg-green-900",
    //   permissions: [USER_VIEW],
    //   disabledOn:[]
    // },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [LEAVE_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [LEAVE_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Profile",
      attribute_name: "profile",
      minWidth: 30,
      show: true,
      isMainField: true,
    },
    {
      name: "Date & Time",
      attribute_name: "full_date",
      minWidth: 30,
      show: true,
    },
    {
      name: "Type",
      attribute_name: "leave_type",
      minWidth: 20,
      show: true,
    },
    {
      name: "Duration",
      attribute_name: "leave_duration",
      minWidth: 20,
      show: true,
    },
    {
      name: "Total Leave Hours",
      attribute_name: "total_leave_hours",
      minWidth: 5,
      show: true,
    },
    {
      name: "Attachment",
      attribute_name: "attachment",
      minWidth: 5,
      show: true,
      alignCenter: true,
    },
    // {
    //   name: "Activity",
    //   attribute_name: "activity",
    //   minWidth: 2,
    //   show: true,
    //   alignCenter: true,
    // },
    {
      name: "Status",
      attribute_name: "statusElement",
      minWidth: 5,
      show: true,
      alignCenter: true,
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

  return (
    <CheckPermission permissionArray={[LEAVE_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <FilterLeaveRequest
            isOpen={isFilterBarOpen}
            toggleHandler={toggleFilterBar}
            filters={filters}
            setFilters={setFilters}
          />

          {/* POPUP  */}
          <CustomPopup
            popupClasses={`w-[50vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {/* CREATE LEAVE  */}
                {popupOption?.type === "assignLeave" && (
                  <CreateLeave
                    id={popupOption?.id}
                    handleClosePopup={() => {
                      setPopupOption({
                        open: false,
                        type: "",
                        id: null,
                        selfId: null,
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

                {/* REQUEST LEAVE  */}
                {popupOption?.type === "requestLeave" && (
                  <CreateLeave
                    selfId={popupOption?.selfId}
                    id={popupOption?.id}
                    handleClosePopup={() => {
                      setPopupOption({
                        open: false,
                        type: "",
                        id: null,
                        userId: null,
                        selfId: null,
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

                {/* REQUEST LEAVE  */}
                {popupOption?.type === "requestLeaveEdit" && (
                  <CreateLeave
                    selfId={popupOption?.selfId}
                    id={popupOption?.id}
                    handleClosePopup={() => {
                      setPopupOption({
                        open: false,
                        type: "",
                        id: null,
                        userId: null,
                        selfId: null,
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

                {/* VIEW FILES  */}
                {popupOption?.type === "viewFiles" && (
                  <FileViewer
                    files={popupOption?.files}
                    handleClosePopup={() => {
                      setPopupOption({
                        open: false,
                        type: "",
                        id: null,
                        userId: null,
                        files: [],
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

          {/* ========IF MULTIPLE ID SELECTED ======== */}
          {selectedIds.length > 1 && (
            <div className="z-[10] animate-pulse hover:animate-none absolute bg-base-300 rounded-xl px-5 py-2 left-1/2 -translate-x-1/2 border border-primary border-opacity-40 flex justify-center items-center gap-2 shadow-xl ">
              <button
                onClick={() => deleteFunction(selectedIds)}
                data-tip="Delete all selected items"
                className="tooltip tooltip-bottom tooltip-primary"
              >
                <MdDeleteSweep className="text-red-500 text-2xl" />
              </button>
            </div>
          )}

          {/* ========================================  */}
          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5 ">
            <div className="flex items-center gap-2 w-full text-center md:text-left ">
              <Headings level={1}>Leave Request</Headings>{" "}
              <button
                data-tip="Leave Settings"
                className=" tooltip tooltip-bottom tooltip-primary"
              >
                <TbSettings2
                  role="button"
                  onClick={() => {
                    navigate("/settings/leave");
                  }}
                  className="text-2xl text-primary"
                />
              </button>
            </div>

            <div className="flex flex-col justify-end md:flex-row gap-5 w-full ">
              <SearchField
                handleChange={(e) => {
                  setFilters({
                    ...filters,
                    search_key: e.target.value,
                    page: 1,
                  });
                }}
              />

              <div className="flex justify-end md:justify-start w-full md:w-auto gap-5">
                <div className="dropdown dropdown-bottom dropdown-start md:dropdown-end w-full">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-primary w-full md:w-16 lg:w-32"
                  >
                    Create Leave
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content shadow-primary-content mt-2 z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
                  >
                    <li>
                      <button
                        onClick={handleAssignLeave}
                        // className="btn btn-primary w-full md:w-16 lg:w-32"
                      >
                        <span className="block">Create Leave</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleRequestLeave}
                        // className="btn btn-primary w-full md:w-16 lg:w-32"
                      >
                        <span className="block">Request For Leave</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* <button
                onClick={toggleFilterBar}
                className="btn btn-primary w-1/2 md:w-16 lg:w-32"
              >
                <FiFilter />{" "}
                <span className="block sm:hidden lg:block">Filter</span>
              </button> */}
              </div>
            </div>
          </div>
          {/* ================================================  */}

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            <FilterByDate
              onChange={(e) => {
                console.log({ e });
                setFilters({
                  ...filters,
                  start_date: e?.start,
                  end_date: e?.end,
                });
              }}
            />
            {/* ANALYTICS  */}
            {/* <div className="w-full rounded-xl border bg-base-300 border-gray-500 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-5">
            <div className="w-full h-[70px] rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
              <span className="font-medium text-sm">Employees on leave</span>
              <span className="text-2xl font-medium text-primary">
                {analyticsData?.employees_on_leave}
              </span>
            </div>
            <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
              <span className="font-medium text-sm">Total leave hours</span>
              <span className="text-2xl font-medium text-primary">
                {analyticsData?.total_leave_hours}
              </span>
            </div>
            <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
              <span className="font-medium text-sm ">
                On leave( Single day )
              </span>
              <span className="text-2xl font-medium text-primary">
                {analyticsData?.single_day_leaves}
              </span>
            </div>
            <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
              <span className="font-medium text-sm">On leave (Multi day)</span>
              <span className="text-2xl font-medium text-primary">
                {analyticsData?.multiple_day_leaves}
              </span>
            </div>
          </div> */}

            <Table
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              itemsPerPage={filters?.perPage}
              totalItems={data?.total}
              setPageNo={(data) => setFilters({ ...filters, page: data })}
              setPerPage={setPerPage}
              perPage={filters?.perPage}
              isLoading={isPending}
              rows={data?.data?.map((d) => ({
                id: d?.id,
                profile: (
                  <div className="flex items-start gap-3">
                    {/* PROFILE  */}
                    {d?.employee?.image ? (
                      <div
                        className={`avatar ${
                          d?.employee?.id_active ? "online" : "offline"
                        }`}
                      >
                        <div className="w-10 rounded-full">
                          <img
                            src={`${getFullImageLink(d?.employee?.image)}`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`avatar ${
                          d?.employee?.id_active ? "online" : "offline"
                        } placeholder duration-100`}
                      >
                        <div className="w-10 rounded-full bg-primary text-base-300">
                          <span>{`${d?.employee?.first_Name.slice(0, 1)}${
                            d?.employee?.middle_Name
                              ? d?.employee?.middle_Name.slice(0, 1)
                              : ""
                          }${d?.employee?.last_Name.slice(0, 1)}`}</span>
                        </div>
                      </div>
                    )}
                    {/* NAME AND EMAIL  */}
                    <div className="flex flex-col">
                      <NavLink
                        className={`text-primary font-medium`}
                        to={`/employee/view/${d?.employee?.id}`}
                      >{`${d?.employee?.first_Name} ${
                        d.employee?.middle_Name ? d.employee?.middle_Name : ""
                      } ${d?.employee?.last_Name}`}</NavLink>
                      <span className="font-semibold text-xs text-gray-500">
                        {d?.employee?.departments.map((dep, index) => {
                          if (index + 1 < d?.employee?.departments.length) {
                            return `${dep?.name},` + " ";
                          } else {
                            return `${dep?.name}`;
                          }
                        })}
                      </span>
                    </div>
                  </div>
                ),
                type: d?.leave_duration,
                leave_duration: (
                  <span className="inline-block">
                    {d?.leave_duration.split("_").length > 1
                      ? `${
                          d?.leave_duration
                            .split("_")[0]
                            .slice(0, 1)
                            .toUpperCase() +
                          d?.leave_duration.split("_")[0].slice(1)
                        } ${
                          d?.leave_duration
                            .split("_")[1]
                            .slice(0, 1)
                            .toUpperCase() +
                          d?.leave_duration.split("_")[1].slice(1)
                        }`
                      : d?.leave_duration}
                  </span>
                ),
                leave_type: d?.leave_type?.name,
                total_leave_hours: (
                  <span className="w-full block text-center">
                    {d?.total_leave_hours || 0}
                  </span>
                ),
                attachment:
                  d?.attachments.length > 0 ? (
                    <span className="w-full flex justify-center items-center">
                      <IoDocumentTextOutline
                        onClick={() =>
                          handleViewFiles(
                            d?.attachments.map((file) => getFullImageLink(file))
                          )
                        }
                        className="text-primary text-xl cursor-pointer"
                      />
                    </span>
                  ) : (
                    "_"
                  ),
                activity: d?.activities ? "" : "_",
                full_date: d?.start_date ? (
                  <div>
                    {d?.start_date === d?.end_date ? (
                      <div className="inline-block">
                        {formatDate(d?.start_date)}
                      </div>
                    ) : (
                      <>
                        <div className="inline-block">
                          {formatDate(d?.start_date)}
                        </div>
                        <div>To</div>
                        <div className="inline-block">
                          {formatDate(d?.end_date)}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  `${formatDate(d?.date)} ${
                    d?.start_time ? `${d?.start_time} - ${d?.end_time}` : ``
                  } ${
                    d?.day_type
                      ? `( ${d?.day_type
                          .split("_")
                          .map((w) => {
                            return w.slice(0, 1).toUpperCase() + w.slice(1);
                          })
                          .join(" ")} )`
                      : ""
                  }`
                ),
                status: d?.status,
                statusElement: (
                  <span
                    className={`px-3 py-1 rounded-full text-center block font-medium ${
                      d?.status === "pending_approval" &&
                      "badge-warning shadow-md shadow-warning"
                    } ${
                      d?.status === "approved" &&
                      "badge-success shadow-md shadow-success"
                    } ${
                      d?.status === "rejected" &&
                      "badge-error shadow-md shadow-error"
                    } ${
                      d?.status === "progress" &&
                      "badge-info shadow-md bg-opacity-20 text-info"
                    }`}
                  >
                    {formatRole(d?.status)}
                  </span>
                ),
              }))}
              actions={actions}
              isFullActionList={true}
              cols={cols}
            />

            {/* PAGINATION  */}
            {data?.total !== 0 && (
              <div
                // style={{ minWidth: minWidth }}
                className="flex-col flex justify-center bg-base-200 md:bg-base-200 items-center py-1 shadow-md"
              >
                <Pagination
                  forcePage={filters?.page}
                  itemsPerPage={filters?.perPage}
                  totalItems={data?.total}
                  onChangePage={(page) => {
                    setFilters({ ...filters, page: page });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
