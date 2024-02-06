// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { getAllBusiness } from "../../apis/userAndBusiness/user";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import { MdCancel, MdDelete, MdDeleteSweep } from "react-icons/md";
import CustomDataSet from "../../components/CustomDataSet";
import Headings from "../../components/Headings/Headings";
import {
  deleteMultipleBusiness,
  toggleBusinessActiveDeactive,
} from "../../apis/userAndBusiness/business";
import Swal from "sweetalert2";

import { IoIosCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import BusinessFilter from "./BusinessFilter";
import {
  BUSINESS_CREATE,
  BUSINESS_DELETE,
  BUSINESS_UPDATE,
  BUSINESS_VIEW,
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../constant/permissions";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import SearchField from "../../components/InputFields/SearchField";
import { BiMailSend, BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { encryptID } from "../../utils/encryptAndDecryptID";
import CheckPermission from "../../CheckPermission";
import Pagination from "../../components/Pagination";

export default function AllBusiness() {
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
  const [isPendingDelete, setIsPendingDelete] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    search_key: "",
    country_code: "",
    address: "",
    city: "",
    start_lat: "",
    end_lat: "",
    start_long: "",
    end_long: "",
    perPage: 20,
    page: 1,
    order_by: "",
  });

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllBusinessData = () => {
    setIsPending(true);
    getAllBusiness({
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      country_code: filters?.country_code,
      address: filters?.address,
      city: filters?.city,
      start_lat: filters?.start_lat,
      end_lat: filters?.end_lat,
      start_long: filters?.start_long,
      end_long: filters?.end_long,
      perPage: filters?.perPage,
      page: filters?.page,
      order_by: filters?.order_by,
    })
      .then((res) => {
        console.log({ res });
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
  const deleteBusinesses = (id) => {
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
        deleteMultipleBusiness(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
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
        toggleBusinessActiveDeactive(id)
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
  // HANDLE CREATE
  const handleCreate = (id) => {
    navigate("/business/create");
  };
  // HANDLE VIEW
  const handleView = (id) => {
    navigate(`/business/${encryptID(id)}`);
  };
  // HANDLE SEND RESET EMAIL
  const handleSendResetEmail = (id) => {
    alert(id);
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    navigate(`/business/update/${encryptID(id)}`);
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteBusinesses(id);
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
      permissions: [BUSINESS_VIEW],
      disabledOn: [],
    },
    {
      name: "send reset password e-mail",
      handler: handleSendResetEmail,
      Icon: BiMailSend,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [BUSINESS_UPDATE],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [BUSINESS_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [BUSINESS_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "name",
      attribute_name: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    { name: "email", attribute_name: "email", minWidth: 20, show: true },
    {
      name: "Address",
      attribute_name: "address_line_1",
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

  return (
    <CheckPermission permissionArray={[BUSINESS_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <BusinessFilter
            isOpen={isFilterBarOpen}
            toggleHandler={toggleFilterBar}
            filters={filters}
            setFilters={setFilters}
          />

          {/* ========IF MULTIPLE ID SELECTED ======== */}
          {selectedIds.length > 1 && (
            <div className="z-[10] absolute bg-base-300 rounded-xl px-5 py-2 left-1/2 -translate-x-1/2 border border-primary border-opacity-40 flex justify-center items-center gap-2 shadow-xl ">
              <button
                onClick={() => deleteBusinesses(selectedIds)}
                data-tip="Delete all selected items"
                className="tooltip tooltip-bottom tooltip-primary"
              >
                <MdDeleteSweep className="text-red-500 text-2xl" />
              </button>
              <button
                data-tip="Active all selected items"
                className="tooltip tooltip-bottom tooltip-success"
              >
                <IoIosCheckmarkCircle className="text-success text-2xl" />
              </button>
              <button
                data-tip="De-active all selected items"
                className="tooltip tooltip-bottom tooltip-warning"
              >
                <MdCancel className="text-warning text-2xl" />
              </button>
            </div>
          )}
          {/* ========================================  */}

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <Headings level={1}>All Business</Headings>
              <h3>
                Total {data?.total}{" "}
                {data?.total > 1 ? "Businesses" : "Business"} Found
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

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            <CustomDataSet cols={cols} setCols={setCols} />
            <Table
              checkBoxes={false}
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
                name: d?.name,
                email: d?.email,
                address_line_1: d?.address_line_1,
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
