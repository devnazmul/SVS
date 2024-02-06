import React, { useEffect, useState } from "react";
import CustomField from "../../../../../../components/InputFields/CustomField";
import ButtonSpinner from "../../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../../components/CustomToaster";
import { useAuth } from "../../../../../../context/AuthContext";
import CustomLoading from "../../../../../../components/CustomLoading";
import {
  createPassportHistory,
  getSinglePassportHistory,
  updateSinglePassportHistory,
} from "../../../../../../apis/employee/History/passportHistory";
import CustomDatePicker from "../../../../../../components/InputFields/CustomDatePicker";
import CustomSingleFileField from "../../../../../../components/InputFields/CustomSingleFileField";
import { uploadUserSingleFile } from "../../../../../../apis/userAndBusiness/user";
import {
  createVisaHistory,
  getSingleVisaHistory,
  updateSingleVisaHistory,
} from "../../../../../../apis/employee/History/visaHistory";
import { MdCancel } from "react-icons/md";

export default function CreateAndUpdateVisaHistory({
  handleClosePopup,
  id = null,
  userId,
}) {
  const { user } = useAuth();
  console.log({ userId });
  const [formData, setFormData] = useState({
    user_id: userId,
    BRP_number: "",
    visa_issue_date: "",
    visa_expiry_date: "",
    place_of_issue: "",
    visa_docs: [
      {
        file_name: "",
        description: "",
      },
    ],
    from_date: "",
    to_date: "",
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(id ? true : false);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleVisaHistory(id)
        .then((res) => {
          console.log({ res });
          setFormData({
            id: res?.id,
            user_id: userId,
            BRP_number: res?.BRP_number || "",
            visa_issue_date: res?.visa_issue_date || "",
            visa_expiry_date: res?.visa_expiry_date || "",
            place_of_issue: res?.place_of_issue || "",
            visa_docs:
              res?.visa_docs?.length > 0
                ? res?.visa_docs
                : [
                    {
                      file_name: "",
                      description: "",
                    },
                  ],
            from_date: res?.from_date || "",
            to_date: res?.to_date || "",
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

  //  HANDLE ADD-REMOVE MULTIPLE DOC
  const handleAddField = () => {
    setFormData({
      ...formData,
      visa_docs: [
        ...formData?.visa_docs,
        {
          id: formData?.visa_docs.length,
          file_name: "",
          description: "",
        },
      ],
    });
  };

  const handleRemoveField = (index) => {
    if (formData?.visa_docs.length > 1) {
      let newFormFields = [...formData?.visa_docs];

      // newFormFields = newFormFields?.filter((file) => file?.id !== index);
      console.log({
        file: newFormFields?.filter((file) => file?.id !== index),
      });

      setFormData({
        ...formData,
        visa_details: {
          ...formData.visa_details,
          visa_docs: newFormFields?.filter((file) => file?.id !== index),
        },
      });
    }
  };

  const handleVisaDocDescriptionChange = (index, event) => {
    const { name, value } = event.target;
    const newFormFields = [...formData?.visa_docs];
    newFormFields[index]["description"] = value;
    setFormData({
      ...formData,
      visa_docs: newFormFields,
    });
  };

  const handleVisaDocFileUrlChange = (index, e) => {
    const file_url = e.target.files[0];
    if (file_url) {
      uploadUserSingleFile(file_url)
        .then((res) => {
          const newFormFields = [...formData?.visa_docs];
          newFormFields[index]["file_name"] = res?.full_location;
          setFormData({
            ...formData,
            visa_docs: newFormFields,
          });
        })
        .catch((error) => {
          console.log({ 188: error });
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

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE FROM DATE
    if (!formData.from_date) {
      newErrors.from_date = "From date is required";
    }

    // VALIDATE TO DATE
    if (!formData.to_date) {
      newErrors.to_date = "To date is required";
    }

    // 1. VALIDATE BRP NUMBER
    if (!formData?.BRP_number) {
      newErrors.BRP_number = "BRP Number is required";
    }
    // 2. VALIDATE VISA ISSUE DATE
    if (!formData?.visa_issue_date) {
      newErrors.visa_issue_date = "Visa issue date is required";
    }
    //3. VALIDATE VISA EXPIRY DATE
    if (!formData?.visa_expiry_date) {
      newErrors.visa_expiry_date = "Visa expiry date is required";
    }
    // 4. VALIDATE VISA ISSUE PLACE
    if (!formData?.place_of_issue) {
      newErrors.place_of_issue = "Visa issue place is required";
    }

    // =============================
    // VALIDATE VISA DOCUMENT
    // =============================
    let visa_doc = [];
    formData?.visa_docs.map((doc, index) => {
      const newDocErrors = {};
      // 1. VALIDATE VISA DOC FILE
      if (!doc?.file_name) {
        newDocErrors.file_name = "File is required";
      }
      // 2. VALIDATE VISA DOC DESCRIPTION
      if (!doc?.description) {
        newDocErrors.description = "Description is required";
      }

      if (Object.keys(newDocErrors).length > 0) {
        visa_doc.push(newDocErrors);
      }
    });
    if (visa_doc.length > 0) {
      newErrors.sponsored_visa_docs = visa_doc;
    }
    console.log(newErrors);

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createVisaHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Passport details created successfully!`}
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
    updateSingleVisaHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Passport details updated successfully!`}
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          {/* FROM DATE  */}
          <CustomDatePicker
            value={formData?.from_date}
            disable={false}
            error={errors?.from_date}
            fieldClassName={"w-full"}
            id={"from_date"}
            label={"From"}
            name={"from_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                from_date: date,
              });
            }}
            placeholder={"From"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* TO DATE  */}
          <CustomDatePicker
            value={formData?.to_date}
            disable={false}
            error={errors?.to_date}
            fieldClassName={"w-full"}
            id={"to_date"}
            label={"To"}
            name={"from_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                to_date: date,
              });
            }}
            placeholder={"To"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* BRP NUMBER  */}
          <CustomField
            defaultValue={formData?.BRP_number}
            disable={false}
            error={errors?.BRP_number}
            fieldClassName={"w-full"}
            id={"BRP_number"}
            label={"BRP Number"}
            name={"BRP_number"}
            onChange={handleFormChange}
            placeholder={"BRP Number"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* VISA ISSUE DATE  */}
          <CustomDatePicker
            value={formData?.visa_issue_date}
            disable={false}
            error={errors?.visa_issue_date}
            fieldClassName={"w-full"}
            id={"visa_issue_date"}
            label={"Visa Issue Date"}
            name={"visa_issue_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                visa_issue_date: date,
              });
            }}
            placeholder={"Visa Issue Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* VISA EXPIRY DATE  */}
          <CustomDatePicker
            value={formData?.visa_expiry_date}
            disable={false}
            error={errors?.visa_expiry_date}
            fieldClassName={"w-full"}
            id={"visa_expiry_date"}
            label={"Visa Expiry Date"}
            name={"visa_expiry_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                visa_expiry_date: date,
              });
            }}
            placeholder={"Visa Expiry Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />
          {/* PLACE OF ISSUE */}
          <CustomField
            defaultValue={formData?.place_of_issue}
            disable={false}
            error={errors?.place_of_issue}
            fieldClassName={"w-full"}
            id={"place_of_issue"}
            label={"Place Of Issue"}
            name={"place_of_issue"}
            onChange={handleFormChange}
            placeholder={"Place Of Issue"}
            wrapperClassName={"w-full"}
            required={true}
          />
        </div>
        <div>
          {/* VISA DOCS  */}
          <div className="mt-10">
            <h3 className=" text-lg font-medium ml-1 mb-2">Visa Documents:</h3>
            {/* DOCS */}
            {formData?.visa_docs?.map((field, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row justify-between items-start gap-2 md:gap-5 bg-base-300 p-5 rounded-xl shadow-md shadow-primary-content relative ${
                  index + 1 <= formData?.visa_docs.length
                    ? "border-b border-primary-content pb-10 mb-5"
                    : ""
                } `}
              >
                {index + 1}.
                {formData?.visa_docs.length > 1 ? (
                  <button
                    onClick={() => handleRemoveField(field?.id)}
                    className="absolute -right-2 -top-2"
                  >
                    <MdCancel className="text-2xl text-error" />
                  </button>
                ) : (
                  <></>
                )}
                {/* FILE */}
                <CustomSingleFileField
                  defaultValue={field?.file_name}
                  disable={false}
                  error={
                    errors?.sponsored_visa_docs
                      ? errors?.sponsored_visa_docs[index]?.file_name
                      : ""
                  }
                  fieldClassName={"w-full"}
                  id={"file_name"}
                  label={"Upload File"}
                  name={"file_name"}
                  onChange={(e) => {
                    handleVisaDocFileUrlChange(index, e);
                  }}
                  placeholder={"Upload File"}
                  wrapperClassName={"w-full md:w-1/2"}
                  required={true}
                />
                {/* DESCRIPTION  */}
                <CustomField
                  value={field?.description}
                  disable={false}
                  error={
                    errors?.sponsored_visa_docs
                      ? errors?.sponsored_visa_docs[index]?.description
                      : ""
                  }
                  fieldClassName={"w-full"}
                  id={"description"}
                  label={"Description"}
                  name={"description"}
                  onChange={(e) => {
                    handleVisaDocDescriptionChange(index, e);
                  }}
                  placeholder={"Description"}
                  wrapperClassName={"w-full md:w-1/2"}
                  required={true}
                />
              </div>
            ))}
            <div className="flex justify-end items-center mt-1">
              <button
                className="btn btn-sm btn-error text-base-300 "
                onClick={handleAddField}
              >
                Add More
              </button>
            </div>
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
            {isPendingSubmit ? <ButtonSpinner /> : id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    );
  }
}
