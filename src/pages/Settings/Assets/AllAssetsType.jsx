// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete, MdDeleteSweep } from "react-icons/md";
import CustomDataSet from "../../../components/CustomDataSet";
import Headings from "../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import SearchField from "../../../components/InputFields/SearchField";

import CustomPopup from "../../../components/CustomPopup";

import { BiPlus } from "react-icons/bi";
import CreateAssetsType from "./CreateAssetsType";
import UpdateAssetsType from "./UpdateAssetsType";
import FilterAssetsType from "./FilterAssetsType";
import {
  deleteAssetType,
  getAllAssetTypes,
} from "../../../apis/settings/assetType/assetType";
import { toggleDesignationActiveDeactive } from "../../../apis/designation/designation";
import {
  ASSET_TYPE_DELETE,
  ASSET_TYPE_UPDATE,
  ASSET_TYPE_VIEW,
} from "../../../constant/permissions";
import CheckPermission from "../../../CheckPermission";
import Pagination from "../../../components/Pagination";

export default function AllAssetsType() {
  const navigate = useNavigate();
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
  });

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllData = () => {
    setIsPending(true);
    getAllAssetTypes({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
    })
      .then((res) => {
        setData(res);
        console.log({ res });
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
        deleteAssetType(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Asset type has been deleted.",
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
        toggleDesignationActiveDeactive(id)
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
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create",
      title: "Create Asset Type",
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
      title: "Update Asset Type",
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
  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [ASSET_TYPE_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [ASSET_TYPE_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Title",
      attribute_name: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    // {
    //   name: "Description",
    //   attribute_name: "description",
    //   minWidth: 60,
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
    <CheckPermission permissionArray={[ASSET_TYPE_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <FilterAssetsType
            isOpen={isFilterBarOpen}
            toggleHandler={toggleFilterBar}
            filters={filters}
            setFilters={setFilters}
          />

          <CustomPopup
            popupClasses={`w-[70vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {popupOption?.type === "create" && (
                  <CreateAssetsType
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
                  <UpdateAssetsType
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
              <Headings level={1}>All Asset Types</Headings>
              <h3>
                Total {data?.total}{" "}
                {data?.total > 1 ? "Asset Types" : "Asset Type"} Found
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
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              itemsPerPage={filters?.perPage}
              totalItems={data?.total}
              setPageNo={(data) => setFilters({ ...filters, page: data })}
              setPerPage={setPerPage}
              perPage={filters?.perPage}
              isLoading={isPending}
              rows={data?.data?.map((d) => ({
                ...d,
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
