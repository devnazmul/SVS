// =====================================
// #00111
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import {
  MdCancel,
  MdDelete,
  MdDeleteSweep,
  MdDoNotDisturb,
  MdFileDownloadDone,
} from "react-icons/md";
import Headings from "../../components/Headings/Headings";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
// import FilterLeaveStatus from "./FilterLeaveStatus";
import {
  ATTENDANCE_DELETE,
  ATTENDANCE_VIEW,
  BUSINESS_CREATE,
  LEAVE_APPROVE,
  LEAVE_CREATE,
  LEAVE_DELETE,
  LEAVE_UPDATE,
  LEAVE_VIEW,
} from "../../constant/permissions";
import CustomField from "../../components/InputFields/CustomField";
import SearchField from "../../components/InputFields/SearchField";
import { useAuth } from "../../context/AuthContext";
import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";

import moment from "moment";
import CustomPopup from "../../components/CustomPopup";
import {
  approveOrRejectLeave,
  deleteMultipleLeave,
  getAllLeaveV2,
} from "../../apis/leave/leaveStatus";
import { TbNotes, TbSettings2 } from "react-icons/tb";
import { getFullImageLink } from "../../utils/getFullImageLink";
import { formatDate } from "../../utils/formatDate";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../apis/userAndBusiness/user";
import RestrictedByPermission from "../../layout/RestrictedByPermission";
import { IoDocumentTextOutline } from "react-icons/io5";
import FilterDailyLog from "./DailLogComponents/FilterDailyLog";
import CreateAttendence from "./DailLogComponents/CreateAttendence";
import FilterByDate from "../../components/FilterByDate";
import CustomDataSet from "../../components/CustomDataSet";
import {
  deleteSingleAttendance,
  getAllAttendenceSummery,
} from "../../apis/attendence/attendence";
import { convertTo12HourFormat } from "../../utils/convertTo12HourFormat";
import CheckPermission from "../../CheckPermission";
import Pagination from "../../components/Pagination";
import NoteView from "./NoteView";
import { formatRole } from "../../utils/formatRole";

