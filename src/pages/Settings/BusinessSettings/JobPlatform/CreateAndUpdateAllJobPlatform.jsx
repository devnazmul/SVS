import React, { useEffect, useState } from "react";
import {
  createJobPlatform,
  getSingleJobPlatform,
  updateSingleJobPlatform,
} from "../../../../apis/jobPlatform/jobPlatform";
import toast from "react-hot-toast";
import CustomToaster from "../../../../components/CustomToaster";
import CustomLoading from "../../../../components/CustomLoading";
import CustomField from "../../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../../components/Loaders/ButtonSpinner";
import { useAuth } from "../../../../context/AuthContext";
import CheckPermission from "../../../../CheckPermission";
import { JOB_PLATFORM_CREATE, JOB_PLATFORM_DELETE, JOB_PLATFORM_UPDATE } from "../../../../constant/permissions";

export default function CreateAndUpdateAllJobPlatform({
  handleClosePopup,
  id = null,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    description: "",
  });
  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleJobPlatform(id)
        .then((res) => {
          setFormData({
            id: res?.id,
            name: res?.name, // REQUIRED
            description: res?.description || "",
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
    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Department name is required";
    }
    // // VALIDATE MANAGER
    // if (!formData.manager_id) {
    //   newErrors.manager_id = "Manager is required";
    // }
    // // VALIDATE WORK-SHIFT
    // if (!formData.work_shift_id) {
    //   newErrors.work_shift_id = "Workshift is required";
    // }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createJobPlatform(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Job Platform created successfully!`}
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
    updateSingleJobPlatform(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Job Platform updated successfully!`}
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

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[JOB_PLATFORM_CREATE,JOB_PLATFORM_UPDATE]}>
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

            {/* DESCRIPTION  */}
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
              {isPendingSubmit ? <ButtonSpinner /> : id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </CheckPermission>
    );
  }
}