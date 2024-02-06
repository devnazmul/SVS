import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getLeaveSetting,
  updateLeaveSetting,
} from "../../../apis/settings/leaveType/leaveSettings";
import CustomToaster from "../../../components/CustomToaster";
import toast from "react-hot-toast";
import { getAllUsersWIthoutPagination } from "../../../apis/userAndBusiness/user";
import { getAllRolesWithoutPagination } from "../../../apis/roles/roles";
import { formatRole } from "../../../utils/formatRole";
import { getAllEmployeeStatusWithoutPerPage } from "../../../apis/employeeStatus/employeeStatus";
import CustomLoading from "../../../components/CustomLoading";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import {
  createPayslipSettings,
  getPayslipSettings,
  uploadPayslipLogoSettings,
} from "../../../apis/settings/paayroll/payslip";
import { getFullImageLink } from "../../../utils/getFullImageLink";
import CustomField from "../../../components/InputFields/CustomField";

export default function PaySlip() {
  const { user } = useAuth();
  // DATA FOR MULTI
  const [formData, setFormData] = useState({
    logo: "",
    title: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  //   GETTING DATA
  const [isGettingData, setIsGettingData] = useState(true);
  useEffect(() => {
    console.log("object");
    setIsGettingData(true);
    getPayslipSettings()
      .then((res) => {
        console.log({ res });
        setFormData({
          logo: res[0]?.logo,
          title: res[0]?.title,
          address: res[0]?.address,
        });

        setIsGettingData(false);
      })
      .catch((error) => {
        setIsGettingData(false);
        console.log({ error });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
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
    // LOGO
    if (!formData?.logo) {
      newErrors.logo = "Logo is required";
    }
    // TITLE
    if (!formData?.title) {
      newErrors.title = "Title is required";
    }
    // ADDRESS
    if (!formData?.address) {
      newErrors.address = "Address is required";
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    createPayslipSettings(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Payslip settings saved!`}
          />
        ));
      })
      .catch((error) => {
        console.log({ error });
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
      updateFunction();
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
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 pb-10">
        <div className="w-full h-[500px] sm:w-full bg-base-300 lg:w-1/2 rounded-xl shadow-xl p-5 shadow-primary-content border-2 border-primary-content">
          <h1 className="text-center text-primary text-xl font-bold mb-5">
            Payslip Settings
          </h1>
          <div className="flex justify-start gap-10 items-start">
            <label className={`label`}>
              <span className="label-text  text-md font-bold">
                Logo <span className="text-error font-bold text-md">*</span>
              </span>
            </label>

            {/* LOGO PIC  */}
            <div className="avatar">
              <div className="w-32 group relative rounded-full shadow-md">
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <span className="loading-spinner loading text-primary"></span>
                  </div>
                ) : (
                  <img
                    src={
                      formData?.logo
                        ? `${getFullImageLink(formData?.logo)}`
                        : `${getFullImageLink(formData?.logo)}`
                    }
                    alt={`${formData?.title}`}
                  />
                )}

                {/* IMAGE UPLOAD BUTTON  */}
                {!isLoading && (
                  <label
                    htmlFor="upload_image"
                    className="cursor-pointer group-hover:bottom-0 duration-200 absolute -bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 text-base-300 rounded-full bg-primary"
                  >
                    Update
                  </label>
                )}
                <input
                  onChange={(e) => {
                    setIsLoading(true);
                    uploadPayslipLogoSettings(e.target.files[0])
                      .then((res) => {
                        createPayslipSettings({
                          ...formData,
                          logo: res?.full_location,
                        })
                          .then((res) => {
                            setFormData((prev) => ({
                              ...prev,
                              logo: res?.logo,
                            }));
                            setIsLoading(false);
                          })
                          .catch((error) => {
                            console.log({ error });
                            setIsLoading(false);
                            toast.custom((t) => (
                              <CustomToaster
                                t={t}
                                type={"error"}
                                text={`ID: #00119 - ${error?.response?.data?.message}`}
                                errors={error?.response?.data?.errors}
                              />
                            ));
                          });
                        console.log({ res });
                      })
                      .catch((error) => {
                        setIsLoading(false);
                        console.log({ error });
                        toast.custom((t) => (
                          <CustomToaster
                            t={t}
                            type={"error"}
                            text={`ID: #00119 - ${error?.response?.data?.message}`}
                            errors={error?.response?.data?.errors}
                          />
                        ));
                      });
                  }}
                  className="hidden"
                  id="upload_image"
                  type="file"
                />
              </div>
            </div>
          </div>
          <CustomField
            // pattern="[A-Za-z]+"
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
          <CustomField
            // pattern="[A-Za-z]+"
            defaultValue={formData?.address}
            disable={false}
            error={errors?.address}
            fieldClassName={"w-full"}
            id={"address"}
            label={"Address"}
            name={"address"}
            onChange={handleFormChange}
            placeholder={"Address"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />
          <div className="w-full flex justify-end">
            <button
              disabled={isPendingSubmit}
              onClick={handleSubmit}
              className="btn w-1/2 lg:btn-wide btn-primary mt-5"
            >
              {isPendingSubmit ? <ButtonSpinner /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
