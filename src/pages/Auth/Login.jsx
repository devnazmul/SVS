// =====================================
// #00118
// =====================================

import React, { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { login } from "../../apis/auth/auth";
import CustomToaster from "../../components/CustomToaster";
import { AuthContext, useNav } from "../../context/AuthContext";
import CustomPassWordInput from "../../components/CustomPassWordInput";
import { useMutation } from "@tanstack/react-query";
import CustomLoading from "../../components/CustomLoading";
import CustomField from "../../components/InputFields/CustomField";
import CustomPasswordField from "../../components/InputFields/CustomPasswordField";

export default function Login() {
  const { setIsNavOpen } = useNav();
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const intendedPath = localStorage.getItem("intendedPath");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // MUTATION
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      const res = data.data;
      localStorage.setItem("userData", JSON.stringify(res));
      localStorage.setItem(
        "permissions",
        JSON.stringify(res?.roles[0]?.permissions.map((p) => p.name))
      );
      localStorage.setItem("token", res?.token);

      setIsAuthenticated(true);
      setIsNavOpen(true);

      if (intendedPath) {
        navigate(`${intendedPath}`);
      } else {
        navigate("/");
      }
    },

    onError: (error) => {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          text={`ID: #00118 - ${error?.response?.data?.message}`}
          errors={error?.response?.data?.errors}
        />
      ));
    },
  });

  // CHANGE FIELD CONTENT
  const onChangeFormData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    // Validate password
    // if (!formData.password || formData.password.trim() === "") {
    //   newErrors.password = "Password is required";
    // } else if (
    //   !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
    // ) {
    //   newErrors.password =
    //     "Password must be at least 8 characters long and contain at least 1 number, 1 lowercase letter, and 1 uppercase letter";
    // }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutateAsync(formData);
    }
  };

  // const history = useHistory();
  const [pageLoading, setPageLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setPageLoading(true);
      setIsAuthenticated(true);

      if (intendedPath) {
        setIsNavOpen(true);
        navigate(`${intendedPath}`);
        setPageLoading(false);
      } else {
        setIsNavOpen(true);
        navigate("/");
        setPageLoading(false);
      }
    } else {
      setPageLoading(false);
    }
  }, [isAuthenticated]);

  if (pageLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="w-full h-screen bg-base-300 flex flex-col-reverse md:flex-row justify-center items-center">
        <div className="w-full md:w-2/5 h-2/3 md:h-full flex flex-col justify-center items-center gap-5 px-5 py-2">
          <div className={`card w-full sm:w-full bg-base-300 shadow-xl`}>
            <div className="card-body gap-0">
              <h2 className="font-semibold text-3xl text-left">Login</h2>
              <p className="text-left  text-sm my-3">
                Want to manage your employees? Please login!
              </p>
              <div className="h-full  w-full">
                <CustomField
                  id={"email"}
                  label={"Email"}
                  required={true}
                  type={"email"}
                  name={"email"}
                  onChange={onChangeFormData}
                  value={formData?.email}
                  placeholder={"Email"}
                  error={errors?.email}
                  wrapperClassName={`w-full`}
                  fieldClassName={`w-full`}
                />
                <CustomPasswordField
                  required={true}
                  label={"Password"}
                  id="password"
                  onChange={onChangeFormData}
                  value={formData?.password}
                  placeholder={`Password`}
                  name={`password`}
                  error={errors?.password}
                  wrapperClassName={`w-full`}
                  fieldClassName={`w-full`}
                />

                <NavLink
                  className={"text-primary  mt-3 block"}
                  to={`/auth/forgot-password`}
                >
                  Forgot password?
                </NavLink>
              </div>

              <div className="card-actions justify-end  mt-5">
                <button
                  disabled={isPending}
                  onClick={handleSubmit}
                  className="btn btn-primary transition-all duration-200 w-full text-base-100"
                >
                  {isPending ? (
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className=" w-full md:w-3/5 h-1/3 md:h-full px-0  py-5 md:py-0 md:px-10 lg:px-32 bg-primary flex justify-center items-center rounded-b-xl md:rounded-bl-[150px]">
          <img className="h-full w-full" src="/assets/loginImage.svg" alt="" />
        </div>
      </div>
    );
  }
}
