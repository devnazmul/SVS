import React, { useEffect, useState } from "react";
import Headings from "../../../../../components/Headings/Headings";
import CustomField from "../../../../../components/InputFields/CustomField";
import CustomAutoComplete from "../../../../../components/CustomAutoComplete";
import CustomNumberField from "../../../../../components/InputFields/CustomNumberField";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import CustomLoading from "../../../../../components/CustomLoading";
import {
  updateEmployee,
  updateEmployeeContact,
} from "../../../../../apis/employee/employee";
import ButtonLoading from "../../../../../components/ButtonLoading";
import ButtonSpinner from "../../../../../components/Loaders/ButtonSpinner";
import CheckPermission from "../../../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../../../constant/permissions";

export default function Contact({ userInfo, setUserInfo }) {
  const [emergencyContactOne, setEmergencyContactOne] = useState({});
  const [emergencyContactTwo, setEmergencyContactTwo] = useState({});
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  // SET ALL DATA
  const [isDataLoad, setIsDataLoad] = useState(true);
  useEffect(() => {
    setIsDataLoad(true);
    // EMERGENCY CONTACT 1
    setEmergencyContactOne({
      full_name: userInfo?.emergency_contact_details[0]?.full_name,
      emergency_contact_name:
        userInfo?.emergency_contact_details[0]?.emergency_contact_name,
      relationship_of_above_to_you:
        userInfo?.emergency_contact_details[0]?.relationship_of_above_to_you,
      address_line_1: userInfo?.emergency_contact_details[0]?.address_line_1,
      city: userInfo?.emergency_contact_details[0]?.city,
      country: userInfo?.emergency_contact_details[0]?.country,
      postcode: userInfo?.emergency_contact_details[0]?.postcode,
      daytime_tel_number:
        userInfo?.emergency_contact_details[0]?.daytime_tel_number,
      eveningtime_tel_number:
        userInfo?.emergency_contact_details[0]?.eveningtime_tel_number,
      mobile_tel_number:
        userInfo?.emergency_contact_details[0]?.mobile_tel_number,
    });

    // EMERGENCY CONTACT 2
    if (userInfo.emergency_contact_details?.length > 1) {
      setEmergencyContactTwo({
        full_name: userInfo?.emergency_contact_details[1]?.full_name,
        emergency_contact_name:
          userInfo?.emergency_contact_details[1]?.emergency_contact_name,
        relationship_of_above_to_you:
          userInfo?.emergency_contact_details[1]?.relationship_of_above_to_you,
        address_line_1: userInfo?.emergency_contact_details[1]?.address_line_1,
        postcode: userInfo?.emergency_contact_details[1]?.postcode,
        city: userInfo?.emergency_contact_details[1]?.city,
        country: userInfo?.emergency_contact_details[1]?.country,
        daytime_tel_number:
          userInfo?.emergency_contact_details[1]?.daytime_tel_number,
        eveningtime_tel_number:
          userInfo?.emergency_contact_details[1]?.eveningtime_tel_number,
        mobile_tel_number:
          userInfo?.emergency_contact_details[1]?.mobile_tel_number,
      });
    }
    setIsDataLoad(false);
  }, [userInfo]);
  // CHANGE DATA
  const handleEmergencyContactFormOneChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContactOne({
      ...emergencyContactOne,
      [name]: value,
    });
  };

  const handleEmergencyContactFormTwoChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContactTwo({
      ...emergencyContactTwo,
      [name]: value,
    });
  };
  // VALIDATION
  const [emergencyContactOneErrors, setEmergencyContactOneErrors] = useState(
    {}
  );
  const [emergencyContactTwoErrors, setEmergencyContactTwoErrors] = useState(
    {}
  );

  const validateForm = () => {
    const newEM1Errors = {};
    const newEM2Errors = {};
    // ------------------------------
    // EM-1
    // ------------------------------
    if (emergencyContactOne.mobile_tel_number) {
      if (
        emergencyContactOne?.mobile_tel_number.toString().split("").length !==
        11
      ) {
        newEM1Errors.mobile_tel_number = "Mobile number must be 11 digit";
      }
    } else {
      newEM1Errors.mobile_tel_number = "Mobile number is required";
    }

    if (emergencyContactOne.eveningtime_tel_number) {
      if (
        emergencyContactOne?.eveningtime_tel_number.toString().split("")
          .length !== 11
      ) {
        newEM1Errors.eveningtime_tel_number =
          "Eveningtime tel number must be 11 digit";
      }
    } else {
      newEM1Errors.eveningtime_tel_number =
        "Eveningtime tel number is required";
    }

    if (emergencyContactOne.daytime_tel_number) {
      if (
        emergencyContactOne?.daytime_tel_number.toString().split("").length !==
        11
      ) {
        newEM1Errors.daytime_tel_number = "Daytime tel number must be 11 digit";
      }
    } else {
      newEM1Errors.daytime_tel_number = "Daytime tel number is required";
    }

    // Validate first name
    if (
      !emergencyContactOne.full_name ||
      emergencyContactOne.full_name.trim() === ""
    ) {
      newEM1Errors.full_name = "Full name is required";
    }
    // Validate emergency_contact_name
    if (
      !emergencyContactOne.emergency_contact_name ||
      emergencyContactOne.emergency_contact_name.trim() === ""
    ) {
      newEM1Errors.emergency_contact_name =
        "Emergency contact name is required";
    }
    // Validate relationship_of_above_to_you
    if (
      !emergencyContactOne.relationship_of_above_to_you ||
      emergencyContactOne.relationship_of_above_to_you.trim() === ""
    ) {
      newEM1Errors.relationship_of_above_to_you =
        "Relationship of above to you is required";
    }
    // Validate address_line_1
    if (
      !emergencyContactOne.address_line_1 ||
      emergencyContactOne.address_line_1.trim() === ""
    ) {
      newEM1Errors.address_line_1 = "Address is required";
    }
    if (
      !emergencyContactOne.postcode ||
      emergencyContactOne.postcode.trim() === ""
    ) {
      newEM1Errors.postcode = "Postcode is required";
    }
    setEmergencyContactOneErrors(newEM1Errors);
    // Return true if there are no errors
    return Object.keys(newEM1Errors).length === 0;
  };

  const updateFunction = () => {
    setIsPendingSubmit(true);
    const emergencyContactDetails =
      Object.keys(emergencyContactOne).length > 0 &&
      Object.keys(emergencyContactTwo).length > 0
        ? [emergencyContactOne, emergencyContactTwo]
        : Object.keys(emergencyContactOne).length > 0
        ? [emergencyContactOne]
        : Object.keys(emergencyContactTwo).length > 0
        ? [emergencyContactTwo]
        : [];
    const data = {
      id: userInfo?.id,
      emergency_contact_details: emergencyContactDetails,
    };
    updateEmployeeContact(data)
      .then((res) => {
        console.log({ res });
        setUserInfo((prev) => ({
          ...prev,
          emergency_contact_details: res?.emergency_contact_details,
        }));
        setIsPendingSubmit(false);
        setIsEditModeOn(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Contact updated successfully`}
          />
        ));
      })
      .catch((error) => {
        console.log({ 188: error });
        setIsPendingSubmit(false);
        setIsEditModeOn(false);

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
  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const handleSubmit = () => {
    if (validateForm()) {
      updateFunction();
    } else {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          text={`You are submitting invalid data`}
        />
      ));
    }
  };
  if (isDataLoad) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[USER_VIEW]}>
        <div className="pl-2 py-2">
          <div className="flex justify-between items-center mt-8">
            <Headings level={2}>Contact Information</Headings>

            <button
              disabled={isPendingSubmit}
              onClick={() => {
                isEditModeOn ? handleSubmit() : setIsEditModeOn(true);
              }}
              className="btn btn-primary w-1/3 md:w-16 lg:w-32"
            >
              <span className="block ">
                {isEditModeOn ? (
                  isPendingSubmit ? (
                    <ButtonSpinner />
                  ) : (
                    "Save"
                  )
                ) : (
                  "Edit"
                )}
              </span>
            </button>
          </div>

          {/* EMERGENCY CONTACT 1  */}
          <div className="flex flex-col gap-5  mt-5">
            <h1 className={`text-lg font-semibold`}>
              Emergency Contact 1{" "}
              <span className="text-error text-sm">
                (This section is required)
              </span>{" "}
            </h1>

            {/* FULL NAME  &  EMERGENCY CONTACT NAME */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              {/* FULL NAME  */}
              <CustomField
                defaultValue={emergencyContactOne?.full_name}
                disable={!isEditModeOn}
                error={emergencyContactOneErrors?.full_name}
                fieldClassName={"w-full"}
                id={"full_name"}
                label={"Full Name"}
                name={"full_name"}
                onChange={handleEmergencyContactFormOneChange}
                placeholder={"Full Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={isEditModeOn}
              />

              {/* EMERGENCY CONTACT NAME  */}
              <CustomField
                defaultValue={emergencyContactOne?.emergency_contact_name}
                disable={!isEditModeOn}
                error={emergencyContactOneErrors?.emergency_contact_name}
                fieldClassName={"w-full"}
                id={"emergency_contact_name"}
                label={"Emergency Contact Name"}
                name={"emergency_contact_name"}
                onChange={handleEmergencyContactFormOneChange}
                placeholder={"Emergency Contact Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={isEditModeOn}
              />
            </div>

            {/* RELATION & ADDRESS  */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              {/* RELATION  */}
              <CustomField
                defaultValue={emergencyContactOne?.relationship_of_above_to_you}
                disable={!isEditModeOn}
                error={emergencyContactOneErrors?.relationship_of_above_to_you}
                fieldClassName={"w-full"}
                id={"relationship_of_above_to_you"}
                label={"Relationship Of Above To You"}
                name={"relationship_of_above_to_you"}
                onChange={handleEmergencyContactFormOneChange}
                placeholder={"Relationship Of Above To You"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={isEditModeOn}
              />

              {/* EC-1 ADDRESS  */}
              <div className="w-full md:w-1/2">
                {/* LABEL */}
                <label htmlFor="address_line_1" className="label">
                  <span className="label-text text-md font-bold">
                    Address{" "}
                    {isEditModeOn ? (
                      <span className="text-error font-bold text-md">*</span>
                    ) : (
                      ""
                    )}
                  </span>
                </label>

                {/* FIELD  */}
                <CustomAutoComplete
                  disable={!isEditModeOn}
                  className={`input input-bordered rounded-md w-full`}
                  placeholder="Address"
                  type="text"
                  name="address_line_1"
                  onChange={handleEmergencyContactFormOneChange}
                  formData={emergencyContactOne}
                  setFormData={setEmergencyContactOne}
                  defaultValue={emergencyContactOne?.address_line_1}
                />

                {/* VALIDATION MESSAGE  */}
                {emergencyContactOneErrors?.address_line_1 && (
                  <label className="label h-7">
                    <span className="label-text-alt text-error">
                      {emergencyContactOneErrors?.address_line_1}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* POSTCODE & DAY TIME TELEPHONE */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              {/* POSTCODE  */}
              <CustomField
                id={"postcode"}
                label={"Postcode"}
                required={isEditModeOn}
                disable={!isEditModeOn}
                type={"text"}
                name={"postcode"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.postcode}
                placeholder={"Postcode"}
                error={emergencyContactOneErrors?.postcode}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />

              {/* DAY TIME TELEPHONE  */}
              <CustomNumberField
                disable={!isEditModeOn}
                id={"daytime_tel_number"}
                label={"Day Time Tel Number"}
                min={0}
                name={"daytime_tel_number"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.daytime_tel_number}
                placeholder={"Day Time Tel Number"}
                error={emergencyContactOneErrors?.daytime_tel_number}
                required={isEditModeOn}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
            </div>

            {/* EVENING TIME TELEPHONE & MOBILE NUMBER  */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              {/* EVENING TIME TELEPHONE  */}
              <CustomNumberField
                disable={!isEditModeOn}
                id={"eveningtime_tel_number"}
                label={"Evening Time Tel Number"}
                min={0}
                name={"eveningtime_tel_number"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.eveningtime_tel_number}
                placeholder={"Evening Time Tel Number"}
                error={emergencyContactOneErrors?.eveningtime_tel_number}
                required={isEditModeOn}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />

              {/* MOBILE NUMBER  */}
              <CustomNumberField
                disable={!isEditModeOn}
                id={"mobile_tel_number"}
                label={"Mobile Tel Number"}
                min={0}
                name={"mobile_tel_number"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.mobile_tel_number}
                placeholder={"Mobile Tel Number"}
                error={emergencyContactOneErrors?.mobile_tel_number}
                required={isEditModeOn}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
            </div>
          </div>

          <hr className="text-base-100 my-10" />
          {/* EMERGENCY CONTACT 2  */}
          <div className="collapse collapse-arrow bg-base-200 border border-primary-content shadow-md">
            <input
              type="checkbox"
              name="my-accordion-3"
              defaultChecked={Object.keys(emergencyContactTwo).length > 0}
            />
            <div className="collapse-title text-xl font-medium ">
              <h1 className={`text-lg font-semibold`}>
                Emergency Contact 2{" "}
                <span className="text-gray-500 text-sm">
                  (This section is optional)
                </span>{" "}
              </h1>
            </div>

            <div className="collapse-content">
              <div className="flex flex-col gap-5">
                {/* FULL NAME  &  EMERGENCY CONTACT NAME */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  {/* FULL NAME  */}
                  <CustomField
                    defaultValue={emergencyContactTwo?.full_name}
                    disable={!isEditModeOn}
                    error={emergencyContactTwoErrors?.full_name}
                    fieldClassName={"w-full"}
                    id={"full_name"}
                    label={"Full Name"}
                    name={"full_name"}
                    onChange={handleEmergencyContactFormTwoChange}
                    placeholder={"Full Name"}
                    type={"text"}
                    wrapperClassName={"w-full md:w-1/2"}
                  />

                  {/* EMERGENCY CONTACT NAME  */}
                  <CustomField
                    defaultValue={emergencyContactTwo?.emergency_contact_name}
                    disable={!isEditModeOn}
                    error={emergencyContactTwoErrors?.emergency_contact_name}
                    fieldClassName={"w-full"}
                    id={"emergency_contact_name"}
                    label={"Emergency Contact Name"}
                    name={"emergency_contact_name"}
                    onChange={handleEmergencyContactFormTwoChange}
                    placeholder={"Emergency Contact Name"}
                    type={"text"}
                    wrapperClassName={"w-full md:w-1/2"}
                  />
                </div>

                {/* RELATION & ADDRESS  */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  {/* RELATION  */}
                  <CustomField
                    defaultValue={
                      emergencyContactTwo?.relationship_of_above_to_you
                    }
                    disable={!isEditModeOn}
                    error={
                      emergencyContactTwoErrors?.relationship_of_above_to_you
                    }
                    fieldClassName={"w-full"}
                    id={"relationship_of_above_to_you"}
                    label={"Relationship Of Above To You"}
                    name={"relationship_of_above_to_you"}
                    onChange={handleEmergencyContactFormTwoChange}
                    placeholder={"Relationship Of Above To You"}
                    type={"text"}
                    wrapperClassName={"w-full md:w-1/2"}
                  />

                  {/* EC-1 ADDRESS  */}
                  <div className="w-full md:w-1/2">
                    {/* LABEL */}
                    <label htmlFor="address_line_1" className="label">
                      <span className="label-text text-md font-bold">
                        Address
                      </span>
                    </label>

                    {/* FIELD  */}
                    <CustomAutoComplete
                      className={`input input-bordered rounded-md w-full`}
                      placeholder="Address"
                      type="text"
                      name="address_line_1"
                      onChange={handleEmergencyContactFormTwoChange}
                      formData={emergencyContactTwo}
                      disable={!isEditModeOn}
                      setFormData={setEmergencyContactTwo}
                      defaultValue={emergencyContactTwo?.address_line_1}
                    />

                    {/* VALIDATION MESSAGE  */}
                    {emergencyContactTwoErrors?.address_line_1 && (
                      <label className="label h-7">
                        <span className="label-text-alt text-error">
                          {emergencyContactTwoErrors?.address_line_1}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* POSTCODE & DAY TIME TELEPHONE */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  {/* POSTCODE  */}
                  <CustomField
                    disable={!isEditModeOn}
                    id={"postcode"}
                    label={"Postcode"}
                    type={"text"}
                    name={"postcode"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.postcode}
                    placeholder={"Postcode"}
                    error={emergencyContactTwoErrors?.postcode}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />

                  {/* DAY TIME TELEPHONE */}
                  <CustomNumberField
                    disable={!isEditModeOn}
                    id={"daytime_tel_number"}
                    label={"Day Time Tel Number"}
                    min={0}
                    name={"daytime_tel_number"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.daytime_tel_number}
                    placeholder={"Day Time Tel Number"}
                    error={emergencyContactTwoErrors?.daytime_tel_number}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />
                </div>

                {/* EVENING TIME TELEPHONE & MOBILE NUMBER  */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  {/* EVENING TIME TELEPHONE  */}
                  <CustomNumberField
                    disable={!isEditModeOn}
                    id={"eveningtime_tel_number"}
                    label={"Evening Time Tel Number"}
                    min={0}
                    name={"eveningtime_tel_number"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.eveningtime_tel_number}
                    placeholder={"Evening Time Tel Number"}
                    error={emergencyContactTwoErrors?.eveningtime_tel_number}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />

                  {/* MOBILE NUMBER */}
                  <CustomNumberField
                    disable={!isEditModeOn}
                    id={"mobile_tel_number"}
                    label={"Mobile Tel Number"}
                    min={0}
                    name={"mobile_tel_number"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.mobile_tel_number}
                    placeholder={"Mobile Tel Number"}
                    error={emergencyContactTwoErrors?.mobile_tel_number}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CheckPermission>
    );
  }
}
