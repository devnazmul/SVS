import React, { useEffect, useState } from "react";
import ShortInfoOfProfile from "../../../../components/ShortInfoOfProfile";
import { HiOutlineClipboard } from "react-icons/hi";
import Headings from "../../../../components/Headings/Headings";
import { useAuth, useNav } from "../../../../context/AuthContext";
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
import { MdPhoneEnabled } from "react-icons/md";
import { formatRole } from "../../../../utils/formatRole";
import toast from "react-hot-toast";
import CustomToaster from "../../../../components/CustomToaster";
import { Navigate, useNavigate } from "react-router-dom";

export default function EmployeeViewHeader({
  userInfo,
  setUserInfo,
  data,
  formData,
  setFormData,
  isLoading,
  setIsLoading,
}) {
  const navigate = useNavigate();
  return (
    <div className="h-full border-2 border-primary-content bg-base-300 flex-col p-5 shadow-md rounded-xl items-center flex justify-start  gap-5 md:gap-10 w-full">
      <div className="flex flex-col items-center  justify-center gap-5 w-full ">
        <div className="flex flex-col items-center gap-2">
          {/* PROFILE PIC  */}
          <div className="avatar">
            <div className="w-44 group relative rounded-full shadow-md">
              {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <span className="loading-spinner loading text-primary"></span>
                </div>
              ) : (
                <>
                  {userInfo?.image ? (
                    <img
                      src={
                        userInfo?.image
                          ? `${getFullImageLink(userInfo?.image)}`
                          : `${getFullImageLink(userInfo?.image)}`
                      }
                      alt={`${userInfo?.first_Name} ${
                        userInfo?.middle_Name ? userInfo?.middle_Name : ""
                      } ${userInfo?.last_Name}`}
                    />
                  ) : (
                    <div className="bg-base-100 text-primary font-semibold text-2xl h-full w-full flex justify-center items-center">{`${userInfo?.first_Name.slice(
                      0,
                      1
                    )}${
                      userInfo?.middle_Name
                        ? userInfo?.middle_Name.slice(0, 1)
                        : ""
                    }${userInfo?.last_Name.slice(0, 1)}`}</div>
                  )}
                </>
              )}

              {/* IMAGE UPLOAD BUTTON  */}
              {!isLoading && (
                <label
                  htmlFor="upload_image"
                  className="cursor-pointer group-hover:bottom-0 duration-200 absolute -bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 text-base-300 rounded-full bg-primary"
                >
                  Uploaded
                </label>
              )}
              <input
                onChange={(e) => {
                  setIsLoading(true);
                  uploadUserProfile(e.target.files[0])
                    .then((res) => {
                      updateSingleUser({
                        ...formData,
                        image: res?.full_location,
                      })
                        .then((res) => {
                          setFormData((prev) => ({
                            ...prev,
                            image: res?.image,
                          }));
                          setUserInfo((prev) => ({
                            ...prev,
                            image: res?.image,
                          }));
                          setIsLoading(false);
                        })
                        .catch((error) => {
                          console.log({ error });
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
                      console.log({ res });
                    })
                    .catch((error) => {
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
                }}
                className="hidden"
                id="upload_image"
                type="file"
              />
            </div>
          </div>
        </div>

        {/* BASIC INFO  */}
        <div className="flex flex-col items-center gap-2">
          <Headings className={`text-center text-primary`} level={2}>
            {formData?.first_Name}{" "}
            {formData?.middle_Name ? formData?.middle_Name : ""}{" "}
            {formData?.last_Name}
          </Headings>

          {userInfo?.employment_status && (
            <div>
              <h2
                style={{
                  background: `${
                    userInfo?.employment_status
                      ? userInfo?.employment_status?.color
                      : ""
                  }`,
                  boxShadow: ` 1px 1px 5px ${
                    userInfo?.employment_status
                      ? userInfo?.employment_status?.color
                      : ""
                  }`,
                }}
                className="py-1 text-center px-5 rounded-full text-sm text-base-300"
              >
                {userInfo?.employment_status
                  ? userInfo?.employment_status?.name
                  : ""}
              </h2>
            </div>
          )}

          {userInfo.designation ? (
            <div>
              <h2 className="">{formatRole(userInfo.designation.name)}</h2>
            </div>
          ) : (
            ""
          )}
          {userInfo?.user_id ? (
            <div>
              <h2 className="">{userInfo?.user_id}</h2>
            </div>
          ) : (
            ""
          )}
          {userInfo.departments.length > 0 ? (
            <div>
              <h2 className="">{formatRole(userInfo.departments[0]?.name)}</h2>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* IMPORTANT INFO  */}
      <div className="flex gap-8 flex-col w-full">
        {userInfo?.user_id && (
          <div className="flex gap-8 flex-col sm:flex-row lg:flex-col justify-center w-full">
            <ShortInfoOfProfile
              Icon={HiOutlineClipboard}
              title={
                userInfo.departments.length > 0
                  ? userInfo.departments[0]?.name
                  : "Not added yet"
              }
              subTitle={"Department"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
            />
            <ShortInfoOfProfile
              Icon={LuWallet}
              title={`${"£"} ${
                userInfo.salary_per_annum
                  ? userInfo.salary_per_annum
                  : "Not added yet"
              }`}
              titleClass={`text-green-500`}
              subTitle={"Salary"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
            />
          </div>
        )}
        {userInfo?.user_id && (
          <div className="flex gap-8 flex-col sm:flex-row lg:flex-col justify-center w-full">
            <ShortInfoOfProfile
              Icon={FaRegClock}
              title={
                userInfo.work_shift
                  ? userInfo.work_shift?.name
                  : "Not added yet"
              }
              subTitle={"Work Shift"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
              badge={<button onClick={() => navigate(``)}>View</button>}
            />
            <ShortInfoOfProfile
              Icon={TbCalendarCheck}
              title={
                userInfo.joining_date ? userInfo.joining_date : "Not added yet"
              }
              subTitle={"Joining date"}
              iconClass={`text-primary`}
              IconBgClass={`bg-primary-content`}
            />
          </div>
        )}
        <div className="flex gap-8 flex-col sm:flex-row lg:flex-col justify-center w-full">
          <ShortInfoOfProfile
            Icon={userInfo.gender === "male" ? CgGenderMale : CgGenderFemale}
            title={
              userInfo.gender
                ? userInfo.gender.slice(0, 1).toUpperCase() +
                  userInfo.gender.slice(1)
                : "Not added yet"
            }
            subTitle={"Gender"}
            iconClass={`text-primary`}
            IconBgClass={`bg-primary-content`}
          />
          <ShortInfoOfProfile
            Icon={MdPhoneEnabled}
            title={userInfo.phone ? userInfo.phone + "" : "Not added yet"}
            subTitle={"Phone"}
            iconClass={`text-primary`}
            IconBgClass={`bg-primary-content`}
          />
        </div>
      </div>
    </div>
  );
}
