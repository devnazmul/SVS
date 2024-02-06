// =====================================
// #00119
// =====================================

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { deleteReminder, getAllReminders } from "../../apis/reminders/reminder";
import CheckPermission from "../../CheckPermission";
import {
  REMINDER_CREATE,
  REMINDER_DELETE,
  REMINDER_UPDATE,
  REMINDER_VIEW,
} from "../../constant/permissions";
import CustomPopup from "../../components/CustomPopup";
import CreateAndUpdateAllReminders from "../Reminders/CreateAndUpdateAllReminders";
import Headings from "../../components/Headings/Headings";
import SearchField from "../../components/InputFields/SearchField";
import { BiPlus } from "react-icons/bi";
import CustomDataSet from "../../components/CustomDataSet";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import CustomToaster from "../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import FilterAllNotification from "./FilterAllNotification";
import { checkPermissions } from "../../utils/checkPermissions";
import { getAllNotification } from "../../apis/notification/notification";
import { formatRole } from "../../utils/formatRole";
import moment from "moment";
import CustomLoading from "../../components/CustomLoading";
import { formatOrRelativeTime } from "../../utils/formatOrRetriveTimeFromDate";
import NotificationRow from "./NotificationRow";

export default function AllNotification() {
  const permissions = localStorage.getItem("permissions");
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
  });

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState(Math.random());

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllData = () => {
    setIsPending(true);
    getAllNotification({
      perPage: filters?.perPage,
      page: filters?.page,
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
        deleteReminder(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Reminder has been deleted.",
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
  // console.log(data);
  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE EDIT
  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Notification",
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
  const [actions, setActions] = useState([
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [REMINDER_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Entity Name",
      attribute_name: "entity_name",
      minWidth: 20,
      show: true,
    },
    {
      name: "Notification Title",
      attribute_name: "notification_title",
      minWidth: 30,
      show: true,
      isMainField: true,
    },
    {
      name: "Notification Description",
      attribute_name: "notification_description",
      minWidth: 30,
      show: true,
    },
    // {
    //   name: "Notification Link",
    //   attribute_name: "notification_link",
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
    <CheckPermission permissionArray={[REMINDER_CREATE, REMINDER_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <FilterAllNotification
            isOpen={isFilterBarOpen}
            toggleHandler={toggleFilterBar}
            filters={filters}
            setFilters={setFilters}
          />

          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <Headings level={1}>All Notification</Headings>
              <h3>
                Total {data?.notifications?.total}{" "}
                {data?.notifications?.total > 1
                  ? "Notifications"
                  : "Notification"}{" "}
                Found
              </h3>
            </div>

            <div
            //  className="flex flex-col justify-end md:flex-row gap-5 w-full"
            >
              {/* <SearchField
                handleChange={(e) => {
                  setFilters({
                    ...filters,
                    search_key: e.target.value,
                    page: 1,
                  });
                }}
              /> */}
            </div>
          </div>
          {/* ================================================  */}

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            {/* <CustomDataSet cols={cols} setCols={setCols} /> */}
            {isPending ? (
              <CustomLoading h="h-[350px]" />
            ) : (
              <div
                className={`max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-primary-content grid grid-cols-1 overflow-y-auto`}
              >
                {data?.notifications?.data?.map((notification, index) => (
                  <NotificationRow key={index} notification={notification} />
                ))}
              </div>
            )}
            {/* <Table
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              itemsPerPage={filters?.perPage}
              totalItems={data?.total}
              setPageNo={(data) => setFilters({ ...filters, page: data })}
              setPerPage={setPerPage}
              perPage={filters?.perPage}
              isLoading={isPending}
              rows={data?.notifications?.data?.map((d) => ({
                ...d,
              }))}
              actions={actions}
              isFullActionList={true}
              cols={cols}
            /> */}
            {/* PAGINATION  */}
            {data?.total !== 0 && (
              <div
                // style={{ minWidth: minWidth }}
                className="flex-col flex justify-center bg-base-200 md:bg-base-200 items-center py-1 shadow-md"
              >
                {console.log({ data: data?.notifications?.total })}
                <Pagination
                  forcePage={filters?.page}
                  itemsPerPage={filters?.perPage}
                  totalItems={data?.notifications?.total}
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
