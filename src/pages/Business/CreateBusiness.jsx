// =====================================
// #00121
// =====================================

import React, { useEffect, useState } from "react";
import CreateUserForm from "./CreateUserForm";
import CreateBusinessForm from "./CreateBusinessForm";
import { useMutation } from "@tanstack/react-query";
import { createUserWithBusiness } from "../../apis/userAndBusiness/user";
import { useNavigate, useParams } from "react-router-dom";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomMultiStepper from "../../components/CustomMultiStepper";
import CreateBusinessTiming from "./CreateBusinessTiming";
import { compareTimes } from "../../utils/compareTimes";
import { compareDates } from "../../utils/compareDates";
import { checkIsEmailExistOrNot } from "../../apis/auth/auth";
import { BUSINESS_CREATE } from "../../constant/permissions";
import CheckPermission from "../../CheckPermission";
import { decryptID } from "../../utils/encryptAndDecryptID";
import { getSingleBusiness } from "../../apis/userAndBusiness/business";

export default function CreateBusiness() {
  const { encId } = useParams();
  let id = null;
  if (encId) {
    id = decryptID(encId);
  }

  const navigate = useNavigate();
  // STEP COUNT
  const [step, setStep] = useState(1);

  // MUTATION
  const { mutateAsync, isError, isSuccess, isPending, error, data } =
    useMutation({
      mutationKey: ["createUserWithBusiness"],
      mutationFn: (data) => createUserWithBusiness(data),
      onSuccess: (res) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Business created successfully!`}
          />
        ));
        navigate("/business/all-business");
      },
      onError: (error) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00121 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      },
    });

  const [userData, setUserData] = useState({
    image: "",
    first_Name: "", //REQUIRED
    last_Name: "", //REQUIRED
    email: "", //REQUIRED
    phone: "",
    password: "", //REQUIRED
    password_confirmation: "", //REQUIRED
    send_password: 0,
    // gender: "male", // REQUIRED
  });

  const [businessData, setBusinessData] = useState({
    name: "", //REQUIRED
    email: "",
    phone: "",
    web_page: "",
    address_line_1: "", //REQUIRED
    address_line_2: "",
    lat: "", //REQUIRED
    long: "", //REQUIRED
    country: "", //REQUIRED
    city: "", //REQUIRED
    currency: "£", //REQUIRED
    postcode: "", //REQUIRED
    type: "regular",
    logo: "",
    image: "",
    images: [],
  });

  const [timingData, setTimingData] = useState([
    {
      day: 0,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: true,
    },
    {
      day: 1,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 2,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 3,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 4,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 5,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
    {
      day: 6,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: false,
    },
  ]);

  // FOR UPDATE
  const [isLoading, setIsLoading] = useState(!!id);

  // GET ALL DATA
  useEffect(() => {
    if (id) {
      setIsDataPending(true);
      getSingleBusiness(id)
        .then((res) => {
          console.log({ r: res });
          setUserData({
            id: res?.owner?.id,
            image: res?.owner?.image,
            first_Name: res?.owner?.first_Name, //REQUIRED
            last_Name: res?.owner?.last_Name, //REQUIRED
            email: res?.owner?.email, //REQUIRED
            phone: res?.owner?.phone,
          });
          setBusinessData({
            id: res?.id,
            name: res?.name, //REQUIRED
            email: res?.email,
            phone: res?.phone,

            about: res?.about,
            web_page: res?.web_page,
            additional_information: res?.additional_information,

            address_line_1: res?.address_line_1, //REQUIRED
            address_line_2: res?.address_line_2,
            lat: res?.lat, //REQUIRED
            long: res?.long, //REQUIRED
            country: res?.country, //REQUIRED
            city: res?.city, //REQUIRED
            currency: "£", //REQUIRED
            postcode: res?.postcode, //REQUIRED

            logo: res?.logo,
            image: res?.image,
            images: res?.images,
          });
          // setTimingData(res?.)
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

  //   CHANGE USER DATA
  const onChangeUserData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   CHANGE BUSINESS DATA
  const onChangeBusinessData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setBusinessData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   CHANGE TIMING DATA
  const onChangeTimingData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setTimingData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [errorsForUser, setErrorsForUser] = useState({});
  const [errorsForBusiness, setErrorsForBusiness] = useState({});
  const [errorsForTiming, setErrorsForTiming] = useState({});
  //   VALIDATE USER DATA
  const validateForm1 = () => {
    const newErrorsForUser = {};

    // USER DATA VALIDATION
    // =============================
    // Validate first name
    if (!userData.first_Name || userData.first_Name.trim() === "") {
      newErrorsForUser.first_Name = "First name is required";
    }
    // Validate last name
    if (!userData.last_Name || userData.last_Name.trim() === "") {
      newErrorsForUser.last_Name = "Last name is required";
    }
    // Validate email
    if (!userData.email || userData.email.trim() === "") {
      newErrorsForUser.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        userData.email.trim()
      )
    ) {
      newErrorsForUser.email = "Invalid email";
    }
    // Validate phone
    if (userData.phone) {
      if (userData?.phone.toString().split("").length !== 11) {
        newErrorsForUser.phone = "Phone must be 11 digit";
      }
    }
    // Validate password
    if (!userData.password || userData.password.trim() === "") {
      newErrorsForUser.password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(userData.password)
    ) {
      newErrorsForUser.password =
        "Password must be at least 8 characters long and must be contain number, lowercase letter, uppercase letter";
    }

    setErrorsForUser(newErrorsForUser);
    console.log({ newErrorsForUser });
    // Return true if there are no errors
    return Object.keys(newErrorsForUser).length === 0;
  };

  //   VALIDATE BUSINESS DATA
  const validateForm = () => {
    const newErrorsForBusiness = {};

    // BUSINESS DATA VALIDATION
    // =============================
    // Validate business name
    if (!businessData.name || businessData.name.trim() === "") {
      newErrorsForBusiness.name = "Business name is required";
    }
    // Validate email
    if (!businessData.email || businessData.email.trim() === "") {
      newErrorsForBusiness.email = "Email name is required";
    }
    // Validate address
    if (
      !businessData.address_line_1 ||
      businessData.address_line_1.trim() === ""
    ) {
      newErrorsForBusiness.address_line_1 = "Address is required";
    }
    // // Validate lat
    // if (!businessData.lat || businessData.lat.trim() === "") {
    //   newErrorsForBusiness.lat = "Lat is required";
    // }
    // // Validate long
    // if (!businessData.long || businessData.long.trim() === "") {
    //   newErrorsForBusiness.long = "Long is required";
    // }
    // Validate country
    if (!businessData.country || businessData.country.trim() === "") {
      newErrorsForBusiness.country = "Country is required";
    }
    // Validate city
    if (!businessData.city || businessData.city.trim() === "") {
      newErrorsForBusiness.city = "City is required";
    }
    // Validate currency
    // if (!businessData.currency || businessData.currency.trim() === "") {
    //   newErrorsForBusiness.currency = "Currency is required";
    // }
    // Validate postcode
    if (!businessData.postcode || businessData.postcode.trim() === "") {
      newErrorsForBusiness.postcode = "Postcode is required";
    }
    // Validate phone
    if (businessData.phone) {
      if (businessData?.phone.toString().split("").length !== 11) {
        newErrorsForBusiness.phone = "Business phone must be 11 digit";
      }
    }

    // Validate email
    if (businessData.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          businessData.email.trim()
        )
      ) {
        newErrorsForBusiness.email = "Invalid email";
      }
    }

    // BUSINESS WEB PAGE
    if (businessData.web_page) {
      const urlPattern =
        /^https?:\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}(\/[A-Za-z0-9-._%+&=]*)*$/i;
      if (!urlPattern.test(businessData.web_page.trim())) {
        newErrorsForBusiness.web_page = "Invalid web page URL";
      }
    }

    setErrorsForBusiness(newErrorsForBusiness);
    console.log({ newErrorsForBusiness });
    // Return true if there are no errors
    return Object.keys(newErrorsForBusiness).length === 0;
  };

  const validateForm2 = () => {
    const newErrors = {};

    timingData.forEach((detail, index) => {
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

  const handleSubmit = async () => {
    if (validateForm2()) {
      console.log("dddd");
      mutateAsync({
        user: userData,
        business: businessData,
        times: timingData,
      });
    }
  };

  const [userEmailExist, setUserEmailExist] = useState("");
  const [businessEmailExist, setBusinessEmailExist] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const handleCheckUserEmail = (e) => {
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
    false;
  };
  const handleCheckBusinessEmail = (e) => {
    setIsCheckingEmail(true);
    checkIsEmailExistOrNot({ email: e.target.value })
      .then((res) => {
        if (res?.data) {
          setBusinessEmailExist("Email already exist!");
        } else {
          setBusinessEmailExist("");
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
  const handleStepChange = (step) => {
    if (step === 2 || step === 1) {
      if (step === 1) {
        // FOR STEP 1
        if (validateForm1()) {
          setStep(step);
        }
      } else {
        // FOR STEP 2
        if (validateForm1() && userEmailExist === "") {
          setStep(step);
        }
      }
    } else {
      // FOR STEP 3
      if (validateForm() && businessEmailExist === "") {
        setStep(step);
      }
    }
  };
  return (
    <CheckPermission permissionArray={[BUSINESS_CREATE]}>
      <div className="pb-5">
        <h1 className="text-2xl font-medium mb-5">Create Business</h1>

        {/* STEPPER  */}
        <div className="w-full flex justify-center items-center mb-5">
          <CustomMultiStepper
            steps={[
              {
                serial: 1,
                id: 1,
                title: "User Info",
                onCLickHandler: () => {
                  setStep(1);
                },
              },
              {
                serial: 2,
                id: 2,
                title: "Business Info",
                onCLickHandler: () => {
                  if (validateForm1()) {
                    setStep(2);
                  }
                },
              },
              {
                serial: 3,
                id: 2,
                title: "Business Timing",
                onCLickHandler: () => {
                  if (validateForm()) {
                    setStep(3);
                  }
                },
              },
            ]}
            currentStep={step}
          />
        </div>

        {/* USER DETAILS  */}
        {step === 1 && (
          <>
            <CreateUserForm
              userEmailExist={userEmailExist}
              handleCheckEmail={handleCheckUserEmail}
              type="create"
              errors={errorsForUser}
              onChangeUserData={onChangeUserData}
              userData={userData}
              setUserData={setUserData}
            />
            <div className="flex w-full justify-center items-center mt-5">
              <button
                disabled={isPending || isCheckingEmail}
                onClick={() => handleStepChange(2)}
                className="btn w-full md:btn-wide btn-primary"
              >
                {"Next"}
              </button>
            </div>
          </>
        )}

        {/* BUSINESS DETAILS  */}
        {step === 2 && (
          <>
            <CreateBusinessForm
              businessEmailExist={businessEmailExist}
              handleCheckEmail={handleCheckBusinessEmail}
              type="create"
              errors={errorsForBusiness}
              onChangeBusinessData={onChangeBusinessData}
              businessData={businessData}
              setBusinessData={setBusinessData}
            />
            <div className="flex w-full flex-col md:flex-row justify-center items-center gap-2 mt-5">
              <button
                disabled={isPending || isCheckingEmail}
                onClick={() => handleStepChange(1)}
                className="btn w-full md:btn-wide btn-primary"
              >
                {"Back"}
              </button>
              <button
                disabled={isPending || isCheckingEmail}
                onClick={() => handleStepChange(3)}
                className="btn w-full md:btn-wide btn-primary"
              >
                {"Next"}
              </button>
            </div>
          </>
        )}

        {/* BUSINESS TIMING  */}
        {step === 3 && (
          <>
            <CreateBusinessTiming
              type="create"
              errors={errorsForTiming}
              onChangeTimingData={onChangeTimingData}
              timingData={timingData}
              setTimingData={setTimingData}
            />
            <div className="flex w-full justify-center items-center gap-2 mt-5 flex-col md:flex-row">
              <button
                disabled={isPending}
                onClick={() => handleStepChange(2)}
                className="btn w-full md:btn-wide btn-primary"
              >
                {"Back"}
              </button>
              <button
                disabled={isPending}
                onClick={handleSubmit}
                className="btn w-full md:btn-wide btn-primary"
              >
                {isPending ? <ButtonSpinner /> : "Create"}
              </button>
            </div>
          </>
        )}
      </div>
    </CheckPermission>
  );
}
