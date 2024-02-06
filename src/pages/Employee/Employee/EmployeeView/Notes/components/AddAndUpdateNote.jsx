import React, { useEffect, useState } from "react";
import CustomField from "../../../../../../components/InputFields/CustomField";
import ButtonSpinner from "../../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../../components/CustomToaster";
import CustomLoading from "../../../../../../components/CustomLoading";
import CustomDatePicker from "../../../../../../components/InputFields/CustomDatePicker";
import CustomNumberFieldWithCurrency from "../../../../../../components/InputFields/CustomNumberFieldWithCurrency";
import {
  createEducationHistory,
  getSingleEducationHistory,
  updateSingleEducationHistory,
} from "../../../../../../apis/employee/educationHistory";
import CustomAutoComplete from "../../../../../../components/CustomAutoComplete";
import CustomTextareaField from "../../../../../../components/InputFields/CustomTextareaField";
import CustomMultiSelect from "../../../../../../components/InputFields/CustomMultiSelect";
import { countries } from "../../../../../../constant/countries";
import { uploadUserSingleFile } from "../../../../../../apis/userAndBusiness/user";
import CustomUploadFilesOneByOne from "../../../../../../components/InputFields/CustomUploadFilesOneByOne";
import {
  createNote,
  getSingleNote,
  updateSingleNote,
} from "../../../../../../apis/note/note";
import { useAuth } from "../../../../../../context/AuthContext";

export default function AddAndUpdateNote({
  id = null,
  userId,
  handleClosePopup,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(
    id
      ? {
          user_id: userId, //✅
          id: null,
          title: "",
          description: "",
          created_at: "",
          updated_at: "",
        }
      : {
          user_id: userId, //✅
          id: null,
          title: "",
          description: "",
        }
  );

  // GET ALL DATA IF ON UPDATE
  const [isDataLoading, setIsDataLoading] = useState(id ? true : false);
  const getAllData = () => {
    setIsDataLoading(true);
    getSingleNote(id)
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          id: res?.id,
          user_id: userId,
          title: res?.title,
          description: res?.description,
          created_at: res?.created_at,
          updated_at: res?.updated_at,
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

    // VALIDATE TITLE
    if (!formData.title) {
      newErrors.tittle = "Title is required";
    }

    // VALIDATE DESCRIPTION
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    if (user?.roles[0]?.name === "business_owner" && id) {
      // VALIDATE CREATED AT
      if (!formData.created_at) {
        newErrors.created_at = "Created at is required";
      }

      // VALIDATE UPDATED AT
      if (!formData.updated_at) {
        newErrors.updated_at = "Updated at is required";
      }
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
    createNote(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Note added successfully!`}
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
    if (user?.roles[0]?.name === "business_owner") {
      updateSingleNote(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Note added successfully!`}
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
    } else {
      updateSingleNote({
        id: formData?.id,
        user_id: formData?.user_id,
        title: formData?.title,
        description: formData?.description,
      })
        .then((res) => {
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Note added successfully!`}
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
    }
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

  const [isFileUploading, setIsFileUploading] = useState(false);

  // DEBUG
  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="grid grid-cols-1">
          {/* TITLE */}
          <CustomField
            defaultValue={formData?.title}
            disable={false}
            error={errors?.title}
            fieldClassName={"w-full"}
            id={"title"}
            label={"Title"}
            name={"title"}
            onChange={handleFormChange}
            placeholder={"Title"}
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
            required
          />

          {/* CREATED AT AND UPDATED AT */}
          {user?.roles[0]?.name === "business_owner" && id ? (
            <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
              <CustomDatePicker
                top
                value={formData?.created_at}
                format="dd-LL-yyyy"
                disable={false}
                error={errors?.created_at}
                fieldClassName={"w-full"}
                id={"created_at"}
                label={"Created At"}
                name={"created_at"}
                onChange={(date) => {
                  setFormData({ ...formData, created_at: date });
                }}
                placeholder={"Created At"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />

              <CustomDatePicker
                top
                value={formData?.updated_at}
                format="dd-LL-yyyy"
                disable={false}
                error={errors?.updated_at}
                fieldClassName={"w-full"}
                id={"updated_at"}
                label={"Updated At"}
                name={"updated_at"}
                onChange={(date) => {
                  setFormData({ ...formData, updated_at: date });
                }}
                placeholder={"Updated At"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />
            </div>
          ) : (
            ""
          )}
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
