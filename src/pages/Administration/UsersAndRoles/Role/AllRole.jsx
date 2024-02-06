// =====================================
// #00143
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../../components/Table";
import toast from "react-hot-toast";
import CustomToaster from "../../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Headings from "../../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { deleteMultipleRole, getAllRoles } from "../../../../apis/roles/roles";
import {
  ROLE_DELETE,
  ROLE_UPDATE,
  ROLE_VIEW,
} from "../../../../constant/permissions";

import { RxInfoCircled } from "react-icons/rx";
import SearchFieldSmall from "../../../../components/InputFields/SearchFieldSmall";
import CustomPopup from "../../../../components/CustomPopup";
import CreateRole from "./CreateAndUpdateRole";
import { useNavigate } from "react-router-dom";
import CreateAndUpdateRole from "./CreateAndUpdateRole";
import ViewRole from "./ViewRole";
import { useAuth } from "../../../../context/AuthContext";
import { getFullImageLink } from "../../../../utils/getFullImageLink";
import Pagination from "../../../../components/Pagination";

export default function AllRole({
  isCreateTriggered,
  setIsCreateTriggered,
  isUpdated,
  setIsUpdated,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUpdateTriggered, setIsUpdateTriggered] = useState({
    status: false,
    id: null,
  });
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {},
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  useEffect(() => {
    if (isCreateTriggered) {
      setPopupOption({
        open: true,
        type: "create",
        title: "Create Role",
        onClose: () => {
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
        title: "Update Role",
        onClose: () => {
          setPopupOption({ ...popupOption, open: false });
        },
        id: isUpdateTriggered?.id,
        closeOnDocumentClick: false,
      });
    }
  }, [isUpdateTriggered]);

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
    perPage: 10,
    page: 1,
    order_by: "DESC",
  });

  // GET ALL DATA
  const [data, setData] = useState({});
  const getAllRoleData = () => {
    setIsPending(true);
    getAllRoles({
      search_key: filters?.search_key,
      page: filters?.page,
      perPage: filters?.perPage,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      order_by: filters?.order_by,
    })
      .then((res) => {
        console.log({ res });
        setData(res);
        setIsPending(false);
      })
      .catch((error) => {
        console.log({ error });

        setIsPending(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00143 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  // DELETE API
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteRoles = (id) => {
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
        deleteMultipleRole(id)
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
                text={`ID: #00143 - ${error?.response?.data?.message}`}
                errors={error?.response?.data?.errors}
              />
            ));
          });
      }
    });
  };

  // REFETCH AFTER FILTER AND DATA CHANGE
  useEffect(() => {
    getAllRoleData();
  }, [filters, isUpdated]);

  // HANDLER FUNCTIONS FUNCTIONS

  // HANDLE VIEW
  const handleView = (id) => {
    setPopupOption({
      open: true,
      type: "view",
      title: "View Role",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    setIsUpdateTriggered({ status: true, id: id });
  };
  // HANDLE DELETE
  const handleDelete = (id) => {
    deleteRoles(id);
  };

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [ROLE_VIEW],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [ROLE_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [ROLE_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Name",
      attribute_name: "name",
      minWidth: 40,
      show: true,
      isMainField: true,
    },
    { name: "Users", attribute_name: "users", minWidth: 40, show: true },
    // {
    //   name: "Permissions",
    //   attribute_name: "permission",
    //   minWidth: 10,
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
    <div className="">
      <div className="relative h-full">
        {/* POPUP */}
        <CustomPopup
          popupClasses={`w-[70vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
              {popupOption?.type === "create" && (
                <CreateAndUpdateRole
                  handleClosePopup={() => {
                    setPopupOption({
                      open: false,
                      type: "",
                      id: null,
                      onClose: () => {
                        setPopupOption({ ...popupOption, open: false });
                        setIsUpdated(Math.random());
                        setIsCreateTriggered(false);
                      },
                      overlayStyle: { background: "red" },
                      closeOnDocumentClick: false,
                    });
                  }}
                />
              )}

              {popupOption?.type === "edit" && (
                <CreateAndUpdateRole
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

              {popupOption?.type === "view" && (
                <ViewRole
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

        {/* ======= HEADING AND FILTERING AREA =========  */}
        <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
          <div className="flex flex-col gap-2 w-full text-center md:text-left">
            <Headings level={1}> Roles</Headings>
            {/* <h3>
              Total {data?.total} {data?.total > 1 ? "Roles" : "Role"} Found
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

        {/* =========== TABLE AREA ============  */}
        <div className="pt-5 relative">
          <Table
            minWidth={"20px"}
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
              let name;
              if (user?.business_id) {
                name = `${d?.name.split("_")[1].split("#")[0].toUpperCase()}`;
              } else {
                if (d?.name.split("_").length > 1) {
                  if (d?.name.split("_")[1].split("#").length > 1) {
                    name = `${d?.name
                      .split("_")[1]
                      .split("#")[0]
                      .toUpperCase()}`;
                  } else {
                    name = `${d?.name.split("_")[1].toUpperCase()}`;
                  }
                } else {
                  name = `${d?.name.toUpperCase()}`;
                }
              }
              return {
                id: d?.id,
                name: name,
                permission: (
                  <>
                    <RxInfoCircled className="text-xl text-primary cursor-pointer hover:text-primary-focus" />
                  </>
                ),
                users:
                  d?.users.length > 0 ? (
                    <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                      {d.users.slice(0, 4).map((u, index) => (
                        <>
                          {u?.image ? (
                            <div
                              // onClick={() =>
                              //   navigate(`/employee/view/${d?.id}`)
                              // }
                              className="avatar hover:scale-125 cursor-pointer duration-100"
                            >
                              <div className="w-8">
                                <img src={getFullImageLink(u?.image)} />
                              </div>
                            </div>
                          ) : (
                            <div
                              // onClick={() =>
                              //   navigate(`/employee/view/${d?.id}`)
                              // }
                              className="avatar placeholder hover:scale-125 duration-100 cursor-pointer"
                            >
                              <div className="w-8 bg-primary text-base-300">
                                <span>
                                  {u?.first_Name.slice(0, 1).toUpperCase()}
                                  {u?.middle_Name
                                    ? u?.middle_Name.slice(0, 1).toUpperCase()
                                    : ""}
                                  {u?.last_Name.slice(0, 1).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {d?.users?.length > 4 && (
                        <div className="avatar placeholder hover:scale-125 duration-100 cursor-pointer">
                          <div className="w-8 bg-primary text-base-300">
                            <span>+{d?.users.length - 4}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>No user added in this role</div>
                  ),
                is_system_default: d?.is_system_default,
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
