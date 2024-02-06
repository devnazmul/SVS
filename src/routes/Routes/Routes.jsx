import ErrorPage from "../../ErrorPage";
import NotFound from "../../NotFound";
import {
  BUSINESS_BACKGROUND_IMAGE_CREATE,
  BUSINESS_BACKGROUND_IMAGE_VIEW,
  BUSINESS_CREATE,
  BUSINESS_DELETE,
  BUSINESS_UPDATE,
  BUSINESS_VIEW,
  ROLE_CREATE,
  ROLE_DELETE,
  ROLE_UPDATE,
  ROLE_VIEW,
  USER_CREATE,
  USER_DELETE,
  USER_UPDATE,
  USER_VIEW,
} from "../../constant/permissions";
import AuthenticationPublicLayout from "../../layout/AuthenticationPublicLayout";
import ManagerLayout from "../../layout/ManagerLayout";

import OrgStructure from "../../pages/Administration/OrgStructure";

import AttandanceSummary from "../../pages/Attendance/AttandanceSummary";
import AttendanceDetails from "../../pages/Attendance/AttendanceDetails";
import AttendanceRequest from "../../pages/Attendance/AttendanceRequest";
import DailyLog from "../../pages/Attendance/DailyLog";
import ImportAttandance from "../../pages/Attendance/ImportAttandance";
import AllBusiness from "../../pages/Business/AllBusiness";
import BusinessView from "../../pages/Business/BusinessView";
import CreateBusiness from "../../pages/Business/CreateBusiness";
import UpdateBusiness from "../../pages/Business/UpdateBusiness";
import Dashboard from "../../pages/Dashboard/Dashboard";
import AllEmployees from "../../pages/Employee/Employee/AllEmployees";
// import CreateEmployee from "../../pages/Employee/Employee/CreateEmployee";
import Designation from "../../pages/Employee/Designation/AllDesignation";
import EmploymentStatus from "../../pages/Employee/EmploymentStatus/AllEmploymentStatus";
import ImportEmployee from "../../pages/Employee/ImportEmployee";
import JobDesk from "../../pages/JobDesk/JobDesk";

import LeaveStatus from "../../pages/Leave/LeaveStatus/AllLeaveStatus";
import LeaveSummary from "../../pages/Leave/LeaveSummary";
import BeneficiaryBadge from "../../pages/Payroll/BeneficiaryBadge";
import PayrollSummary from "../../pages/Payroll/PayrollSummary";
import Payrun from "../../pages/Payroll/Payrun";
import Payslip from "../../pages/Payroll/Payslip";
// import AllRole from "../../pages/Role/AllRole";
// import CreateRole from "../../pages/Role/CreateRole";
// import UpdateRole from "../../pages/Role/UpdateRole";
// import ViewRole from "../../pages/Role/ViewRole";
import { checkPermissions } from "../../utils/checkPermissions";
import { authRoutes } from "../Auth/AuthRoutes";
import AllDepartments from "../../pages/Administration/Departments/AllDepartments";
import UpdateEmployee from "../../pages/Employee/Employee/UpdateEmployee";
import VIewEmployee from "../../pages/Employee/Employee/VIewEmployee";
import AllWorkShifts from "../../pages/Administration/WorkShift/AllWorkShifts";
import AppSettings from "../../pages/Settings/App/AppSettings";
import AttendanceSettings from "../../pages/Settings/Attandance/AttendanceSettings";
import LeaveSettings from "../../pages/Settings/Leave/LeaveSettings";
import PayrollSettings from "../../pages/Settings/Payroll/PayrollSettings";
import AllAnnouncements from "../../pages/Administration/Announcements/AllAnnouncements";
import AllHolidays from "../../pages/Administration/Holiday/AllHolidays";
import AllLeaveStatus from "../../pages/Leave/LeaveStatus/AllLeaveStatus";
import ViewBusiness from "../../pages/Business/ViewBusiness";
import UsersAndRoles from "../../pages/Administration/UsersAndRoles/UsersAndRoles";
import AllRole from "../../pages/Administration/UsersAndRoles/Role/AllRole";
import AllLeaveRequest from "../../pages/Leave/LeaveRequest/AllLeaveRequest";
import AllCalendar from "../../pages/Leave/Calendar/AllCalendar";
import AllSocialMediaLink from "../../pages/Settings/SocialMediaLink/AllSocialMediaLink";
import Assets from "../../pages/Assets/Assets";
import AllAssetsType from "../../pages/Settings/Assets/AllAssetsType";
import ViewProfile from "../../pages/Profile/Profile/ViewProfile";

