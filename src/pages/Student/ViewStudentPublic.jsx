import React, { useEffect, useRef, useState } from "react";
import { getSingleBusiness } from "../../apis/userAndBusiness/business";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import { useParams } from "react-router-dom";
import CustomField from "../../components/InputFields/CustomField";
import Headings from "../../components/Headings/Headings";
import ButtonLoading from "../../components/ButtonLoading";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { decryptID } from "../../utils/encryptAndDecryptID";
import CheckPermission from "../../CheckPermission";
import { STUDENT_VIEW } from "../../constant/permissions";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import {
  getAllStudents,
  getSingleStudent,
  getSingleStudentForPublic,
} from "../../apis/student/student";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import { nationality } from "../../constant/nationality";
import {
  getAllStudentStatusWithoutPerPage,
  getAllStudentStatusWithoutPerPagePublic,
} from "../../apis/studentStatus/studentStatus";
import { IoQrCode } from "react-icons/io5";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import GoBackButton from "../../components/GoBackButton";
import { formatRole } from "../../utils/formatRole";

export default function ViewStudentPublic() {
  const { encId, businessEncId } = useParams();

  const id = decryptID(encId);
  const business_id = decryptID(businessEncId);

  // FORM DATA
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    nationality: "",
    passport_number: "",
    school_id: "",
    date_of_birth: "",
    course_start_date: "",
    letter_issue_date: "",
    student_status_id: null,
    attachments: [],
  });

  // GET ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleStudentForPublic(id)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            id: res?.id,
            first_name: res?.first_name || "",
            middle_name: res?.middle_name || "",
            last_name: res?.last_name || "",
            nationality: res?.nationality || "",
            passport_number: res?.passport_number || "",
            school_id: res?.school_id || "",
            date_of_birth: res?.date_of_birth || "",
            course_start_date: res?.course_start_date || "",
            letter_issue_date: res?.letter_issue_date || "",
            student_status_id: res?.student_status_id,
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
  const [errors, setErrors] = useState({});

  // GETTING STUDENT STATUS
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [isLoadingStudentStatuses, setIsLoadingStudentStatuses] =
    useState(true);
  const getAllStudentStatus = () => {
    setIsLoadingStudentStatuses(true);
    // GETTING STUDENT STATUS
    getAllStudentStatusWithoutPerPagePublic({ business_id: business_id })
      .then((res) => {
        setStudentStatuses(res.map((ss) => ({ id: ss?.id, label: ss?.name })));
        setIsLoadingStudentStatuses(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingStudentStatuses(false);
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
    getAllStudentStatus();
  }, []);

  // //   CHANGE TIMING DATA
  // const onChangeTimingData = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;

  //   setTimingData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  // // VALIDATION
  // const [errorsForUser, setErrorsForUser] = useState({});
  // const [errorsForBusiness, setErrorsForBusiness] = useState({});
  // const [errorsForTiming, setErrorsForTiming] = useState({});
  // const validateUser = () => {
  //   const newErrorsForUser = {};
  //   // USER DATA VALIDATION
  //   // =============================
  //   // Validate first name
  //   if (
  //     !formDataForUser.first_Name ||
  //     formDataForUser.first_Name.trim() === ""
  //   ) {
  //     newErrorsForUser.first_Name = "First name is required";
  //   }
  //   // Validate last name
  //   if (!formDataForUser.last_Name || formDataForUser.last_Name.trim() === "") {
  //     newErrorsForUser.last_Name = "First name is required";
  //   }
  //   // Validate email
  //   if (!formDataForUser.email || formDataForUser.email.trim() === "") {
  //     newErrorsForUser.email = "Email is required";
  //   } else if (
  //     !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
  //       formDataForUser.email.trim()
  //     )
  //   ) {
  //     newErrorsForUser.email = "Invalid email";
  //   }
  //   // Validate phone
  //   if (formDataForUser.phone) {
  //     if (formDataForUser?.phone.toString().split("").length !== 11) {
  //       newErrorsForUser.phone = "Phone must be 11 digit";
  //     }
  //   }
  //   setErrorsForUser(newErrorsForUser);
  //   // Return true if there are no errors
  //   return Object.keys(newErrorsForUser).length === 0;
  // };
  // const validateBusiness = () => {
  //   const newErrorsForBusiness = {};
  //   // Validate business name
  //   if (!formDataForBusiness.name || formDataForBusiness.name.trim() === "") {
  //     newErrorsForBusiness.name = "Business name is required";
  //   }
  //   // Validate address
  //   if (
  //     !formDataForBusiness.address_line_1 ||
  //     formDataForBusiness.address_line_1.trim() === ""
  //   ) {
  //     newErrorsForBusiness.address_line_1 = "Address is required";
  //   }
  //   // Validate lat
  //   if (!formDataForBusiness.lat || formDataForBusiness.lat.trim() === "") {
  //     newErrorsForBusiness.lat = "Lat is required";
  //   }
  //   // Validate long
  //   if (!formDataForBusiness.long || formDataForBusiness.long.trim() === "") {
  //     newErrorsForBusiness.long = "Long is required";
  //   }
  //   // Validate country
  //   if (
  //     !formDataForBusiness.country ||
  //     formDataForBusiness.country.trim() === ""
  //   ) {
  //     newErrorsForBusiness.country = "Country is required";
  //   }
  //   // Validate city
  //   if (!formDataForBusiness.city || formDataForBusiness.city.trim() === "") {
  //     newErrorsForBusiness.city = "City is required";
  //   }
  //   // Validate currency
  //   if (
  //     !formDataForBusiness.currency ||
  //     formDataForBusiness.currency.trim() === ""
  //   ) {
  //     newErrorsForBusiness.currency = "Currency is required";
  //   }
  //   // Validate postcode
  //   if (
  //     !formDataForBusiness.postcode ||
  //     formDataForBusiness.postcode.trim() === ""
  //   ) {
  //     newErrorsForBusiness.postcode = "Postcode is required";
  //   }
  //   // Validate phone
  //   if (formDataForBusiness.phone) {
  //     if (formDataForBusiness?.phone.toString().split("").length !== 11) {
  //       newErrorsForBusiness.phone = "Business phone must be 11 digit";
  //     }
  //   }
  //   // Validate email
  //   if (formDataForBusiness.email) {
  //     if (
  //       !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
  //         formDataForBusiness.email.trim()
  //       )
  //     ) {
  //       newErrorsForBusiness.email = "Invalid email";
  //     }
  //   }
  //   // BUSINESS WEB PAGE
  //   if (formDataForBusiness.web_page) {
  //     const urlPattern =
  //       /^https?:\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}(\/[A-Za-z0-9-._%+&=]*)*$/i;
  //     if (!urlPattern.test(formDataForBusiness.web_page.trim())) {
  //       newErrorsForBusiness.web_page = "Invalid web page URL";
  //     }
  //   }
  //   setErrorsForBusiness(newErrorsForBusiness);
  //   // Return true if there are no errors
  //   return Object.keys(newErrorsForBusiness).length === 0;
  // };

  // // FORM CHANGE HANDLE
  // const handleUserFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormDataForUser({
  //     ...formDataForUser,
  //     [name]: value,
  //   });
  // };
  // const handleBusinessFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormDataForBusiness({
  //     ...formDataForBusiness,
  //     [name]: value,
  //   });
  // };
  // // HANDLE SAVE DATA
  // const [isPendingSubmit, setIsPendingSubmit] = useState(false);

  // const handleSaveData = () => {
  //   if (validateUser() && validateBusiness() && validateTiming()) {
  //     setIsPendingSubmit(true);
  //     updateSingleUserWithBusiness({
  //       user: formDataForUser,
  //       business: formDataForBusiness,
  //       times: formDataForBusinessTiming,
  //     })
  //       .then((res) => {
  //         setIsPendingSubmit(false);
  //         setIsEditEnabled(false);
  //       })
  //       .catch((error) => {
  //         console.log({ 188: error });
  //         setIsPendingSubmit(false);
  //         toast.custom((t) => (
  //           <CustomToaster
  //             t={t}
  //             type={"error"}
  //             text={`ID: #00119 - ${error?.response?.data?.message}`}
  //             errors={error?.response?.data?.errors}
  //           />
  //         ));
  //       });
  //   }
  // };
  const qrCodeRef = useRef(null);

  const downloadQRCode = async () => {
    const qrCodeElement = document.getElementById("qrcode-container");

    if (qrCodeElement) {
      try {
        const canvas = await html2canvas(qrCodeElement);
        const dataURL = canvas.toDataURL("image/png");

        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "qrcode.png";
        a.click();
      } catch (error) {
        console.error("Error generating QR code image:", error);
      }
    }
  };

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      // <CheckPermission permissionArray={[STUDENT_VIEW]}>
      <div className=" overflow-x-hidden relative">
        <div className={`mb-5 flex justify-start items-center`}>
          <Headings level={1} className=" font-bold my-4 text-primary">
            Student Details
          </Headings>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5 bg-base-300 p-5 rounded-xl border-2 border-primary shadow-lg shadow-primary-content">
          {/* FIRST NAME  */}
          <CustomField
            defaultValue={`${formatRole(formData?.first_name)} ${
              formData?.middle_name ? formatRole(formData?.middle_name) : ""
            } ${formData?.last_name}`}
            disable={true}
            error={errors?.first_name}
            fieldClassName={"w-full "}
            id={"first_name"}
            label={"Name"}
            name={"first_name"}
            onChange={() => {}}
            placeholder={"Name"}
            type={"text"}
            wrapperClassName={"w-full "}
            required={true}
          />

          {/* SCHOOL ID  */}
          <CustomField
            defaultValue={formData?.school_id}
            disable={true}
            error={errors?.school_id}
            fieldClassName={"w-full"}
            id={"school_id"}
            label={"Reference"}
            name={"school_id"}
            onChange={() => {}}
            placeholder={"Reference"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* STUDENT STATUS  */}
          <CustomMultiSelect
            error={errors?.student_status_id}
            loading={isLoadingStudentStatuses || isGettingData}
            options={studentStatuses}
            label={"Student Status"}
            defaultSelectedValues={studentStatuses.filter((ss, index) => {
              return ss?.id === formData?.student_status_id;
            })}
            singleSelect
            // required
            onSelect={(e) => {
              setFormData({ ...formData, student_status_id: e[0]?.id });
            }}
            disable
          />
        </div>
      </div>
      // </CheckPermission>
    );
  }
}
