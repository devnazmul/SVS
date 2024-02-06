import React, { useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import { createDesignation } from "../../../apis/designation/designation";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { createAssetType } from "../../../apis/settings/assetType/assetType";

export default function CreateAssetsType({ handleClosePopup }) {
  const [formData, setFormData] = useState({
    name: "", // REQUIRED
  });

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // Validate name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createDesignationFunction = () => {
    setIsPendingSubmit(true);
    createAssetType(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Asset type created successfully!`}
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
      createDesignationFunction();
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
  return (
    <div className="px-2 py-5">
      <div className="flex flex-col">
        <CustomField
          defaultValue={formData?.name}
          disable={false}
          error={errors?.name}
          fieldClassName={"w-full"}
          id={"name"}
          label={"Name"}
          name={"name"}
          onChange={handleFormChange}
          placeholder={"Name"}
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
          {isPendingSubmit ? <ButtonSpinner /> : "Create"}
        </button>
      </div>
    </div>
  );
}