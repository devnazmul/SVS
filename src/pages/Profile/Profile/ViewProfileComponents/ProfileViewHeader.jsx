import React, { useEffect, useState } from "react";
import ShortInfoOfProfile from "../../../../components/ShortInfoOfProfile";
import { HiOutlineClipboard } from "react-icons/hi";
import Headings from "../../../../components/Headings/Headings";
import { useAuth } from "../../../../context/AuthContext";
import moment from "moment";
import { FaPhoneAlt, FaRegClock } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";
import { TbCalendarCheck } from "react-icons/tb";
import {
  updateSingleUser,
  uploadUserProfile,
} from "../../../../apis/userAndBusiness/user";
import { getFullImageLink } from "../../../../utils/getFullImageLink";
import { CgGenderFemale } from "react-icons/cg";
import { CgGenderMale } from "react-icons/cg";
import { MdEmail, MdMail, MdPhoneEnabled } from "react-icons/md";
import { updateProfile } from "../../../../apis/auth/auth";
import { formatRole } from "../../../../utils/formatRole";

export default function ProfileViewHeader({
  userInfo,
  data,
  formData,
  setFormData,
  isLoading,
  setIsLoading,
}) {
  return (
    <div className="h-full border-2 border-primary-content flex-col p-5 shadow-md rounded-xl bg-base-300 items-center flex justify-start  gap-5 md:gap-10 w-full">
      <div className="flex flex-col items-center  justify-center gap-5 w-full ">
        {/* BASIC INFO  */}
        <div className="flex flex-col items-center gap-2">
          <Headings className={`text-center text-primary`} level={2}>
            {formData?.first_Name}{" "}
            {formData?.middle_Name ? formData?.middle_Name : ""}
            {formData?.last_Name}
          </Headings>
        </div>
      </div>

      {/* IMPORTANT INFO  */}
      <div className="flex gap-8 flex-col w-full">
        <div className="flex gap-8 flex-col justify-center w-full">
          {userInfo.email && (
            <ShortInfoOfProfile
              Icon={MdEmail}
              title={userInfo.email}
              subTitle={"Email"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
            />
          )}

          {userInfo.phone && (
            <ShortInfoOfProfile
              Icon={MdPhoneEnabled}
              title={userInfo.phone}
              subTitle={"Phone"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
            />
          )}

          {userInfo.gender && (
            <ShortInfoOfProfile
              Icon={userInfo.gender === "male" ? CgGenderMale : CgGenderFemale}
              title={
                userInfo.gender.slice(0, 1).toUpperCase() +
                userInfo.gender.slice(1)
              }
              subTitle={"Gender"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
