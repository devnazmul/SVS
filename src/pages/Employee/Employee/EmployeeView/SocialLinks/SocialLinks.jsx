// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";
import Table from "../../../../../components/Table";

import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import { MdCancel, MdDelete, MdDeleteSweep } from "react-icons/md";
import CustomDataSet from "../../../../../components/CustomDataSet";
import Headings from "../../../../../components/Headings/Headings";
import Swal from "sweetalert2";
import { IoIosCheckmarkCircle, IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteSingleUser,
  getAllUsers,
  toggleEmployeeActiveDeactive,
} from "../../../../../apis/userAndBusiness/user";
import {
  EMPLOYEE_VIEW,
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../../../../constant/permissions";
import CustomField from "../../../../../components/InputFields/CustomField";
import SearchField from "../../../../../components/InputFields/SearchField";
import { useAuth } from "../../../../../context/AuthContext";
import { BiPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import {
  deleteMultipleDocument,
  getAllDocument,
} from "../../../../../apis/documents/documents";
import CustomPopup from "../../../../../components/CustomPopup";
import { IoDocumentText } from "react-icons/io5";
import { getFullImageLink } from "../../../../../utils/getFullImageLink";
import {
  createUserSocialLink,
  getAllUserSocialMedia,
  updateUserSocialLink,
} from "../../../../../apis/employee/employee";
import { formatRole } from "../../../../../utils/formatRole";
import CreateAndUpdateSocialLink from "./CreateAndUpdateSocialLink";
import { DisplayIcon } from "../../../../../utils/DisplayIcon";
import CheckPermission from "../../../../../CheckPermission";
import NoDataFound from "../../../../../components/NoDataFound";

export default function SocialLinks({ userInfo }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    console.log({ userInfo });
  }, [userInfo]);
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    title: "",
    id: null,
    userId: userInfo.id,
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
  const getAllData = () => {
    setIsPending(true);
    getAllUserSocialMedia({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
      user_id: filters?.user_id,
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
        deleteMultipleDocument(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Document has been deleted.",
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

  // HANDLER FUNCTIONS FUNCTIONS
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      open: true,
      type: "create",
      title: "Add Document",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE VIEW
  const handleView = (id) => {
    console.log({ id });
    navigate(`/employee/view/${id}`);
  };
  // HANDLE EDIT
  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Social Media Link",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      userId: userInfo?.id,
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
      name: "Platform",
      attribute_name: "platform",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Url",
      attribute_name: "url",
      minWidth: 70,
      show: true,
      isMainField: true,
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

  const [editId, setEditId] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState();
  const validate = (e, id) => {
    setError({ id: id, message: "url is invalid" });
  };

  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const handleSave = (s) => {
    console.log("save");
    setIsSaveLoading(true);
    if (s?.user_social_site?.length > 0) {
      // UPDATE
      const data = {
        id: s?.user_social_site[0]?.id,
        social_site_id: editId,
        user_id: userInfo?.id,
        profile_link: url,
      };
      updateUserSocialLink(data)
        .then((res) => {
          console.log({ res });
          setIsSaveLoading(false);

          setIsUpdated(Math.random());
          setEditId(null);
          setUrl("");
        })
        .catch((error) => {
          console.log({ error });
        });
    } else {
      // CREATE
      const data = {
        social_site_id: editId,
        user_id: userInfo?.id,
        profile_link: url,
      };

      createUserSocialLink(data)
        .then((res) => {
          console.log({ res });
          setIsSaveLoading(false);
          setIsUpdated(Math.random());
          setEditId(null);
          setUrl("");
        })
        .catch((error) => {
          console.log({ error });
        });
    }
  };

  return (
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <CustomPopup
            popupClasses={`w-[70vw]`}
            popupOption={popupOption}
            setPopupOption={setPopupOption}
            Component={
              <>
                {popupOption?.type === "edit" && (
                  <CreateAndUpdateSocialLink
                    user_id={popupOption?.userId}
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
              <Headings level={1}>Social Links</Headings>
            </div>
          </div>
          {/* ================================================  */}

          {/* =========== TABLE AREA ============  */}
          <div className="pt-5 relative">
            <div className="flex justify-between items-center py-5 px-5 gap-5 text-sm font-medium border-b border-primary-content">
              <div className="w-[30%]">Website</div>
              <div className="w-[60%] pl-4">Url</div>
              <div className="w-[10%]">Actions</div>
            </div>
            {isPending ? (
              <div className="flex justify-center items-center py-5 px-5 gap-5 text-sm font-medium">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : (
              <>
                {data?.data?.length > 0 ? (
                  data?.data
                    ?.map((d) => ({
                      ...d,
                      id: d?.id,
                      platform: formatRole(d?.name),
                      url:
                        d?.user_social_site.length > 0
                          ? d?.user_social_site[0]?.profile_link
                          : "",
                    }))
                    .map((s, i) => (
                      <div className="flex justify-between items-center bg-base-300 py-4 px-5 gap-5">
                        <div className="w-[30%] flex gap-3">
                          <DisplayIcon
                            className={`text-2xl text-primary`}
                            text={s?.icon}
                          />
                          {s?.platform}
                        </div>
                        <div className="w-[60%]">
                          <input
                            type="text"
                            className={`w-full input`}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={`${s?.url ? s?.url : "Not Added"}`}
                            disabled={editId !== s?.id}
                            value={!editId ? s?.url : url}
                          />
                        </div>

                        <div className="w-[10%] flex gap-5">
                          {!editId ? (
                            <button
                              data-tip={"edit"}
                              onClick={() => {
                                setUrl(s?.url);
                                setEditId(s?.id);
                              }}
                              className="tooltip tooltip-bottom tooltip-primary"
                            >
                              <RiEdit2Fill className="text-xl text-primary" />
                            </button>
                          ) : (
                            ""
                          )}
                          {editId ? (
                            <button
                              data-tip={"save"}
                              onClick={() => {
                                handleSave(s);
                              }}
                              className="tooltip tooltip-bottom tooltip-primary"
                            >
                              {isSaveLoading ? (
                                <span className="loading loading-spinner text-primary loading-xs"></span>
                              ) : (
                                <IoIosSave className="text-xl text-primary" />
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                          <button
                            data-tip="delete"
                            className="tooltip tooltip-bottom tooltip-primary"
                          >
                            <MdDelete className="text-xl text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex w-full justify-center items-center">
                    <NoDataFound
                      h="h-[400px]"
                      text={`No Social site Found!`}
                      backButton={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
