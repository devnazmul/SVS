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
  toggleEmployeeActiveDeactive,
} from "../../../apis/userAndBusiness/user";
import FilterUser from "./FilterUser";
import {
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../../constant/permissions";
import CustomField from "../../../components/InputFields/CustomField";
import SearchField from "../../../components/InputFields/SearchField";
import { useAuth } from "../../../context/AuthContext";
import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import SearchFieldSmall from "../../../components/InputFields/SearchFieldSmall";
import CustomPopup from "../../../components/CustomPopup";
import CreateUser from "./CreateAndUpdateUser";
import { getFullImageLink } from "../../../utils/getFullImageLink";
import { formatRole } from "../../../utils/formatRole";
import { encryptID } from "../../../utils/encryptAndDecryptID";
import Pagination from "../../../components/Pagination";

export default function AllUsers({
  isCreateTriggered,
  setIsCreateTriggered,
  isUpdated,
  setIsUpdated,
}) {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [isUpdateTriggered, setIsUpdateTriggered] = useState({
    status: false,
    id: null,
  });

  useEffect(() => {
    if (isCreateTriggered) {
      setPopupOption({
        open: true,
        type: "create",
        title: "Create User",
        onClose: () => {
          setIsCreateTriggered(false);
          setPopupOption({ ...popupOption, open: false });
        },
        id: null,
        closeOnDocumentClick: false,
      });
    }
  }, [isCreateTriggered]);
  useEffect(() => {
    if (isUpdateTriggered?.status) {
      setPopupOption({
        open: true,
        type: "edit",
        title: "Update User",
        onClose: () => {
          setIsUpdateTriggered({ status: false, id: null });
          setPopupOption({ ...popupOption, open: false });
        },
        id: isUpdateTriggered?.id,
        closeOnDocumentClick: false,
      });
    }
  }, [isUpdateTriggered]);

  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {
      setIsCreateTriggered(false);
      setIsUpdateTriggered({ status: false, id: null });
      setPopupOption({ ...popupOption, open: false });
      setIsUpdated(Math.random());
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  // LOADINGS
  const [isPending, setIsPending] = useState(true);
  const [isPendingDelete, setIsPendingDelete] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 4,
    page: 1,
    start_date: "",
    end_date: "",
    search_key: "",
    order_by: "DESC",
    is_active: "",
    role: [],
  });

  // GET ALL DATA
  // IF ANY DATA UPDATED
  const [data, setData] = useState({});
  const getAllBusinessData = () => {
    setIsPending(true);
    getAllUsers({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
      role: filters?.role,
      is_active: filters?.is_active,
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
    getAllBusinessData();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE VIEW
  const handleView = (id) => {
    navigate(`/employee/view/${encryptID(id)}`);
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    setIsUpdateTriggered({ status: true, id: id });
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteFunc(id);
  };
  // HANDLE TOGGLE ACTIVATION
  const handleToggleActivation = (id) => {
    toggleFunc(id);
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
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Details",
      attribute_name: "details",
      minWidth: 70,
      show: true,
      isMainField: true,
    },
    // { name: "email", attribute_name: "email", minWidth: 20, show: true },
    // {
    //   name: "Address",
    //   attribute_name: "address_line_1",
    //   minWidth: 30,
    //   show: true,
    // },
    { name: "Status", attribute_name: "is_active", minWidth: 30, show: true },
    // { name: "Gender", attribute_name: "gender", minWidth: 5, show: true },
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
    <div className="w-full">
      {/* POPUP  */}

      <CustomPopup
        popupClasses={`w-[70vw]`}
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        Component={
          <>
            {popupOption?.type === "create" && (
              <CreateUser
                handleClosePopup={() => {
                  setPopupOption({
                    open: false,
                    type: "",
                    id: null,
                    onClose: () => {
                      setIsCreateTriggered(false);
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
              <CreateUser
                id={popupOption?.id}
                handleClosePopup={() => {
                  setPopupOption({
                    open: false,
                    type: "",
                    id: null,
                    onClose: () => {
                      setIsUpdateTriggered({ status: false, id: null });
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

      <div className="relative h-full">
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
            <Headings className={``} level={1}>
              Users
            </Headings>
            {/* <h3>
              Total {data?.total} {data?.total > 1 ? "Users" : "User"} Found
            </h3> */}
          </div>

          <div className="flex flex-col justify-end md:flex-row gap-5 w-full">
            <SearchFieldSmall
              handleChange={(e) => {
                setFilters({ ...filters, search_key: e.target.value, page: 1 });
              }}
            />
          </div>
        </div>

        {/* ================================================  */}

        {/* FILTERS  */}
        <div className="bg-base-200 mt-5 pb-4 border-b border-primary-content block w-full">
          {/* FOR MOBILE  */}
          <div className="collapse md:hidden collapse-arrow bg-base-200 mb-2">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium bg-primary text-base-300">
              All users
            </div>
            <div className="collapse-content ">
              <div className="mt-4 flex flex-col gap-1 justify-between items-center  py-2">
                <button
                  className={`${
                    // buttonName !== "Last Year" && "btn-outline"""
                    ""
                  } font-semibold btn btn-primary w-full`}
                  onClick={() => {
                    // handleButtonClick("lastYear")
                  }}
                >
                  All Users
                </button>
                <button
                  className={`${
                    // buttonName !== "Last Year" && "btn-outline"""
                    ""
                  } font-semibold btn btn-primary w-full`}
                  onClick={() => {
                    // handleButtonClick("lastYear")
                  }}
                >
                  Active
                </button>
                <button
                  className={`${
                    // buttonName !== "Last Year" && "btn-outline"""
                    ""
                  } font-semibold btn btn-primary w-full`}
                  onClick={() => {
                    // handleButtonClick("lastYear")
                  }}
                >
                  De-active
                </button>
                <button
                  className={`${
                    // buttonName !== "Last Year" && "btn-outline"""
                    ""
                  } font-semibold btn btn-primary w-full`}
                  onClick={() => {
                    // handleButtonClick("lastYear")
                  }}
                >
                  Invited
                </button>
              </div>
            </div>
          </div>

          {/* FOR DESKTOP  */}
          <div className="mt-4 hidden md:flex px-2 gap-2 w-full justify-between items-center py-2">
            <button
              className={`${
                filters.is_active === "" ? "" : "btn-outline"
              } font-semibold btn btn-primary  w-1/5`}
              onClick={() => {
                setFilters({ ...filters, is_active: "" });
              }}
            >
              All Users
            </button>
            <button
              className={`${
                filters.is_active === 1 ? "" : "btn-outline"
              } font-semibold btn btn-primary  w-1/5`}
              onClick={() => {
                setFilters({ ...filters, is_active: 1 });
              }}
            >
              Active
            </button>
            <button
              className={`${
                filters.is_active === 0 ? "" : "btn-outline"
              } font-semibold btn btn-primary w-1/5`}
              onClick={() => {
                setFilters({ ...filters, is_active: 0 });
              }}
            >
              De-active
            </button>
          </div>
        </div>

        {/* =========== TABLE AREA ============  */}
        <div className="relative">
          <Table
            header={false}
            minWidth="50px"
            checkBoxes={false}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            itemsPerPage={filters?.perPage}
            totalItems={data?.total}
            setPageNo={(data) => setFilters({ ...filters, page: data })}
            setPerPage={setPerPage}
            perPage={filters?.perPage}
            isLoading={isPending}
            rows={data?.data?.map((d) => {
              console.log({ d });
              return {
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
                      <span className="text-xs">{d?.email}</span>
                      {d.business_id ? (
                        <span className="text-xs">
                          Total Employee: {d?.user_count}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ),
                email: d?.email,
                address_line_1: d?.address_line_1,
                gender: d?.gender,
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
              };
            })}
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
  );
}
