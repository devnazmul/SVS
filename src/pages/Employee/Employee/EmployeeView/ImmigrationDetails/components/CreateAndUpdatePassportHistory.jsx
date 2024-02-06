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

export default function CreateAndUpdatePassportHistory({
  handleClosePopup,
  id = null,
  userId,
}) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    user_id: userId,
    passport_number: "",
    passport_issue_date: "",
    passport_expiry_date: "",
    place_of_issue: "",
    from_date: "",
    to_date: "",
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(id ? true : false);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSinglePassportHistory(id)
        .then((res) => {
          console.log({ res });
          setFormData({
            id: res?.id,
            user_id: userId,
            passport_number: res?.passport_number || "",
            passport_issue_date: res?.passport_issue_date || "",
            passport_expiry_date: res?.passport_expiry_date || "",
            place_of_issue: res?.place_of_issue || "",
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

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE PASSPORT NUMBER
    if (!formData.passport_number || formData.passport_number.trim() === "") {
      newErrors.passport_number = "Passport number is required";
    }

    // VALIDATE ISSUE DATE
    if (!formData.passport_issue_date) {
      newErrors.passport_issue_date = "Issue date is required";
    }

    // VALIDATE EXPIRY DATE
    if (!formData.passport_expiry_date) {
      newErrors.passport_expiry_date = "Expiry date is required";
    }

    // VALIDATE EXPIRY DATE
    if (!formData.place_of_issue) {
      newErrors.place_of_issue = "Place of issue is required";
    }

    // VALIDATE EXPIRY DATE
    if (!formData.from_date) {
      newErrors.from_date = "From date is required";
    }

    // VALIDATE EXPIRY DATE
    if (!formData.to_date) {
      newErrors.to_date = "To date is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createPassportHistory(formData)
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
    updateSinglePassportHistory(formData)
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
            right
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

          {/* CERTIFICATE NUMBER  */}
          <CustomField
            defaultValue={formData?.passport_number}
            disable={false}
            error={errors?.passport_number}
            fieldClassName={"w-full"}
            id={"passport_number"}
            label={"Passport Number"}
            name={"passport_number"}
            onChange={handleFormChange}
            placeholder={"Passport Number"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* ISSUE DATE  */}
          <CustomDatePicker
            top
            value={formData?.passport_issue_date}
            disable={false}
            error={errors?.passport_issue_date}
            fieldClassName={"w-full"}
            id={"passport_issue_date"}
            label={"Passport Issue Date"}
            name={"passport_issue_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                passport_issue_date: date,
              });
            }}
            placeholder={"Passport Issue Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* EXPIRY DATE  */}
          <CustomDatePicker
            top
            right
            value={formData?.passport_expiry_date}
            disable={false}
            error={errors?.passport_expiry_date}
            fieldClassName={"w-full"}
            id={"passport_expiry_date"}
            label={"Passport Expiry Date"}
            name={"passport_expiry_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                passport_expiry_date: date,
              });
            }}
            placeholder={"Passport Expiry Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

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
    );
  }
}
