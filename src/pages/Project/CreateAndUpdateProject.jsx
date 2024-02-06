import React, { useEffect, useState } from "react";
import CustomField from "../../components/InputFields/CustomField";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import { getAllDepartmentsWithoutPerPage } from "../../apis/department/department";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import { useAuth } from "../../context/AuthContext";
import {
  createProject,
  getSingleProject,
  updateSingleProject,
} from "../../apis/project/project";
import { projectStatus } from "../../constant/projectStatus";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import TextEditor from "../../components/TextEditor";
import CustomLoading from "../../components/CustomLoading";
import CheckPermission from "../../CheckPermission";
import { PROJECT_CREATE, PROJECT_UPDATE } from "../../constant/permissions";
import moment from "moment";
import UpdateDepartment from "../Administration/Departments/UpdateDepartment";
import CreateDepartment from "../Administration/Departments/CreateDepartment";
import CustomPopup from "../../components/CustomPopup";

export default function CreateAndUpdateProject({ handleClosePopup, id }) {
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
    name: " ",
    description: "",
    start_date: moment(new Date()).format("DD-MM-YYYY"),
    end_date: "",
    status: "",
    departments: [],
  });
  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleProject(id)
        .then((res) => {
          console.log({ res });
          setFormData({
            ...formData,
            id: id,
            name: res?.name || "",
            description: res?.description || "",
            start_date: res?.start_date || "",
            end_date: res?.end_date || "",
            status: res?.status || "",
            departments: res?.departments || [],
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
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(true);
  // GETTING ALL DEPARTMENT,
  const getAllDepartmentsData = () => {
    setIsLoadingDepartment(true);
    // GETTING DEPARTMENTS
    getAllDepartmentsWithoutPerPage()
      .then((res) => {
        setDepartments(res.map((d) => ({ id: d?.id, label: d?.name })));
        setIsLoadingDepartment(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingDepartment(false);
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

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Project name is required";
    }
    // VALIDATE START-DATE
    if (!formData.start_date) {
      newErrors.start_date = "Start Date is required";
    }
    // VALIDATE END-DATE
    if (!formData.end_date) {
      newErrors.end_date = "End Date is required";
    }
    // VALIDATE STATUS
    // if (!formData.status) {
    //   newErrors.status = "Status is required";
    // }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createProject(formData)
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
    updateSingleProject(formData)
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

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <>
        <CustomPopup
          popupClasses={`w-[70vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            <>
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
              {/* {popupOption?.type === "edit" && (
                <UpdateDepartment
                  id={popupOption?.id}
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
              )} */}
            </>
          }
        />
        <CheckPermission permissionArray={[PROJECT_CREATE, PROJECT_UPDATE]}>
          <div className="px-2 py-5">
            <div className="flex flex-col">
              {/* NAME  */}
              <CustomField
                defaultValue={formData?.name}
                disable={false}
                error={errors?.name}
                fieldClassName={"w-full"}
                id={"name"}
                label={"Project Name"}
                name={"name"}
                onChange={handleFormChange}
                placeholder={"Project Name"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              {/* START DATE AND END DATE  */}
              <div className="flex flex-col md:flex-row md:gap-5">
                {/* START DATE  */}
                <CustomDatePicker
                  value={formData?.start_date}
                  disable={false}
                  format="dd-MM-yyyy"
                  error={errors?.start_date}
                  fieldClassName={"w-full"}
                  id={"start_date"}
                  label={"Start Date"}
                  name={"start_date"}
                  onChange={(date) => {
                    setFormData({ ...formData, start_date: date });
                  }}
                  placeholder={"Start Date"}
                  type={"text"}
                  wrapperClassName={"w-full md:w-1/2"}
                  required={true}
                />

                {/* END DATE  */}
                <CustomDatePicker
                  right
                  value={formData?.end_date}
                  disable={false}
                  error={errors?.end_date}
                  fieldClassName={"w-full"}
                  format="dd-MM-yyyy"
                  id={"end_date"}
                  label={"End Date"}
                  name={"end_date"}
                  onChange={(date) => {
                    setFormData({ ...formData, end_date: date });
                  }}
                  placeholder={"End Date"}
                  type={"text"}
                  wrapperClassName={"w-full md:w-1/2"}
                  required={true}
                />
              </div>

              <div className="flex flex-col md:flex-row md:gap-5">
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
                  error={errors?.department_id}
                  loading={isLoadingDepartment}
                  options={departments}
                  label={"Department"}
                  required={true}
                  defaultSelectedValues={departments.filter((item1) =>
                    formData?.departments.some((id) => id === item1.id)
                  )}
                  singleSelect={false}
                  onSelect={(e) => {
                    setFormData({
                      ...formData,
                      departments: e.map((d) => d?.id) || [],
                    });
                  }}
                />

                {/* STATUS  */}
                <CustomMultiSelect
                  error={errors?.status}
                  loading={false}
                  options={projectStatus}
                  label={"Status"}
                  required={true}
                  defaultSelectedValues={projectStatus.filter(
                    (s) => s?.value === "pending"
                  )}
                  singleSelect
                  onSelect={(e) => {
                    setFormData({ ...formData, status: e[0]?.value || "" });
                  }}
                />
              </div>
              {/* DESCRIPTION  */}
              <div className="my-5">
                <label className="label">
                  <span className="label-text text-md font-bold">
                    {"Description"}{" "}
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
        </CheckPermission>
      </>);
  }
}
