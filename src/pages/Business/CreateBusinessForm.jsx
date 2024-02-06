// =====================================
// #00122
// =====================================

import React from "react";
import CustomField from "../../components/InputFields/CustomField";
import CustomTextareaField from "../../components/InputFields/CustomTextareaField";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CheckPermission from "../../CheckPermission";
import { BUSINESS_CREATE } from "../../constant/permissions";

export default function CreateBusinessForm({
  errors,
  onChangeBusinessData,
  businessData,
  setBusinessData,
  type,
  businessEmailExist,
  handleCheckEmail,
}) {
  return (
    <CheckPermission permissionArray={[BUSINESS_CREATE]}>
      <div className="">
        {/* <h3 className="text-xl font-medium mb-5">Business Details</h3> */}
        <form className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5">
            {/* BUSINESS NAME  */}
            <CustomField
              disable={type === "view"}
              id={"name"}
              label={"Business Name"}
              required={true}
              type={"text"}
              name={"name"}
              onChange={onChangeBusinessData}
              value={businessData?.name}
              placeholder={"Business Name"}
              error={errors?.name}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* Business Email  */}
            <CustomField
              disable={type === "view"}
              id={"email"}
              label={"Business Email"}
              type={"text"}
              name={"email"}
              onBlur={handleCheckEmail}
              onChange={onChangeBusinessData}
              value={businessData?.email}
              placeholder={"Business Email"}
              error={errors?.email || businessEmailExist}
              required={true}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5 ">
            {/* PHONE  */}
            <CustomNumberField
              disable={type === "view"}
              id={"phone"}
              label={"Business Phone"}
              min={0}
              name={"phone"}
              onChange={onChangeBusinessData}
              value={businessData?.phone}
              placeholder={"Business Phone"}
              error={errors?.phone}
              required={false}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* ADDRESS LINE 1 */}
            <div className="w-full md:w-1/2">
              {/* LABEL */}
              <label htmlFor="address_line_1" className="label">
                <span className="label-text text-md font-bold">
                  Business Address{" "}
                  <span className="text-error font-bold text-md">*</span>
                </span>
              </label>

              {/* FIELD  */}
              <CustomAutoComplete
                disable={type === "view"}
                className={`input input-bordered rounded-md w-full`}
                placeholder="Business Address"
                type="text"
                name="address_line_1"
                onChange={onChangeBusinessData}
                formData={businessData}
                setFormData={setBusinessData}
                defaultValue={businessData?.address_line_1}
              />

              {/* VALIDATION MESSAGE  */}
              {errors?.address_line_1 && (
                <label className="label h-7">
                  <span className="label-text-alt text-error">
                    {errors?.address_line_1}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5 ">
            {/* CITY */}
            <CustomField
              disable={type === "view"}
              id={"city"}
              label={"City"}
              required={true}
              type={"text"}
              name={"city"}
              onChange={onChangeBusinessData}
              value={businessData?.city}
              placeholder={"City"}
              error={errors?.city}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* COUNTRY */}
            <CustomField
              disable={type === "view"}
              id={"country"}
              label={"Country"}
              required={true}
              type={"text"}
              name={"country"}
              onChange={onChangeBusinessData}
              value={businessData?.country}
              placeholder={"Country"}
              error={errors?.country}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-5 ">
            {/* POST CODE  */}
            <CustomField
              disable={type === "view"}
              id={"postcode"}
              label={"Postcode"}
              required={true}
              type={"text"}
              name={"postcode"}
              onChange={onChangeBusinessData}
              value={businessData?.postcode}
              placeholder={"Postcode"}
              error={errors?.postcode}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* WEB PAGE  */}
            <CustomField
              disable={type === "view"}
              id={"web_page"}
              label={"Business Webpage"}
              type={"text"}
              name={"web_page"}
              onChange={onChangeBusinessData}
              value={businessData?.web_page}
              placeholder={"Business Webpage"}
              error={errors?.web_page}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
          </div>
        </form>
      </div>
    </CheckPermission>
  );
}
