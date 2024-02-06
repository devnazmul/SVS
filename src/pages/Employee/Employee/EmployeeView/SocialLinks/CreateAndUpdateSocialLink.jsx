import React, { useEffect, useState } from "react";
import CustomField from "../../../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../components/CustomToaster";
import {
  createDepartment,
  getAllDepartmentsWithoutPerPage,
  getSingleDepartment,
  updateSingleDepartment,
} from "../../../../../apis/department/department";
import CustomMultiSelect from "../../../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../../../apis/userAndBusiness/user";
import { useAuth } from "../../../../../context/AuthContext";
import { getAllWorkshiftsWithoutPerPage } from "../../../../../apis/workshift/workshift";
import CustomLoading from "../../../../../components/CustomLoading";
import {
  createUserSocialLink,
  getSingleUserSocialMedia,
  updateUserSocialLink,
} from "../../../../../apis/employee/employee";

export default function CreateAndUpdateSocialLink({
  handleClosePopup,
  user_id,
  id,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: id,
    social_site_id: null, // REQUIRED
    user_id: user_id, // REQUIRED
    profile_link: "",
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(true);
  useEffect(() => {
    setIsGettingData(true);
    getSingleUserSocialMedia(id)
      .then((res) => {
        console.log({ res });
        setFormData({
          id: res?.id, // REQUIRED
          user_id: user_id, // REQUIRED
          profile_link: res?.profile_link || "",
          social_site_id: res?.social_site_id || null,
        });
        setIsGettingData(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsGettingData(false);
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

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE NAME
    // if (!formData.name || formData.name.trim() === "") {
    //   newErrors.name = "";
    // }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createUserSocialLink(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Social link added successfully!`}
          />
        ));
        handleClosePopup();
      })
      .catch((error) => {
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
  };
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateUserSocialLink(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Social link updated successfully!`}
          />
        ));
        handleClosePopup();
      })
      .catch((error) => {
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
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (id) {
        updateFunction();
      } else {
        createFunction();
      }
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          {/* Profile Link  */}
          <CustomField
            defaultValue={formData?.profile_link}
            disable={false}
            error={errors?.profile_link}
            fieldClassName={"w-full"}
            id={"profile_link"}
            label={"Profile Link"}
            name={"profile_link"}
            onChange={handleFormChange}
            placeholder={"Profile Link"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
          <button
            disabled={isPendingSubmit}
            onClick={handleClosePopup}
            className="btn w-full md:btn-wide btn-outline btn-primary"
          >
            Cancel
          </button>
          <button
            disabled={isPendingSubmit}
            onClick={handleSubmit}
            className="btn w-full md:btn-wide btn-primary"
          >
            {isPendingSubmit ? <ButtonSpinner /> : "Update"}
          </button>
        </div>
      </div>
    );
  }
}
