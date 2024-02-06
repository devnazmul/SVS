import React, { useEffect, useState } from "react";
import Headings from "../../../../../components/Headings/Headings";
import CustomPasswordField from "../../../../../components/InputFields/CustomPasswordField";
import { changePassword } from "../../../../../apis/auth/auth";
import CustomToaster from "../../../../../components/CustomToaster";
import toast from "react-hot-toast";
import ButtonSpinner from "../../../../../components/Loaders/ButtonSpinner";

export default function ChangeProfilePassword() {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    current_password: "",
  });
  const onChangeUserData = (e) => {
    console.log({ o: "object" });
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState({});

  //   VALIDATE DATA
  const validateForm = () => {
    const newErrorsForUser = {};
    // Validate password
    if (!formData.password || formData.password.trim() === "") {
      newErrorsForUser.password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
    ) {
      newErrorsForUser.password =
        "Password must be at least 8 characters long and must be contain number, lowercase letter, uppercase letter";
    } else if (formData.password !== formData.password_confirmation) {
      newErrorsForUser.password_confirmation = `Confirm Password didn't match`;
    }

    // Validate current password
    if (!formData.current_password || formData.current_password.trim() === "") {
      newErrorsForUser.current_password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
    ) {
      newErrorsForUser.current_password =
        "Password must be at least 8 characters long and must be contain number, lowercase letter, uppercase letter";
    }

    setErrors(newErrorsForUser);

    // Return true if there are no errors
    return Object.keys(newErrorsForUser).length === 0;
  };

  const updateFunction = () => {
    setIsPendingSubmit(true);
    changePassword(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        setFormData({
          password: "",
          password_confirmation: "",
          current_password: "",
        });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Password updated successfully`}
          />
        ));
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  return (
    <div>
      <div className="py-5">
        <Headings level={2}>Change Password</Headings>
      </div>
      <div className="bg-base-300 p-5 rounded-xl border-2 border-primary-content ">
        <CustomPasswordField
          required={true}
          label={"Password"}
          id="password"
          onChange={onChangeUserData}
          value={formData?.password}
          placeholder={`Password`}
          name={`password`}
          error={errors?.password}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
        <CustomPasswordField
          required={true}
          label={"Confirm Password"}
          id="password_confirmation"
          onChange={onChangeUserData}
          value={formData?.password_confirmation}
          placeholder={`Confirm Password`}
          name={`password_confirmation`}
          error={errors?.password_confirmation}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
        <CustomPasswordField
          required={true}
          label={"Current Password"}
          id="current_password"
          onChange={onChangeUserData}
          value={formData?.current_password}
          placeholder={`Current Password`}
          name={`current_password`}
          error={errors?.current_password}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
      </div>

      <div className="flex justify-start md:justify-end my-5">
        <button
          disabled={isPendingSubmit}
          onClick={handleSubmit}
          className="btn md:btn-wide btn-primary w-full"
        >
          {isPendingSubmit ? <ButtonSpinner /> : "Change Password"}
        </button>
      </div>
    </div>
  );
}
