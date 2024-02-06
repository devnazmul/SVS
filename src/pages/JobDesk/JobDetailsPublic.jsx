import { CiMap } from "react-icons/ci";
import {
  FaArrowRight,
  FaBookmark,
  FaCoins,
  FaRegBookmark,
} from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { decryptID } from "../../utils/encryptAndDecryptID";
import { getSingleJobList } from "../../apis/jobDesk/jobDesk";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import { useEffect, useState } from "react";
import { FaMapLocationDot, FaPenToSquare } from "react-icons/fa6";
import { formatNumber } from "../../utils/formatNumber";
import HTMLRenderer from "../../components/HTMLRenderer";
import CustomPopup from "../../components/CustomPopup";
import CreateAndUpdateJobDesk from "./CreateAndUpdateJobDesk";
import { checkPermissions } from "../../utils/checkPermissions";
import { JOB_LISTING_UPDATE } from "../../constant/permissions";
import CreateAndUpdateCandidate from "./Candidate/CreateAndUpdateCandidate";
import { MdCopyAll } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

export default function JobDetailsPublic() {
  const { encId } = useParams();
  const id = decryptID(encId);
  const permissions = localStorage.getItem("permissions");
  const [data, setData] = useState({});

  // COPY LINK
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentRouteLink = `${window.location.origin}/public/job-view/${
    location.pathname?.split("/")[location.pathname?.split("/")?.length - 1]
  }`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentRouteLink);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link to clipboard:", error);
    }
  };

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

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(Math.random());
  useEffect(() => {
    setIsLoading(true);
    getSingleJobList(id)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [id, isUpdated]);

  // HANDLER FUNCTIONS
  // HANDLE EDIT
  const handleEdit = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Job",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: id,
      closeOnDocumentClick: false,
    });
  };
  // HANDLE APPLY
  const handleApply = () => {
    setPopupOption({
      open: true,
      type: "apply",
      title: "Assign Candidate",
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };
  if (isLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div>
        {/* POPUP  */}
        <CustomPopup
          popupClasses={`w-[70vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
              {popupOption?.type === "apply" && (
                <CreateAndUpdateCandidate
                  jobId={data?.id}
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

        <h1 className="text-2xl font-bold mb-5">Job Details</h1>
        {/* JOB TITLE  &  ACTION BUTTONS  */}
        <div className="md:flex md:justify-between md:items-start gap-5">
          <div
            className={`flex flex-col shadow-md shadow-primary-content rounded-xl md:w-2/3 bg-base-300 border-2 border-primary-content`}
          >
            <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 items-center p-5  w-full">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-col justify-center items-center md:items-start">
                  {/* JOB TITLE  */}
                  <span className="text-xl font-bold">{data?.title}</span>

                  {/* JOB PLATFORM  */}
                  <div className={`text-primary`}>
                    {data?.job_platforms
                      ?.map((jp, index) => jp?.name)
                      .join(", ")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 my-3 flex-wrap">
                {/* JOB TYPE  */}
                {data?.job_type && (
                  <p className="bg-warning text-warning-content text-sm rounded-full px-3 p-1">
                    {data?.job_type?.name}
                  </p>
                )}

                {/* EXPERIENCE LEVEL  */}
                {data?.experience_level && (
                  <p className="bg-info text-info-content text-sm rounded-full px-3 p-1">
                    {data?.experience_level}
                  </p>
                )}

                {/* WORK LOCATION  */}
                {data?.work_location && (
                  <p className="bg-success text-success-content text-sm rounded-full px-3 p-1">
                    {data?.work_location?.name}
                  </p>
                )}
              </div>
            </div>

            {/* SALARY AND LOCATION  */}
            <div className="flex items-center justify-between text-center w-full p-5 ">
              {/* SALARY  */}
              <div className="flex flex-col justify-end items-start md:items-center gap-1">
                <FaCoins className="text-primary text-2xl" />
                <span className="font-bo">Salary Per Month</span>
                <span className="text-primary">
                  £ {formatNumber(data?.minimum_salary || 0)}
                  {data?.maximum_salary &&
                    ` - ${formatNumber(data?.maximum_salary || 0)}`}
                </span>
              </div>

              {/* DIVIDER  */}
              <div className={`block w-[1px] h-16 bg-primary-content`}></div>

              {/* JOB LOCATION  */}
              <div className="flex flex-col justify-end items-end md:items-center gap-1">
                <FaMapLocationDot className="text-primary text-2xl flex justify-center text-center" />
                {/* JOB LOCATION  */}
                <span className="font-bo">Job Location</span>
                <span className="text-sm">{data?.location}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS  */}
          <div className="flex items-center justify-end gap-4 mt-5 md:mt-0 md:w-1/3">
            <button
              data-tip={isCopied ? "Copied!!" : "Copy Link"}
              onClick={() => !isCopied && handleCopyToClipboard(id)}
              className=" tooltip tooltip-bottom tooltip-primary btn btn-primary btn-outline group w-15 h-5 "
            >
              {isCopied ? (
                <IoCheckmarkDoneCircle className={` text-lg`} />
              ) : (
                <MdCopyAll className={` text-lg`} />
              )}
            </button>

            <button
              data-tip="Apply"
              onClick={handleApply}
              className="btn btn-primary w-1/3 md:w-16 lg:w-32"
            >
              <span className="block sm:hidden lg:block">Apply Now</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* DESCRIPTION  */}
        <div>
          <h3 className="text-2xl mt-10 font-bold mb-5">Job Description</h3>
          <div className="default-styles-container bg-base-300 border-2 border-primary-content shadow-md shadow-primary-content rounded-xl px-8 py-5">
            <HTMLRenderer htmlString={data?.description} />
          </div>
        </div>
      </div>
    );
  }
}
