import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { useAuth } from "../../../context/AuthContext";
import {
  createProject,
  getSingleProject,
  updateSingleProject,
} from "../../../apis/project/project";
import { projectStatus } from "../../../constant/projectStatus";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import TextEditor from "../../../components/TextEditor";
import CustomLoading from "../../../components/CustomLoading";
import CheckPermission from "../../../CheckPermission";
import {
  CANDIDATE_CREATE,
  CANDIDATE_UPDATE,
  PROJECT_CREATE,
  PROJECT_UPDATE,
} from "../../../constant/permissions";
import {
  createCandidate,
  getSingleCandidate,
  updateSingleCandidate,
} from "../../../apis/candidate/candidate";
import CustomNumberField from "../../../components/InputFields/CustomNumberField";
import { uploadUserSingleFile } from "../../../apis/userAndBusiness/user";
import CustomUploadFilesOneByOne from "../../../components/InputFields/CustomUploadFilesOneByOne";
import { getAllJobListsWithoutPerPage } from "../../../apis/jobDesk/jobDesk";
import { candidateStatus } from "../../../constant/candidateStatus";
import moment from "moment";
import { educationLevel } from "../../../constant/educationLevel ";
import { getAllJobPlatformsWithoutPerPage } from "../../../apis/jobPlatform/jobPlatform";
import CustomPopup from "../../../components/CustomPopup";
import CreateDepartment from "../../Administration/Departments/CreateDepartment";
import UpdateDepartment from "../../Administration/Departments/UpdateDepartment";

