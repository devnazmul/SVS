// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import {
  MdCancel,
  MdDelete,
  MdDeleteSweep,
  MdOutlineEditCalendar,
} from "react-icons/md";
import CustomDataSet from "../../../components/CustomDataSet";
import Headings from "../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import {
  deleteSingleUser,
  getAllUsers,
  toggleEmployeeActiveDeactive,
} from "../../../apis/userAndBusiness/user";
import FilterEmployee from "./FilterEmployee";
import {
  EMPLOYEE_VIEW,
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../../constant/permissions";
import CustomField from "../../../components/InputFields/CustomField";
import SearchField from "../../../components/InputFields/SearchField";
import { useAuth } from "../../../context/AuthContext";
import { BiPlus } from "react-icons/bi";
import { FiClock, FiFilter } from "react-icons/fi";
import { formatRole } from "../../../utils/formatRole";
import { encryptID } from "../../../utils/encryptAndDecryptID";
import { getFullImageLink } from "../../../utils/getFullImageLink";
import CheckPermission from "../../../CheckPermission";
import CustomPopup from "../../../components/CustomPopup";
import CreateAttendence from "../../Attendance/DailLogComponents/CreateAttendence";
import CreateLeave from "../../Leave/CreateLeave";
import { LuCalendarPlus } from "react-icons/lu";
import ChangeJoiningDate from "./ChangeJoiningDate";
import Pagination from "../../../components/Pagination";
import { OutsideClickHandler } from "../../../components/OutsideClickHandler";
import {
  allEmployees,
  exportAllEmployees,
  exportAllEmployeesURLUtil,
} from "../../../apis/employee/employee";
import moment from "moment";
import { saveAs } from "file-saver";
import CreateAndUpdateStudent from "./CreateAndUpdateStudent";

export default function AllEmployees() {
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
    start_date: "",
    end_date: "",
    search_key: "",
    order_by: "DESC",
    is_in_employee: 1,
    role: [
      `business_admin#${user?.business_id}`,
      `business_manager#${user?.business_id}`,
      `business_employee#${user?.business_id}`,
    ],
    is_active: "",
    response_type: "",
    file_name: `employee_report_${moment(new Date()).format(
      "DD-MM-YYYY_HH:mm:ss"
    )}`,
    designation_id: "",
    work_location_id: "",
    has_this_project: "",
    employment_status_id: "",
    immigration_status: "",
    sponsorship_status: "",
    sponsorship_certificate_number: "",
    sponsorship_current_certificate_status: "",
    start_joining_date: "",
    start_sponsorship_date_assigned: "",
    end_sponsorship_date_assigned: "",
    start_sponsorship_expiry_date: "",
    end_sponsorship_expiry_date: "",
    start_passport_expiry_date: "",
    end_passport_expiry_date: "",
    end_visa_issue_date: "",
    start_visa_expiry_date: "",
    end_visa_expiry_date: "",
    visa_expires_in_day: "",
    project_id: "",
    department_id: "",
    doesnt_have_payrun: "",
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
    allEmployees({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
      is_in_employee: filters?.is_in_employee,
      role: filters?.role,
      is_active: filters?.is_active,
      response_type: filters?.response_type,
      file_name: filters?.file_name,
      designation_id: filters?.designation_id,
      work_location_id: filters?.work_location_id,
      has_this_project: filters?.has_this_project,
      employment_status_id: filters?.employment_status_id,
      immigration_status: filters?.immigration_status,
      sponsorship_status: filters?.sponsorship_status,
      sponsorship_certificate_number: filters?.sponsorship_certificate_number,
      sponsorship_current_certificate_status:
        filters?.sponsorship_current_certificate_status,
      start_joining_date: filters?.start_joining_date,
      start_sponsorship_date_assigned: filters?.start_sponsorship_date_assigned,
      end_sponsorship_date_assigned: filters?.end_sponsorship_date_assigned,
      start_sponsorship_expiry_date: filters?.start_sponsorship_expiry_date,
      end_sponsorship_expiry_date: filters?.end_sponsorship_expiry_date,
      start_passport_expiry_date: filters?.start_passport_expiry_date,
      end_passport_expiry_date: filters?.end_passport_expiry_date,
      end_visa_issue_date: filters?.end_visa_issue_date,
      start_visa_expiry_date: filters?.start_visa_expiry_date,
      end_visa_expiry_date: filters?.end_visa_expiry_date,
      visa_expires_in_day: filters?.visa_expires_in_day,
      project_id: filters?.project_id,
      department_id: filters?.department_id,
      doesnt_have_payrun: filters?.doesnt_have_payrun,
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
        deleteSingleUser(id)
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
        toggleEmployeeActiveDeactive(id)
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
    getAllData();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS

  // HANDLE TOGGLE ACTIVATION
  const handleToggleActivation = (id) => {
    toggleFunc(id);
  };
  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create",
      title: "Create Student",
      onClose: (e) => {
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
      title: "Update Student",
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

  // HANDLE CREATE LEAVE
  const handleAssignLeave = (id) => {
    setPopupOption({
      open: true,
      type: "assignLeave",
      title: "Create Leave",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE ADD ATTENDANCE
  const handleAddAttendance = (id) => {
    setPopupOption({
      userId: id,
      open: true,
      type: "addAttandance",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE CHANGE JOINING DATE
  const handleChangeJoiningDate = (id) => {
    setPopupOption({
      open: true,
      type: "changeJoiningDate",
      title: "Change Joining Date",
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
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [USER_VIEW],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [USER_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [USER_DELETE],
      disabledOn: [],
    },
    {
      name: "add attendance",
      handler: handleAddAttendance,
      Icon: LuCalendarPlus,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [USER_VIEW],
      disabledOn: [],
    },
    {
      name: "create leave",
      handler: handleAssignLeave,
      Icon: FiClock,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [USER_VIEW],
      disabledOn: [],
    },
    // {
    //   name: "edit joining date",
    //   handler: handleChangeJoiningDate,
    //   Icon: MdOutlineEditCalendar,
    //   colorClass: "text-green-500",
    //   backgroundColorClass: "bg-green-900",
    //   permissions: [USER_VIEW],
    //   disabledOn: [],
    // },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Full Name",
      attribute_name: "details",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Employee ID",
      attribute_name: "user_id",
      minWidth: 10,
      show: true,
    },
    // {
    //   name: "Employment Status",
    //   attribute_name: "employment_status",
    //   minWidth: 20,
    //   show: true,
    // },
    { name: "email", attribute_name: "email", minWidth: 20, show: true },
    {
      name: "Designation",
      attribute_name: "designation",
      minWidth: 30,
      show: true,
    },
    {
      name: "Role",
      attribute_name: "role",
      minWidth: 30,
      show: true,
    },
    { name: "Status", attribute_name: "is_active", minWidth: 5, show: true },
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

  // HANDLE EXPORT
  const [isExportOption, setIsExportOption] = useState(false);
  const toggleExportOpt = () => {
    setIsExportOption(!isExportOption);
  };

  const handleExport = (type) => {
    const dataURL = exportAllEmployeesURLUtil({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
      is_in_employee: filters?.is_in_employee,
      role: filters?.role,
      is_active: filters?.is_active,
      response_type: type,
      file_name: filters?.file_name,
      designation_id: filters?.designation_id,
      work_location_id: filters?.work_location_id,
      has_this_project: filters?.has_this_project,
      employment_status_id: filters?.employment_status_id,
      immigration_status: filters?.immigration_status,
      sponsorship_status: filters?.sponsorship_status,
      sponsorship_certificate_number: filters?.sponsorship_certificate_number,
      sponsorship_current_certificate_status:
        filters?.sponsorship_current_certificate_status,
      start_joining_date: filters?.start_joining_date,
      start_sponsorship_date_assigned: filters?.start_sponsorship_date_assigned,
      end_sponsorship_date_assigned: filters?.end_sponsorship_date_assigned,
      start_sponsorship_expiry_date: filters?.start_sponsorship_expiry_date,
      end_sponsorship_expiry_date: filters?.end_sponsorship_expiry_date,
      start_passport_expiry_date: filters?.start_passport_expiry_date,
      end_passport_expiry_date: filters?.end_passport_expiry_date,
      end_visa_issue_date: filters?.end_visa_issue_date,
      start_visa_expiry_date: filters?.start_visa_expiry_date,
      end_visa_expiry_date: filters?.end_visa_expiry_date,
      visa_expires_in_day: filters?.visa_expires_in_day,
      project_id: filters?.project_id,
      department_id: filters?.department_id,
      doesnt_have_payrun: filters?.doesnt_have_payrun,
    });

    fetch(dataURL["url"], {
      method: "GET",
      headers: {
        Authorization: dataURL["jwt"],
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob(); // Use response.blob() to handle binary data (e.g., PDF)
      })
      .then((blobData) => {
        // Create a Blob URL and trigger download
        const blobUrl = URL.createObjectURL(blobData);

        if (type === "pdf") {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${filters?.file_name}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        if (type === "csv") {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${filters?.file_name}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsPending(false);
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
  };

  return (
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          {/* POPUP  */}
          <CustomPopup
            popupClasses={`w-[70vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {popupOption?.type === "create" && (
                  <CreateAndUpdateStudent
                    selfId={popupOption?.id}
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
                  <CreateAndUpdateStudent
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
                    getAllAttendence={() => {}}
                  />
                )}

                {popupOption?.type === "changeJoiningDate" && (
                  <ChangeJoiningDate
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
                    getAllAttendence={() => {}}
                  />
                )}
              </>
            }
          />
          {/* ========IF MULTIPLE ID SELECTED ======== */}
          {selectedIds.length > 1 && (
            <div className="z-[10] absolute bg-base-300 rounded-xl px-5 py-2 left-1/2 -translate-x-1/2 border border-primary border-opacity-40 flex justify-center items-center gap-2 shadow-xl ">
              <button
                onClick={() => deleteFunc(selectedIds)}
                data-tip="Delete all selected items"
                className="tooltip tooltip-bottom tooltip-primary"
              >
                <MdDeleteSweep className="text-red-500 text-2xl" />
              </button>
            </div>
          )}
          {/* ========================================  */}

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <div className={`flex items-center gap-5`}>
                <Headings level={1}>All Employee</Headings>
                <button
                  onClick={toggleFilterBar}
                  data-tip="filter"
                  className="text-primary"
                >
                  <FiFilter />
                </button>
              </div>
              <h3>
                Total {data?.total} {data?.total > 1 ? "Employees" : "Employee"}{" "}
                Found
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

                {/* EXPORT OPTIONS  */}

                <OutsideClickHandler
                  onOutsideClick={() => setIsExportOption(false)}
                  className="relative w-1/3 md:w-16 lg:w-32"
                >
                  <button
                    className="btn btn-primary w-full relative"
                    onClick={toggleExportOpt}
                  >
                    <span className="block sm:hidden lg:block">Export</span>
                  </button>

                  {isExportOption ? (
                    <div
                      className={`absolute right-0 z-30 top-full mt-2 bg-base-300 rounded-md border border-primary shadow-md shadow-primary-content px-2 w-32 py-2 flex flex-col`}
                    >
                      <button
                        onClick={() => handleExport("pdf")}
                        className={`px-8 text-primary hover:text-base-300 rounded-md py-2 btn-sm hover:bg-primary`}
                      >
                        As PDF
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className={`px-8 text-primary hover:text-base-300 rounded-md py-2 btn-sm hover:bg-primary`}
                      >
                        As CSV
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </OutsideClickHandler>
              </div>
            </div>
          </div>

          {/* FILTER  */}
          <div
            className={`${
              isFilterBarOpen ? "block" : "hidden"
            } p-5 bg-base-300 border-2 rounded-xl my-5 border-primary shadow-md shadow-primary-content`}
          >
            <Headings className={`text-primary`} level={3}>
              Filters
            </Headings>
          </div>
          {/* ================================================  */}

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            <CustomDataSet cols={cols} setCols={setCols} />
            <Table
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              itemsPerPage={filters?.perPage}
              totalItems={data?.total}
              setPageNo={(data) => {
                setFilters({ ...filters, page: data });
              }}
              setPerPage={setPerPage}
              perPage={filters?.perPage}
              isLoading={isPending}
              rows={data?.data?.map((d) => ({
                ...d,
                id: d?.id,
                details: (
                  <div className="flex items-start gap-3">
                    {/* PROFILE  */}
                    {d?.image ? (
                      <div className={`avatar`}>
                        <div className="w-10 rounded-full">
                          <img src={`${getFullImageLink(d?.image)}`} />
                        </div>
                      </div>
                    ) : (
                      <div className={`avatar placeholder duration-100`}>
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
                        to={`/employee/view/${encryptID(d?.id)}`}
                      >{`${d?.first_Name} ${
                        d.middle_Name ? d.middle_Name : ""
                      } ${d?.last_Name}`}</NavLink>
                      <span className="text-xs font-medium">
                        {d?.roles.map((r) => formatRole(r?.name)).join()}
                      </span>
                    </div>
                  </div>
                ),
                email: d?.email,
                designation: d?.designation?.name,
                role: formatRole(d?.roles[0]?.name),
                is_active: (
                  <>
                    {parseInt(d?.is_active) === 1 ? (
                      <button
                        onClick={() => handleToggleActivation(d?.id)}
                        disabled={
                          isToggleLoading.status && isToggleLoading.id === d?.id
                        }
                        className="text-base-300 bg-success shadow-md shadow-success  px-5 py-1 rounded-full"
                      >
                        {isToggleLoading.status &&
                        isToggleLoading.id === d?.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Active"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleActivation(d?.id)}
                        disabled={
                          isToggleLoading.status && isToggleLoading.id === d?.id
                        }
                        className="text-base-300 bg-error shadow-md shadow-error  px-5 py-1 rounded-full"
                      >
                        {isToggleLoading.status &&
                        isToggleLoading.id === d?.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "De-active"
                        )}
                      </button>
                    )}
                  </>
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
