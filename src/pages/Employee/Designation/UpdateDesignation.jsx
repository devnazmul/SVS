import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import {
  createDesignation,
  getSingleDesignation,
  updateSingleDesignation,
} from "../../../apis/designation/designation";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import CustomLoading from "../../../components/CustomLoading";
import CustomToaster from "../../../components/CustomToaster";
import toast from "react-hot-toast";
import {
  getSingleDepartment,
  updateSingleDepartment,
} from "../../../apis/department/department";

export default function UpdateDesignation({ handleClosePopup, id }) {
  const [formData, setFormData] = useState({
    id: null, // REQUIRED
    name: "", // REQUIRED
    description: "",
  });

  // GET ALL DATA
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setIsDataLoading(true);
    getSingleDesignation(id)
      .then((res) => {
        setFormData({
          id: res?.id,
          name: res?.name,
          description: res?.description,
        });
        setIsDataLoading(false);
      })
      .catch((error) => {
        setIsDataLoading(false);
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
    // Validate business name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Designation name is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleDesignation(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Department updated successfully!`}
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
  return (
    <div className="px-2 py-5">
      {isDataLoading ? (
        <CustomLoading />
      ) : (
        <>
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
            <CustomTextareaField
              defaultValue={formData?.description}
              disable={false}
              error={errors?.description}
              fieldClassName={"w-full"}
              id={"description"}
              label={"Description"}
              name={"description"}
              onChange={handleFormChange}
              placeholder={"Description"}
              type={"text"}
              wrapperClassName={"w-full"}
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
        </>
      )}
    </div>
  );
}
