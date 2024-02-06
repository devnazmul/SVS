// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete, MdDeleteSweep, MdPanoramaFishEye } from "react-icons/md";
import CustomDataSet from "../../../components/CustomDataSet";
import Headings from "../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  ANNOUNCEMENT_DELETE,
  ANNOUNCEMENT_UPDATE,
  HOLIDAY_DELETE,
  HOLIDAY_UPDATE,
  HOLIDAY_VIEW,
} from "../../../constant/permissions";
import SearchField from "../../../components/InputFields/SearchField";

import FilterDesignation from "./FilterAnnouncement";
import CustomPopup from "../../../components/CustomPopup";

import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import HTMLRenderer from "../../../components/HTMLRenderer";
import { CustomBigCalender } from "../../../components/CustomBigCalender";
import { IoCalendar } from "react-icons/io5";
import { LuTable2 } from "react-icons/lu";
import { deleteHolidays, getAllHolidays } from "../../../apis/holiday/holiday";
import moment from "moment";
import CustomLoading from "../../../components/CustomLoading";
import ViewHoliday from "./ViewHoliday";
import UpdateHoliday from "./UpdateHoliday";
import CreateHoliday from "./CreateHoliday";
import { BsEye } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import CheckPermission from "../../../CheckPermission";
import Pagination from "../../../components/Pagination";
import { findMinMaxDates } from "../../../utils/findMinMaxDates";

export default function AllHolidays() {
  const navigate = useNavigate();
  const [isTable, setIsTable] = useState(false);
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
  const getAllAnnouncementData = () => {
    setIsPending(true);
    getAllHolidays({
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
        deleteHolidays(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Holiday has been deleted.",
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
    getAllAnnouncementData();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create",
      title: "Create Holiday",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE VIEW
  const handleView = (id) => {
    setPopupOption({
      open: true,
      type: "view",
      title: "View Holiday",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Updayte Holiday",
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

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [HOLIDAY_VIEW],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [HOLIDAY_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [HOLIDAY_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Name",
      attribute_name: "name",
      minWidth: 10,
      show: true,
      isMainField: true,
    },

    {
      name: "Start date",
      attribute_name: "start_date",
      minWidth: 10,
      show: true,
    },
    { name: "End date", attribute_name: "end_date", minWidth: 10, show: true },
    {
      name: "Repeats annually",
      attribute_name: "repeats_annually",
      minWidth: 10,
      show: true,
    },
    {
      name: "Description",
      attribute_name: "description",
      minWidth: 30,
      show: true,
    },
    {
      name: "Available for",
      attribute_name: "department",
      minWidth: 10,
      show: true,
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
    <CheckPermission permissionArray={[HOLIDAY_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <FilterDesignation
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
                  <CreateHoliday
                    startDate={popupOption?.start}
                    endDate={popupOption?.end}
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
                  <UpdateHoliday
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
                {popupOption?.type === "view" && (
                  <ViewHoliday
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

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <Headings level={1}>All Holidays</Headings>
              <h3>
                Total {data?.total} {data?.total > 1 ? "Holidays" : "Holiday"}{" "}
                Found
              </h3>
            </div>

            <div className="flex flex-col justify-end md:flex-row gap-5 w-full">
              {isTable && (
                <SearchField
                  handleChange={(e) => {
                    setFilters({
                      ...filters,
                      search_key: e.target.value,
                      page: 1,
                    });
                  }}
                />
              )}

              <div className="flex justify-end md:justify-start gap-5">
                <button
                  onClick={handleCreate}
                  className="btn btn-primary w-1/3 md:w-16 lg:w-32"
                >
                  <BiPlus />{" "}
                  <span className="block sm:hidden lg:block">Create</span>
                </button>
                {isTable
                  ? // <button
                    //   onClick={toggleFilterBar}
                    //   className="btn btn-primary w-1/3 md:w-16 lg:w-32"
                    // >
                    //   <FiFilter />{" "}
                    //   <span className="block sm:hidden lg:block">Filter</span>
                    // </button>
                    ""
                  : ""}
              </div>
            </div>
          </div>
          {/* ================================================  */}

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            <div className="flex items-center gap-2">
              {isTable && <CustomDataSet cols={cols} setCols={setCols} />}
              <button
                data-tip={isTable ? "Calender" : "Table"}
                onClick={() => setIsTable(!isTable)}
                className="bg-primary px-2 py-1 rounded-lg  tooltip tooltip-primary tooltip-bottom mb-1"
              >
                {isTable ? (
                  <IoCalendar className="text-2xl text-base-300" />
                ) : (
                  <LuTable2 className="text-2xl text-base-300" />
                )}
              </button>
            </div>
            {isTable ? (
              <>
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
                    description: <HTMLRenderer htmlString={d?.description} />,
                    is_active: (
                      <>
                        {parseInt(d?.is_active) === 1 ? (
                          <span className="text-base-300 bg-success shadow-md shadow-success px-5 py-1 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="text-base-300 bg-error shadow-md shadow-error  px-5 py-1 rounded-full">
                            De-active
                          </span>
                        )}
                      </>
                    ),
                    repeats_annually: d?.repeats_annually ? "Yes" : "NO",
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
              </>
            ) : (
              <div className="h-[90vh] pb-5">
                {isPending ? (
                  <CustomLoading />
                ) : (
                  <CustomBigCalender
                    onSelectSlot={(e) => {
                      const { minDate, maxDate } = findMinMaxDates(e?.slots);

                      setPopupOption({
                        open: true,
                        type: "create",
                        title: "Create Holiday",
                        onClose: () => {
                          setPopupOption({ ...popupOption, open: false });
                        },
                        id: null,
                        start: minDate,
                        end: maxDate,
                        closeOnDocumentClick: false,
                      });
                    }}
                    events={data?.data.map((e) => ({
                      ...e,
                      title: e?.name,
                      start: moment(e?.start_date, "DD-MM-YYYY").toDate(),
                      end: moment(e?.end_date, "DD-MM-YYYY").toDate(),
                      repeats_annually: e?.repeats_annually,
                    }))}
                    onSelectEvent={(e) => {
                      handleView(e?.id);
                    }}
                    className={"h-full"}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
