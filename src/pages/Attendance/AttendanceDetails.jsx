// =====================================
// #00112
// =====================================

import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdDeleteSweep,
  MdOutlineCalendarMonth,
} from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import FilterDailyLog from "./DailLogComponents/FilterDailyLog";
import CustomDataSet from "../../components/CustomDataSet";
import SearchField from "../../components/InputFields/SearchField";
import Headings from "../../components/Headings/Headings";
import Table from "../../components/Table";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";
import { ATTENDANCE_VIEW } from "../../constant/permissions";
import CustomPopup from "../../components/CustomPopup";
import CreateAttendence from "./DailLogComponents/CreateAttendence";
import { useAuth } from "../../context/AuthContext";
import { getAllAttendanceListDetails } from "../../apis/attendence/attendence";
import FilterByDate from "../../components/FilterByDate";
import { NavLink, useNavigate } from "react-router-dom";
import { getFullImageLink } from "../../utils/getFullImageLink";
import CustomLeaveCalender from "../../components/CustomLeaveCalender";
import { TbLogout2, TbSettings2 } from "react-icons/tb";
import CheckPermission from "../../CheckPermission";
import Pagination from "../../components/Pagination";

export default function AttendanceDetails() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // FILTER TOGGLE
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const toggleFilterBar = () => {
    setIsFilterBarOpen(!isFilterBarOpen);
  };

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    start_date: "",
    end_date: "",
    search_key: "",
    order_by: "DESC",
    role: [],
  });

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // DELETE API
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteFunc = (id) => {};

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // LOADINGS
  const [isPending, setIsPending] = useState(true);

  const [filterName, setFilterName] = useState("");
  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "User",
      attribute_name: "user",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      name: "Total",
      attribute_name: "total",
      minWidth: 30,
      show: true,
      isMainField: true,
    },
  ]);

  // ACTION HANDLER
  // HANDLE VIEW
  const handleViewOnCalendar = (id) => {
    setPopupOption({
      open: true,
      type: "calendar",
      title: "Attendence On Calendar",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  const handleEdit = () => {};
  const handleDelete = () => {};

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "view on calendar",
      handler: handleViewOnCalendar,
      Icon: MdOutlineCalendarMonth,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [ATTENDANCE_VIEW],
      disabledOn: [],
    },
  ]);

  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    selfId: null,
    userId: null,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  // HANDLE Create Attendence
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create_attendence",
      title: "Create Attendence",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      userId: null,
      selfId: user?.id,
      closeOnDocumentClick: false,
    });
  };

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllAttendence = () => {
    setIsPending(true);
    getAllAttendanceListDetails({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
    })
      .then((res) => {
        console.log(res);
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

  useEffect(() => {
    getAllAttendence();
  }, [filters]);

  console.log({ data });
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

          {/* ======= HEADEING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <div className="flex items-center gap-2 w-full text-center md:text-left">
                <Headings level={1}>Attendance Details</Headings>{" "}
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
              <h3>
                Total {data?.total}{" "}
                {data?.total > 1 ? "Attendances" : "Attendance"} Found
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
                  className="btn btn-primary w-1/3 md:w-16 lg:w-48"
                >
                  <span className="block sm:hidden lg:block">
                    Add Attendance
                  </span>
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
              rows={data?.data?.map((d) => ({
                id: d?.id,
                user: (
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
                          <span>{`${d?.first_Name.slice(0, 1)}${
                            d?.middle_Name ? d?.middle_Name.slice(0, 1) : ""
                          }${d?.last_Name.slice(0, 1)}`}</span>
                        </div>
                      </div>
                    )}
                    {/* NAME AND EMAIL  */}
                    <div className="flex flex-col">
                      <NavLink
                        className={`text-primary font-medium`}
                        to={`/employee/view/${d?.id}`}
                      >{`${d?.first_Name} ${
                        d.middle_Name ? d.middle_Name : ""
                      } ${d?.last_Name}`}</NavLink>
                      <span className="font-semibold text-xs text-gray-500">
                        {d?.departments.map((dep, index) => {
                          if (index + 1 < d?.departments.length) {
                            return `${dep?.name},` + " ";
                          } else {
                            return `${dep?.name}`;
                          }
                        })}
                      </span>
                    </div>
                  </div>
                ),
                date: "",
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
        {/* POPUP  */}
        {console.log(popupOption)}
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
              {/* VIEW ON CALENDAR  */}
              {popupOption?.type === "calendar" ? (
                <CustomLeaveCalender
                  userId={popupOption?.id}
                  handleClosePopup={() => {
                    setPopupOption({
                      open: false,
                      type: "",
                      id: null,
                      onClose: () => {
                        setPopupOption({ ...popupOption, open: false });
                        // setIsUpdated(Math.random());
                      },
                      overlayStyle: { background: "red" },
                      closeOnDocumentClick: false,
                    });
                  }}
                  type={filterName}
                  rowData={data?.data?.find((d) => d?.id === popupOption?.id)}
                  spacialDates={
                    data?.data?.find((d) => d?.id === popupOption?.id)
                      ?.datewise_attendanes?.length > 0
                      ? data?.data
                          ?.find((d) => d?.id === popupOption?.id)
                          ?.datewise_attendanes?.map((a) => {
                            const data = {
                              ...a,
                              bgColorClassName: `bg-green-200`,
                              textColorClassName: `text-green-500`,
                              borderColorClassName: `border-green-500`,
                              CustomComponent: (
                                <div className="w-full flex flex-col gap-2">
                                  <div className="flex items-center">
                                    <span>Schedule : </span>
                                    <span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>Worked : </span>
                                    <span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>Paid Leave : </span>
                                    <span>&nbsp;&nbsp;&nbsp;00:00</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>Balance : </span>
                                    {
                                      // This text color will be text-green-500 but if the balance is negative it will be text-red-500
                                    }
                                    <span className={`text-green-500`}>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00
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
              ) : (
                <>
                  {/* CREATE ATTENDANCE  */}
                  <CreateAttendence
                    popupOption={popupOption}
                    handleClosePopup={() => {
                      setPopupOption({
                        open: false,
                        type: "",
                        id: null,
                        selfId: null,
                        onClose: () => {
                          setPopupOption({ ...popupOption, open: false });
                        },
                        overlayStyle: { background: "red" },
                        closeOnDocumentClick: false,
                      });
                    }}
                    getAllAttendence={getAllAttendence}
                  />
                </>
              )}
            </>
          }
        />
      </div>
    </CheckPermission>
  );
}
