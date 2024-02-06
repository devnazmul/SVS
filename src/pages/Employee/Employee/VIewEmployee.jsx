import React, { useEffect, useState } from "react";
import Headings from "../../../components/Headings/Headings";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getSingleUsers } from "../../../apis/userAndBusiness/user";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import CustomLoading from "../../../components/CustomLoading";
import ActinDropdownButton from "../../../components/Buttons/ActinDropdownButton";
import CustomPopup from "../../../components/CustomPopup";
import AssignLeave from "../../Leave/CreateLeave";
import EmployeeViewHeader from "./ViewEmployeeComponents/EmployeeViewHeader";
import EmployeeMenu from "./EmployeeView/EmployeeMenu";
import PersonalDetails from "./EmployeeView/PersonalDetails/PersonalDetails";
import LeaveAllowance from "./EmployeeView/LeaveAllowance/LeaveAllowance";
import UserMenu from "../../Administration/UsersAndRoles/UserMenu";
import ActivityLog from "./EmployeeView/ActivityLog/ActivityLog";
import Leave from "./EmployeeView/Leave/Leave";
import Documents from "./EmployeeView/Documents/Documents";
import Assets from "./EmployeeView/Assets/Assets";
import SalaryOverview from "./EmployeeView/SalaryOverview/SalaryOverview";
import SocialLinks from "./EmployeeView/SocialLinks/SocialLinks";
import Contact from "./EmployeeView/Contact/Contact";
import AddressDetails from "./EmployeeView/AddressDetails/AddressDetails";
import Payslip from "./EmployeeView/Payslip/Payslip";
import PayroleAndBudget from "./EmployeeView/PayroleAndBudget/PayroleAndBudget";
import JobHistory from "./EmployeeView/JobHistrory/JobHistrory";
import { decryptID, encryptID } from "../../../utils/encryptAndDecryptID";
import NoDataFound from "../../../components/NoDataFound";
import AttendanceSummaryForEmployeeView from "../../Attendance/AttandanceSummaryForEmployeeView";
import CreateAttendence from "../../Attendance/DailLogComponents/CreateAttendence";
import ImmigrationDetails from "./EmployeeView/ImmigrationDetails/ImmigrationDetails";
import CheckPermission from "../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../constant/permissions";
import EducationHistory from "./EmployeeView/EducationHistory/EducationHistory";
import Notes from "./EmployeeView/Notes/Notes";
import { employeeTabs } from "../../../utils/employeeTabs";

