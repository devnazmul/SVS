import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import {
  createDepartment,
  getAllDepartmentsWithoutPerPage,
} from "../../../apis/department/department";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../apis/userAndBusiness/user";
import { useAuth } from "../../../context/AuthContext";
import { getAllWorkshiftsWithoutPerPage } from "../../../apis/workshift/workshift";
import CustomLoading from "../../../components/CustomLoading";
import { getAllWorkLocationsWithoutPerPage } from "../../../apis/workLocation/workLocation";

export default function CreateDepartment({ handleClosePopup }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    work_location_id: "",
    description: "",
    manager_id: null, // REQUIRED
    parent_id: 1,
    work_shift_id: null, // REQUIRED
  });

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
    // GETTING DEPARTMENTS
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
          res.map((d) => ({
            id: d?.id,
            label: d?.name,
            parent_id: d?.parent_id,
          }))
        );
        setFormData((prev) => ({
          ...prev,
          parent_id: res.find((ws) => ws.parent_id === null)?.id,
        }));

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

  // GETTING WORK-LOCATION
  const [workLocations, setWorkLocations] = useState([]);
  const [isLoadingWorkLocations, setIsLoadingWorkLocations] = useState(true);
  // GETTING ALL WORK-LOCATION
  const getAllWorkLocationsData = () => {
    setIsLoadingWorkLocations(true);
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
        setFormData((prev) => ({
          ...prev,
          work_location_id: res.find(
            (wl) => wl?.is_default === 1 && wl?.business_id !== null
          )?.id,
        }));
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

  // GETTING WORK-SHIFTS
  const [workshifts, setWorkshifts] = useState([]);
  const [isLoadingWorkshifts, setIsLoadingWorkshifts] = useState(true);
  // GETTING ALL WORK-SHIFTS
  const getAllWorkshiftsData = () => {
    setIsLoadingWorkshifts(true);
    getAllWorkshiftsWithoutPerPage()
      .then((res) => {
        setWorkshifts(
          res.map((ws) => ({
            id: ws?.id,
            label: ws?.name,
            is_default: ws.is_default,
            business_id: ws.business_id,
          }))
        );
        setFormData((prev) => ({
          ...prev,
          work_shift_id: res.find((ws) => ws.is_default)?.id,
        }));
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

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Department name is required";
    }

    // VALIDATE DEPARTMENT
    if (!formData.parent_id) {
      newErrors.parent_id = "Parent department is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createDepartmentFunction = () => {
    setIsPendingSubmit(true);
    createDepartment(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Department created successfully!`}
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
      createDepartmentFunction();
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
    isLoadingDepartments ||
    isLoadingManagers ||
    isLoadingWorkshifts ||
    isLoadingWorkLocations
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
            singleSelect
            onSelect={(e) => {
              setFormData({ ...formData, manager_id: e[0]?.id || null });
            }}
          />

          {/* PARENT DEPARTMENT  */}
          <CustomMultiSelect
            error={errors?.parent_id}
            loading={isLoadingDepartments}
            options={departments}
            defaultSelectedValues={departments.filter(
              (d) => d?.parent_id === null
            )}
            label={"Parent Department"}
            singleSelect
            onSelect={(e) => {
              setFormData({ ...formData, parent_id: e[0]?.id || null });
            }}
            required={true}
          />

          {/* WORK SHIFT  */}
          <CustomMultiSelect
            error={errors?.work_shift_id}
            loading={isLoadingWorkshifts}
            options={workshifts}
            defaultSelectedValues={workshifts.filter(
              (d) => d?.is_default === 1 && d?.business_id !== null
            )}
            label={"Work Shift"}
            singleSelect
            onSelect={(e) => {
              setFormData({ ...formData, work_shift_id: e[0]?.id || null });
            }}
          />

          {/* LOCATION  */}
          <CustomMultiSelect
            error={errors?.location_id}
            loading={isLoadingWorkLocations}
            options={workLocations}
            defaultSelectedValues={workLocations.filter(
              (d) => d?.is_default === 1 && d?.business_id !== null
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
            {isPendingSubmit ? <ButtonSpinner /> : "Create"}
          </button>
        </div>
      </div>
    );
  }
}
