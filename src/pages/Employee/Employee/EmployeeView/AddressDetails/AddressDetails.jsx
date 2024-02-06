import React, { useEffect, useState } from "react";
import CustomToaster from "../../../../../components/CustomToaster";
import toast from "react-hot-toast";
import ButtonSpinner from "../../../../../components/Loaders/ButtonSpinner";
import CustomField from "../../../../../components/InputFields/CustomField";
import CustomAutoComplete from "../../../../../components/CustomAutoComplete";
import { updateEmployeeAddress } from "../../../../../apis/employee/employee";
import Headings from "../../../../../components/Headings/Headings";
import {
  getAllAddressHistoriesWithoutPerPageByEmployee,
  getAllAddressHistoriesWithoutPerPageByEmployee2,
} from "../../../../../apis/employee/History/addressHistory";
import CustomLoading from "../../../../../components/CustomLoading";
import NoDataFound from "../../../../../components/NoDataFound";
import AddressHistory from "./components/AddressHistory";
import CheckPermission from "../../../../../CheckPermission";
import { EMPLOYEE_VIEW, USER_VIEW } from "../../../../../constant/permissions";

export default function AddressDetails({ userInfo, setUserInfo }) {
  const [tabName, setTabName] = useState("presentAddress");
  // FILTERS
  const [filters, setFilters] = useState({
    user_id: userInfo?.id,
    start_date: "",
    end_date: "",
  });
  const [formData, setFormData] = useState({
    id: userInfo?.id,
    // phone: userInfo?.phone || "",
    address_line_1: userInfo?.address_line_1 || "",
    address_line_2: userInfo?.address_line_2 || "",
    country: userInfo?.country || "",
    city: userInfo?.city || "",
    postcode: userInfo?.postcode || "",
    lat: userInfo?.lat || "",
    long: userInfo?.long || "",
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  // GET ALL ADDRESS DETAILS
  const [addressHistories, setAddressHistories] = useState([]);
  const [isLoadingDepartments, setIsLoadingAddressHistory] = useState(true);
  const [isUpdate, setIsUpdate] = useState(Math.random());
  const getAllAddressHistory = () => {
    setIsLoadingAddressHistory(true);
    // GETTING ADDRESS DETAILS
    getAllAddressHistoriesWithoutPerPageByEmployee2(filters)
      .then((res) => {
        setAddressHistories(res);
        setIsLoadingAddressHistory(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingAddressHistory(false);
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
    getAllAddressHistory();
  }, [isUpdate]);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE PHONE
    // if (formData.phone) {
    //   if (formData?.phone.toString().split("").length !== 11) {
    //     newErrors.phone = "Phone must be 11 digit";
    //   }
    // } else {
    //   newErrors.phone = "Phone is required";
    // }

    // VALIDATE ADDRESS
    if (!formData.address_line_1 || formData.address_line_1.trim() === "") {
      newErrors.address_line_1 = "Address is required";
    }

    // VALIDATE CITY
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "City is required";
    }

    // VALIDATE COUNTRY
    if (!formData.country || formData.country.trim() === "") {
      newErrors.country = "Country is required";
    }

    // VALIDATE POST CODE
    if (!formData.postcode || formData.postcode.trim() === "") {
      newErrors.postcode = "Postcode is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const updateFunction = () => {
    setIsPendingSubmit(true);

    updateEmployeeAddress(formData)
      .then((res) => {
        setUserInfo((prev) => ({
          ...prev,
          phone: res?.phone || "",
          address_line_1: res?.address_line_1 || "",
          address_line_2: res?.address_line_2 || "",
          country: res?.country || "",
          city: res?.city || "",
          postcode: res?.postcode || "",
          lat: res?.lat || "",
          long: res?.long || "",
        }));
        setIsPendingSubmit(false);
        setIsEditModeOn(false);
        setIsUpdate(Math.random());
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Address updated successfully`}
          />
        ));
      })
      .catch((error) => {
        console.log({ 188: error });
        setIsPendingSubmit(false);
        setIsEditModeOn(false);
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

  const handleSearch = () => {
    setIsUpdate(Math?.random());
  };
  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
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

  return (
    <CheckPermission permissionArray={[USER_VIEW]}>
      <div className="px-2 md:pl-2 ">
        {/* ADDRESS TITLE  */}
        <div className="flex justify-between items-center mt-8">
          <Headings level={2}>Addresses</Headings>
          <button
            disabled={isPendingSubmit}
            onClick={() => {
              tabName === "presentAddress"
                ? setTabName("addressHistory")
                : setTabName("presentAddress");
            }}
            className="btn-sm btn-primary px-5 rounded-md"
          >
            <span className="block">
              {tabName === "presentAddress" ? "History" : "Go Back"}
            </span>
          </button>
        </div>

        {/* ADDRESS HISTORY  */}
        {tabName === "addressHistory" ? (
          <div>

              <AddressHistory
              isLoadingDepartments={isLoadingDepartments}
                handleSearch={handleSearch}
                setFilters={setFilters}
                filters={filters}
                addressHistories={addressHistories}
              />

          </div>
        ) : (
          ""
        )}

        {/* PRESENT ADDRESS  */}
        {tabName === "presentAddress" ? (
          <div>
            <div className="flex justify-between items-center mt-8">
              <Headings level={3} className={`text-md`}>
                Present Address
              </Headings>

              <button
                disabled={isPendingSubmit}
                onClick={() => {
                  isEditModeOn ? handleSubmit() : setIsEditModeOn(true);
                }}
                className="btn-sm btn-primary px-5 rounded-md"
              >
                <span className="block ">
                  {isEditModeOn ? (
                    isPendingSubmit ? (
                      <ButtonSpinner />
                    ) : (
                      "Save"
                    )
                  ) : (
                    "Edit"
                  )}
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-5 mt-5">
              {/* ADDRESS & CITY  */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                {/* ADDRESS */}
                <div className="w-full md:w-1/2">
                  {/* LABEL */}
                  <label htmlFor="address_line_1" className="label">
                    <span className="label-text text-md font-bold">
                      Address{" "}
                      {isEditModeOn ? (
                        <span className="text-error font-bold text-md">*</span>
                      ) : (
                        ""
                      )}
                    </span>
                  </label>

                  {/* FIELD  */}
                  <CustomAutoComplete
                    disable={!isEditModeOn}
                    className={`input input-bordered rounded-md w-full`}
                    placeholder="Address"
                    type="text"
                    name="address_line_1"
                    onChange={handleFormChange}
                    formData={formData}
                    setFormData={setFormData}
                    defaultValue={formData?.address_line_1}
                  />

                  {/* VALIDATION MESSAGE  */}
                  {errors?.address_line_1 && (
                    <label className="label h-7">
                      <span className="label-text-alt text-error">
                        {errors?.address_line_1}
                      </span>
                    </label>
                  )}
                </div>

                {/* CITY */}
                <CustomField
                  disable={!isEditModeOn}
                  id={"city"}
                  label={"City"}
                  required={isEditModeOn}
                  type={"text"}
                  name={"city"}
                  onChange={handleFormChange}
                  value={formData?.city}
                  placeholder={"City"}
                  error={errors?.city}
                  wrapperClassName={`w-full md:w-1/2`}
                  fieldClassName={`w-full`}
                />
              </div>

              {/* COUNTRY & POSTCODE  */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                {/* COUNTRY */}
                <CustomField
                  disable={!isEditModeOn}
                  id={"country"}
                  label={"Country"}
                  required={isEditModeOn}
                  type={"text"}
                  name={"country"}
                  onChange={handleFormChange}
                  value={formData?.country}
                  placeholder={"Country"}
                  error={errors?.country}
                  wrapperClassName={`w-full md:w-1/2`}
                  fieldClassName={`w-full`}
                />

                {/* POSTCODE */}
                <CustomField
                  disable={!isEditModeOn}
                  id={"postcode"}
                  label={"Postcode"}
                  required={isEditModeOn}
                  type={"text"}
                  name={"postcode"}
                  onChange={handleFormChange}
                  value={formData?.postcode}
                  placeholder={"Postcode"}
                  error={errors?.postcode}
                  wrapperClassName={`w-full md:w-1/2`}
                  fieldClassName={`w-full`}
                />
              </div>

              {/* PHONE */}
              {/* <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomNumberField
                disable={!isEditModeOn}
                id={"phone"}
                label={"Phone"}
                min={0}
                name={"phone"}
                onChange={handleFormChange}
                value={formData?.phone}
                placeholder={"Phone"}
                error={errors?.phone}
                required={isEditModeOn}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
              <div className="w-full md:w-1/2"></div>
            </div> */}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </CheckPermission>
  );
}
