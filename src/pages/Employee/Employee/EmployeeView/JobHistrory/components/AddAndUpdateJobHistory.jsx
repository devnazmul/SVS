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
  updateSingleJobHistory,
} from "../../../../../../apis/employee/jobHistory";
import UpdateJobHistory from "./UpdateJobHistory";
import { getAllWorkLocationsWithoutPerPage } from "../../../../../../apis/workLocation/workLocation";
import { countries } from "../../../../../../constant/countries";

export default function AddAndUpdateJobHistory({
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

  // GETTING WORK-LOCATION
  const [workLocations, setWorkLocations] = useState([]);
  const [isLoadingWorkLocations, setIsLoadingWorkLocations] = useState(true);
  // GETTING ALL WORK-LOCATION
  const getAllWorkLocationsData = () => {
    setIsLoadingWorkLocations(true);
    // GETTING WORK-LOCATION
    getAllWorkLocationsWithoutPerPage()
      .then((res) => {
        setWorkLocations(
          res.map((wl) => ({
            id: wl?.id,
            label: wl?.name,
            is_default: wl?.is_default,
            business_id: wl?.business_id,
          }))
        );
        setIsLoadingWorkLocations(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingWorkLocations(false);
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
    getAllWorkLocationsData();
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
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleJobHistory(formData)
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
      if (!id) {
        createFunction();
      } else {
        updateFunction();
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

  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
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
            wrapperClassName={"w-full"}
            required={true}
          />

          <CustomDatePicker
            right
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
            wrapperClassName={"w-full"}
            required={false}
          />

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
            wrapperClassName={"w-full"}
            required={false}
          />
          {/* COUNTRY  */}
          <CustomMultiSelect
            error={errors?.country}
            loading={false}
            options={countries}
            label={"Country"}
            required={true}
            singleSelect
            defaultSelectedValues={countries.filter(
              (des) => des?.label === formData?.country
            )}
            onSelect={(e) => {
              setFormData({ ...formData, country: e[0]?.label });
            }}
          />
        </div>
        <div className={`mt-5`}>
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
