import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import {
  createDepartment,
  getAllDepartmentsWithoutPerPage,
  getSingleDepartment,
  updateSingleDepartment,
} from "../../../apis/department/department";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../apis/userAndBusiness/user";
import { useAuth } from "../../../context/AuthContext";
import { getAllWorkshiftsWithoutPerPage } from "../../../apis/workshift/workshift";
import CustomLoading from "../../../components/CustomLoading";
import {
  createSocialMediaLink,
  getSingleSocialMediaLink,
  updateSingleSocialMediaLink,
} from "../../../apis/settings/socialSites";
import CustomMultiSelectIcon from "../../../components/InputFields/CustomMultiSelectIcon";
import { iconArray } from "../../../constant/icons";

export default function CreateAndUpdateSocialMediaLink({
  handleClosePopup,
  id,
}) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    link: "",
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(id || false);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleSocialMediaLink(id)
        .then((res) => {
          console.log({ res });
          setFormData((prev) => ({
            ...prev,
            id: res?.id,
            name: res?.name,
            icon: res?.icon,
            link: res?.link,
          }));
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
      newErrors.name = "Website name is required";
    }
    // VALIDATE ICON
    if (!formData.icon) {
      newErrors.icon = "Website logo is required";
    }

    // VALIDATE BASE URL
    if (formData.link) {
      const urlPattern =
        /^https?:\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}(\/[A-Za-z0-9-._%+&=]*)*$/i;
      if (!urlPattern.test(formData.link.trim())) {
        newErrors.link = "Invalid website url page URL";
      }
    } else {
      newErrors.link = "Website url is required";
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
    createSocialMediaLink(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Social link created successfully!`}
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
    updateSingleSocialMediaLink(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Social link updated successfully!`}
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
        <div className="flex flex-col">
          {/* WEBSITE NAME  */}
          <CustomField
            defaultValue={formData?.name}
            disable={false}
            error={errors?.name}
            fieldClassName={"w-full"}
            id={"name"}
            label={"Website Name"}
            name={"name"}
            onChange={handleFormChange}
            placeholder={"Website Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* MANAGER  */}
          <CustomMultiSelectIcon
            error={errors?.icon}
            loading={false}
            label={"Website Icon"}
            required={true}
            singleSelect
            defaultSelectedValues={iconArray.filter(
              (i) => i?.iconString === formData?.icon
            )}
            onSelect={(e) => {
              setFormData({ ...formData, icon: e[0]?.iconString || null });
            }}
          />

          {/* BASE URL  */}
          <CustomField
            defaultValue={formData?.link}
            // disable={false}
            required
            error={errors?.link}
            fieldClassName={"w-full"}
            id={"link"}
            label={"Website Base Url"}
            name={"link"}
            onChange={handleFormChange}
            placeholder={"https://example.com"}
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