export const routes = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <ManagerLayout />,
    errorElement: <ErrorPage />,
    children: [
      // DASHBOARD
      {
        path: "/",
        element: <Dashboard />,
      },
      // PROFILE
      {
        path: "/profile",
        element: <ViewProfile />,
      },
      // NOTIFICATION
      {
        path: "/notification",
        element: <Dashboard />,
      },
      // JOB DESK
      {
        path: "/job-desk",
        element: <JobDesk />,
      },
      // BUSINESS
      {
        path: "/business",
        element: <AllBusiness />,
      },
      {
        path: "/business/all-business",
        element: <AllBusiness />,
      },
      {
        path: "/business/create",
        element: <CreateBusiness />,
      },
      {
        path: "/business/:encId",
        element: <ViewBusiness />,
      },
      {
        path: "/business/update/:encId",
        element: <UpdateBusiness />,
      },
      {
        path: "/role/all-role",
        element: <AllRole />,
      },
      // EMPLOYEE
      {
        path: "/employee",
        element: <AllEmployees />,
      },
      {
        path: "/employee/all-employees",
        element: <AllEmployees />,
      },
      {
        path: "/employee/designation",
        element: <Designation />,
      },
      // {
      //   path: "/employee/create",
      //   element: <CreateEmployee />,
      // },
      // {
      //   path: "/employee/update/:encId",
      //   element: <CreateEmployee />,
      // },
      {
        path: "/employee/view/:encId",
        element: <VIewEmployee />,
      },
      {
        path: "/employee/employment-status",
        element: <EmploymentStatus />,
      },
      {
        path: "/employee/import",
        element: <ImportEmployee />,
      },
      // LEAVE
      {
        path: "/leave",
        element: <AllLeaveStatus />,
      },
      {
        path: "/leave/leaves",
        element: <LeaveStatus />,
      },
      {
        path: "/leave/leave-request",
        element: <AllLeaveRequest />,
      },
      {
        path: "/leave/calender",
        element: <AllCalendar />,
      },
      {
        path: "/leave/leave-summary",
        element: <LeaveSummary />,
      },
      // ATTENDANCE
      {
        path: "/attendance",
        element: <DailyLog />,
      },
      {
        path: "/attendance/daily-log",
        element: <DailyLog />,
      },
      {
        path: "/attendance/attendance-request",
        element: <AttendanceRequest />,
      },
      {
        path: "/attendance/attendance-details",
        element: <AttendanceDetails />,
      },
      {
        path: "/attendance/attendance-summary",
        element: <AttandanceSummary />,
      },
      {
        path: "/attendance/import",
        element: <ImportAttandance />,
      },

      // PAYROLL
      {
        path: "/payroll",
        element: <Payrun />,
      },
      {
        path: "/payroll/payrun",
        element: <Payrun />,
      },
      {
        path: "/payroll/payslip",
        element: <Payslip />,
      },
      {
        path: "/payroll/payroll-summary",
        element: <PayrollSummary />,
      },
      {
        path: "/payroll/beneficiary-badge",
        element: <BeneficiaryBadge />,
      },

      // ADMINISTRATION
      {
        path: "/administration",
        element: <UsersAndRoles />,
      },
      {
        path: "/administration/users-and-roles",
        element: <UsersAndRoles />,
      },
      {
        path: "/administration/work-shifts",
        element: <AllWorkShifts />,
      },
      {
        path: "/administration/departments",
        element: <AllDepartments />,
      },
      {
        path: "/administration/holiday",
        element: <AllHolidays />,
      },
      {
        path: "/administration/org-structure",
        element: <OrgStructure />,
      },
      {
        path: "/administration/announcements",
        element: <AllAnnouncements />,
      },

      // ASSETS
      {
        path: "/assets",
        element: <Assets />,
      },

      // SETTINGS
      {
        path: "/settings",
        element: <AppSettings />,
      },
      {
        path: "/settings/app",
        element: <AppSettings />,
      },
      {
        path: "/settings/leave",
        element: <LeaveSettings />,
      },
      {
        path: "/settings/attendance",
        element: <AttendanceSettings />,
      },
      {
        path: "/settings/assets",
        element: <AllAssetsType />,
      },
      {
        path: "/settings/payroll",
        element: <PayrollSettings />,
      },
      {
        path: "/settings/social_media",
        element: <AllSocialMediaLink />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthenticationPublicLayout />,
    children: authRoutes,
  },
];
