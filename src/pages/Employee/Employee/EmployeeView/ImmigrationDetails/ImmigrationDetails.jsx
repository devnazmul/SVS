// =====================================
// #00119
// =====================================

import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import Headings from "../../../../../components/Headings/Headings";

import { getAllPassportHistoriesWithoutPerPageByEmployee } from "../../../../../apis/employee/History/passportHistory";
import ImmigrationDetailsMenu from "./components/ImmigrationDetailsMenu";
// import CosHistory from "./components/CosHistory";
import VisaHistory from "./components/VisaHistory";
import PassportHistory from "./components/PassportHistory";
import { getAllVisaHistoriesWithoutPerPageByEmployee } from "../../../../../apis/employee/History/visaHistory";
import { getAllSponsorshipHistoriesWithoutPerPageByEmployee } from "../../../../../apis/employee/History/sponsorshipHistory";
import CustomLoading from "../../../../../components/CustomLoading";
import CheckPermission from "../../../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../../../constant/permissions";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { encryptID } from "../../../../../utils/encryptAndDecryptID";
import CosHistory from "./components/CosHistory";

export default function ImmigrationDetails({ userInfo, tab, id }) {
  const [menu, setMenu] = useState("cos");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [subTab, setSubTab] = useState(searchParams.get("sub_tab"));

  useEffect(() => {
    setSubTab(searchParams.get("sub_tab"));
  }, [location.pathname]);

  // GET ALL DATA
  const [isUpdate, setIsUpdate] = useState(Math.random());
  const [isPendingPassportHistory, setIsPendingPassportHistory] =
    useState(true);
  const [isPendingVisaHistory, setIsPendingVisaHistory] = useState(true);
  const [isPendingSponsorshipHistory, setIsPendingSponsorshipHistory] =
    useState(true);

  const [passportData, setPassportData] = useState([]);
  const [visaData, setVisaData] = useState([]);
  const [sponsorshipData, setSponsorshipData] = useState([]);

  const getAllData = () => {
    setIsPendingPassportHistory(true);
    setIsPendingVisaHistory(true);
    setIsPendingSponsorshipHistory(true);

    getAllPassportHistoriesWithoutPerPageByEmployee(userInfo?.id)
      .then((passportHistory) => {
        setPassportData(passportHistory);
        setIsPendingPassportHistory(false);
      })
      .catch((error) => {
        setIsPendingPassportHistory(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });

    getAllVisaHistoriesWithoutPerPageByEmployee(userInfo?.id)
      .then((visaHistory) => {
        setVisaData(visaHistory);
        setIsPendingVisaHistory(false);
      })
      .catch((error) => {
        setIsPendingVisaHistory(false);

        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });

    getAllSponsorshipHistoriesWithoutPerPageByEmployee(userInfo?.id)
      .then((sponsorshipHistory) => {
        setSponsorshipData(sponsorshipHistory);
        setIsPendingSponsorshipHistory(false);
      })
      .catch((error) => {
        setIsPendingSponsorshipHistory(false);
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

  // REFETCH AFTER FILTER AND DATA CHANGE
  useEffect(() => {
    getAllData();
  }, [isUpdate]);

  return (
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div className="h-[85vh]">
        <div className="relative h-full">
          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-5">
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <Headings level={1}>Immigration Details</Headings>
            </div>
          </div>
          {/* ================================================  */}

          {/* =========== DATA AREA ============  */}
          <div className="pt-5">
            <div className="flex justify-center">
              <ImmigrationDetailsMenu id={id} tab={tab} subTab={subTab} />
            </div>

            {isPendingPassportHistory ||
            isPendingVisaHistory ||
            isPendingSponsorshipHistory ? (
              <CustomLoading />
            ) : (
              <div>
                {subTab === "cos" && (
                  <CosHistory
                    userId={userInfo?.id}
                    data={sponsorshipData}
                    setIsUpdate={setIsUpdate}
                  />
                )}
                {subTab === "visa" && (
                  <VisaHistory
                    userId={userInfo?.id}
                    data={visaData}
                    setIsUpdate={setIsUpdate}
                  />
                )}
                {subTab === "passport" && (
                  <PassportHistory
                    userId={userInfo?.id}
                    data={passportData}
                    setIsUpdate={setIsUpdate}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CheckPermission>
  );
}
