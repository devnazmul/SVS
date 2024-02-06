import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import {
  createDepartment,
  getAllDepartmentsWithoutPerPage,
  getSingleDepartment,
  updateSingleDepartment,
} from "../../../apis/department/department";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../apis/userAndBusiness/user";
import { useAuth } from "../../../context/AuthContext";
import { getAllWorkshiftsWithoutPerPage } from "../../../apis/workshift/workshift";
import CustomLoading from "../../../components/CustomLoading";
import { getAllWorkLocationsWithoutPerPage } from "../../../apis/workLocation/workLocation";

export default function UpdateDepartment({ handleClosePopup, id }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    location: "",
    description: "",
    manager_id: null, // REQUIRED
    parent_id: null,
    work_shift_id: null, // REQUIRED
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(true);
  useEffect(() => {
    setIsGettingData(true);
    getSingleDepartment(id)
      .then((res) => {
        console.log({ res });
        setFormData({
          id: res?.id,
          name: res?.name, // REQUIRED
          work_location_id: res?.work_location_id || "",
          description: res?.description || "",
          manager_id: res?.manager_id, // REQUIRED
          parent_id: res?.parent_id || "",
          work_shift_id: res?.work_shift_id, // REQUIRED
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

  // GETTING MANAGERS
  const [managers, setManagers] = useState([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(true);
  // GETTING ALL MANAGERS,
  const getAllManagersData = () => {
    setIsLoadingManagers(true);
    // GETTING MANAGERS
    getAllUsersWithoutPaginationByRole([
      // `business_admin#${user?.business_id}`,
      `business_manager#${user?.business_id}`,
    ])
      .then((res) => {
        console.log({ res });
        setManagers(
          res.map((m) => ({
            id: m?.id,
            label: `${m?.first_Name} ${m?.last_Name}`,
          }))
        );
        setIsLoadingManagers(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingManagers(false);
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
    getAllManagersData();
  }, []);

  // GETTING DEPARTMENTS
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  // GETTING ALL DEPARTMENT,
  const getAllDepartmentsData = () => {
    setIsLoadingDepartments(true);
    // GETTING DEPARTMENTS
    getAllDepartmentsWithoutPerPage()
      .then((res) => {
        setDepartments(
          res.map((p_dep) => ({ id: p_dep?.id, label: p_dep?.name }))
        );
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

  // GETTING WORK-SHIFTS
  const [workshifts, setWorkshifts] = useState([]);
  const [isLoadingWorkshifts, setIsLoadingWorkshifts] = useState(true);
  // GETTING ALL WORK-SHIFTS
  const getAllWorkshiftsData = () => {
    setIsLoadingWorkshifts(true);
    // GETTING WORK-SHIFTS
    getAllWorkshiftsWithoutPerPage()
      .then((res) => {
        setWorkshifts(res.map((ws) => ({ id: ws?.id, label: ws?.name })));
        setIsLoadingWorkshifts(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingWorkshifts(false);
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
    getAllWorkshiftsData();
  }, []);

  // GETTING WORK-LOCATION
  const [workLocations, setWorkLocations] = useState([]);
  const [isLoadingWorkLocations, setIsLoadingWorkLocations] = useState(true);
  // GETTING ALL WORK-LOCATION
  const getAllWorkLocationsData = () => {
    setIsLoadingWorkLocations(true);
    // GETTING WORK-LOCATION
    getAllWorkLocationsWithoutPerPage()
      .then((res) => {
        setWorkLocations(
          res.map((wl) => ({
            id: wl?.id,
            label: wl?.name,
            is_default: wl?.is_default,
            business_id: wl?.business_id,
          }))
        );
        setIsLoadingWorkLocations(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingWorkLocations(false);
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
    getAllWorkLocationsData();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Department name is required";
    }
    if (!formData.parent_id) {
      newErrors.parent_id = "Parent department is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleDepartment(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Department updated successfully!`}
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  if (
    isGettingData ||
    isLoadingWorkLocations ||
    isLoadingDepartments ||
    isLoadingWorkshifts
  ) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          {/* NAME  */}
          <CustomField
            defaultValue={formData?.name}
            disable={false}
            error={errors?.name}
            fieldClassName={"w-full"}
            id={"name"}
            label={"Name"}
            name={"name"}
            onChange={handleFormChange}
            placeholder={"Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* MANAGER  */}
          <CustomMultiSelect
            error={errors?.manager_id}
            loading={isLoadingManagers}
            options={managers}
            label={"Manager"}
            // required={true}
            singleSelect
            defaultSelectedValues={managers.filter(
              (m) => m?.id === formData?.manager_id
            )}
            onSelect={(e) => {
              setFormData({ ...formData, manager_id: e[0]?.id || null });
            }}
          />

          {/* PARENT DEPARTMENT  */}
          <CustomMultiSelect
            required={true}
            error={errors?.parent_id}
            loading={isLoadingDepartments}
            options={departments}
            label={"Parent Department"}
            singleSelect
            defaultSelectedValues={departments.filter(
              (m) => m?.id === formData?.parent_id
            )}
            onSelect={(e) => {
              setFormData({ ...formData, parent_id: e[0]?.id || null });
            }}
          />

          {/* WORK SHIFT  */}
          <CustomMultiSelect
            error={errors?.work_shift_id}
            loading={isLoadingWorkshifts || isGettingData}
            options={workshifts}
            label={"Work Shift"}
            // required={true}
            singleSelect
            defaultSelectedValues={workshifts.filter(
              (ws) => ws?.id === formData?.work_shift_id
            )}
            onSelect={(e) => {
              setFormData({ ...formData, work_shift_id: e[0]?.id || null });
            }}
          />

          {/* WORK LOCATION  */}
          <CustomMultiSelect
            error={errors?.location_id}
            loading={isLoadingWorkLocations}
            options={workLocations}
            defaultSelectedValues={workLocations.filter(
              (d) => d?.id === formData.work_location_id
            )}
            label={"Work Location"}
            singleSelect
            onSelect={(e) => {
              setFormData({ ...formData, work_location_id: e[0]?.id || null });
            }}
          />

          {/* DESCRIPTION  */}
          <CustomTextareaField
            defaultValue={formData?.description}
            disable={false}
            error={errors?.description}
            fieldClassName={"w-full"}
            id={"description"}
            label={"Description"}
            name={"description"}
            onChange={handleFormChange}
            placeholder={"Description"}
            type={"text"}
            wrapperClassName={"w-full"}
          />
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
            {isPendingSubmit ? <ButtonSpinner /> : "Update"}
          </button>
        </div>
      </div>
    );
  }
}
