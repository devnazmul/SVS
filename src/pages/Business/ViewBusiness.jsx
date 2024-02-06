import React, { useEffect, useState } from "react";
import BusinessPictureSection from "./components/BusinessPictureSection";
import { getSingleBusiness } from "../../apis/userAndBusiness/business";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import { useParams } from "react-router-dom";
import CustomField from "../../components/InputFields/CustomField";
import Headings from "../../components/Headings/Headings";
import ButtonLoading from "../../components/ButtonLoading";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import CustomTextareaField from "../../components/InputFields/CustomTextareaField";
import { updateSingleUserWithBusiness } from "../../apis/userAndBusiness/user";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { decryptID } from "../../utils/encryptAndDecryptID";
import CheckPermission from "../../CheckPermission";
import { BUSINESS_VIEW } from "../../constant/permissions";
import BusinessViewMenu from "./components/BusinessViewMenu";
import CreateBusinessTiming from "./CreateBusinessTiming";
import { compareTimes } from "../../utils/compareTimes";

export default function ViewBusiness() {
  const { encId } = useParams();
  const id = decryptID(encId);

  // FORM DATA
  const [formDataForUser, setFormDataForUser] = useState({});
  const [formDataForBusiness, setFormDataForBusiness] = useState({});
  const [formDataForBusinessTiming, setFormDataForBusinessTiming] = useState(
    []
  );
  const [step, setStep] = useState("");

  // EDIT ENABLE OR DISABLE
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  const [isEditEnabledForUser, setIsEditEnabledForUser] = useState({
    // Owner Information
    first_Name: false,
    middle_Name: false,
    last_Name: false,
    phone: false,
    email: false,
  });

  // GET ALL DATA
  const [isDataPending, setIsDataPending] = useState(true);
  useEffect(() => {
    if (id) {
      setIsDataPending(true);
      getSingleBusiness(id)
        .then((res) => {
          setFormDataForUser(res?.owner);
          delete res?.owner;
          setFormDataForBusiness(res);
          setFormDataForBusinessTiming(res?.times);
          setIsDataPending(false);
        })
        .catch((error) => {
          setIsDataPending(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={`ID: #00124 - ${error?.response?.data?.message}`}
              errors={error?.response?.data?.errors}
            />
          ));
        });
    }
  }, [id]);

  //   CHANGE TIMING DATA
  const onChangeTimingData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setTimingData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // VALIDATION
  const [errorsForUser, setErrorsForUser] = useState({});
  const [errorsForBusiness, setErrorsForBusiness] = useState({});
  const [errorsForTiming, setErrorsForTiming] = useState({});
  const validateUser = () => {
    const newErrorsForUser = {};
    // USER DATA VALIDATION
    // =============================
    // Validate first name
    if (
      !formDataForUser.first_Name ||
      formDataForUser.first_Name.trim() === ""
    ) {
      newErrorsForUser.first_Name = "First name is required";
    }
    // Validate last name
    if (!formDataForUser.last_Name || formDataForUser.last_Name.trim() === "") {
      newErrorsForUser.last_Name = "First name is required";
    }
    // Validate email
    if (!formDataForUser.email || formDataForUser.email.trim() === "") {
      newErrorsForUser.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formDataForUser.email.trim()
      )
    ) {
      newErrorsForUser.email = "Invalid email";
    }
    // Validate phone
    if (formDataForUser.phone) {
      if (formDataForUser?.phone.toString().split("").length !== 11) {
        newErrorsForUser.phone = "Phone must be 11 digit";
      }
    }
    setErrorsForUser(newErrorsForUser);
    // Return true if there are no errors
    return Object.keys(newErrorsForUser).length === 0;
  };
  const validateBusiness = () => {
    const newErrorsForBusiness = {};
    // Validate business name
    if (!formDataForBusiness.name || formDataForBusiness.name.trim() === "") {
      newErrorsForBusiness.name = "Business name is required";
    }
    // Validate address
    if (
      !formDataForBusiness.address_line_1 ||
      formDataForBusiness.address_line_1.trim() === ""
    ) {
      newErrorsForBusiness.address_line_1 = "Address is required";
    }
    // Validate lat
    if (!formDataForBusiness.lat || formDataForBusiness.lat.trim() === "") {
      newErrorsForBusiness.lat = "Lat is required";
    }
    // Validate long
    if (!formDataForBusiness.long || formDataForBusiness.long.trim() === "") {
      newErrorsForBusiness.long = "Long is required";
    }
    // Validate country
    if (
      !formDataForBusiness.country ||
      formDataForBusiness.country.trim() === ""
    ) {
      newErrorsForBusiness.country = "Country is required";
    }
    // Validate city
    if (!formDataForBusiness.city || formDataForBusiness.city.trim() === "") {
      newErrorsForBusiness.city = "City is required";
    }
    // Validate currency
    if (
      !formDataForBusiness.currency ||
      formDataForBusiness.currency.trim() === ""
    ) {
      newErrorsForBusiness.currency = "Currency is required";
    }
    // Validate postcode
    if (
      !formDataForBusiness.postcode ||
      formDataForBusiness.postcode.trim() === ""
    ) {
      newErrorsForBusiness.postcode = "Postcode is required";
    }
    // Validate phone
    if (formDataForBusiness.phone) {
      if (formDataForBusiness?.phone.toString().split("").length !== 11) {
        newErrorsForBusiness.phone = "Business phone must be 11 digit";
      }
    }
    // Validate email
    if (formDataForBusiness.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formDataForBusiness.email.trim()
        )
      ) {
        newErrorsForBusiness.email = "Invalid email";
      }
    }
    // BUSINESS WEB PAGE
    if (formDataForBusiness.web_page) {
      const urlPattern =
        /^https?:\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}(\/[A-Za-z0-9-._%+&=]*)*$/i;
      if (!urlPattern.test(formDataForBusiness.web_page.trim())) {
        newErrorsForBusiness.web_page = "Invalid web page URL";
      }
    }
    setErrorsForBusiness(newErrorsForBusiness);
    // Return true if there are no errors
    return Object.keys(newErrorsForBusiness).length === 0;
  };

  const validateTiming = () => {
    const newErrors = {};

    formDataForBusinessTiming.forEach((detail, index) => {
      if (detail.start_at && detail.end_at) {
        if (
          compareTimes(detail.start_at, detail.end_at) === 1 ||
          compareTimes(detail.start_at, detail.end_at) === 0
        ) {
          newErrors.times = newErrors.times || [];
          newErrors.times.push({
            id: index,
            start_at: "Start time must be before the end time",
            end_at: "End time must be after the start time",
          });
        }
      } else {
        if (!detail.start_at && detail.is_weekend === false) {
          newErrors.times = newErrors.times || [];
          newErrors.times.push({
            id: index,
            start_at: "Start time is required",
          });
        }

        if (!detail.end_at && detail.is_weekend === false) {
          newErrors.times = newErrors.times || [];
          newErrors.times.push({
            id: index,
            end_at: "End time is required",
          });
        }
      }
    });

    setErrorsForTiming(newErrors);
    console.log({ err3: newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // FORM CHANGE HANDLE
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setFormDataForUser({
      ...formDataForUser,
      [name]: value,
    });
  };
  const handleBusinessFormChange = (e) => {
    const { name, value } = e.target;
    setFormDataForBusiness({
      ...formDataForBusiness,
      [name]: value,
    });
  };
  // HANDLE SAVE DATA
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);

  const handleSaveData = () => {
    if (validateUser() && validateBusiness() && validateTiming()) {
      setIsPendingSubmit(true);
      updateSingleUserWithBusiness({
        user: formDataForUser,
        business: formDataForBusiness,
        times: formDataForBusinessTiming,
      })
        .then((res) => {
          setIsPendingSubmit(false);
          setIsEditEnabled(false);
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

  if (isDataPending) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[BUSINESS_VIEW]}>
        <div className="pb-5">
          <BusinessPictureSection
            formDataForBusinessTiming={formDataForBusinessTiming}
            formDataForBusiness={formDataForBusiness}
            setFormDataForBusiness={setFormDataForBusiness}
            formDataForUser={formDataForUser}
            setFormDataForUser={setFormDataForUser}
          />

          {/* TABS  */}
          <BusinessViewMenu onClick={(e) => setStep(e)} />

          {console.log({ step })}
          {/* BUSINESS DETAILS TAB  */}
          {step === "Business Details" ? (
            <>
              {/* BASIC INFORMATION  */}
              <div className="">
                <div className="py-5 flex justify-between items-center">
                  <Headings className={`text-primary`} level={2}>
                    Basic Information
                  </Headings>
                  <button
                    disabled={isPendingSubmit}
                    className="btn btn-primary w-[100px]"
                    onClick={() => {
                      if (isEditEnabled) {
                        handleSaveData();
                      } else {
                        setIsEditEnabled(true);
                      }
                    }}
                  >
                    {isPendingSubmit ? (
                      <ButtonLoading />
                    ) : isEditEnabled ? (
                      "Save"
                    ) : (
                      "Edit"
                    )}
                  </button>
                </div>

                <div className="p-5 rounded-xl border-2 border-primary-content bg-base-300 shadow-md">
                  {/* NAME  */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForBusiness?.name}
                      disable={!isEditEnabled}
                      error={errorsForBusiness?.name}
                      fieldClassName={"w-full"}
                      id={"name"}
                      label={"Name"}
                      name={"name"}
                      onChange={handleBusinessFormChange}
                      placeholder={"Name"}
                      type={"text"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* EMAIL  */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForBusiness?.email}
                      disable={!isEditEnabled}
                      error={errorsForBusiness?.email}
                      fieldClassName={"w-full"}
                      id={"email"}
                      label={"Email"}
                      name={"email"}
                      onChange={handleBusinessFormChange}
                      placeholder={"Email"}
                      type={"email"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* PHONE  */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomNumberField
                      value={formDataForBusiness?.phone}
                      disable={!isEditEnabled}
                      error={errorsForBusiness?.phone}
                      fieldClassName={"w-full"}
                      id={"phone"}
                      label={"Phone"}
                      name={"phone"}
                      onChange={handleBusinessFormChange}
                      placeholder={"Phone"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* WEB PAGE  */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForBusiness?.web_page}
                      disable={!isEditEnabled}
                      error={errorsForBusiness?.web_page}
                      fieldClassName={"w-full"}
                      id={"web_page"}
                      label={"Web Page"}
                      name={"web_page"}
                      onChange={handleBusinessFormChange}
                      placeholder={"Web Page"}
                      type={"text"}
                      wrapperClassName={"w-full"}
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS INFORMATION  */}
              <div>
                <div className="py-5">
                  <Headings className={`text-primary`} level={2}>
                    Address Information
                  </Headings>
                </div>

                <div className="p-5 rounded-xl border-2 border-primary-content bg-base-300 shadow-md">
                  {/* ADDRESS LINE 1  */}
                  <div className="flex justify-between items-end gap-5">
                    <div className="flex flex-col">
                      {/* Business Address */}
                      <label htmlFor="address_line_1" className="label">
                        <span className="label-text text-md font-bold">
                          Business Address{" "}
                        </span>
                      </label>

                      {/* FIELD  */}
                      <CustomAutoComplete
                        value={formDataForBusiness?.address_line_1}
                        disable={!isEditEnabled}
                        className={`input input-bordered rounded-md w-full`}
                        placeholder="Business Address"
                        type="text"
                        name="address_line_1"
                        onChange={handleBusinessFormChange}
                        formData={formDataForBusiness}
                        setFormData={setFormDataForBusiness}
                      />

                      {/* VALIDATION MESSAGE  */}
                      {errorsForBusiness?.address_line_1 && (
                        <label className="label h-7">
                          <span className="label-text-alt text-error">
                            {errorsForBusiness?.address_line_1}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* POSTCODE  */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForBusiness?.postcode}
                      disable={!isEditEnabled}
                      error={errorsForBusiness?.postcode}
                      fieldClassName={"w-full"}
                      id={"postcode"}
                      label={"Postcode"}
                      name={"postcode"}
                      onChange={handleBusinessFormChange}
                      placeholder={"Postcode"}
                      type={"text"}
                      wrapperClassName={"w-full"}
                    />
                  </div>
                </div>
              </div>

              {/* OWNER INFORMATION  */}
              <div>
                <div className="py-5">
                  <Headings className={`text-primary`} level={2}>
                    Owner Information
                  </Headings>
                </div>

                <div className="p-5 rounded-xl border-2 border-primary-content bg-base-300 shadow-md">
                  {/* FIRST NAME  */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForUser?.first_Name}
                      disable={!isEditEnabled}
                      error={errorsForUser?.first_Name}
                      fieldClassName={"w-full"}
                      id={"first_Name"}
                      label={"First Name"}
                      name={"first_Name"}
                      onChange={handleUserFormChange}
                      placeholder={"First Name"}
                      type={"text"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* MIDDLE NAME */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForUser?.middle_Name}
                      disable={!isEditEnabled}
                      error={errorsForUser?.middle_Name}
                      fieldClassName={"w-full"}
                      id={"middle_Name"}
                      label={"Middle Name"}
                      name={"middle_Name"}
                      onChange={handleUserFormChange}
                      placeholder={"Middle Name"}
                      type={"text"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* LAST NAME */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForUser?.last_Name}
                      disable={!isEditEnabled}
                      error={errorsForUser?.last_Name}
                      fieldClassName={"w-full"}
                      id={"last_Name"}
                      label={"Last Name"}
                      name={"last_Name"}
                      onChange={handleUserFormChange}
                      placeholder={"Last Name"}
                      type={"text"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomField
                      value={formDataForUser?.email}
                      disable={!isEditEnabled}
                      error={errorsForUser?.email}
                      fieldClassName={"w-full"}
                      id={"email"}
                      label={"Email"}
                      name={"email"}
                      onChange={handleUserFormChange}
                      placeholder={"Email"}
                      type={"email"}
                      wrapperClassName={"w-full"}
                    />
                  </div>

                  {/* PHONE */}
                  <div className="flex justify-between items-end gap-5">
                    <CustomNumberField
                      value={formDataForUser?.phone}
                      disable={!isEditEnabled}
                      error={errorsForUser?.phone}
                      fieldClassName={"w-full"}
                      id={"phone"}
                      label={"Phone"}
                      name={"phone"}
                      onChange={handleUserFormChange}
                      placeholder={"Phone"}
                      wrapperClassName={"w-full"}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {step === "Business Timing" ? (
            <>
              <div className={`flex justify-between items-center mb-5`}>
                <Headings className={`text-primary`} level={2}>
                  Business Timing
                </Headings>
                {/* EDIT BUTTON  */}
                <button
                  disabled={isPendingSubmit}
                  className="btn btn-primary w-[100px]"
                  onClick={() => {
                    if (isEditEnabled) {
                      handleSaveData();
                    } else {
                      setIsEditEnabled(true);
                    }
                  }}
                >
                  {isPendingSubmit ? (
                    <ButtonLoading />
                  ) : isEditEnabled ? (
                    "Save"
                  ) : (
                    "Edit"
                  )}
                </button>
              </div>

              <div className="p-5 rounded-xl border-2 border-primary-content bg-base-300 shadow-md">
                <CreateBusinessTiming
                  idDisabledAll={!isEditEnabled}
                  type="create"
                  errors={errorsForTiming}
                  onChangeTimingData={onChangeTimingData}
                  timingData={formDataForBusinessTiming}
                  setTimingData={setFormDataForBusinessTiming}
                />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </CheckPermission>
    );
  }
}
