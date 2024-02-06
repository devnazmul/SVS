// =====================================
// #00114
// =====================================

import React, { useEffect, useState } from "react";
import { MdDelete, MdDeleteSweep } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import FilterDailyLog from "./DailLogComponents/FilterDailyLog";
import CustomDataSet from "../../components/CustomDataSet";
import SearchField from "../../components/InputFields/SearchField";
import Headings from "../../components/Headings/Headings";
import Table from "../../components/Table";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";

import CustomPopup from "../../components/CustomPopup";
import CreateAttendence from "./DailLogComponents/CreateAttendence";
import { useAuth } from "../../context/AuthContext";
import { getAllAttendanceList } from "../../apis/attendence/attendence";
import FilterByDate from "../../components/FilterByDate";
import { NavLink } from "react-router-dom";
import { getFullImageLink } from "../../utils/getFullImageLink";
import CheckPermission from "../../CheckPermission";
import {
  ATTENDANCE_DELETE,
  ATTENDANCE_UPDATE,
  ATTENDANCE_VIEW,
} from "../../constant/permissions";
import Pagination from "../../components/Pagination";

export default function DailyLogForEmployeeView({ userInfo, setUserInfo }) {
  const { user } = useAuth();
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
    user_id: userInfo?.id,
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
      name: "Date",
      attribute_name: "date",
      minWidth: 10,
      show: true,
    },
    {
      name: "Start",
      attribute_name: "start",
      minWidth: 10,
      show: true,
    },
    {
      name: "End",
      attribute_name: "end",
      minWidth: 10,
      show: true,
    },
    {
      name: "Break",
      attribute_name: "break",
      minWidth: 10,
      show: true,
    },
    {
      name: "Schedule Hour",
      attribute_name: "capacity",
      minWidth: 10,
      show: true,
    },
    {
      name: "Overtime",
      attribute_name: "overtime",
      minWidth: 10,
      show: true,
    },
    // {
    //   name: "Time off",
    //   attribute_name: "time_off",
    //   minWidth: 10,
    //   show: true,
    // },
  ]);

  // ACTION HANDLER
  const handleView = () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [ATTENDANCE_VIEW],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [ATTENDANCE_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: false,
      permissions: [ATTENDANCE_DELETE],
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
      type: "requestLeave",
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
    getAllAttendanceList({
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
  console.log(data);
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
              <Headings level={1}>Attendance</Headings>
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
                  <BiPlus />{" "}
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
                console.log({ e });
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
                date: d?.in_date,
                start: d?.in_time,
                end: d?.out_time,
                break: d?.does_break_taken !== 0 ? d?.does_break_taken : "N/A",
                capacity: d?.capacity_hours,
                overtime: d?.work_hours_delta < 1 ? 0 : d?.work_hours_delta,
                // time_off: "",
              }))}
              // actions={actions}
              actions={[]}
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
        {console.log(popupOption)}
        {/* CREATE ATTENDENCE */}
        {/* POPUP  */}
        <CustomPopup
          popupClasses={`lg:w-[80vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
              {/* CREATE ATTENDENCE  */}
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
          }
        />
      </div>
    </CheckPermission>
  );
}
