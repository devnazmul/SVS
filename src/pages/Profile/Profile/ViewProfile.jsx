import React, { useEffect, useState } from "react";
import Headings from "../../../components/Headings/Headings";
import { getSingleUsers } from "../../../apis/userAndBusiness/user";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import CustomLoading from "../../../components/CustomLoading";
import { useAuth } from "../../../context/AuthContext";
import CustomPopup from "../../../components/CustomPopup";
import AssignLeave from "../../Leave/CreateLeave";
import PersonalDetails from "./ProfileView/PersonalDetails/PersonalDetails";
import ProfileMenu from "./ProfileView/ProfileMenu";
import ProfileViewHeader from "./ViewProfileComponents/ProfileViewHeader";
import ActivityLog from "./ProfileView/ActivityLog/ActivityLog";
import ChangeProfilePassword from "./ProfileView/ChangeProfilePassword/ChangeProfilePassword";
import BusinessDetails from "./ProfileView/BusinessDetails/BusinessDetails";
import BusinessTiming from "./ProfileView/BusinessTiming/BusinessTiming";
import { getUserByToken } from "../../../apis/auth/auth";

export default function ViewProfile() {
  const { user } = useAuth();
  const id = user?.id;

  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState();
  const [formDataForBusiness, setFormDataForBusiness] = useState();

  const [menu, setMenu] = useState("");
  const [isGettingData, setIsGettingData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  // GETTING ALL DATA
  useEffect(() => {
    setIsGettingData(true);
    setIsLoading(true);
    getUserByToken()
      .then((res) => {
        setUserInfo(res);
        console.log({ res });

        setFormData({
          id: id,
          first_Name: res?.first_Name,
          middle_Name: res?.middle_Name ? res?.middle_Name : "",
          last_Name: res?.last_Name,
          email: res?.email,
          user_id: res?.user_id,
          gender: res?.gender,
          phone: res?.phone,
          address_line_1: res?.address_line_1,
          country: res?.country,
          city: res?.city,
          lat: res?.lat,
          long: res?.long,
          role: res?.roles[0]?.name,
          // departments:
          //   res?.departments.length > 0
          //     ? res?.departments.map((d) => d?.id)
          //     : [],
        });
        setIsGettingData(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsGettingData(false);
        setIsLoading(false);
        console.log({ error });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, []);

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
      title: "Add attandance",
      handler: () => {
        setPopupOption({
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
          id: null,
          closeOnDocumentClick: false,
        });
      },
    },
    {
      title: "Terminate",
      handler: () => {},
    },
    {
      title: "Edit salary",
      handler: () => {},
    },
    {
      title: "Edit joining date",
      handler: () => {},
    },
  ];
  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div>
        {/* POPUPS  */}
        <CustomPopup
          popupClasses={`w-[70vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
              {popupOption?.type === "assignLeave" && (
                <AssignLeave
                  employeeId={popupOption?.id}
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

        <div className="flex items-center justify-between">
          <Headings className={`mb-5`} level={1}>
            My profile
          </Headings>
          {/* <ActinDropdownButton options={options} /> */}
        </div>

        <div className="gap-5 flex flex-col lg:flex-row pb-5">
          <div className="w-full lg:w-[350px]">
            <ProfileViewHeader
              formData={formData}
              setFormData={setFormData}
              userInfo={userInfo}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          <div className="w-full">
            <ProfileMenu onClick={(e) => setMenu(e)} />
            <div className={``}>
              {menu === "Personal Details" && (
                <PersonalDetails
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  userInfo={userInfo}
                  userId={id}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {menu === "Business Details" && (
                <BusinessDetails
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  userInfo={userInfo}
                  userId={id}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {menu === "Business Timing" && (
                <BusinessTiming
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  userInfo={userInfo}
                  userId={id}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {/* {menu === "Activity Log" && <ActivityLog  userId={id} />} */}
              {menu === "Change Password" && <ChangeProfilePassword />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
