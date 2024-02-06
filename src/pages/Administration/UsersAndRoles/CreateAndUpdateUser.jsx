import React, { useEffect, useState } from "react";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import CustomNumberFieldWithCurrency from "../../../components/InputFields/CustomNumberFieldWithCurrency";
import CustomField from "../../../components/InputFields/CustomField";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import CustomFieldWithGenerateID from "../../../components/InputFields/CustomFieldWithGenerateID";
import CustomNumberField from "../../../components/InputFields/CustomNumberField";
import { getAllRolesWithoutPagination } from "../../../apis/roles/roles";
import { getAllEmployeeStatusWithoutPerPage } from "../../../apis/employeeStatus/employeeStatus";
import { getAllDesignationsWithoutPerPage } from "../../../apis/designation/designation";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import {
  createUser,
  getSingleUsers,
  updateSingleUser,
} from "../../../apis/userAndBusiness/user";
import CustomLoading from "../../../components/CustomLoading";
import CustomPasswordField from "../../../components/InputFields/CustomPasswordField";

export default function CreateAndUpdateUser({ handleClosePopup, id }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_Name: "", // REQUIRED
    middle_Name: "",
    last_Name: "", // REQUIRED
    email: "", // REQUIRED

    phone: "", // REQUIRED
    address_line_1: "", // REQUIRED
    country: "", // REQUIRED
    city: "", // REQUIRED
    lat: "", // REQUIRED
    long: "", // REQUIRED
    role: "", // REQUIRED
    gender: "male", // REQUIRED
    user_id: "", // REQUIRED
    postcode: "", // REQUIRED
    is_in_employee: null,

    designation_id: null,
    employment_status_id: null,

    salary_per_annum: null,
    joining_date: null,
    address_line_2: null,
    departments: [],

    emergency_contact_details: [], // AT LEAST ONE ELEMENT IS REQUIRED
  });

  const [isGettingData, setIsGettingData] = useState(true);
  // GETTING ALL DATA
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleUsers(id)
        .then((res) => {
          setFormData({
            ...formData,
            id: res?.id,
            first_Name: res?.first_Name, // REQUIRED
            middle_Name: res?.middle_Name, // REQUIRED
            last_Name: res?.last_Name, // REQUIRED
            email: res?.email, // REQUIRED
            phone: res?.phone, // REQUIRED
            address_line_1: res?.address_line_1, // REQUIRED
            postcode: res?.postcode, // REQUIRED
            country: res?.country, // REQUIRED
            city: res?.city, // REQUIRED
            lat: res?.lat, // REQUIRED
            long: res?.long, // REQUIRED
            role: res?.roles[0]?.name, // REQUIRED
            gender: res?.gender, // REQUIRED
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
    } else {
      setIsGettingData(false);
    }
  }, [id]);

  // ROLE
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // GETTING ALL ROLES
  const getAllRolesData = () => {
    setIsLoadingRoles(true);
    // GETTING EMPLOYEE STATUS
    getAllRolesWithoutPagination()
      .then((res) => {
        if (res.length > 0) {
          setRoles(
            res
              .map((es) => {
                if (!(es?.name.split("_")?.length > 1)) {
                  return {
                    id: es?.id,
                    label: `${es?.name?.toUpperCase()}`,
                    value: es?.name,
                  };
                }
              })
              ?.filter((r) => r !== undefined)
          );
        } else {
          setRoles([]);
        }
        setIsLoadingRoles(false);
      })
      .catch((error) => {
        console.log({ 131: error });
        setIsLoadingRoles(false);
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
    getAllRolesData();
  }, []);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setFormData({
        ...formData,
        password: value,
        password_confirmation: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // VALIDATION
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    // Validate first name
    if (!formData.first_Name || formData.first_Name.trim() === "") {
      newErrors.first_Name = "First name is required";
    }
    // Validate last name
    if (!formData.last_Name || formData.last_Name.trim() === "") {
      newErrors.last_Name = "Last name is required";
    }
    // Validate email
    if (formData.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email.trim()
        )
      ) {
        newErrors.email = "Invalid email";
      }
    } else {
      newErrors.email = "Email is required";
    }
    // VALIDATE PHONE
    if (formData.phone) {
      if (formData?.phone.toString().split("").length !== 11) {
        newErrors.phone = "Phone must be 11 digit";
      }
    } else {
      newErrors.phone = "Phone is required";
    }

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

    // VALIDATE POSTCODE
    if (!formData.postcode || formData.postcode.trim() === "") {
      newErrors.postcode = "Postcode is required";
    }

    if (!id) {
      // Validate password
      if (!formData.password || formData.password.trim() === "") {
        newErrorsForUser.password = "Password is required";
      } else if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
      ) {
        newErrorsForUser.password =
          "Password must be at least 8 characters long and must be contain number, lowercase letter, uppercase letter";
      }
    }

    //  VALIDATE GENDER
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    // VALIDATE ROLE
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const createFunction = () => {
    setIsPendingSubmit(true);
    createUser(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`User created successfully!`}
          />
        ));
        handleClosePopup();
      })
      .catch((error) => {
        console.log({ 229: error });
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
    updateSingleUser(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`User updated successfully!`}
          />
        ));
        handleClosePopup();
      })
      .catch((error) => {
        console.log({ 257: error });
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

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
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
      <div className="py-5 px-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row justify-between items-start gap-5">
            {/* FIRST NAME  */}
            <CustomField
              defaultValue={formData?.first_Name}
              disable={false}
              error={errors?.first_Name}
              fieldClassName={"w-full"}
              id={"first_Name"}
              label={"First Name"}
              name={"first_Name"}
              onChange={handleFormChange}
              placeholder={"First Name"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />

            {/* MIDDLE NAME  */}
            <CustomField
              defaultValue={formData?.middle_Name}
              disable={false}
              error={errors?.middle_Name}
              fieldClassName={"w-full"}
              id={"middle_Name"}
              label={"Middle Name"}
              name={"middle_Name"}
              onChange={handleFormChange}
              placeholder={"Middle Name"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-5">
            {/* LAST NAME  */}
            <CustomField
              defaultValue={formData?.last_Name}
              disable={false}
              error={errors?.last_Name}
              fieldClassName={"w-full"}
              id={"last_Name"}
              label={"Last Name"}
              name={"last_Name"}
              onChange={handleFormChange}
              placeholder={"Last Name"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />

            {/* EMAIL  */}
            <CustomField
              defaultValue={formData?.email}
              disable={false}
              error={errors?.email}
              fieldClassName={"w-full"}
              id={"email"}
              label={"Email"}
              name={"email"}
              onChange={handleFormChange}
              placeholder={"Email"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-5">
            {/* ADDRESS  */}
            <div className="w-full md:w-1/2">
              {/* LABEL */}
              <label htmlFor="address_line_1" className="label">
                <span className="label-text text-md font-bold">
                  Address{" "}
                  <span className="text-error font-bold text-md">*</span>
                </span>
              </label>

              {/* FIELD  */}
              <CustomAutoComplete
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

            <CustomField
              id={"city"}
              label={"City"}
              required={true}
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
          <div className="flex flex-col md:flex-row justify-between items-start gap-5">
            <CustomField
              id={"country"}
              label={"Country"}
              required={true}
              type={"text"}
              name={"country"}
              onChange={handleFormChange}
              value={formData?.country}
              placeholder={"Country"}
              error={errors?.country}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
            {/* POST CODE  */}
            <CustomField
              id={"postcode"}
              label={"Postcode"}
              required={true}
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
          <div className="flex flex-col md:flex-row justify-between items-start gap-5">
            {/* PHONE  */}
            <CustomNumberField
              id={"phone"}
              label={"Phone"}
              min={0}
              name={"phone"}
              onChange={handleFormChange}
              value={formData?.phone}
              placeholder={"Phone"}
              error={errors?.phone}
              required={true}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
            {/* ROLE  */}
            <div className={`w-full md:w-1/2`}>
              <CustomMultiSelect
                label={"Role"}
                top
                error={errors?.role}
                loading={isLoadingRoles}
                options={roles}
                required
                singleSelect
                defaultSelectedValues={roles.filter(
                  (d) => d?.value === formData?.role
                )}
                onSelect={(e) => {
                  setFormData({ ...formData, role: e[0]?.value });
                }}
              />
            </div>
          </div>

          {/* GENDER  */}
          <div className="w-full  -mt-1">
            <div className="label">
              <span className="label-text text-md font-bold">
                Gender
                <span className="text-error font-bold text-md">*</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 place-items-start">
              {/* MALE  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`gender`}
                    onChange={handleFormChange}
                    value={"male"}
                    className="toggle toggle-primary"
                    defaultChecked={formData?.gender === "male"}
                  />
                  <span className="label-text">Male</span>
                </label>
              </div>
              {/* FEMALE  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`gender`}
                    value={"female"}
                    onChange={handleFormChange}
                    className="toggle toggle-primary"
                    defaultChecked={formData?.gender === "female"}
                  />
                  <span className="label-text">Female</span>
                </label>
              </div>
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`gender`}
                    value={"female"}
                    onChange={handleFormChange}
                    className="toggle toggle-primary"
                    defaultChecked={formData?.gender === "other"}
                  />
                  <span className="label-text">Other</span>
                </label>
              </div>
            </div>
          </div>

          {!id ? (
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomPasswordField
                required={true}
                label={"Password"}
                id="password"
                onChange={handleFormChange}
                value={formData?.password}
                placeholder={`Password`}
                name={`password`}
                error={errors?.password}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />
            </div>
          ) : (
            ""
          )}

          {/* ACTION BUTTONS  */}
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
              {isPendingSubmit ? (
                <ButtonSpinner />
              ) : (
                `${id ? "Update" : "Create"}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
