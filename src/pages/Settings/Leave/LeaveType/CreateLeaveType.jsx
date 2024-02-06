import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomField from "../../../../components/InputFields/CustomField";
import ButtonSpinner from "../../../../components/Loaders/ButtonSpinner";
import CustomToaster from "../../../../components/CustomToaster";
import CustomMultiSelect from "../../../../components/InputFields/CustomMultiSelect";
import { useAuth } from "../../../../context/AuthContext";
import { types } from "../../../../constant/types";
import CustomNumberField from "../../../../components/InputFields/CustomNumberField";
import { createLeaveType } from "../../../../apis/settings/leaveType/leaveType";

export default function CreateLeaveType({ handleClosePopup }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    is_active: 1,
    is_earning_enabled: 1,
    name: "", // REQUIRED
    type: "", // REQUIRED
    amount: "", // REQUIRED
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
    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    // VALIDATE MANAGER
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    // VALIDATE WORK-SHIFT
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createLeaveType(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Leave type created successfully!`}
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
      createFunction();
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
  return (
    <div className="px-2 py-5">
      <div className="flex flex-col">
        {/* NAME  */}
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

        {/* TYPE  */}
        <CustomMultiSelect
          error={errors?.type}
          options={types}
          label={"Type"}
          required={true}
          singleSelect
          onSelect={(e) => {
            setFormData({ ...formData, type: e[0]?.value || null });
          }}
        />

        {/* AMOUNT  */}
        <CustomNumberField
          defaultValue={formData?.amount}
          disable={false}
          error={errors?.amount}
          fieldClassName={"w-full"}
          id={"amount"}
          label={"Amount"}
          name={"amount"}
          onChange={handleFormChange}
          placeholder={"Amount"}
          wrapperClassName={"w-full"}
          required={true}
        />

        <div className="flex justify-between items-center mt-1">
          <div className="w-full md:w-1/2 -mt-1">
            <div className="label">
              <span className="label-text text-md font-bold">Active</span>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-5 -mt-1">
              {/* YES  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`is_active`}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        is_active: e.target.checked ? 1 : 0,
                      });
                    }}
                    value={1}
                    className="toggle toggle-primary"
                    checked={formData?.is_active === 1}
                  />
                  <span className="label-text">Yes</span>
                </label>
              </div>
              {/* NO  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`is_active`}
                    value={0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        is_active: e.target.checked ? 0 : 1,
                      });
                    }}
                    className="toggle toggle-primary"
                    checked={formData?.is_active === 0}
                  />
                  <span className="label-text">No</span>
                </label>
              </div>
            </div>
          </div>
          {/* <div className="w-full md:w-1/2 -mt-1">
            <div className="label">
              <span className="label-text text-md font-bold">
                Allow Monthly earning
              </span>
            </div> */}

          {/* <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-5 -mt-1"> */}
          {/* YES  */}
          {/* <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`is_earning_enabled`}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        is_earning_enabled: e.target.checked ? 1 : 0,
                      });
                    }}
                    value={1}
                    className="radio checked:bg-primary"
                    checked={formData?.is_earning_enabled === 1}
                  />
                  <span className="label-text">Yes</span>
                </label>
              </div> */}
          {/* NO  */}
          {/* <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`is_earning_enabled`}
                    value={0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        is_earning_enabled: e.target.checked ? 0 : 1,
                      });
                    }}
                    className="radio checked:bg-primary"
                    checked={formData?.is_earning_enabled === 0}
                  />
                  <span className="label-text">No</span>
                </label>
              </div>
            </div> */}
          {/* </div> */}
        </div>
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
