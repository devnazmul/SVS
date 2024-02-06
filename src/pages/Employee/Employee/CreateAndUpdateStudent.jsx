import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkIsEmailExistOrNot } from "../../../apis/auth/auth";
import CustomPasswordField from "../../../components/InputFields/CustomPasswordField";
import CustomField from "../../../components/InputFields/CustomField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import CustomToaster from "../../../components/CustomToaster";
import { useAuth } from "../../../context/AuthContext";
import CustomLoading from "../../../components/CustomLoading";
import {
  createEmployee,
  updateEmployee,
} from "../../../apis/employee/employee";

export default function CreateAndUpdateStudent({
  handleClosePopup,
  id = null,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleJobList(id)
        .then((res) => {
          setFormData({
            id: res?.id,
            title: res?.title, // REQUIRED
            location: res?.location || "test", // REQUIRED
            minimum_salary: res?.minimum_salary, // REQUIRED
            maximum_salary: res?.maximum_salary, // REQUIRED
            experience_level: res?.experience_level, // REQUIRED
            required_skills: res?.required_skills, // REQUIRED
            application_deadline: res?.application_deadline, // REQUIRED
            posted_on: res?.posted_on, // REQUIRED
            department_id: res?.department_id, // REQUIRED
            job_platforms: res?.job_platforms
              ? res?.job_platforms?.map((jp) => jp.id)
              : [],
            job_type_id: res?.job_type_id, // REQUIRED
            work_location_id: res?.work_location_id, // REQUIRED
            description: res?.description || "",
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

    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
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
    checkIsEmailExistOrNot({ email: e.target.value })
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
    createEmployee(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Student created successfully!`}
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
    updateEmployee(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Student updated successfully!`}
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
        <div className="grid grid-cols-1 gap-2">
          {/* NAME  */}
          <CustomField
            defaultValue={formData?.name}
            disable={false}
            error={errors?.name}
            fieldClassName={"w-full"}
            id={"name"}
            label={"Name"}
            name={"name"}
            onChange={handleFormChange}
            placeholder={"Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* EMAIL */}
          <CustomField
            defaultValue={formData?.email}
            disable={false}
            error={errors?.email || userEmailExist}
            fieldClassName={"w-full"}
            id={"email"}
            onBlur={handleCheckEmail}
            label={"Email"}
            name={"email"}
            onChange={handleFormChange}
            placeholder={"Email"}
            type={"email"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* PASSWORD */}
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
