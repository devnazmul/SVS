// =====================================
// #00124
// =====================================

import React, { useEffect, useState } from "react";
import CreateUserForm from "./CreateUserForm";
import CreateBusinessForm from "./CreateBusinessForm";
import { useMutation } from "@tanstack/react-query";
import { updateSingleUserWithBusiness } from "../../apis/userAndBusiness/user";
import { useNavigate, useParams } from "react-router-dom";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import { getSingleBusiness } from "../../apis/userAndBusiness/business";
import Headings from "../../components/Headings/Headings";
import GoBackButton from "../../components/GoBackButton";
import CustomMultiStepper from "../../components/CustomMultiStepper";
import { decryptID } from "../../utils/encryptAndDecryptID";
import CheckPermission from "../../CheckPermission";
import { BUSINESS_UPDATE } from "../../constant/permissions";

export default function UpdateBusiness() {
  const { encId } = useParams();
  const id = decryptID(encId);
  // STEP COUNT
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  // MUTATION
  const { mutateAsync, isError, isSuccess, isPending, error, data } =
    useMutation({
      mutationKey: ["updateUserWithBusiness"],
      mutationFn: (data) => updateSingleUserWithBusiness(data),
      onSuccess: (res) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Business updated successfully!`}
          />
        ));
        navigate("/business/all-business");
      },
      onError: (error) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00124 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      },
    });

  const [isDataPending, setIsDataPending] = useState(true);
  const [userData, setUserData] = useState({
    image: "",
    first_Name: "", //REQUIRED
    last_Name: "", //REQUIRED
    email: "", //REQUIRED
    phone: "",
    send_password: 0,
  });
  const [businessData, setBusinessData] = useState({
    name: "", //REQUIRED
    email: "",
    phone: "",
    about: "",
    web_page: "",
    additional_information: "",
    address_line_1: "", //REQUIRED
    address_line_2: "",
    lat: "23.55635642174789", //REQUIRED
    long: "90.15000452359874", //REQUIRED
    country: "Bangladesh", //REQUIRED
    city: "Dhaka", //REQUIRED
    currency: "BDT", //REQUIRED
    postcode: "", //REQUIRED
    logo: "",
    image: "",
    images: [],
  });
  const [businessTimingData, setBusinessTimingData] = useState([]);

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

          setBusinessTimingData(res?.times);

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

  useEffect(() => {
    console.log({ userData });
  }, [userData]);

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

  const [errorsForUser, setErrorsForUser] = useState({});
  const [errorsForBusiness, setErrorsForBusiness] = useState({});
  //   VALIDATE DATA
  //   VALIDATE DATA
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
      newErrorsForUser.last_Name = "First name is required";
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
    // if (!userData.password || userData.password.trim() === "") {
    //   newErrorsForUser.password = "Password is required";
    // } else if (
    //   !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(userData.password)
    // ) {
    //   newErrorsForUser.password =
    //     "Password must be at least 8 characters long and must be contain number, lowercase letter, uppercase letter";
    // } else if (userData.password !== userData.password_confirmation) {
    //   newErrorsForUser.password_confirmation = `Password didn't match`;
    // }

    setErrorsForUser(newErrorsForUser);

    // Return true if there are no errors
    return Object.keys(newErrorsForUser).length === 0;
  };

  const validateForm = () => {
    const newErrorsForBusiness = {};

    // BUSINESS DATA VALIDATION
    // =============================
    // Validate business name
    if (!businessData.name || businessData.name.trim() === "") {
      newErrorsForBusiness.name = "Business name is required";
    }

    // Validate address
    if (
      !businessData.address_line_1 ||
      businessData.address_line_1.trim() === ""
    ) {
      newErrorsForBusiness.address_line_1 = "Address is required";
    }
    // Validate lat
    if (!businessData.lat || businessData.lat.trim() === "") {
      newErrorsForBusiness.lat = "Lat is required";
    }
    // Validate long
    if (!businessData.long || businessData.long.trim() === "") {
      newErrorsForBusiness.long = "Long is required";
    }
    // Validate country
    if (!businessData.country || businessData.country.trim() === "") {
      newErrorsForBusiness.country = "Country is required";
    }
    // Validate city
    if (!businessData.city || businessData.city.trim() === "") {
      newErrorsForBusiness.city = "City is required";
    }
    // Validate currency
    if (!businessData.currency || businessData.currency.trim() === "") {
      newErrorsForBusiness.currency = "Currency is required";
    }
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

    // Return true if there are no errors
    return Object.keys(newErrorsForBusiness).length === 0;
  };

  // const handleSubmit = async () => {
  //   if (validateForm()) {
  //     mutateAsync({
  //       user: userData,
  //       business: businessData,
  //     });
  //   }
  // };

  const handleSubmit = async () => {
    if (validateForm()) {
      mutateAsync({
        user: userData,
        business: businessData,
        times: businessTimingData,
      });
    }
  };

  const handleStepChange = (step) => {
    console.log({ step: validateForm1() });
    console.log({ errorsForUser });
    if (validateForm1()) {
      setStep(step);
    }
  };
  return (
    <CheckPermission permissionArray={[BUSINESS_UPDATE]}>
      <div className="pb-5">
        {isDataPending ? (
          <div className="h-[80vh] w-full flex justify-center items-center">
            <span className="loading loading-spinner text-primary loading-lg" />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <Headings level={1}>Edit Business</Headings>
              <GoBackButton />
            </div>

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
                ]}
                currentStep={step}
              />
            </div>

            {step === 1 && (
              <>
                {/* USER DETAILS  */}
                <CreateUserForm
                  type="update"
                  errors={errorsForUser}
                  onChangeUserData={onChangeUserData}
                  userData={userData}
                  setUserData={setUserData}
                />
                <div className="flex w-full justify-center items-center mt-5">
                  <button
                    disabled={isPending}
                    onClick={() => handleStepChange(2)}
                    className="btn w-full md:btn-wide btn-primary"
                  >
                    {isPending ? <ButtonSpinner /> : "Next"}
                  </button>
                </div>
              </>
            )}

            {/* BUSINESS DETAILS  */}
            {step === 2 && (
              <>
                <CreateBusinessForm
                  type="update"
                  errors={errorsForBusiness}
                  onChangeBusinessData={onChangeBusinessData}
                  businessData={businessData}
                  setBusinessData={setBusinessData}
                />

                <div className="flex w-full justify-center gap-2 items-center mt-5">
                  <button
                    disabled={isPending}
                    onClick={() => handleStepChange(1)}
                    className="btn w-full md:btn-wide btn-primary"
                  >
                    {"Go Back"}
                  </button>
                  <button
                    disabled={isPending}
                    onClick={handleSubmit}
                    className="btn w-full md:btn-wide btn-primary"
                  >
                    {isPending ? <ButtonSpinner /> : "Update"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </CheckPermission>
  );
}
