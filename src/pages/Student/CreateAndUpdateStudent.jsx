import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomField from "../../components/InputFields/CustomField";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import CustomToaster from "../../components/CustomToaster";
import { useAuth } from "../../context/AuthContext";
import CustomLoading from "../../components/CustomLoading";
import {
  checkStudentRef,
  createStudent,
  getSingleStudent,
  updateSingleStudent,
} from "../../apis/student/student.js";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect.jsx";
import { nationality } from "../../constant/nationality.js";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker.jsx";
import { getAllStudentStatusWithoutPerPage } from "../../apis/studentStatus/studentStatus.js";

export default function CreateAndUpdateStudent({
  handleClosePopup,
  id = null,
}) {
  const [isFileUploading, setIsFileUploading] = useState(false);

  const { user } = useAuth();
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
    student_status_id: 1,
    attachments: [],
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleStudent(id)
        .then((res) => {
          setFormData({
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
            student_status_id: res?.student_status_id || null,
            attachments: res?.attachments || [],
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
            ?.filter((ss) => ss?.is_active)
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

  // CHECK EMAIL
  const [studentRefExist, setStudentRefExist] = useState("");
  const [isCheckingRef, setIsCheckingRef] = useState(false);
  const handleCheckRefExist = (e) => {
    setIsCheckingRef(true);
    checkStudentRef(e.target.value)
      .then((res) => {
        if (res?.school_id_exists) {
          setStudentRefExist("Reference already exist!");
        } else {
          setStudentRefExist("");
        }
        setIsCheckingRef(false);
      })
      .catch((error) => {
        setIsCheckingRef(false);
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

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.first_name || formData.first_name.trim() === "") {
      newErrors.first_name = "First name is required";
    }

    // LAST NAME
    if (!formData.last_name || formData.last_name.trim() === "") {
      newErrors.last_name = "Last name is required";
    }

    // NATIONALITY
    if (!formData.nationality || formData.nationality.trim() === "") {
      newErrors.nationality = "Nationality is required";
    }

    // PASSPORT NUMBER
    if (!formData.passport_number || formData.passport_number.trim() === "") {
      newErrors.passport_number = "Passport number is required";
    }

    // REFERENCE
    if (!formData.school_id || formData.school_id.trim() === "") {
      newErrors.school_id = "Reference is required";
    }

    // DATE OF BIRTH
    if (!formData.date_of_birth || formData.date_of_birth.trim() === "") {
      newErrors.date_of_birth = "Date of birth is required";
    }

    // COURSE START DATE
    if (
      !formData.course_start_date ||
      formData.course_start_date.trim() === ""
    ) {
      newErrors.course_start_date = "Course start date is required";
    }

    // LETTER ISSUE DATE
    if (
      !formData.letter_issue_date ||
      formData.letter_issue_date.trim() === ""
    ) {
      newErrors.letter_issue_date = "Letter issue date is required";
    }

    // STUDENT STATUS
    if (!formData.student_status_id) {
      newErrors.student_status_id = "Student status is required";
    }

    setErrors(newErrors);
    console.log({ newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createStudent(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Student created successfully!`}
          />
        ));
        handleClosePopup(res?.id);
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
    if (validateForm() && !studentRefExist) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          {/* FIRST NAME  */}
          <CustomField
            defaultValue={formData?.first_name}
            disable={false}
            error={errors?.first_name}
            fieldClassName={"w-full "}
            id={"first_name"}
            label={"First Name"}
            name={"first_name"}
            onChange={handleFormChange}
            placeholder={"First Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />
          {/* MIDDLE NAME  */}
          {/* <CustomField
            defaultValue={formData?.middle_name}
            disable={false}
            error={errors?.middle_name}
            fieldClassName={"w-full"}
            id={"middle_name"}
            label={"Middle Name"}
            name={"middle_name"}
            onChange={handleFormChange}
            placeholder={"Middle Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={false}
          /> */}
          {/* LAST NAME  */}
          <CustomField
            defaultValue={formData?.last_name}
            disable={false}
            error={errors?.last_name}
            fieldClassName={"w-full"}
            id={"last_name"}
            label={"Last Name"}
            name={"last_name"}
            onChange={handleFormChange}
            placeholder={"Last Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* NATIONALITY  */}
          <CustomMultiSelect
            error={errors?.nationality}
            loading={false}
            options={nationality}
            label={"Select Nationality"}
            defaultSelectedValues={nationality.filter((jt, index) => {
              return jt?.label === formData?.nationality;
            })}
            singleSelect
            required
            onSelect={(e) => {
              setFormData({
                ...formData,
                nationality: e[0]?.label || "",
              });
            }}
          />

          {/* PASSPORT NUMBER  */}
          <CustomField
            defaultValue={formData?.passport_number}
            disable={false}
            error={errors?.passport_number}
            fieldClassName={"w-full"}
            id={"passport_number"}
            label={"Passport Number"}
            name={"passport_number"}
            onChange={handleFormChange}
            placeholder={"Passport Number"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* SCHOOL ID  */}
          <CustomField
            defaultValue={formData?.school_id}
            disable={false}
            error={errors?.school_id || studentRefExist}
            onBlur={handleCheckRefExist}
            fieldClassName={"w-full"}
            id={"school_id"}
            label={"Reference"}
            name={"school_id"}
            onChange={handleFormChange}
            placeholder={"Reference"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* STUDENT STATUS  */}
          <CustomMultiSelect
            error={errors?.student_status_id}
            loading={isLoadingStudentStatuses}
            options={studentStatuses}
            label={"Select Student Status"}
            defaultSelectedValues={studentStatuses.filter((ss, index) => {
              return ss?.id === formData?.student_status_id;
            })}
            singleSelect
            required
            onSelect={(e) => {
              setFormData({
                ...formData,
                student_status_id: e[0]?.id || null,
              });
            }}
          />

          {/* DATE OF BIRTH  */}
          <CustomDatePicker
            value={formData?.date_of_birth}
            disable={false}
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
            left
            placeholder={"Date Of Birth"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* COURSE START DATE  */}
          <CustomDatePicker
            value={formData?.course_start_date}
            disable={false}
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
            right
            placeholder={"Course Start Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* LETTER ISSUE DATE  */}
          <CustomDatePicker
            value={formData?.letter_issue_date}
            disable={false}
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
            placeholder={"Letter Issue Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* <CustomUploadFilesOneByOne
            files={formData?.attachments}
            isFileUploading={isFileUploading}
            setFiles={async (e) => {
              const imageArray = Object.values(e?.file?.target?.files);
              imageArray?.map((file_url, index) => {
                if (file_url) {
                  setIsFileUploading(true);
                  uploadStudentSingleFile(file_url)
                    .then((res) => {
                      const newFormData = formData?.attachments;
                      newFormData.push(res?.full_location);
                      setFormData({ ...formData, attachments: newFormData });
                      setIsFileUploading(false);
                    })
                    .catch((error) => {
                      console.log({ 188: error });
                      setIsFileUploading(false);
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
              });
            }}
            onDrop={(e) => console.log({ e })}
            onRemove={(e) => {
              setFormData({
                ...formData,
                attachments: formData?.attachments?.filter((img) => img !== e),
              });
            }}
          /> */}
          {/* PASSWORD */}
          {/* <CustomPasswordField
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
          /> */}
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
            disabled={isCheckingRef || isPendingSubmit}
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
