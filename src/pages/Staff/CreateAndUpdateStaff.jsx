import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkIsEmailExistOrNot } from "../../apis/auth/auth";
import CustomPasswordField from "../../components/InputFields/CustomPasswordField";
import CustomField from "../../components/InputFields/CustomField";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import CustomToaster from "../../components/CustomToaster";
import { useAuth } from "../../context/AuthContext";
import CustomLoading from "../../components/CustomLoading";
import { createEmployee, updateEmployee } from "../../apis/employee/employee";
import moment from "moment";
import {
  createStaff,
  getSingleStaff,
  updateSingleStaff,
} from "../../apis/staff/staff";

export default function CreateAndUpdateStaff({ handleClosePopup, id = null }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_Name: "",
    middle_Name: "",
    last_Name: "",
    email: "",

    password: "",
    password_confirmation: "",

    gender: "male",
    is_in_employee: 1,
    designation_id: null,
    salary_per_annum: "100",
    weekly_contractual_hours: "8",
    minimum_working_days_per_week: "7",
    overtime_rate: "8",
    joining_date: moment(new Date()).format("DD-MM-YYYY"),
    image: "",
    phone: "00000000000",
    address_line_1: "Dummy",
    address_line_2: "Dummy",
    country: "Dummy",
    city: "Dummy",
    postcode: "Dummy",
    lat: "Dummy",
    long: "Dummy",
    role: `business_staff#${user?.business_id}`,
    emergency_contact_details: [],
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleStaff(id)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            id: res?.id,
            first_Name: res?.first_Name || "",
            middle_Name: "",
            last_Name: res?.last_Name || "",
            email: res?.email || "",
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

    // VALIDATE FIRST NAME
    if (!formData.first_Name || formData.first_Name.trim() === "") {
      newErrors.first_Name = "First name is required";
    }

    // VALIDATE LAST NAME
    if (!formData.last_Name || formData.last_Name.trim() === "") {
      newErrors.last_Name = "Last name is required";
    }

    // VALIDATE EMAIL
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    // VALIDATE PASSWORD
    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters long and must be contain number, lowercase letter, uppercase letter";
    }

    setErrors(newErrors);
    console.log({ newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // CHECK EMAIL
  const [userEmailExist, setUserEmailExist] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const handleCheckEmail = (e) => {
    setIsCheckingEmail(true);
    checkIsEmailExistOrNot({ email: e.target.value, user_id: id })
      .then((res) => {
        if (res?.data) {
          setUserEmailExist("Email already exist!");
        } else {
          setUserEmailExist("");
        }
        setIsCheckingEmail(false);
      })
      .catch((error) => {
        setIsCheckingEmail(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00121 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createStaff({ ...formData, password_confirmation: formData?.password })
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Staff created successfully!`}
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
    updateSingleStaff({
      ...formData,
      password_confirmation: formData?.password,
    })
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Staff updated successfully!`}
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
    if (validateForm() && !userEmailExist) {
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
        <div className="grid grid-cols-1 gap-2">
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
            wrapperClassName={"w-full"}
            required={true}
          />

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
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* EMAIL */}
          <CustomField
            defaultValue={formData?.email}
            disable={false}
            error={errors?.email || userEmailExist}
            onBlur={handleCheckEmail}
            fieldClassName={"w-full"}
            id={"email"}
            label={"Email"}
            name={"email"}
            onChange={handleFormChange}
            placeholder={"Email"}
            type={"email"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* PASSWORD */}
          {!id && (
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
          )}
        </div>

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
            disabled={isCheckingEmail || isPendingSubmit}
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
