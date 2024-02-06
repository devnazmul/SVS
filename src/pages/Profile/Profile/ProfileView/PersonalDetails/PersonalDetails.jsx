import React, { useState } from "react";
import EmployeeViewHeader from "../../ViewProfileComponents/ProfileViewHeader";
import Headings from "../../../../../components/Headings/Headings";
import CustomField from "../../../../../components/InputFields/CustomField";
import ButtonLoading from "../../../../../components/ButtonLoading";
import {
  checkEmployeeId,
  updateSingleUser,
} from "../../../../../apis/userAndBusiness/user";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import { updateProfile } from "../../../../../apis/auth/auth";
import CustomNumberField from "../../../../../components/InputFields/CustomNumberField";
import { formatRole } from "../../../../../utils/formatRole";

export default function PersonalDetails({
  userInfo,
  userId,
  isLoading,
  setIsLoading,
  formData,
  setFormData,
}) {
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [errors, setErrors] = useState();

  // VALIDATE
  const validateForm = () => {
    const newErrors = {};
    const newEM1Errors = {};
    const newEM2Errors = {};

    // Validate first name
    if (!formData.first_Name || formData.first_Name.trim() === "") {
      newErrors.first_Name = "First name is required";
    }
    // Validate middle name
    // if (!formData.middle_Name || formData.middle_Name.trim() === "") {
    //   newErrors.middle_Name = "Middle name is required";
    // }
    // Validate last name
    if (!formData.last_Name || formData.last_Name.trim() === "") {
      newErrors.last_Name = "Last name is required";
    }
    // Validate email
    if (formData.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email.trim()
        )
      ) {
        newErrors.email = "Invalid email";
      }
    } else {
      newErrors.email = "Email is required";
    }
    if (formData.phone) {
      if (formData?.phone.toString().split("").length !== 11) {
        newErrors.phone = "Phone must be 11 digit";
      }
    } else {
      newErrors.phone = "Phone is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // if (!formData.user_id) {
    //   newErrors.user_id = "Employee ID is required";
    // } else {
    //   if (formData.user_id !== userInfo?.user_id) {
    //     checkEmployeeId(formData?.user_id)
    //       .then((res) => {
    //         if (res?.employee_id_exists) {
    //           newErrors.user_id = "Employee ID is already exist";
    //         }
    //       })
    //       .catch((error) => {
    //         console.log({ 188: error });
    //         setIsPendingSubmit(false);
    //         toast.custom((t) => (
    //           <CustomToaster
    //             t={t}
    //             type={"error"}
    //             text={`ID: #00119 - ${error?.response?.data?.message}`}
    //             errors={error?.response?.data?.errors}
    //           />
    //         ));
    //       });
    //   }
    // }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  // HANDLE SAVE DATA
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);

  const handleSaveData = () => {
    if (validateForm()) {
      setIsPendingSubmit(true);
      updateProfile(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          setIsEditEnabled(false);
        })
        .catch((error) => {
          console.log({ 188: error });
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={`ID: #00119 - ${error?.response?.data?.message}`}
              errors={error?.response?.data?.errors}
            />
          ));
        });
    }
  };

  return (
    <div>
      <div className="py-5 flex justify-between items-center">
        <Headings level={2}>Personal Details</Headings>
        <button
          disabled={isPendingSubmit}
          className="btn btn-primary w-[100px]"
          onClick={() => {
            if (isEditEnabled) {
              handleSaveData();
            } else {
              setIsEditEnabled(true);
            }
          }}
        >
          {isPendingSubmit ? (
            <ButtonLoading />
          ) : isEditEnabled ? (
            "Save"
          ) : (
            "Edit"
          )}
        </button>
      </div>

      <div className="p-5 rounded-xl  shadow-md bg-base-300 border-2 border-primary-content">
        {/* FIRST NAME  */}
        <div className="flex justify-between items-end gap-5">
          <CustomField
            value={formData?.first_Name}
            disable={!isEditEnabled}
            error={errors?.first_Name}
            fieldClassName={"w-full"}
            id={"first_Name"}
            label={"First Name"}
            name={"first_Name"}
            onChange={handleFormChange}
            placeholder={"First Name"}
            type={"text"}
            wrapperClassName={"w-full"}
          />
        </div>

        {/* LAST NAME  */}
        <div className="flex justify-between items-end gap-5">
          <CustomField
            value={formData?.last_Name}
            disable={!isEditEnabled}
            error={errors?.last_Name}
            fieldClassName={"w-full"}
            id={"last_Name"}
            label={"Last Name"}
            name={"last_Name"}
            onChange={handleFormChange}
            placeholder={"Last Name"}
            type={"text"}
            wrapperClassName={"w-full "}
          />
        </div>

        {/* EMAIL */}
        <div className="flex justify-between items-end gap-5">
          <CustomField
            value={formData?.email}
            disable={!isEditEnabled}
            error={errors?.email}
            fieldClassName={"w-full"}
            id={"email"}
            label={"Email"}
            name={"email"}
            onChange={handleFormChange}
            placeholder={"Email"}
            type={"email"}
            wrapperClassName={"w-full "}
          />
        </div>

        {/* PHONE */}
        <div className="flex justify-between items-end gap-5">
          <CustomNumberField
            value={formData?.phone}
            disable={!isEditEnabled}
            error={errors?.phone}
            fieldClassName={"w-full"}
            id={"phone"}
            label={"Phone"}
            name={"phone"}
            onChange={handleFormChange}
            placeholder={"Phone"}
            type={"phone"}
            wrapperClassName={"w-full "}
          />
        </div>

        {/* GENDER */}
        <div className="flex justify-between items-end gap-5">
          {!isEditEnabled ? (
            <CustomField
              value={formatRole(formData?.gender)}
              disable={!isEditEnabled}
              error={errors?.gender}
              fieldClassName={"w-full"}
              id={"gender"}
              label={"Gender"}
              name={"gender"}
              onChange={handleFormChange}
              placeholder={"Not Set"}
              type={"gender"}
              wrapperClassName={"w-full "}
            />
          ) : (
            <div className="w-full">
              <div className="label">
                <span className="label-text text-md font-bold">Gender</span>
              </div>

              <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-5 -mt-1">
                {/* MALE  */}
                <div className="form-control flex justify-start items-center">
                  <label className="label cursor-pointer flex items-center gap-5">
                    <input
                      type="radio"
                      name={`gender`}
                      onChange={handleFormChange}
                      value={"male"}
                      className="toggle toggle-primary"
                      defaultChecked={formData?.gender === "male"}
                    />
                    <span className="label-text">Male</span>
                  </label>
                </div>
                {/* FEMALE  */}
                <div className="form-control flex justify-start items-center">
                  <label className="label cursor-pointer flex items-center gap-5">
                    <input
                      type="radio"
                      name={`gender`}
                      value={"female"}
                      onChange={handleFormChange}
                      className="toggle toggle-primary"
                      defaultChecked={formData?.gender === "female"}
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
                      onChange={handleFormChange}
                      className="toggle toggle-primary"
                      defaultChecked={formData?.gender === "other"}
                    />
                    <span className="label-text">Other</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
