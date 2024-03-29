import {
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiImage,
  FiInbox,
  FiPieChart,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { GoProjectRoadmap } from "react-icons/go";
import { BsAlarm, BsDot } from "react-icons/bs";
import { LuUserCog } from "react-icons/lu";
import { checkPermissions } from "../utils/checkPermissions";
import { IoMdAlarm } from "react-icons/io";
import {
  ANNOUNCEMENT_CREATE,
  ANNOUNCEMENT_DELETE,
  ANNOUNCEMENT_UPDATE,
  ANNOUNCEMENT_VIEW,
  BUSINESS_BACKGROUND_IMAGE_CREATE,
  BUSINESS_BACKGROUND_IMAGE_VIEW,
  BUSINESS_CREATE,
  BUSINESS_DELETE,
  BUSINESS_UPDATE,
  BUSINESS_VIEW,
  DEPARTMENT_CREATE,
  DEPARTMENT_DELETE,
  DEPARTMENT_UPDATE,
  DEPARTMENT_VIEW,
  DESIGNATION_CREATE,
  DESIGNATION_DELETE,
  DESIGNATION_UPDATE,
  DESIGNATION_VIEW,
  EMPLOYMENT_STATUS_CREATE,
  EMPLOYMENT_STATUS_DELETE,
  EMPLOYMENT_STATUS_UPDATE,
  EMPLOYMENT_STATUS_VIEW,
  HOLIDAY_CREATE,
  HOLIDAY_DELETE,
  HOLIDAY_UPDATE,
  HOLIDAY_VIEW,
  LEAVE_APPROVE,
  LEAVE_CREATE,
  LEAVE_DELETE,
  LEAVE_UPDATE,
  LEAVE_VIEW,
  ROLE_CREATE,
  ROLE_DELETE,
  ROLE_UPDATE,
  ROLE_VIEW,
  SETTING_LEAVE_TYPE_CREATE,
  SETTING_LEAVE_TYPE_DELETE,
  SETTING_LEAVE_TYPE_UPDATE,
  SETTING_LEAVE_TYPE_VIEW,
  USER_CREATE,
  USER_UPDATE,
  USER_VIEW,
  USER_DELETE,
  WORK_SHIFT_CREATE,
  WORK_SHIFT_DELETE,
  WORK_SHIFT_UPDATE,
  WORK_SHIFT_VIEW,
  ATTENDANCE_CREATE,
  EMPLOYEE_ASSET_CREATE,
  EMPLOYEE_ASSET_UPDATE,
  EMPLOYEE_ASSET_VIEW,
  EMPLOYEE_ASSET_DELETE,
  SOCIAL_SITE_CREATE,
  SOCIAL_SITE_UPDATE,
  SOCIAL_SITE_VIEW,
  SOCIAL_SITE_DELETE,
  ASSET_TYPE_CREATE,
  ASSET_TYPE_UPDATE,
  ASSET_TYPE_VIEW,
  ASSET_TYPE_DELETE,
  ATTENDANCE_UPDATE,
  ATTENDANCE_VIEW,
  ATTENDANCE_DELETE,
  JOB_LISTING_CREATE,
  JOB_LISTING_DELETE,
  JOB_LISTING_UPDATE,
  JOB_LISTING_VIEW,
  SETTING_ATTENDANCE_CREATE,
  SETTING_ATTENDANCE_DELETE,
  SETTING_ATTENDANCE_UPDATE,
  SETTING_ATTENDANCE_VIEW,
  SETTING_LEAVE_CREATE,
  SETTING_LEAVE_DELETE,
  SETTING_LEAVE_UPDATE,
  SETTING_LEAVE_VIEW,
  PROJECT_CREATE,
  PROJECT_DELETE,
  PROJECT_UPDATE,
  PROJECT_VIEW,
  RECRUITMENT_PROCESS_CREATE,
  RECRUITMENT_PROCESS_UPDATE,
  RECRUITMENT_PROCESS_VIEW,
  RECRUITMENT_PROCESS_DELETE,
  SETTING_PAYROLL_CREATE,
  SETTING_PAYROLL_UPDATE,
  SETTING_PAYROLL_DELETE,
  SETTING_PAYROLL_VIEW,
  PAYROLL_CREATE,
  PAYROLL_UPDATE,
  PAYROLL_DELETE,
  PAYROLL_VIEW,
  REMINDER_CREATE,
  REMINDER_UPDATE,
  REMINDER_VIEW,
  REMINDER_DELETE,
  TASK_CREATE,
  TASK_DELETE,
  TASK_UPDATE,
  TASK_VIEW,
  CANDIDATE_CREATE,
  CANDIDATE_UPDATE,
  CANDIDATE_VIEW,
  CANDIDATE_DELETE,
  STUDENT_CREATE,
  STUDENT_UPDATE,
  STUDENT_VIEW,
  STUDENT_DELETE,
  STUDENT_STATUS_CREATE,
  STUDENT_STATUS_UPDATE,
  STUDENT_STATUS_VIEW,
  STUDENT_STATUS_DELETE,
  COURSE_TITLE_CREATE,
  COURSE_TITLE_UPDATE,
  COURSE_TITLE_VIEW,
  COURSE_TITLE_DELETE,
} from "./permissions";
import { HiOutlinePaperClip, HiPaperClip } from "react-icons/hi";
import {
  FaChartPie,
  FaGraduationCap,
  FaIdBadge,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { MdVerified } from "react-icons/md";

export const menus = ({ permissions, userData }) => {
  return [
    // STUDENT
    {
      title: "Students",
      link: "/",
      Icon: FaUserGraduate,
      show: checkPermissions(
        [STUDENT_CREATE, STUDENT_UPDATE, STUDENT_VIEW, STUDENT_DELETE],
        permissions
      ),
      childrens: [],
    },

    // COURSE TITLE
    {
      title: "Course Title",
      link: "/course-title",
      Icon: FaGraduationCap,
      childrens: [],
      // show: checkPermissions(
      //   [
      //     COURSE_TITLE_CREATE,
      //     COURSE_TITLE_UPDATE,
      //     COURSE_TITLE_VIEW,
      //     COURSE_TITLE_DELETE,

      //   ],
      //   permissions
      // ),
      show: true,
    },

    // STUDENT STATUS
    {
      title: "Student Status",
      link: "/student-status",
      Icon: FaIdBadge,
      childrens: [],
      show: checkPermissions(
        [
          STUDENT_STATUS_CREATE,
          STUDENT_STATUS_UPDATE,
          STUDENT_STATUS_VIEW,
          STUDENT_STATUS_DELETE,
        ],
        permissions
      ),
    },

    // STAFF
    {
      title: "Staffs",
      link: "/staffs",
      Icon: FaUserTie,
      show: checkPermissions(
        [USER_CREATE, USER_UPDATE, USER_VIEW, USER_DELETE],
        permissions
      ),
      childrens: [],
    },
  ];
};
