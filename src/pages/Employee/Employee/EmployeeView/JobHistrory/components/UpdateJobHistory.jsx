import React, { useEffect, useState } from "react";
import CustomField from "../../../../../../components/InputFields/CustomField";

import ButtonSpinner from "../../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../../components/CustomToaster";
import {
  createDocument,
  getSingleDocument,
  uploadSingleDocumentFile,
} from "../../../../../../apis/documents/documents";
import CustomLoading from "../../../../../../components/CustomLoading";
import CustomSingleFileField from "../../../../../../components/InputFields/CustomSingleFileField";
import CustomMultiSelect from "../../../../../../components/InputFields/CustomMultiSelect";
import { getAllAssetTypesWithoutPerPage } from "../../../../../../apis/settings/assetType/assetType";
import CustomDatePicker from "../../../../../../components/InputFields/CustomDatePicker";
import CustomNumberFieldWithCurrency from "../../../../../../components/InputFields/CustomNumberFieldWithCurrency";
import {
  createJobHistory,
  getSingleJobHistory,
} from "../../../../../../apis/employee/jobHistory";

export default function UpdateJobHistory({
  id = null,
  userId,
  handleClosePopup,
}) {
  const [formData, setFormData] = useState({
    user_id: userId, // REQUIRED
    company_name: "", // REQUIRED
    job_title: "", // REQUIRED
    employment_start_date: "", // REQUIRED
    employment_end_date: "",
    responsibilities: "",
    supervisor_name: "",
    contact_information: "",
    salary: "",
    work_location: "",
    achievements: "",
  });

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  // GET ALL DATA IF ON UPDATE
  const [isDataLoading, setIsDataLoading] = useState(id ? true : false);
  const getAllData = () => {
    setIsDataLoading(true);
    getSingleJobHistory(id)
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          id: res?.id,
          user_id: userId,
          company_name: res?.company_name,
          job_title: res?.job_title,
          employment_start_date: res?.employment_start_date,
          employment_end_date: res?.employment_end_date,
          responsibilities: res?.responsibilities,
          supervisor_name: res?.supervisor_name,
          contact_information: res?.contact_information,
          salary: res?.salary,
          work_location: res?.work_location,
          achievements: res?.achievements,
        }));
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
  };
  useEffect(() => {
    if (id) {
      getAllData();
    }
  }, [id]);

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

    // VALIDATE USER ID
    if (!formData.user_id) {
      newErrors.user_id = "User id is required";
    }

    // VALIDATE COMPANY NAME
    if (!formData.company_name) {
      newErrors.company_name = "Company name is required";
    }

    // VALIDATE JOB TITLE
    if (!formData.job_title) {
      newErrors.job_title = "Job title is required";
    }

    // VALIDATE JOB TITLE
    if (!formData.employment_start_date) {
      newErrors.employment_start_date = "Employment start date is required";
    }

    setErrors(newErrors);
    console.log({ newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createJobHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Job history added successfully!`}
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

  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          {/* COMPANY NAME & JOB TITLE */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
            <CustomField
              defaultValue={formData?.company_name}
              disable={false}
              error={errors?.company_name}
              fieldClassName={"w-full"}
              id={"company_name"}
              label={"Company Name"}
              name={"company_name"}
              onChange={handleFormChange}
              placeholder={"Company Name"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
            <CustomField
              defaultValue={formData?.job_title}
              disable={false}
              error={errors?.job_title}
              fieldClassName={"w-full"}
              id={"job_title"}
              label={"Job Title"}
              name={"job_title"}
              onChange={handleFormChange}
              placeholder={"Job Title"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>
          {/* EMPLOYMENT START DATE &  EMPLOYMENT END DATE */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
            <CustomDatePicker
              value={formData?.employment_start_date}
              format="dd-LL-yyyy"
              disable={false}
              error={errors?.employment_start_date}
              fieldClassName={"w-full"}
              id={"employment_start_date"}
              label={"Employment Start Date"}
              name={"employment_start_date"}
              onChange={(date) => {
                setFormData({ ...formData, employment_start_date: date });
              }}
              placeholder={"Employment Start Date"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />
            <CustomDatePicker
              value={formData?.employment_end_date}
              format="dd-LL-yyyy"
              disable={false}
              error={errors?.employment_end_date}
              fieldClassName={"w-full"}
              id={"employment_end_date"}
              label={"Employment End Date"}
              name={"employment_end_date"}
              onChange={(date) => {
                setFormData({ ...formData, employment_end_date: date });
              }}
              placeholder={"Employment End Date"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={false}
            />
          </div>
          {/* RESPONSIBILITIES & SUPERVISOR NAME */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
            <CustomField
              defaultValue={formData?.responsibilities}
              disable={false}
              error={errors?.responsibilities}
              fieldClassName={"w-full"}
              id={"responsibilities"}
              label={"Responsibilities"}
              name={"responsibilities"}
              onChange={handleFormChange}
              placeholder={"Responsibilities"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={false}
            />
            <CustomField
              defaultValue={formData?.supervisor_name}
              disable={false}
              error={errors?.supervisor_name}
              fieldClassName={"w-full"}
              id={"supervisor_name"}
              label={"Supervisor Name"}
              name={"supervisor_name"}
              onChange={handleFormChange}
              placeholder={"Supervisor Name"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={false}
            />
          </div>
          {/* CONTACT INFORMATION & SALARY */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
            <CustomField
              defaultValue={formData?.contact_information}
              disable={false}
              error={errors?.contact_information}
              fieldClassName={"w-full"}
              id={"contact_information"}
              label={"Contact Information"}
              name={"contact_information"}
              onChange={handleFormChange}
              placeholder={"Contact Information"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={false}
            />
            <CustomNumberFieldWithCurrency
              currency="£"
              defaultValue={formData?.salary}
              disable={false}
              error={errors?.salary}
              fieldClassName={"w-full"}
              id={"salary"}
              label={"Salary"}
              name={"salary"}
              onChange={handleFormChange}
              placeholder={"Salary"}
              wrapperClassName={"w-full md:w-1/2"}
              required={false}
            />
          </div>
          {/* WORK LOCATION & ACHIEVEMENTS */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
            <CustomField
              defaultValue={formData?.work_location}
              disable={false}
              error={errors?.work_location}
              fieldClassName={"w-full"}
              id={"work_location"}
              label={"Work Location"}
              name={"work_location"}
              onChange={handleFormChange}
              placeholder={"Work Location"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={false}
            />
            <CustomField
              defaultValue={formData?.achievements}
              disable={false}
              error={errors?.achievements}
              fieldClassName={"w-full"}
              id={"achievements"}
              label={"Achievements"}
              name={"achievements"}
              onChange={handleFormChange}
              placeholder={"Achievements"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={false}
            />
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
            {isPendingSubmit ? <ButtonSpinner /> : `${id ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    );
  }
}
