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
import { decryptID, encryptID } from "../../utils/encryptAndDecryptID";
import CheckPermission from "../../CheckPermission";
import { STUDENT_VIEW } from "../../constant/permissions";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import {
  getAllStudents,
  getAllStudentsClient,
  getAllStudentsWithoutPerPage,
  getSingleStudent,
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

export default function StudentVerification() {
  // FORM DATA
  const [formData, setFormData] = useState();
  const [isFirst, setIsFirst] = useState(true);

  // GET ALL DATA
  const [isGettingData, setIsGettingData] = useState(false);
  const [url, setUrl] = useState(``);
  const [data, setData] = useState({
    ref: "",
    dob: "",
  });

  useEffect(() => {
    if (formData?.id) {
      setUrl(
        `${import.meta.env.VITE_LIVE_SITE_URL}/public/student/view/${encryptID(
          formData?.id
        )}`
      );
    }
    console.log({ formData });
  }, [formData]);

  const [errors, setErrors] = useState({});

  // GETTING STUDENT STATUS
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [isLoadingStudentStatuses, setIsLoadingStudentStatuses] =
    useState(true);
  const getAllStudentStatus = () => {
    setIsLoadingStudentStatuses(true);
    // GETTING STUDENT STATUS
    getAllStudentStatusWithoutPerPagePublic({ business_id: 2 })
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

  // CHANGE DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const searchFunction = () => {
    setIsFirst(false);
    setIsGettingData(true);
    getAllStudentsClient({ reference: data?.ref, date_of_birth: data?.dob })
      .then((res) => {
        console.log({ res });
        setFormData((prev) => {
          if (res?.data?.length > 0) {
            return {
              ...prev,
              id: res?.data[0]?.id,
              first_name: res?.data[0]?.first_name || "",
              middle_name: "",
              last_name: res?.data[0]?.last_name || "",
              nationality: res?.data[0]?.nationality || "",
              passport_number: res?.data[0]?.passport_number || "",
              school_id: res?.data[0]?.school_id || "",
              date_of_birth: res?.data[0]?.date_of_birth || "",
              course_start_date: res?.data[0]?.course_start_date || "",
              letter_issue_date: res?.data[0]?.letter_issue_date || "",
              student_status_id: res?.data[0]?.student_status_id,
            };
          } else {
            return {};
          }
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
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE REF
    if (!data.ref || data.ref.trim() === "") {
      newErrors.ref = "Student Reference is required";
    }
    // VALIDATE DOB
    if (!data.dob) {
      newErrors.dob = "Student Date of birth is required";
    }

    setErrors(newErrors);
    console.log({ newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (validateForm()) {
      searchFunction();
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
    <div className="pb-5">
      <div className={`my-5 flex justify-start items-center`}>
        <Headings level={1} className=" font-bold my-4 text-primary">
          Student Verification
        </Headings>
        {/* <GoBackButton /> */}
      </div>

      {/* VERIFICATION FORM  */}
      <div
        className={`flex flex-col md:flex-row justify-between items-start gap-5`}
      >
        {/* SCHOOL ID  */}
        <CustomField
          defaultValue={data?.ref}
          error={errors?.ref}
          fieldClassName={"w-full"}
          id={"school_id"}
          label={"Student Reference"}
          name={"ref"}
          onChange={handleFormChange}
          placeholder={"Student Reference"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* DATE OF BIRTH  */}
        <CustomDatePicker
          value={data?.dob}
          format="dd-MM-yyyy"
          error={errors?.dob}
          fieldClassName={"w-full"}
          id={"date_of_birth"}
          label={"Date Of Birth"}
          name={"dob"}
          onChange={(date) => {
            setData({ ...data, dob: date });
          }}
          right
          placeholder={"Date Of Birth"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        <button
          onClick={handleSubmit}
          className="btn w-full md:w-32 mt-[2.2rem] btn-md btn-primary"
        >
          Search
        </button>
      </div>

      {/* <QRC}ode id="qr-code-canvas" /> */}
      <div>
        {isGettingData ? (
          <CustomLoading h="h-[200px]" />
        ) : (
          <>
            {formData?.id ? (
              <div
                className={` bg-base-300 p-5 rounded-xl border-2 border-primary shadow-lg shadow-primary-content mt-10`}
              >
                <Headings level={2} className=" font-bold my-4 text-primary">
                  Student Details
                </Headings>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5 mt-5">
                  <CustomField
                    defaultValue={`${formatRole(formData?.first_name)} ${
                      formData?.middle_name
                        ? formatRole(formData?.middle_name)
                        : ""
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
                    defaultSelectedValues={studentStatuses.filter(
                      (ss, index) => {
                        return ss?.id === formData?.student_status_id;
                      }
                    )}
                    singleSelect
                    // required
                    onSelect={(e) => {
                      setFormData({
                        ...formData,
                        student_status_id: e[0]?.id,
                      });
                    }}
                    disable
                  />
                </div>
              </div>
            ) : (
              <div className={`flex justify-center items-center h-[200px]`}>
                {!isFirst ? (
                  <Headings className={`text-primary`} level={2}>
                    No Student Found!
                  </Headings>
                ) : (
                  ""
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
