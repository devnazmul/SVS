// =====================================
// #00123
// =====================================

import React from "react";
import CustomPassWordInput from "../../components/InputFields/CustomPasswordField";
import CustomField from "../../components/InputFields/CustomField";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import CustomPasswordField from "../../components/InputFields/CustomPasswordField";
import { checkIsEmailExistOrNot } from "../../apis/auth/auth";
import CheckPermission from "../../CheckPermission";
import { USER_CREATE } from "../../constant/permissions";

export default function CreateUserForm({
  handleCheckEmail,
  onChangeUserData,
  userData,
  setUserData,
  errors,
  type,
  userEmailExist,
}) {
  return (
    <CheckPermission permissionArray={[USER_CREATE]}>
      <>
        {/* <h3 className="text-xl font-medium mb-5">Owner Details</h3> */}
        <form className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5">
            {/* FIRST NAME  */}
            <CustomField
              disable={type === "view"}
              id={"first_name"}
              label={"First Name"}
              required={true}
              type={"text"}
              name={"first_Name"}
              onChange={onChangeUserData}
              value={userData?.first_Name}
              placeholder={"First Name"}
              error={errors?.first_Name}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* LAST NAME  */}
            <CustomField
              disable={type === "view"}
              id={"last_Name"}
              label={"Last Name"}
              required={true}
              type={"text"}
              name={"last_Name"}
              onChange={onChangeUserData}
              value={userData?.last_Name}
              placeholder={"Last Name"}
              error={errors?.last_Name}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5">
            {/* PHONE  */}
            <CustomNumberField
              disable={type === "view"}
              id={"phone"}
              label={"Phone Number"}
              required={false}
              min={0}
              name={"phone"}
              onChange={onChangeUserData}
              value={userData?.phone}
              placeholder={"Phone Number"}
              error={errors?.phone}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* EMAIL */}
            <CustomField
              onBlur={handleCheckEmail}
              disable={type === "view"}
              id={"email"}
              label={"Email"}
              required={true}
              type={"email"}
              name={"email"}
              onChange={onChangeUserData}
              value={userData?.email}
              placeholder={"Email"}
              error={errors?.email || userEmailExist}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
          </div>

          {/* GANDER  */}
          {/* <div className="">
          <div className="label">
            <span className="label-text text-md font-bold">
              Gender
              <span className="text-error font-bold text-md">*</span>
            </span>
          </div>
          <div className="flex items-center justify-start w-full gap-10">

            <div className="form-control flex justify-start items-center">
              <label className="label cursor-pointer flex items-center gap-5">
                <input
                  type="radio"
                  name={`gender`}
                  onChange={onChangeUserData}
                  value={"male"}
                  className="radio checked:bg-primary"
                  defaultChecked={userData?.gender === "male"}
                />
                <span className="label-text">Male</span>
              </label>
            </div>

            <div className="form-control flex justify-start items-center">
              <label className="label cursor-pointer flex items-center gap-5">
                <input
                  type="radio"
                  name={`gender`}
                  value={"female"}
                  onChange={onChangeUserData}
                  className="radio checked:bg-primary"
                  defaultChecked={userData?.gender === "female"}
                />
                <span className="label-text">Female</span>
              </label>
            </div>

            <div className="form-control flex justify-start items-center">
              <label className="label cursor-pointer flex items-center gap-5">
                <input
                  type="radio"
                  name={`gender`}
                  value={"female"}
                  onChange={onChangeUserData}
                  className="radio checked:bg-primary"
                  defaultChecked={userData?.gender === "other"}
                />
                <span className="label-text">Other</span>
              </label>
            </div>
          </div>
        </div> */}

          {type !== "update" && (
            <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5">
              {/* PASSWORD */}
              <CustomPasswordField
                disable={type === "view"}
                required={true}
                label={"Password"}
                id="password"
                onChange={onChangeUserData}
                value={userData?.password}
                placeholder={`Password`}
                name={`password`}
                error={errors?.password}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />

              {/* PASSWORD CONFIRMATION */}
              {/* <CustomPasswordField
              disable={type === "view"}
              required={true}
              id="password_confirmation"
              onChange={onChangeUserData}
              value={userData?.password_confirmation}
              placeholder={`Confirm Password`}
              label={"Confirm Password"}
              name={`password_confirmation`}
              error={errors?.password_confirmation}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            /> */}
            </div>
          )}
        </form>
      </>
    </CheckPermission>
  );
}
