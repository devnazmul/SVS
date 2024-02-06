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
import { useNavigate, useParams } from "react-router-dom";
import SearchField from "../../../components/InputFields/SearchField";
import CustomPopup from "../../../components/CustomPopup";
import { BiPlus } from "react-icons/bi";
import CheckPermission from "../../../CheckPermission";
import Pagination from "../../../components/Pagination";

import CreateAndUpdateCandidate from "./CreateAndUpdateCandidate";
import { AiFillEye } from "react-icons/ai";
import ViewCandidate from "./ViewCandidate";
import { decryptID, encryptID } from "../../../utils/encryptAndDecryptID";
import FilterCandidate from "./FilterCandidate";
import {
  deleteCandidate,
  getAllCandidates,
} from "../../../apis/candidate/candidate";
import {
  CANDIDATE_DELETE,
  CANDIDATE_UPDATE,
  CANDIDATE_VIEW,
} from "../../../constant/permissions";
import GoBackButton from "../../../components/GoBackButton";
import { formatRole } from "../../../utils/formatRole";

export default function AllCandidates() {
  const { encId } = useParams();
  let id = undefined;

  if (encId) {
    id = decryptID(encId);
  }

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
    getAllCandidates({
      perPage: filters?.perPage,
      page: filters?.page,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      search_key: filters?.search_key,
      order_by: filters?.order_by,
      job_listing_id: id || "",
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
        deleteCandidate(id)
          .then((res) => {
            setIsUpdated(Math.random());
            setSelectedIds([]);
            Swal.fire({
              title: "Deleted!",
              text: "Candidate has been deleted.",
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
      title: "Create Candidate",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE VIEW
  const handleView = (id) => {
    // navigate(`view-Project/${encryptID(id)}`);
    // ${encryptID(id)
  };

  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Candidate",
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
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      permissions: [CANDIDATE_VIEW],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: [CANDIDATE_UPDATE],
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isPendingDelete,
      permissions: [CANDIDATE_DELETE],
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Name",
      attribute_name: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Job Title",
      attribute_name: "job_title",
      minWidth: 20,
      show: true,
    },
    {
      name: "Job Platform",
      attribute_name: "job_platform",
      minWidth: 20,
      show: true,
    },
    {
      name: "Interview Date",
      attribute_name: "interview_date",
      minWidth: 20,
      show: true,
    },
    { name: "Status", attribute_name: "status", minWidth: 20, show: true },
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
    <CheckPermission permissionArray={[CANDIDATE_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          <FilterCandidate
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
                  <CreateAndUpdateCandidate
                    jobId={id || null}
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
                  <CreateAndUpdateCandidate
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
                  <ViewCandidate
                    data={data}
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
          {id && (
            <div className="flex mb-5 flex-col md:flex-row justify-between items-center relative gap-5">
              <div className="flex flex-col gap-2 w-full text-center md:text-left">
                <Headings level={1}>
                  All Candidates of {data?.data?.[0]?.job_listing?.title}
                </Headings>
                <h3>
                  Total {data?.total}{" "}
                  {data?.total > 1 ? "Candidates" : "Candidate"} Found
                </h3>
              </div>

              <div className="flex flex-col justify-end md:flex-row gap-5 w-full">
                <div className="flex justify-end md:justify-start gap-5">
                  <GoBackButton />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              {!id && (
                <>
                  <Headings level={1}>
                    All Candidates
                    {id && <>of {data?.data?.[0]?.job_listing?.title}</>}
                  </Headings>
                  <h3>
                    Total {data?.total}{" "}
                    {data?.total > 1 ? "Candidates" : "Candidate"} Found
                  </h3>
                </>
              )}
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
                  <span className="block sm:hidden lg:block">Add Candidate</span>
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
              rows={
                data?.data?.length > 0
                  ? data?.data.map((d) => ({
                    ...d,
                    name: d?.name,
                    job_title: d?.job_listing?.title,
                    status: (
                      <>
                        {d?.status === "applied" && (
                          <span
                            className={`bg-gray-200 text-gray-700 px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "in_progress" && (
                          <span
                            className={`bg-blue-200 text-blue-700 px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "interview_stage_1" && (
                          <span
                            className={`bg-yellow-200 text-yellow-700 px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "interview_stage_2" && (
                          <span
                            className={`bg-yellow-400 text-yellow-800 px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "final_interview" && (
                          <span
                            className={`bg-purple-200 text-purple-700 px-5 py-2 rounded-full shadow-md`}
                          >
                            {" "}
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "rejected" && (
                          <span
                            className={`bg-red-200 text-red-700 px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "job_offered" && (
                          <span
                            className={`bg-green-200 text-green-700 px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                        {d?.status === "hired" && (
                          <span
                            className={`bg-green-500 text-white px-5 py-2 rounded-full shadow-md`}
                          >
                            {formatRole(d?.status)}
                          </span>
                        )}
                      </>
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
