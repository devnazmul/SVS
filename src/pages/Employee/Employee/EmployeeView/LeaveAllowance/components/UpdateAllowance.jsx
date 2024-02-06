import React, { useEffect, useState } from "react";
import CustomLoading from "../../../../../../components/CustomLoading";
import CustomNumberField from "../../../../../../components/InputFields/CustomNumberField";

export default function UpdateAllowance({ id, handleClosePopup, amount }) {
  const [formData, setFormData] = useState({
    id: id, // REQUIRED
    amount: amount, // REQUIRED
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
      <div className="flex flex-col">
        <CustomNumberField
          defaultValue={formData?.name}
          disable={false}
          error={errors?.name}
          fieldClassName={"w-full"}
          id={"name"}
          label={"Amount (In days)"}
          name={"name"}
          onChange={handleFormChange}
          placeholder={"Amount (In days)"}
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