export default function AttendanceSummaryForEmployeeView({ userInfo }) {
  console.log(userInfo);
  const navigate = useNavigate();
  const { user } = useAuth();

  // LOADINGS
  const [isPending, setIsPending] = useState(true);
  const [isPendingDelete, setIsPendingDelete] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState(
    userInfo ? [userInfo?.id] : []
  );

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    start_date: moment().startOf("month").format("DD-MM-YYYY"),
    end_date: moment().endOf("month").format("DD-MM-YYYY"),
    search_key: "",
    user_id: userInfo?.id,
    order_by: "DESC",
  });

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

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());

  // GET EMPLOYEE
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const getAllEmployeesData = () => {
    setIsLoadingEmployees(true);
    // GETTING EMPLOYEES FUNC
    getAllUsersWithoutPaginationByRole([
      `business_employee#${user?.business_id}`,
      `business_admin#${user?.business_id}`,
      `business_manager#${user?.business_id}`,
    ])
      .then((res) => {
        console.log({ res });
        setFilters((prev) => ({
          ...prev,
          user_id: userInfo?.id,
        }));
        setEmployees(
          res.map((emp) => ({
            id: emp?.id,
            label: `${emp?.first_Name} ${
              emp?.middle_Name ? emp?.middle_Name : ""
            } ${emp?.last_Name}`,
          }))
        );
        setIsLoadingEmployees(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingEmployees(false);
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
  useEffect(() => {
    getAllEmployeesData();
  }, []);

  // GET ALL DATA
  const [data, setData] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const getAllData = () => {
    setIsPending(true);
    getAllAttendenceSummery({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      user_id: filters?.user_id,
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
        deleteSingleAttendance(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Attendance has been deleted.",
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
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create_attendance",
      title: "Create Attendance",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      userId: userInfo?.id,
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

  const handleViewNote = (id) => {
    setPopupOption({
      open: true,
      type: "viewNote",
      title: "Notes",
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
      name: "note",
      handler: handleViewNote,
      Icon: TbNotes,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [ATTENDANCE_VIEW],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [ATTENDANCE_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    // {
    //   name: "User",
    //   attribute_name: "profile",
    //   minWidth: 10,
    //   show: true,

    // },
    {
      name: "Date",
      attribute_name: "date",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Start",
      attribute_name: "start",
      minWidth: 10,
      show: true,
      // isMainField: true,
    },
    {
      name: "End",
      attribute_name: "end",
      minWidth: 10,
      show: true,
      // isMainField: true,
    },
    {
      name: "Break",
      attribute_name: "break",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      name: "Schedule Hour",
      attribute_name: "capacity",
      minWidth: 10,
      show: true,
      // isMainField: true,
    },
    {
      name: "Overtime",
      attribute_name: "overtime",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    // {
    //   name: "Note",
    //   attribute_name: "noteIcon",
    //   minWidth: 10,
    //   show: true,
    //   isMainField: true,
    // },
    // {
    //   name: "Time off",
    //   attribute_name: "time_off",
    //   minWidth: 10,
    //   show: true,
    // },
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
    <CheckPermission permissionArray={[ATTENDANCE_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <FilterDailyLog
            isOpen={isFilterBarOpen}
            toggleHandler={toggleFilterBar}
            filters={filters}
            setFilters={setFilters}
          />

          {/* POPUP  */}
          <CustomPopup
            popupClasses={`lg:w-[80vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {/* VIEW NOTES  */}
                {popupOption?.type === "viewNote" && (
                  <NoteView
                    popupOption={popupOption}
                    handleClosePopup={() => {
                      setPopupOption({
                        open: false,
                        type: "",
                        id: null,
                        selfId: null,
                        note: "",
                        onClose: () => {
                          setPopupOption({ ...popupOption, open: false });
                        },
                        overlayStyle: { background: "red" },
                        closeOnDocumentClick: false,
                      });
                    }}
                  />
                )}
                {/* CREATE LEAVE  */}
                {popupOption?.type === "create_attendance" && (
                  <>
                    {/* CREATE ATTENDANCE  */}
                    <CreateAttendence
                      popupOption={popupOption}
                      getAllAttendence={getAllData}
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
                  </>
                )}
              </>
            }
          />
          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5 ">
            <div className="flex items-center gap-2 w-full text-center md:text-left md:w-3/12">
              <Headings level={1}>Attendance</Headings>{" "}
              <button
                data-tip="Attendence Settings"
                className=" tooltip tooltip-bottom tooltip-primary"
              >
                <TbSettings2
                  role="button"
                  onClick={() => {
                    navigate("/settings/attendance");
                  }}
                  className="text-2xl text-primary"
                />
              </button>
            </div>

            <div className="flex flex-col-reverse justify-end md:flex-row gap-5 w-full  md:w-5/12 ">
              {/* SELECT USER  */}

              <div className="flex justify-end md:justify-start w-full md:w-auto gap-5">
                <button
                  onClick={handleCreate}
                  className="btn btn-primary w-full md:w-18 lg:w-18"
                >
                  <span className="block">Add Attendance</span>
                </button>

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
                setFilters({
                  ...filters,
                  start_date: e?.start,
                  end_date: e?.end,
                });
              }}
            />
            {/* ANALYTICS  */}
            <div className="w-full rounded-xl border bg-base-300 border-gray-500 p-5 grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div className="w-full h-[70px] rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">Total schedule hour</span>
                <span className="text-2xl font-medium text-primary">
                  {analyticsData?.total_schedule_hours}
                </span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">
                Total leave (Hour)
                </span>
                <span className="text-2xl font-medium text-primary">
                  {analyticsData?.total_leave_hours}
                </span>
              </div>
              <div className="w-full h-[70px] rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">
                  Total work availability
                </span>
                <span className={` text-2xl font-medium text-green-500`}>
                  {analyticsData?.total_work_availability_per_centum === 100
                    ? analyticsData?.total_work_availability_per_centum
                    : analyticsData?.total_work_availability_per_centum?.toFixed(
                        2
                      )}
                  %
                </span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">Total active hour</span>
                <span className="text-2xl font-medium text-primary">
                  {analyticsData?.total_active_hours}
                </span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm ">Balance (Extra)</span>
                <span className="text-2xl font-medium text-green-500">
                  {analyticsData?.total_extra_hours}
                </span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm ">Average Behaviour</span>
                <span className={`text-2xl font-medium  text-red-500`}>
                  {formatRole(analyticsData?.work_availability || "")}
                </span>
              </div>
            </div>
            <CustomDataSet cols={cols} setCols={setCols} />

            <Table
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              itemsPerPage={filters?.perPage}
              totalItems={data?.total}
              setPageNo={(data) => setFilters({ ...filters, page: data })}
              setPerPage={setPerPage}
              perPage={filters?.perPage}
              isLoading={isPending}
              rows={
                data?.data?.length > 0
                  ? data?.data?.map((d) => ({
                      id: d?.id,
                      // profile: (
                      //   <div className="flex items-start gap-3">
                      //     {/* PROFILE  */}
                      //     {d?.employee?.image ? (
                      //       <div
                      //         className={`avatar ${
                      //           d?.employee?.id_active ? "online" : "offline"
                      //         }`}
                      //       >
                      //         <div className="w-10 rounded-full">
                      //           <img
                      //             src={`${getFullImageLink(d?.employee?.image)}`}
                      //           />
                      //         </div>
                      //       </div>
                      //     ) : (
                      //       <div
                      //         className={`avatar ${
                      //           d?.employee?.id_active ? "online" : "offline"
                      //         } placeholder duration-100`}
                      //       >
                      //         <div className="w-10 rounded-full bg-primary text-base-300">
                      //           <span>{`${d?.employee?.first_Name.slice(0, 1)}${
                      //             d?.employee?.middle_Name
                      //               ? d?.employee?.middle_Name.slice(0, 1)
                      //               : ""
                      //           }${d?.employee?.last_Name.slice(0, 1)}`}</span>
                      //         </div>
                      //       </div>
                      //     )}
                      //     {/* NAME AND EMAIL  */}
                      //     <div className="flex flex-col">
                      //       <NavLink
                      //         className={`text-primary font-medium`}
                      //         to={`/employee/view/${d?.employee?.id}`}
                      //       >{`${d?.employee?.first_Name} ${
                      //         d.employee?.middle_Name ? d.employee?.middle_Name : ""
                      //       } ${d?.employee?.last_Name}`}</NavLink>
                      //       <span className="font-semibold text-xs text-gray-500">
                      //         {d?.employee?.departments.map((dep, index) => {
                      //           if (index + 1 < d?.employee?.departments.length) {
                      //             return `${dep?.name},` + " ";
                      //           } else {
                      //             return `${dep?.name}`;
                      //           }
                      //         })}
                      //       </span>
                      //     </div>
                      //   </div>
                      // ),
                      date: (
                        <span className="inline-block w-full">
                          {d?.in_date}
                        </span>
                      ),
                      start: convertTo12HourFormat(d?.in_time),
                      end: convertTo12HourFormat(d?.out_time),
                      break:
                        d?.does_break_taken !== 0 ? d?.does_break_taken : "_",
                      capacity: d?.capacity_hours,
                      overtime:
                        d?.work_hours_delta < 1 ? 0 : d?.work_hours_delta,
                    }))
                  : []
              }
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