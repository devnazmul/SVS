import { FaBookmark, FaCoins, FaRegBookmark } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { formatNumber } from "../../utils/formatNumber";
import moment from "moment";
import { formatRelativeDate } from "../../utils/formatRelativeDate";
import { encryptID } from "../../utils/encryptAndDecryptID";
import { RiEdit2Fill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdDelete, MdFlag } from "react-icons/md";
import { PiFlagBannerFill } from "react-icons/pi";
import { BsFillPeopleFill } from "react-icons/bs";

export default function JobPostCard({
  job,
  handleEdit,
  handleDelete,
  handleApply,
}) {
  const navigate = useNavigate();
  return (
    <div className="border border-base-100 flex flex-col gap-2 shadow-lg duration-300 hover:border-primary hover:shadow-primary-content rounded-xl p-5 w-full bg-base-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div>
            {/* JOB TITLE  */}
            <p
              onClick={() =>
                navigate(`/job-desk/details/${encryptID(job?.id)}`)
              }
              className="text-xl hover:text-primary duration-150 font-bold cursor-pointer"
            >
              {job?.title}
            </p>
            {/* JOB PLATFORM  */}
            <div className={`text-primary flex items-center gap-2`}>
              <div
                data-tip="platforms"
                className={`tooltip tooltip-bottom tooltip-primary`}
              >
                <MdFlag />
              </div>
              {job?.job_platforms?.map((jp, index) => jp?.name).join(", ")}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS  */}
        <div className={`flex gap-2 items-center justify-end`}>
          <button
            onClick={() => handleApply(job?.id)}
            data-tip="apply"
            className={`tooltip tooltip-bottom tooltip-primary`}
          >
            <PiFlagBannerFill className={`text-xl text-primary`} />
          </button>
          <button
            onClick={() => handleEdit(job?.id)}
            data-tip="edit"
            className={`tooltip tooltip-bottom tooltip-primary`}
          >
            <RiEdit2Fill className={`text-xl text-primary`} />
          </button>
          <button
            onClick={() => handleDelete(job?.id)}
            data-tip="delete"
            className={`tooltip tooltip-bottom tooltip-primary`}
          >
            <MdDelete className={`text-xl text-red-500`} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 my-3 flex-wrap">
        {/* JOB TYPE  */}
        {job?.job_type && (
          <p
            data-tip="Job Type"
            className="cursor-pointer  tooltip tooltip-bottom tooltip-primary bg-warning text-warning-content  text-sm rounded-full px-3 p-1"
          >
            {job?.job_type?.name}
          </p>
        )}

        {/* EXPERIENCE LEVEL  */}
        {job?.experience_level && (
          <p
            data-tip="Experience Level"
            className="cursor-pointer tooltip tooltip-bottom tooltip-primary bg-info text-info-content text-sm rounded-full px-3 p-1"
          >
            {job?.experience_level}
          </p>
        )}

        {/* WORK LOCATION  */}
        {job?.work_location && (
          <p
            data-tip="Work Location"
            className="cursor-pointer tooltip tooltip-bottom tooltip-primary bg-success text-success-content text-sm rounded-full px-3 p-1"
          >
            {job?.work_location?.name}
          </p>
        )}
      </div>

      <div className="w-full items-end h-full flex">
        <div className={`w-full flex justify-between items-end`}>
          <div className={`inline-flex flex-col`}>
            {/* SALARY  */}
            <div
              data-tip="Salary"
              className="tooltip cursor-pointer tooltip-right tooltip-primary inline-flex gap-2 items-center text-sm"
            >
              <span
                className={`w-7 h-7 flex justify-center items-center text-primary`}
              >
                <RiMoneyDollarCircleLine className={`text-2xl`} />
              </span>
              <span>
                £ {formatNumber(job?.minimum_salary || 0)}
                {job?.maximum_salary &&
                  ` -
             ${formatNumber(job?.maximum_salary || 0)}`}{" "}
                / month
              </span>
            </div>

            {/* TOTAL CANDIDATE  */}
            <NavLink
              to={`/job-candidates/${job?.id}`}
              data-tip="Total candidates"
              className="tooltip cursor-pointer tooltip-right tooltip-primary inline-flex gap-2 items-center text-sm"
            >
              <span
                className={`w-7 h-7 flex justify-center items-center text-primary`}
              >
                <BsFillPeopleFill className={`text-lg`} />
              </span>
              <span>{job?.total_candidates}</span>
            </NavLink>
          </div>

          <div
            data-tip={job?.created_at}
            className="tooltip cursor-pointer tooltip-top text-gray-500 text-sm"
          >
            {formatRelativeDate(job?.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
