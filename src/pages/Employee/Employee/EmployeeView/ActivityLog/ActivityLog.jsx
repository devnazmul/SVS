// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete, MdDeleteSweep } from "react-icons/md";
import CustomDataSet from "../../../../../components/CustomDataSet";
import Headings from "../../../../../components/Headings/Headings";
import Swal from "sweetalert2";
import {
  EMPLOYEE_VIEW,
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../../../../constant/permissions";
import SearchField from "../../../../../components/InputFields/SearchField";
import {
  deleteDesignation,
  getAllDesignations,
} from "../../../../../apis/designation/designation";
import { FiFilter } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import SearchFieldSmall from "../../../../../components/InputFields/SearchFieldSmall";
import { getEmployeeActivityLog } from "../../../../../apis/employee/employee";
import moment from "moment";
import CheckPermission from "../../../../../CheckPermission";
import Pagination from "../../../../../components/Pagination";

export default function ActivityLog({ userInfo }) {
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
    user_id: userInfo?.id,
  });
  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllDataFunction = () => {
    setIsPending(true);
    getEmployeeActivityLog({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
      user_id: userInfo?.id,
    })
      .then((res) => {
        setData(res);
        console.log({ res });
        setIsPending(false);
      })
      .catch((error) => {
        setData([]);
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
        deleteDesignation(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Designation has been deleted.",
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
    getAllDataFunction();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create",
      title: "Create Designation",
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
      title: "Update Designation",
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

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Title",
      attribute_name: "title",
      minWidth: 30,
      show: true,
      isMainField: true,
    },
    {
      name: "Description",
      attribute_name: "description",
      minWidth: 50,
      show: true,
    },
    { name: "Time", attribute_name: "created_at", minWidth: 20, show: true },
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
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div className="mt-10">
        <div className="relative h-full">
          {/* ========IF MULTIPLE ID SELECTED ======== */}
          {selectedIds.length > 1 && (
            <div className="z-[10] absolute bg-base-300 rounded-xl px-5 py-2 left-1/2 -translate-x-1/2 border border-primary border-opacity-40 flex justify-center items-center gap-2 shadow-xl ">
              <button
                onClick={() => handleDelete(selectedIds)}
                data-tip="Delete all selected items"
                className="tooltip tooltip-bottom tooltip-error"
              >
                <MdDeleteSweep className="text-red-500 text-2xl" />
              </button>
            </div>
          )}
          {/* ========================================  */}

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <Headings level={2}>Activity Log</Headings>
            </div>

            <div className="flex flex-col justify-end md:flex-row gap-5 w-full">
              <SearchFieldSmall
                handleChange={(e) => {
                  setFilters({
                    ...filters,
                    search_key: e.target.value,
                    page: 1,
                  });
                }}
              />
            </div>
          </div>
          {/* ================================================  */}

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            {/* <CustomDataSet cols={cols} setCols={setCols} /> */}
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
                      ...d,
                      title:
                        d?.activity.slice(0, 1).toUpperCase() +
                        d?.activity.slice(1),
                      description: d?.description,
                      created_at: moment(d?.created_at, "DD-MM-YYYY").format(
                        "lll"
                      ),
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
