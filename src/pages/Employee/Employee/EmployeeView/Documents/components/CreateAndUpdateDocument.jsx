import React, { useEffect, useState } from "react";
import CustomField from "../../../../../../components/InputFields/CustomField";

import ButtonSpinner from "../../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../../components/CustomToaster";
import {
  createDocument,
  getSingleDocument,
  updateSingleDocument,
  uploadSingleDocumentFile,
} from "../../../../../../apis/documents/documents";
import CustomLoading from "../../../../../../components/CustomLoading";
import CustomSingleFileField from "../../../../../../components/InputFields/CustomSingleFileField";
import { getFullImageLink } from "../../../../../../utils/getFullImageLink";
import { getFileDetailsFromUrl } from "../../../../../../utils/getFileDetailsFromUrl";
import { formToJSON } from "axios";

export default function CreateAndUpdateDocument({
  id = null,
  userId,
  handleClosePopup,
}) {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [formData, setFormData] = useState({
    user_id: userId, // REQUIRED
    name: "", // REQUIRED
    file_name: "", // REQUIRED
  });

  useEffect(() => {
    console.log({ formData });
  }, [formData]);
  // GET ALL DATA IF ON UPDATE
  const [isDataLoading, setIsDataLoading] = useState(id ? true : false);
  const getAllData = () => {
    setIsDataLoading(true);
    getSingleDocument(id)
      .then((res) => {
        setFormData({
          ...formData,
          id: res?.id, // REQUIRED
          name: res?.name, // REQUIRED
          file_name: res?.file_name, // REQUIRED
        });
        setFileUrl(res?.file_name);

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

  // HANDLE FILE Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // Validate business name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Title is required";
    }
    // Validate business name
    if (!id) {
      if (!file) {
        newErrors.file_name = "Attachment is required";
      }
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    uploadSingleDocumentFile(file)
      .then((res) => {
        const data = { ...formData, file_name: res?.full_location };
        createDocument(data)
          .then((res) => {
            setIsPendingSubmit(false);
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"success"}
                text={`Document added successfully!`}
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
    if (file) {
      uploadSingleDocumentFile(file)
        .then((res) => {
          const data = { ...formData, file_name: res?.full_location };
          updateSingleDocument(data)
            .then((res) => {
              setIsPendingSubmit(false);
              toast.custom((t) => (
                <CustomToaster
                  t={t}
                  type={"success"}
                  text={`Document updated successfully!`}
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
      updateSingleDocument(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Document updated successfully!`}
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

  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          <CustomField
            defaultValue={formData?.name}
            disable={false}
            error={errors?.name}
            fieldClassName={"w-full"}
            id={"name"}
            label={"Title"}
            name={"name"}
            onChange={handleFormChange}
            placeholder={"Title"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          <CustomSingleFileField
            value={formData?.file_name}
            disable={false}
            required
            error={errors?.file_name}
            fieldClassName={"w-full"}
            id={"file_name"}
            label={id ? "Change File" : "Upload File"}
            name={"file_name"}
            onChange={handleFileChange}
            placeholder={id ? "Change File" : "Upload File"}
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
            {isPendingSubmit ? <ButtonSpinner /> : `${id ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    );
  }
}