export default function CreateAndUpdateCandidate({
  handleClosePopup,
  id,
  jobId = null,
}) {
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
      setIsUpdated(Math.random());
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    job_listing_id: jobId, //REQUIRED
    name: "", //REQUIRED
    email: "", //REQUIRED
    phone: "", //REQUIRED
    feedback: "", //REQUIRED
    education_level: "", //REQUIRED
    status: "", //REQUIRED
    application_date: moment(new Date()).format("DD-MM-YYYY"), //REQUIRED
    experience_years: 0,
    cover_letter: "",
    interview_date: "",
    attachments: [],
    job_platform: null, // REQUIRED
  });
  const [isFileUploading, setIsFileUploading] = useState(false);
  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleCandidate(id)
        .then((res) => {
          console.log({ res });
          setFormData({
            id: id,
            job_listing_id: res?.job_listing_id, //REQUIRED
            name: res?.name, //REQUIRED
            email: res?.email, //REQUIRED
            phone: res?.phone, //REQUIRED
            feedback: res?.feedback, //REQUIRED
            education_level: res?.education_level, //REQUIRED
            status: res?.status, //REQUIRED
            application_date: res?.application_date, //REQUIRED
            experience_years: res?.experience_years,
            cover_letter: res?.cover_letter,
            interview_date: res?.interview_date,
            attachments: res?.attachments,
            job_platform: res?.job_platform, // REQUIRED
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

  // GETTING ALL ESSENTIAL DATA

  // GETTING DEPARTMENTS
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  // GETTING ALL DEPARTMENT,
  const getAllJobsData = () => {
    setIsLoadingJobs(true);
    // GETTING DEPARTMENTS
    getAllJobListsWithoutPerPage()
      .then((res) => {
        setJobs(res?.map((d) => ({ id: d?.id, label: d?.title })));
        setIsLoadingJobs(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingJobs(false);
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
    getAllJobsData();
  }, []);
  // GETTING JOB PLATFORMS
  const [jobPlatforms, setJobPlatforms] = useState([]);
  const [isLoadingJobPlatform, setIsLoadingJobPlatform] = useState(true);
  const getAllJobPlatForm = () => {
    setIsLoadingJobPlatform(true);
    // GETTING JOB PLATFORM
    getAllJobPlatformsWithoutPerPage()
      .then((res) => {
        setJobPlatforms(
          res.map((d) => ({ id: d?.id, label: d?.name, value: d?.name }))
        );
        setIsLoadingJobPlatform(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingJobPlatform(false);
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
    getAllJobPlatForm();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE JOB
    if (!formData.job_listing_id) {
      newErrors.job_listing_id = "Job is required";
    }
    // VALIDATE JOB
    if (!formData.job_platform) {
      newErrors.job_platform = "Job platform is required";
    }
    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Candidate name is required";
    }
    // VALIDATE EMAIL
    if (formData.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email.trim()
        )
      ) {
        newErrors.email = "Invalid email";
      }
    } else {
      newErrors.email = "Email is required";
    }
    // VALIDATE PHONE
    if (formData.phone) {
      if (formData?.phone.toString().split("").length !== 11) {
        newErrors.phone = "Phone must be 11 digit";
      }
    } else {
      newErrors.phone = "Phone is required";
    }
    // VALIDATE APPLICATION DATE
    if (!formData.application_date) {
      newErrors.application_date = "Application Date is required";
    }
    // VALIDATE STATUS
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    // VALIDATE YEAR OF EXPERIENCE
    if (!formData.experience_years) {
      newErrors.experience_years = "Year of experience is required";
    }
    // VALIDATE FEEDBACK
    if (!formData.feedback || formData.feedback.trim() === "") {
      newErrors.feedback = "Feedback is required";
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createCandidate(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Project created successfully!`}
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
    updateSingleCandidate(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Project updated successfully!`}
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

  if (isGettingData || isLoadingJobs) {
    return <CustomLoading />;
  } else {
    return (
      <>
        <CheckPermission permissionArray={[CANDIDATE_CREATE, CANDIDATE_UPDATE]}>
          <div className="px-2 py-5 flex flex-col gap-2">
            {/* JOB  */}
            <CustomMultiSelect
              error={errors?.job_listing_id}
              loading={isLoadingJobs}
              disable={jobId}
              options={jobs}
              label={"Select Job"}
              required={true}
              defaultSelectedValues={jobs.filter(
                (item1) => item1?.id === formData?.job_listing_id
              )}
              singleSelect={false}
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  job_listing_id: e[0]?.id || null,
                });
              }}
            />
            {/* JOB PLATFORMS  */}
            <CustomMultiSelect
              required
              error={errors?.job_platform}
              loading={isLoadingJobPlatform}
              options={jobPlatforms}
              label={"Select Job Platforms"}
              defaultSelectedValues={jobPlatforms.filter(
                (jp, index) => jp?.value === formData?.job_platform
              )}
              singleSelect={false}
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  job_platform: e[0]?.value || null,
                });
              }}
            />
            {/* FORM FIELDS  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
              {/* NAME  */}
              <CustomField
                defaultValue={formData?.name}
                disable={false}
                error={errors?.name}
                fieldClassName={"w-full"}
                id={"name"}
                label={"Candidate Name"}
                name={"name"}
                onChange={handleFormChange}
                placeholder={"Candidate Name"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />

              {/* EMAIL  */}
              <CustomField
                defaultValue={formData?.email}
                disable={false}
                error={errors?.email}
                fieldClassName={"w-full"}
                id={"email"}
                label={"Email"}
                name={"email"}
                onChange={handleFormChange}
                placeholder={"Email"}
                type={"email"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* PHONE */}
              <CustomNumberField
                id={"phone"}
                label={"Phone"}
                min={0}
                name={"phone"}
                onChange={handleFormChange}
                value={formData?.phone}
                placeholder={"Phone"}
                error={errors?.phone}
                required={true}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />

              {/* YEAR OF EXPERIENCE */}
              <CustomNumberField
                id={"experience_years"}
                label={"Year of Experience"}
                min={0}
                name={"experience_years"}
                onChange={handleFormChange}
                value={formData?.experience_years}
                placeholder={"Year of Experience"}
                error={errors?.experience_years}
                required={true}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />

              {/* EDUCATION LEVEL  */}
              <CustomMultiSelect
                error={errors?.education_level}
                loading={false}
                options={educationLevel}
                label={"Education Level"}
                required={false}
                defaultSelectedValues={educationLevel.filter(
                  (s) => s?.value === formData?.education_level
                )}
                singleSelect
                onSelect={(e) => {
                  setFormData({
                    ...formData,
                    education_level: e[0]?.value || "",
                  });
                }}
              />

              {/* APPLICATION DATE  */}
              <CustomDatePicker
                value={formData?.application_date}
                disable={false}
                format="dd-MM-yyyy"
                error={errors?.application_date}
                fieldClassName={"w-full"}
                id={"application_date"}
                label={"Application Date"}
                name={"application_date"}
                onChange={(date) => {
                  setFormData({ ...formData, application_date: date });
                }}
                placeholder={"Application Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* INTERVIEW DATE  */}
              <CustomDatePicker
                value={formData?.interview_date}
                disable={false}
                error={errors?.interview_date}
                fieldClassName={"w-full"}
                format="dd-MM-yyyy"
                id={"interview_date"}
                label={"Interview Date"}
                name={"interview_date"}
                onChange={(date) => {
                  setFormData({ ...formData, interview_date: date });
                }}
                placeholder={"Interview Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* STATUS  */}
              <CustomMultiSelect
                error={errors?.status}
                loading={false}
                options={candidateStatus}
                label={"Status"}
                required={true}
                defaultSelectedValues={candidateStatus.filter(
                  (s) => s?.value === "review"
                )}
                singleSelect
                onSelect={(e) => {
                  setFormData({ ...formData, status: e[0]?.value || "" });
                }}
              />
            </div>
            <div>
              {/* COVER LETTER  */}
              <div className="my-5">
                <label className="label">
                  <span className="label-text text-md font-bold">
                    {"Cover Letter"}{" "}
                  </span>
                </label>
                <TextEditor
                  value={formData?.cover_letter}
                  onChange={(e) => {
                    setFormData({ ...formData, cover_letter: e });
                  }}
                />
                {/* VALIDATION MESSAGE  */}
                {errors?.cover_letter && (
                  <label className="label h-7">
                    <span className="label-text-alt text-error">
                      {errors?.cover_letter}
                    </span>
                  </label>
                )}
              </div>
              {/* FEEDBACK  */}
              <div className="my-5">
                <label className="label">
                  <span className="label-text text-md font-bold">
                    {"Feedback"}{" "}
                    <span className="text-error font-bold text-md">*</span>
                  </span>
                </label>
                <TextEditor
                  value={formData?.feedback}
                  onChange={(e) => {
                    setFormData({ ...formData, feedback: e });
                  }}
                />
                {/* VALIDATION MESSAGE  */}
                {errors?.feedback && (
                  <label className="label h-7">
                    <span className="label-text-alt text-error">
                      {errors?.feedback}
                    </span>
                  </label>
                )}
              </div>

              <CustomUploadFilesOneByOne
                files={formData?.attachments || []}
                setFiles={async (e) => {
                  const imageArray = Object.values(e?.file?.target?.files);
                  imageArray?.map((file_url, index) => {
                    if (file_url) {
                      setIsFileUploading(true);
                      uploadUserSingleFile(file_url)
                        .then((res) => {
                          setFormData((prev) => ({
                            ...prev,
                            attachments: [
                              ...prev?.attachments,
                              res?.full_location,
                            ],
                          }));
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
                isFileUploading={isFileUploading}
                onDrop={(e) => console.log({ e })}
                onRemove={(e) => {
                  const newFormData = formData?.attachments?.filter(
                    (img) => img !== e
                  );
                  setFormData((prev) => ({
                    ...prev,
                    attachments: newFormData,
                  }));
                }}
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
                disabled={isPendingSubmit}
                onClick={handleSubmit}
                className="btn w-full md:btn-wide btn-primary"
              >
                {isPendingSubmit ? <ButtonSpinner /> : id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </CheckPermission>
      </>);
  }
}