export default function VIewEmployee() {
  const { encId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = decryptID(encId);

  const [tab, setTab] = useState(searchParams.get("tab"));

  useEffect(() => {
    if (!employeeTabs.includes(searchParams.get("tab"))) {
      navigate(`/employee/view/${encryptID(id)}?tab=personal_details`);
    } else {
      setTab(searchParams.get("tab"));
    }
  }, [location.pathname]);

  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState();
  const [menu, setMenu] = useState("");
  const [isGettingData, setIsGettingData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);
  // GETTING ALL DATA
  useEffect(() => {
    setIsGettingData(true);
    setIsLoading(true);
    getSingleUsers(id)
      .then((res) => {
        setUserInfo(res);
        console.log({ res });
        setNotFound(false);
        setFormData({
          id: id,
          first_Name: res?.first_Name,
          middle_Name: res?.middle_Name,
          last_Name: res?.last_Name,
          email: res?.email,
          user_id: res?.user_id,
          gender: res?.gender,
          phone: res?.phone,
          address_line_1: res?.address_line_1,
          country: res?.country,
          password: res?.password,
          city: res?.city,
          lat: res?.lat,
          long: res?.long,
          role: res?.roles[0]?.name,
          departments:
            res?.departments.length > 0
              ? res?.departments.map((d) => d?.id)
              : [],
        });
        setIsGettingData(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsGettingData(false);
        setIsLoading(false);
        if (error?.response?.status === 404) {
          // IF NOT FOUND
          setNotFound(true);
        }
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [id]);

  const [isUpdated, setIsUpdated] = useState(Math.random());

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
  // ALL ACTION BUTTONS
  const options = [
    {
      title: "Add attendance",
      handler: () => {
        setPopupOption({
          userId: id,
          open: true,
          type: "addAttandance",
          onClose: () => {
            setPopupOption({ ...popupOption, open: false });
          },
          id: null,
          closeOnDocumentClick: false,
        });
      },
    },
    {
      title: "Create leave",
      handler: () => {
        setPopupOption({
          open: true,
          type: "assignLeave",
          title: "Create Leave",
          onClose: () => {
            setPopupOption({ ...popupOption, open: false });
          },
          id: userInfo?.id,
          closeOnDocumentClick: false,
        });
      },
    },
    // {
    //   title: "Terminate",
    //   handler: () => {},
    // },
    // {
    //   title: "Edit salary",
    //   handler: () => {},
    // },
    // {
    //   title: "Edit joining date",
    //   handler: () => {},
    // },
  ];
  if (isGettingData) {
    return <CustomLoading />;
  } else {
    if (!notFound) {
      return (
        <CheckPermission permissionArray={[USER_VIEW]}>
          <div className="w-full ">
            {/* POPUPS  */}
            <CustomPopup
              popupClasses={
                popupOption?.type === "addAttandance"
                  ? "lg:w-[80vw]"
                  : "w-[70vw]"
              }
              popupOption={popupOption}
              setPopupOption={setPopupOption}
              Component={
                <>
                  {popupOption?.type === "assignLeave" && (
                    <AssignLeave
                      selfId={popupOption?.id}
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
                  {popupOption?.type === "addAttandance" && (
                    <CreateAttendence
                      popupOption={popupOption}
                      handleClosePopup={() => {
                        setPopupOption({
                          open: false,
                          type: "",
                          id: null,
                          selfId: null,
                          onClose: () => {
                            setPopupOption({ ...popupOption, open: false });
                          },
                          overlayStyle: { background: "red" },
                          closeOnDocumentClick: false,
                        });
                      }}
                      getAllAttendence={() => {}}
                    />
                  )}
                </>
              }
            />

            {/* HEADING  */}
            <div className="flex items-center justify-between">
              <Headings className={`mb-5`} level={1}>
                {userInfo?.user_id ? "Employee profile" : "User profile"}
              </Headings>
              {userInfo?.user_id ? (
                <ActinDropdownButton options={options} />
              ) : (
                ""
              )}
            </div>

            {/* EMPLOYEE VIEW SIDE BAR  */}
            <div className="gap-5 flex flex-col lg:flex-row pb-5 ">
              <div className="w-full lg:w-[350px]">
                <EmployeeViewHeader
                  formData={formData}
                  setFormData={setFormData}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>

              <div className="max-h-[60vh] w-full  pb-5">
                {/* EMPLOYEE OR USERS MENU  */}
                {userInfo?.user_id ? (
                  <EmployeeMenu id={id} tab={tab} />
                ) : (
                  <UserMenu onClick={(e) => setMenu(e)} id={id} tab={tab} />
                )}

                {/* MAIN SECTION  */}
                <div className="w-full md:max-h-[78vh] msd:overflow-y-auto scrollbar md:pr-5">
                  {/* PERSONAL DETAILS  */}
                  {tab === "personal_details" && (
                    <PersonalDetails
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                      userId={id}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}

                  {/* ACTIVITY LOG  */}
                  {tab === "activity_log" && (
                    <ActivityLog
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* LEAVE ALLOWANCE  */}
                  {tab === "leave_allowance" && (
                    <LeaveAllowance
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* ATTENDANCE  */}
                  {tab === "attendance" && (
                    <AttendanceSummaryForEmployeeView
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* LEAVE  */}
                  {tab === "leave" && (
                    <Leave
                      setIsUpdated={setIsUpdated}
                      isUpdated={isUpdated}
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                      handleAssignLeave={() => {
                        setPopupOption({
                          open: true,
                          type: "assignLeave",
                          title: "Create Leave",
                          onClose: () => {
                            setPopupOption({ ...popupOption, open: false });
                          },
                          id: userInfo?.id,
                          closeOnDocumentClick: false,
                        });
                      }}
                    />
                  )}

                  {/* DOCUMENTS  */}
                  {tab === "documents" && (
                    <Documents userInfo={userInfo} setUserInfo={setUserInfo} />
                  )}

                  {/* ASSETS  */}
                  {tab === "assets" && (
                    <Assets userInfo={userInfo} setUserInfo={setUserInfo} />
                  )}

                  {/* JOB HISTORY  */}
                  {tab === "job_history" && (
                    <JobHistory userInfo={userInfo} setUserInfo={setUserInfo} />
                  )}

                  {/* EDUCATION HISTORY  */}
                  {tab === "education_history" && (
                    <EducationHistory
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* IMMIGRATION DETAILS  */}
                  {tab === "immigration_details" && (
                    <ImmigrationDetails
                      id={id}
                      tab={tab}
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* SALARY  */}
                  {tab === "salary_overview" && (
                    <SalaryOverview
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* PAY RUN AND BUDGET  */}
                  {tab === "payrun_budget" && (
                    <PayroleAndBudget
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* PAY SLIP  */}
                  {tab === "pay_slip" && (
                    <Payslip userInfo={userInfo} setUserInfo={setUserInfo} />
                  )}

                  {/* ADDRESS DETAILS  */}
                  {tab === "address_details" && (
                    <AddressDetails
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}

                  {/* CONTACT  */}
                  {tab === "contact" && (
                    <Contact userInfo={userInfo} setUserInfo={setUserInfo} />
                  )}

                  {/* NOTES  */}
                  {tab === "notes" && (
                    <Notes userInfo={userInfo} setUserInfo={setUserInfo} />
                  )}

                  {/* SOCIAL LINKS  */}
                  {tab === "social_links" && (
                    <SocialLinks
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CheckPermission>
      );
    } else {
      return <NoDataFound text={"No Employee Found!"} />;
    }
  }
}
