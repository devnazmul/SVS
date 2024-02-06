import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import { createDesignation } from "../../../apis/designation/designation";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import {
  createEmployeeStatus,
  getSingleEmployeeStatus,
  updateSingleEmployeeStatus,
} from "../../../apis/employeeStatus/employeeStatus";
import CustomSingleSelect from "../../../components/InputFields/CustomSingleSelect";
import CustomLoading from "../../../components/CustomLoading";
import {
  getSingleStudentStatus,
  updateSingleStudentStatus,
} from "../../../apis/studentStatus/studentStatus";

export default function UpdateStudentStatus({ handleClosePopup, id }) {
  const [formData, setFormData] = useState({
    id: null, // REQUIRED
    name: "", // REQUIRED
    description: "",
    color: "", // REQUIRED
  });

  // GET ALL DATA
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setIsDataLoading(true);
    getSingleStudentStatus(id)
      .then((res) => {
        setFormData({
          id: res?.id,
          name: res?.name,
          description: res?.description,
          color: res?.color,
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
    // Validate  name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Student Status name is required";
    }
    // Validate Color
    if (!formData.color) {
      newErrors.color = "Color is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleStudentStatus(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Student status created successfully!`}
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
      <>
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
                wrapperClassName={"w-full mt-2"}
              />
              {/* <CustomSingleSelect
                options={[
                  { value: "#ef4444", title: "Red" },
                  { value: "#f97316", title: "Orange" },
                  { value: "#22c55e", title: "Green" },
                  { value: "#06b6d4", title: "Cyan" },
                  { value: "#3b82f6", title: "Blue" },
                  { value: "#6366f1", title: "Indigo" },
                  { value: "#a855f7", title: "Purple" },
                  { value: "#ec4899", title: "Pink" },
                ]}
                defaultValue={formData?.color}
                disable={false}
                error={errors?.color}
                fieldClassName={"w-full"}
                id={"color"}
                label={"Color"}
                name={"color"}
                onChange={handleFormChange}
                placeholder={"Color"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              /> */}
            </div>

            <>
              {formData?.name && formData?.color && (
                <label className="label">
                  <span className={`label-text text-md font-bold }`}>
                    Select Color
                    <sup className="text-error font-bold">*</sup>
                  </span>
                </label>
              )}
              <div className="inline-block w-full ">
                {[
                  { value: "#ef4444", title: "Red" },
                  { value: "#f97316", title: "Orange" },
                  { value: "#22c55e", title: "Green" },
                  { value: "#06b6d4", title: "Cyan" },
                  { value: "#3b82f6", title: "Blue" },
                  { value: "#6366f1", title: "Indigo" },
                  { value: "#a855f7", title: "Purple" },
                  { value: "#ec4899", title: "Pink" },
                ].map((c, i) => (
                  <>
                    {formData?.name && formData?.color && (
                      <div
                        onClick={() =>
                          setFormData({ ...formData, color: c?.value })
                        }
                        key={i}
                        style={{ backgroundColor: `${c?.value}` }}
                        className={`${
                          formData?.color === c?.value &&
                          "ring ring-primary ring-offset-2"
                        } rounded-full m-2 cursor-pointer inline-block px-5 py-1 shadow-md text-white`}
                      >
                        {formData?.name}
                      </div>
                    )}
                  </>
                ))}
              </div>
              {/* VALIDATION MESSAGE  */}
              {errors.color && (
                <label className="label h-7">
                  <span className="label-text-alt text-error">
                    {errors.color}
                  </span>
                </label>
              )}
            </>
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
      </>
    </div>
  );
}
