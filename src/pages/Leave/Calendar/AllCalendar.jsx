// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { MdOutlineCalendarMonth } from "react-icons/md";
import Headings from "../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LEAVE_VIEW } from "../../../constant/permissions";
import SearchField from "../../../components/InputFields/SearchField";
import { useAuth } from "../../../context/AuthContext";
import FilterByDate from "../../../components/FilterByDate";
import moment from "moment";
import CustomPopup from "../../../components/CustomPopup";
import {
  deleteMultipleLeave,
  getAllLeaveV3,
} from "../../../apis/leave/leaveStatus";
import CreateLeave from "../CreateLeave";
import { TbSettings2 } from "react-icons/tb";
import FilterAllCalendar from "./FilterAllCalendar";
import CustomLeaveCalender from "../../../components/CustomLeaveCalender";
import CheckPermission from "../../../CheckPermission";
import Pagination from "../../../components/Pagination";

export default function AllCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // LOADINGS
  const [isPending, setIsPending] = useState(true);
  const [isPendingDelete, setIsPendingDelete] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  const [filterName, setFilterName] = useState("");

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    start_date: moment().startOf("month").format("DD-MM-YYYY"),
    end_date: moment().endOf("month").format("DD-MM-YYYY"),
    search_key: "",
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

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllData = () => {
    setIsPending(true);
    getAllLeaveV3({
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
      id: user?.id,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE VIEW
  const handleViewOnCalendar = (id) => {
    setPopupOption({
      open: true,
      type: "calendar",
      title: "Leaves On Calendar",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    // console.log({ edit: id });
    // navigate(`/employee/update/${id}`);
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteFunction(id);
  };

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "view on calendar",
      handler: handleViewOnCalendar,
      Icon: MdOutlineCalendarMonth,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [LEAVE_VIEW],
      disabledOn: [],
    },
    // {
    //   name: "edit",
    //   handler: handleEdit,
    //   Icon: RiEdit2Fill,
    //   colorClass: "text-secondary",
    //   backgroundColorClass: "bg-secondary-content",
    //   permissions: [USER_UPDATE],
    //   disabledOn: [],
    // },
    // {
    //   name: "delete",
    //   handler: handleDelete,
    //   Icon: MdDelete,
    //   colorClass: "text-red-600",
    //   backgroundColorClass: "bg-red-200",
    //   isLoading: isPendingDelete,
    //   permissions: [USER_DELETE],
    //   disabledOn:[]
    // },
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
      name: "Total Leave Hour",
      attribute_name: "total_leave_hour",
      minWidth: 70,
      show: true,
    },
    // {
    //   name: "Type",
    //   attribute_name: "leave_ype",
    //   minWidth: 10,
    //   show: true,
    // },
    // {
    //   name: "Duration",
    //   attribute_name: "leave_duration",
    //   minWidth: 10,
    //   show: true,
    // },
    // {
    //   name: "Attachment",
    //   attribute_name: "attachment",
    //   minWidth: 5,
    //   show: true,
    // },
    // { name: "Activity", attribute_name: "activity", minWidth: 5, show: true },
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
          <FilterAllCalendar
            isOpen={isFilterBarOpen}
            toggleHandler={toggleFilterBar}
            filters={filters}
            setFilters={setFilters}
          />

          {/* POPUP  */}
          <CustomPopup
            popupClasses={
              filterName === "This Month" || filterName === "Last Month"
                ? `lg:w-[35vw] md:w-[50vw] w-[50vw]`
                : `w-[50vw]`
            }
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

                {/* VIEW ON CALENDAR  */}
                {popupOption?.type === "calendar" && (
                  <CustomLeaveCalender
                    userId={popupOption?.id}
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
                    rowData={data?.data?.find((d) => d?.id === popupOption?.id)}
                    type={filterName}
                    spacialDates={
                      data?.data?.find((d) => d?.id === popupOption?.id)
                        ?.datewise_leave.length > 0
                        ? data?.data
                            ?.find((d) => d?.id === popupOption?.id)
                            ?.datewise_leave?.map((l) => {
                              const data = {
                                ...l,
                                bgColorClassName: `bg-primary-content`,
                                textColorClassName: `text-primary`,
                                borderColorClassName: `border-primary`,
                                CustomComponent: (
                                  <div className="w-full flex flex-col gap-2">
                                    <div className="flex items-center">
                                      <span>Total Leave Hour : </span>
                                      <span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {l?.leave_hours}
                                      </span>
                                    </div>
                                  </div>
                                ),
                              };
                              return data;
                            })
                        : []
                    }
                    startDate={filters?.start_date}
                    endDate={filters?.end_date}
                  />
                )}
              </>
            }
          />

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5 ">
            <div className="flex items-center gap-2 w-full text-center md:text-left ">
              <Headings level={1}>Calendar</Headings>{" "}
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
                <button
                  onClick={handleAssignLeave}
                  className="btn btn-primary w-full md:w-16 lg:w-32"
                >
                  <span className="block">Create Leave</span>
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
                setFilterName(e?.filterName);
                setFilters({
                  ...filters,
                  start_date: e?.start,
                  end_date: e?.end,
                });
              }}
            />
            {/* ANALYTICS  */}
            <div className="w-full rounded-xl border bg-base-300 border-gray-500 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-5">
              <div className="w-full h-[70px] rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">Employees on leave</span>
                <span className="text-2xl font-medium text-primary">0</span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">Total leave hours</span>
                <span className="text-2xl font-medium text-primary">0</span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm ">
                  On leave( Single day )
                </span>
                <span className="text-2xl font-medium text-primary">0</span>
              </div>
              <div className="w-full h-[70px]  rounded-xl border border-gray-500 p-5 flex flex-col items-start justify-center">
                <span className="font-medium text-sm">
                  On leave (Multi day)
                </span>
                <span className="text-2xl font-medium text-primary">0</span>
              </div>
            </div>

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
                profile: `${d?.first_Name} ${d?.middle_Name} ${d?.last_Name}`,
                total_leave_hour: 8,
                // d?.leaves.reduce((accumulator, current) => accumulator + current, 0);
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
