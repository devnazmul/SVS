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
import CustomDatePickerOnlyMonthAndYear from "../../../../../../components/InputFields/CustomDatePickerOnlyMonthAndYear";

export default function AddAndUpdateEducationHistory({
  id = null,
  userId,
  handleClosePopup,
}) {
  const [formData, setFormData] = useState({
    user_id: userId, //✅
    degree: "", // REQUIRED ✅
    major: "",
    school_name: "", // REQUIRED ✅
    address: "", // REQUIRED ✅
    country: "", // ✅
    city: "", // ✅
    postcode: "", // ✅
    start_date: "", // REQUIRED ✅
    graduation_date: "", // REQUIRED ✅
    achievements: "",
    description: "",
    is_current: false,
    attachments: [],
  });

  // GET ALL DATA IF ON UPDATE
  const [isDataLoading, setIsDataLoading] = useState(id ? true : false);
  const getAllData = () => {
    setIsDataLoading(true);
    getSingleEducationHistory(id)
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          id: res?.id,
          user_id: userId,
          degree: res?.degree,
          major: res?.major,
          school_name: res?.school_name,
          graduation_date: res?.graduation_date,
          start_date: res?.start_date,
          achievements: res?.achievements,
          description: res?.description,
          address: res?.address,
          country: res?.country,
          city: res?.city,
          postcode: res?.postcode,
          is_current: res?.is_current,
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

    // VALIDATE DEGREE
    if (!formData.degree) {
      newErrors.degree = "Degree is required";
    }

    // VALIDATE MAJOR
    // if (!formData.major) {
    //   newErrors.major = "Major is required";
    // }

    // VALIDATE SCHOOL NAME
    if (!formData.school_name) {
      newErrors.school_name = "School name is required";
    }

    // // VALIDATE ADDRESS
    // if (!formData.address) {
    //   newErrors.address = "Address is required";
    // }

    // VALIDATE START DATE
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    // VALIDATE GRADUATION DATE
    if (!formData.graduation_date) {
      newErrors.graduation_date = "Graduation date is required";
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
    createEducationHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Education history added successfully!`}
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
    updateSingleEducationHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Education history added successfully!`}
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
        <div className="flex flex-col gap-5">
          {/* DEGREE  */}
          <div className="grid gap-3  md:gap-5 grid-cols-1 md:grid-cols-2">
            <CustomField
              defaultValue={formData?.degree}
              disable={false}
              error={errors?.degree}
              fieldClassName={"w-full"}
              id={"degree"}
              label={"Degree"}
              name={"degree"}
              onChange={handleFormChange}
              placeholder={"Degree"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />

            {/* MAJOR  */}
            <CustomField
              defaultValue={formData?.major}
              disable={false}
              error={errors?.major}
              fieldClassName={"w-full"}
              id={"major"}
              label={"Major"}
              name={"major"}
              onChange={handleFormChange}
              placeholder={"Major"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={false}
            />

            {/* INSTITUTION */}
            <CustomField
              defaultValue={formData?.school_name}
              disable={false}
              error={errors?.school_name}
              fieldClassName={"w-full"}
              id={"school_name"}
              label={"Institution Name"}
              name={"school_name"}
              onChange={handleFormChange}
              placeholder={"Institution Name"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
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

            {/* START DATE */}
            <CustomDatePickerOnlyMonthAndYear
              value={formData?.start_date}
              format="dd-LL-yyyy"
              disable={false}
              error={errors?.start_date}
              fieldClassName={"w-full"}
              id={"start_date"}
              label={"Start Date"}
              name={"start_date"}
              onChange={(date) => {
                setFormData({ ...formData, start_date: date });
              }}
              placeholder={"Start Date"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />

            {/* GRADUATION DATE  */}
            <CustomDatePickerOnlyMonthAndYear
              right
              value={formData?.graduation_date}
              format="dd-LL-yyyy"
              disable={false}
              error={errors?.graduation_date}
              fieldClassName={"w-full"}
              id={"graduation_date"}
              label={"Graduation Date"}
              name={"graduation_date"}
              onChange={(date) => {
                setFormData({ ...formData, graduation_date: date });
              }}
              placeholder={"Graduation Date"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>
          {/* ACHIEVEMENTS */}
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
          />
          {/* DESCRIPTION  */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start w-full">
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

          <CustomUploadFilesOneByOne
            files={formData?.attachments}
            isFileUploading={isFileUploading}
            setFiles={async (e) => {
              const imageArray = Object.values(e?.file?.target?.files);
              imageArray?.map((file_url, index) => {
                if (file_url) {
                  setIsFileUploading(true);
                  uploadUserSingleFile(file_url)
                    .then((res) => {
                      const newFormData = formData?.attachments;
                      newFormData.push(res?.full_location);
                      setFormData({ ...formData, attachments: newFormData });
                      setIsFileUploading(false);
                    })
                    .catch((error) => {
                      console.log({ 188: error });
                      setIsFileUploading(false);
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
              });
            }}
            onDrop={(e) => console.log({ e })}
            onRemove={(e) => {
              setFormData({
                ...formData,
                attachments: formData?.attachments?.filter((img) => img !== e),
              });
            }}
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
