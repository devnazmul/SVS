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
import { getAllCourseTitleWithoutPerPagePublic } from "../../apis/courseTitle/courseTitle";

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
    course_title_id: null,
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

  // GETTING COURSE TITLE
  const [courseTitle, setCourseTitle] = useState([]);
  const [isLoadingCourseTitle, setIsLoadingCourseTitle] = useState(true);
  const getAllCourseTitle = () => {
    setIsLoadingCourseTitle(true);
    // GETTING COURSE TITLE
    getAllCourseTitleWithoutPerPagePublic({ business_id: business_id })
      .then((res) => {
        console.log({ res });
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
            // required
            onSelect={(e) => {
              setFormData({
                ...formData,
                course_title_id: e[0]?.id || null,
              });
            }}
            disable
          />
        </div>
      </div>
      // </CheckPermission>
    );
  }
}
