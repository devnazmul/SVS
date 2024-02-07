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
  getSingleStudent,
  updateSingleStudent,
} from "../../apis/student/student";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import { nationality } from "../../constant/nationality";
import { getAllStudentStatusWithoutPerPage } from "../../apis/studentStatus/studentStatus";
import { IoQrCode } from "react-icons/io5";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import GoBackButton from "../../components/GoBackButton";
import { useAuth } from "../../context/AuthContext";
import { getAllCourseTitleWithoutPerPage } from "../../apis/courseTitle/courseTitle";

export default function ViewStudent() {
  const { encId } = useParams();
  const id = decryptID(encId);

  const { user } = useAuth();

  // EDIT
  const [editModeOn, setEditModeOn] = useState(false);
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
    course_title_id: null,
    attachments: [],
  });

  // GET ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  const [url, setUrl] = useState();
  useEffect(() => {
    if (id) {
      setUrl(
        `${
          import.meta.env.VITE_LIVE_SITE_URL
        }/public/student/view/${encId}/${encryptID(user?.business?.id)}`
      );
      setIsGettingData(true);
      getSingleStudent(id)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            id: res?.id,
            first_name: res?.first_name || "",
            middle_name: "",
            last_name: res?.last_name || "",
            nationality: res?.nationality || "",
            passport_number: res?.passport_number || "",
            school_id: res?.school_id || "",
            date_of_birth: res?.date_of_birth || "",
            course_start_date: res?.course_start_date || "",
            letter_issue_date: res?.letter_issue_date || "",
            student_status_id: res?.student_status_id,
            course_title_id: res?.course_title_id,
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

  // GETTING STUDENT STATUS
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [isLoadingStudentStatuses, setIsLoadingStudentStatuses] =
    useState(true);
  const getAllStudentStatus = () => {
    setIsLoadingStudentStatuses(true);
    // GETTING STUDENT STATUS
    getAllStudentStatusWithoutPerPage()
      .then((res) => {
        setStudentStatuses(
          res
            ?.filter((ss) => ss.is_active)
            .map((ss) => ({ id: ss?.id, label: ss?.name }))
        );
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

  // GETTING COURSE TITLE
  const [courseTitle, setCourseTitle] = useState([]);
  const [isLoadingCourseTitle, setIsLoadingCourseTitle] = useState(true);
  const getAllCourseTitle = () => {
    setIsLoadingCourseTitle(true);
    // GETTING COURSE TITLE
    getAllCourseTitleWithoutPerPage()
      .then((res) => {
        setCourseTitle(
          res
            ?.filter((ct) => ct?.is_active)
            .map((ct) => ({ id: ct?.id, label: ct?.name }))
        );
        setIsLoadingCourseTitle(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingCourseTitle(false);
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
    getAllCourseTitle();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.first_name || formData.first_name.trim() === "") {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name || formData.last_name.trim() === "") {
      newErrors.last_name = "Last name is required";
    }
    // NATIONALITY
    if (!formData.nationality || formData.nationality.trim() === "") {
      newErrors.nationality = "Nationality is required";
    }
    if (!formData.passport_number || formData.passport_number.trim() === "") {
      newErrors.passport_number = "Passport number is required";
    }

    if (!formData.school_id || formData.school_id.trim() === "") {
      newErrors.school_id = "Reference is required";
    }
    if (!formData.date_of_birth || formData.date_of_birth.trim() === "") {
      newErrors.date_of_birth = "Date of birth is required";
    }
    if (
      !formData.course_start_date ||
      formData.course_start_date.trim() === ""
    ) {
      newErrors.course_start_date = "Course start date is required";
    }
    if (
      !formData.letter_issue_date ||
      formData.letter_issue_date.trim() === ""
    ) {
      newErrors.letter_issue_date = "Letter issue date is required";
    }
    if (!formData.student_status_id) {
      newErrors.student_status_id = "Student status is required";
    }
    if (!formData.course_title_id) {
      newErrors.course_title_id = "Course title is required";
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

  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleStudent(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Student updated successfully!`}
          />
        ));
        setEditModeOn(false);
      })
      .catch((error) => {
        console.log({ error });
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[STUDENT_VIEW]}>
        <div className="pb-5 overflow-x-hidden relative">
          <div className={`my-5 flex justify-between items-center`}>
            <Headings level={1} className=" font-bold my-4 text-primary">
              Student Profile
            </Headings>
            <GoBackButton />
          </div>

          <div
            className={`bg-base-300 p-5 rounded-xl border-2 border-primary shadow-lg shadow-primary-content relative`}
          >
            {/* EDIT BUTTON  */}
            {!editModeOn && (
              <div className={`flex justify-end items-center`}>
                <button
                  onClick={() => setEditModeOn(true)}
                  className={`tooltip tooltip-left tooltip-primary btn btn-primary flex items-center gap-2`}
                >
                  Edit
                </button>
              </div>
            )}

            {/* QR CODE  */}
            <div className={` justify-center items-center  flex `}>
              <div className="flex-wrap p-3 rounded-md" id="qrcode-container">
                <QRCode width={50} height={50} value={url} id="qrcode-canvas" />
              </div>
            </div>

            {/* QR CODE DOWNLOAD  */}
            <div className={`w-full  flex justify-center items-center mt-5`}>
              <button
                // data-tip="Download QR Code"
                className={`tooltip tooltip-left tooltip-primary btn btn-primary flex items-center gap-2`}
                onClick={downloadQRCode}
              >
                <IoQrCode className={`text-2xl`} /> Download
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5 mt-5 border-t border-primary-content pt-5">
              {/* FIRST NAME  */}
              <CustomField
                defaultValue={formData?.first_name}
                disable={!editModeOn}
                error={errors?.first_name}
                fieldClassName={"w-full  "}
                id={"first_name"}
                label={"First Name"}
                name={"first_name"}
                onChange={handleFormChange}
                placeholder={"First Name"}
                type={"text"}
                wrapperClassName={"w-full "}
                required={editModeOn}
              />

              {/* LAST NAME  */}
              <CustomField
                defaultValue={formData?.last_name}
                disable={!editModeOn}
                error={errors?.last_name}
                fieldClassName={"w-full"}
                id={"last_name"}
                label={"Last Name"}
                name={"last_name"}
                onChange={handleFormChange}
                placeholder={"Last Name"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={editModeOn}
              />

              {/* NATIONALITY  */}
              <CustomMultiSelect
                error={errors?.nationality}
                loading={false}
                options={nationality}
                label={
                  editModeOn ? "Select Nationality" : "Student Nationality"
                }
                // label={"Select "}
                defaultSelectedValues={nationality.filter((jt, index) => {
                  return jt?.label === formData?.nationality;
                })}
                singleSelect
                required={editModeOn}
                onSelect={(e) => {
                  setFormData({ ...formData, nationality: e[0]?.label || "" });
                }}
                disable={!editModeOn}
              />

              {/* PASSPORT NUMBER  */}
              <CustomField
                defaultValue={formData?.passport_number}
                disable={!editModeOn}
                error={errors?.passport_number}
                fieldClassName={"w-full"}
                id={"passport_number"}
                label={"Passport Number"}
                name={"passport_number"}
                onChange={handleFormChange}
                placeholder={"Passport Number"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={editModeOn}
              />

              {/* SCHOOL ID  */}
              <CustomField
                defaultValue={formData?.school_id}
                disable={!editModeOn}
                error={errors?.school_id}
                fieldClassName={"w-full"}
                id={"school_id"}
                label={"Reference"}
                name={"school_id"}
                onChange={handleFormChange}
                placeholder={"Reference"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={editModeOn}
              />

              {/* STUDENT STATUS  */}
              <CustomMultiSelect
                error={errors?.student_status_id}
                loading={isLoadingStudentStatuses || isGettingData}
                options={studentStatuses}
                label={editModeOn ? "Select Student Status" : "Student Status"}
                defaultSelectedValues={studentStatuses.filter((ss, index) => {
                  return ss?.id === formData?.student_status_id;
                })}
                singleSelect
                required={editModeOn}
                onSelect={(e) => {
                  setFormData({ ...formData, student_status_id: e[0]?.id });
                }}
                disable={!editModeOn}
              />

              {/* DATE OF BIRTH  */}
              <CustomDatePicker
                value={formData?.date_of_birth}
                disabled={!editModeOn}
                format="dd-MM-yyyy"
                error={errors?.date_of_birth}
                fieldClassName={"w-full"}
                id={"date_of_birth"}
                label={"Date Of Birth"}
                name={"date_of_birth"}
                onChange={(date) => {
                  setFormData({ ...formData, date_of_birth: date });
                }}
                top
                right
                placeholder={"Date Of Birth"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={editModeOn}
              />

              {/* STUDENT STATUS  */}
              <CustomMultiSelect
                error={errors?.course_title_id}
                loading={isLoadingStudentStatuses || isGettingData}
                options={studentStatuses}
                label={editModeOn ? "Select Student Status" : "Student Status"}
                defaultSelectedValues={studentStatuses.filter((ss, index) => {
                  return ss?.id === formData?.course_title_id;
                })}
                singleSelect
                required={editModeOn}
                onSelect={(e) => {
                  setFormData({ ...formData, course_title_id: e[0]?.id });
                }}
                disable={!editModeOn}
              />

              {/* COURSE TITLE  */}
              <CustomMultiSelect
                error={errors?.course_title_id}
                loading={isLoadingCourseTitle}
                options={courseTitle}
                label={"Select Course Title"}
                defaultSelectedValues={courseTitle.filter((ct, index) => {
                  return ct?.id === formData?.course_title_id;
                })}
                singleSelect
                required={editModeOn}
                onSelect={(e) => {
                  setFormData({
                    ...formData,
                    course_title_id: e[0]?.id || null,
                  });
                }}
                disable={!editModeOn}
              />

              {/* COURSE START DATE  */}
              <CustomDatePicker
                value={formData?.course_start_date}
                disabled={!editModeOn}
                format="dd-MM-yyyy"
                error={errors?.course_start_date}
                fieldClassName={"w-full"}
                id={"course_start_date"}
                label={"Course Start Date"}
                name={"course_start_date"}
                onChange={(date) => {
                  setFormData({ ...formData, course_start_date: date });
                }}
                top
                placeholder={"Course Start Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={editModeOn}
              />

              {/* LETTER ISSUE DATE  */}
              <CustomDatePicker
                value={formData?.letter_issue_date}
                disabled={!editModeOn}
                format="dd-MM-yyyy"
                error={errors?.letter_issue_date}
                fieldClassName={"w-full"}
                id={"letter_issue_date"}
                label={"Letter Issue Date"}
                name={"letter_issue_date"}
                onChange={(date) => {
                  setFormData({ ...formData, letter_issue_date: date });
                }}
                top
                right
                placeholder={"Letter Issue Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={editModeOn}
              />
            </div>

            {/* SAVE BUTTON  */}
            {editModeOn && (
              <div className={`flex justify-center items-center mt-10`}>
                <button
                  onClick={handleSubmit}
                  className={`tooltip w-full md:w-1/3 tooltip-left tooltip-primary btn btn-primary flex items-center gap-2`}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </CheckPermission>
    );
  }
}
