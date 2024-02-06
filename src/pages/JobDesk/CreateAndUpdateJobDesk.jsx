import React, { useEffect, useState } from "react";
import CustomField from "../../components/InputFields/CustomField";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import { getAllDepartmentsWithoutPerPage } from "../../apis/department/department";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import { useAuth } from "../../context/AuthContext";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import TextEditor from "../../components/TextEditor";
import {
  createJobList,
  getAllJobListsWithoutPerPage,
  getSingleJobList,
  updateSingleJobList,
} from "../../apis/jobDesk/jobDesk";
import { getAllJobPlatformsWithoutPerPage } from "../../apis/jobPlatform/jobPlatform";
import { getAllWorkLocationsWithoutPerPage } from "../../apis/workLocation/workLocation";
import { getAllJobTypesWithoutPerPage } from "../../apis/jobType/jobType";
import CustomLoading from "../../components/CustomLoading";
import moment from "moment";
import CustomPopup from "../../components/CustomPopup";
import CreateDesignation from "../Employee/Designation/CreateDesignation";
import CreateAndUpdateWorkLocation from "../Settings/BusinessSettings/CreateAndUpdateWorkLocation";
import CustomNumberFieldWithCurrency from "../../components/InputFields/CustomNumberFieldWithCurrency";

export default function CreateAndUpdateJobDesk({
  handleClosePopup,
  id = null,
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
    title: "", // REQUIRED ✅
    minimum_salary: "", // REQUIRED ✅
    maximum_salary: "", // REQUIRED ✅
    required_skills: "", // REQUIRED ✅
    experience_level: "", // REQUIRED ✅
    job_platforms: [], // ✅
    work_location_id: null, // REQUIRED ✅
    posted_on: moment(new Date()).format("DD-MM-YYYY"), // REQUIRED ✅
    application_deadline: "", // REQUIRED ✅
    department_id: "", // REQUIRED ✅
    job_type_id: null, // REQUIRED
    description: "",
    location: "test", // NEED TO REMOVE
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleJobList(id)
        .then((res) => {
          setFormData({
            id: res?.id,
            title: res?.title, // REQUIRED
            location: res?.location || "test", // REQUIRED
            minimum_salary: res?.minimum_salary, // REQUIRED
            maximum_salary: res?.maximum_salary, // REQUIRED
            experience_level: res?.experience_level, // REQUIRED
            required_skills: res?.required_skills, // REQUIRED
            application_deadline: res?.application_deadline, // REQUIRED
            posted_on: res?.posted_on, // REQUIRED
            department_id: res?.department_id, // REQUIRED
            job_platforms: res?.job_platforms
              ? res?.job_platforms?.map((jp) => jp.id)
              : [],
            job_type_id: res?.job_type_id, // REQUIRED
            work_location_id: res?.work_location_id, // REQUIRED
            description: res?.description || "",
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

  // GETTING DEPARTMENTS
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const getAllDepartmentsData = () => {
    setIsLoadingDepartments(true);
    // GETTING DEPARTMENTS
    getAllDepartmentsWithoutPerPage()
      .then((res) => {
        setDepartments(res.map((d) => ({ id: d?.id, label: d?.name })));
        setIsLoadingDepartments(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingDepartments(false);
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
    getAllDepartmentsData();
  }, []);

  // GETTING JOB PLATFORMS
  const [jobPlatforms, setJobPlatforms] = useState([]);
  const [isLoadingJobPlatform, setIsLoadingJobPlatform] = useState(true);
  const getAllJobPlatForm = () => {
    setIsLoadingJobPlatform(true);
    // GETTING JOB PLATFORM
    getAllJobPlatformsWithoutPerPage()
      .then((res) => {
        setJobPlatforms(res.map((d) => ({ id: d?.id, label: d?.name })));
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

  // GETTING JOB TYPES
  const [jobTypes, setJobTypes] = useState([]);
  const [isLoadingJobTypes, setIsLoadingJobTypes] = useState(true);
  const getAllJobTypesData = () => {
    setIsLoadingJobTypes(true);
    // GETTING DEPARTMENTS
    getAllJobTypesWithoutPerPage()
      .then((res) => {
        setJobTypes(res.map((jt) => ({ id: jt?.id, label: jt?.name })));
        setIsLoadingJobTypes(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingJobTypes(false);
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
    getAllJobTypesData();
  }, []);

  // GETTING WORK LOCATION
  const [workLocations, setWorkLocations] = useState([]);
  const [isLoadingWorkLocation, setIsLoadingWorkLocation] = useState(true);
  const getAllWorkLocationData = () => {
    setIsLoadingWorkLocation(true);
    // GETTING DEPARTMENTS
    getAllWorkLocationsWithoutPerPage()
      .then((res) => {
        setWorkLocations(res.map((ws) => ({ id: ws?.id, label: ws?.name })));
        setIsLoadingWorkLocation(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingWorkLocation(false);
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
    getAllWorkLocationData();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE TITLE
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    }
    if (!formData.job_type_id) {
      newErrors.job_type_id = "Job type is required";
    }

    // VALIDATE LOCATION
    // if (!formData.location || formData.location.trim() === "") {
    //   newErrors.location = "Location is required";
    // }
    // VALIDATE MIN SALARY
    if (!formData.minimum_salary) {
      newErrors.minimum_salary = "Minimum salary is required";
    }
    // VALIDATE MAX SALARY
    if (!formData.maximum_salary) {
      newErrors.maximum_salary = "Maximum salary is required";
    }
    // VALIDATE SKILL
    if (!formData.required_skills || formData.required_skills.trim() === "") {
      newErrors.required_skills = "Required skills is required";
    }
    // VALIDATE EXPERIENCE LEVEL
    if (!formData.experience_level || formData.experience_level.trim() === "") {
      newErrors.experience_level = "Experience level skills is required";
    }

    // VALIDATE WORK LOCATION
    if (!formData.work_location_id) {
      newErrors.work_location_id = "Work location is required";
    }
    // VALIDATE POST ON
    if (!formData.posted_on) {
      newErrors.posted_on = "Post on date is required";
    }
    // VALIDATE DEADLINE
    if (!formData.application_deadline) {
      newErrors.application_deadline = "Deadline is required";
    }
    // VALIDATE DEPARTMENT
    if (!formData.department_id) {
      newErrors.department_id = "Department is required";
    }
    // VALIDATE DEADLINE
    if (!formData.application_deadline) {
      newErrors.application_deadline = "Deadline is required";
    }
    // job_platforms
    // description,

    setErrors(newErrors);
    console.log({ newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createJobList(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Job created successfully!`}
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
    updateSingleJobList(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Job updated successfully!`}
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

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        {/* POPUP  */}
        <CustomPopup
          popupClasses={`w-[70vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
              {popupOption?.type === "createDesignation" && (
                <CreateDesignation
                  handleClosePopup={(e) => {
                    setPopupOption({
                      open: false,
                      type: "",
                      id: null,
                      onClose: () => {
                        setFormData((prev) => ({
                          ...prev,
                          designation_id: e?.id,
                        }));
                        setPopupOption({ ...popupOption, open: false });
                        setIsDesignationUpdated(Math.random());
                      },
                      overlayStyle: { background: "red" },
                      closeOnDocumentClick: false,
                    });
                  }}
                />
              )}
              {popupOption?.type === "createWorkLocation" && (
                <CreateAndUpdateWorkLocation
                  handleClosePopup={(e) => {
                    setPopupOption({
                      open: false,
                      type: "",
                      id: null,
                      onClose: () => {
                        setFormData((prev) => ({
                          ...prev,
                          work_location_id: e?.id,
                        }));
                        setPopupOption({ ...popupOption, open: false });
                        setIsWorkLocationUpdated(Math.random());
                      },
                      overlayStyle: { background: "red" },
                      closeOnDocumentClick: false,
                    });
                  }}
                />
              )}
              {popupOption?.type === "create" && (
                <CreateDepartment
                  handleClosePopup={() => {
                    setPopupOption({
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
                  }}
                />
              )}
            </>
          }
        />
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:gap-4 justify-between">
            {/*JOB TITLE  */}
            <CustomField
              defaultValue={formData?.title}
              disable={false}
              error={errors?.title}
              fieldClassName={"w-full"}
              id={"title"}
              label={"Title"}
              name={"title"}
              onChange={handleFormChange}
              placeholder={"Title"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />
            <div className="w-full md:w-1/2">
              {/* JOB TYPE  */}
              <CustomMultiSelect
                error={errors?.job_type_id}
                loading={isLoadingJobTypes}
                options={jobTypes}
                label={"Select Job Types"}
                defaultSelectedValues={jobTypes.filter((jt, index) => {
                  return jt?.id === formData?.job_type_id;
                })}
                singleSelect
                onSelect={(e) => {
                  setFormData({
                    ...formData,
                    job_type_id: e[0]?.id || null,
                  });
                }}
              />
            </div>
          </div>

          {/* COMPANY LOCATION & WORK LOCATION  */}
          <div className="flex flex-col md:flex-row items-start md:gap-4 justify-between">
            {/* COMPANY LOCATION  */}

            {/* WORK LOCATION */}
            <CustomMultiSelect
              addNewItemButton={true}
              onClickAddNewItemButton={() => {
                setPopupOption({
                  open: true,
                  type: "createWorkLocation",
                  title: "Create Work Location",
                  onClose: () => {
                    setPopupOption({ ...popupOption, open: false });
                  },
                  id: null,
                  closeOnDocumentClick: false,
                });
              }}
              required
              error={errors?.work_location_id}
              loading={isLoadingWorkLocation}
              options={workLocations}
              label={"Select Work Location"}
              defaultSelectedValues={workLocations.filter((wl, index) => {
                return wl?.id === formData?.work_location_id;
              })}
              singleSelect
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  work_location_id: e[0]?.id || null,
                });
              }}
            />
            {/* DEPARTMENT  */}
            <CustomMultiSelect
              addNewItemButton={true}
              onClickAddNewItemButton={() => {
                setPopupOption({
                  open: true,
                  type: "createDepartment",
                  title: "Create Department",
                  onClose: () => {
                    setPopupOption({ ...popupOption, open: false });
                  },
                  id: null,
                  closeOnDocumentClick: false,
                });
              }}
              required
              error={errors?.department_id}
              loading={isLoadingDepartments}
              options={departments}
              label={"Select Department"}
              defaultSelectedValues={departments.filter((d, index) => {
                return d?.id === formData?.department_id;
              })}
              singleSelect
              onSelect={(e) => {
                setFormData({ ...formData, department_id: e[0]?.id || null });
              }}
            />
          </div>

          {/* REQUIRED SKILL & EXPERIENCE LEVEL */}
          <div className="flex flex-col md:flex-row items-start md:gap-4 justify-between">
            {/* REQUIRED SKILL */}
            <CustomField
              defaultValue={formData?.required_skills}
              disable={false}
              error={errors?.required_skills}
              fieldClassName={"w-full"}
              id={"required_skills"}
              label={"Required Skills"}
              name={"required_skills"}
              onChange={handleFormChange}
              placeholder={"Java, JavaScript, etc."}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
            {/* EXPERIENCE LEVEL */}
            <CustomField
              defaultValue={formData?.experience_level}
              disable={false}
              error={errors?.experience_level}
              fieldClassName={"w-full"}
              id={"experience_level"}
              label={"Experience Level"}
              name={"experience_level"}
              onChange={handleFormChange}
              placeholder={"Experience Level"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>

          {/* MIN & MAX SALARY  */}
          <div className="flex flex-col md:flex-row justify-between items-start md:gap-4">
            {/* MIN SALARY */}
            <CustomNumberFieldWithCurrency
              id={"minimum_salary"}
              label={"Minimum Salary"}
              min={0}
              name={"minimum_salary"}
              onChange={handleFormChange}
              value={formData?.minimum_salary}
              placeholder={"Minimum Salary"}
              error={errors?.minimum_salary}
              required={true}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />

            {/* MAX SALARY */}
            <CustomNumberFieldWithCurrency
              id={"maximum_salary"}
              label={"Maximum Salary"}
              min={0}
              name={"maximum_salary"}
              onChange={handleFormChange}
              value={formData?.maximum_salary}
              placeholder={"Maximum Salary"}
              error={errors?.maximum_salary}
              required={true}
              wrapperClassName={`w-full md:w-1/2`}
              fieldClassName={`w-full`}
            />
          </div>

          {/* POST ON & APPLICATION DEADLINE  */}
          <div className="flex flex-col md:flex-row justify-between items-start md:gap-4">
            {/* POST ON */}
            <CustomDatePicker
              value={formData?.posted_on}
              disable={false}
              error={errors?.posted_on}
              fieldClassName={"w-full"}
              id={"posted_on"}
              label={"Posted On"}
              name={"posted_on"}
              onChange={(date) => {
                setFormData({ ...formData, posted_on: date });
              }}
              placeholder={"Posted On"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />

            {/* APPLICATION DEADLINE */}
            <CustomDatePicker
              right
              value={formData?.application_deadline}
              disable={false}
              error={errors?.application_deadline}
              fieldClassName={"w-full"}
              id={"application_deadline"}
              label={"Application Deadline"}
              name={"application_deadline"}
              onChange={(date) => {
                setFormData({ ...formData, application_deadline: date });
              }}
              placeholder={"Application Deadline"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />
          </div>

          {/* JOB PLATFORMS & DEPARTMENT  */}
          <div className="flex flex-col md:flex-row  justify-between items-start md:gap-4">
            {/* JOB PLATFORMS  */}
            <CustomMultiSelect
              error={errors?.job_platforms}
              loading={isLoadingJobPlatform}
              options={jobPlatforms}
              label={"Select Job Platforms"}
              defaultSelectedValues={jobPlatforms.filter((jp, index) =>
                formData?.job_platforms.some((fjp) => fjp === jp?.id)
              )}
              singleSelect={false}
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  job_platforms: e.length > 0 ? e.map((jp) => jp?.id) : [],
                });
              }}
            />
          </div>

          <div className="my-5">
            <label className="label">
              <span className="label-text text-md font-bold">
                {"Description"}
              </span>
            </label>
            <TextEditor
              value={formData?.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e });
              }}
            />
          </div>
        </div>
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
    );
  }
}
