import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import {
  getAllUsersWIthoutPagination,
  getAllUsersWithoutPaginationByRole,
} from "../../../apis/userAndBusiness/user";
import { useAuth } from "../../../context/AuthContext";
import { getAllWorkshiftsWithoutPerPage } from "../../../apis/workshift/workshift";
import { createAnnouncement } from "../../../apis/announcement/announcement";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import ReactQuill from "react-quill";
import TextEditor from "../../../components/TextEditor";
import { createHoliday } from "../../../apis/holiday/holiday";
import moment from "moment";
import { getAllEmployeeStatusWithoutPerPage } from "../../../apis/employeeStatus/employeeStatus";

export default function CreateHoliday({
  handleClosePopup,
  startDate,
  endDate,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    description: "",
    start_date: startDate ? moment(startDate).format("DD-MM-YYYY") : "", // REQUIRED
    end_date: endDate ? moment(endDate).format("DD-MM-YYYY") : "", // REQUIRED
    departments: [],
    users: [],
    repeats_annually: false,
  });

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
  // GETTING ALL DEPARTMENT,
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

  // GETTING DEPARTMENTS
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  // GETTING ALL DEPARTMENT,
  const getAllEmployeesData = () => {
    setIsLoadingDepartments(true);
    // GETTING DEPARTMENTS
    getAllUsersWIthoutPagination()
      .then((res) => {
        setEmployees(
          res.map((d) => ({
            id: d?.id,
            label: `${d?.first_Name} ${d?.middle_Name || ""} ${d?.last_Name}`,
          }))
        );
        setIsLoadingEmployees(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingEmployees(false);
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
    getAllEmployeesData();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE Name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    // VALIDATE START DATE
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    // VALIDATE END DATE
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    // VALIDATE EMPLOYEE
    if (!formData.users?.length === 0) {
      newErrors.end_date = "Employee is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createHoliday(formData)
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
      createFunction();
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

        {/* EMPLOYEE  */}
        <CustomMultiSelect
          required
          error={errors?.parent_id}
          loading={isLoadingEmployees}
          options={employees}
          label={"Employee"}
          onSelect={(e) => {
            setFormData({
              ...formData,
              users: e.length > 0 ? e.map((d) => d?.id) : [],
            });
          }}
        />

        {/* DEPARTMENT  */}
        <CustomMultiSelect
          error={errors?.parent_id}
          loading={isLoadingDepartments}
          options={departments}
          label={"Department"}
          onSelect={(e) => {
            setFormData({
              ...formData,
              departments: e.length > 0 ? e.map((d) => d?.id) : [],
            });
          }}
        />

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

        <div className="flex gap-2 items-center my-2">
          <input
            id="repeats_annually"
            type="checkbox"
            className="checkbox-primary checkbox"
            name="repeats_annually"
            checked={formData?.repeats_annually}
            onClick={(e) => {
              e.target.checked;
              setFormData({
                ...formData,
                repeats_annually: !!e.target.checked,
              });
            }}
          />
          <label htmlFor="repeats_annually"> Repeats annually</label>
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
          {isPendingSubmit ? <ButtonSpinner /> : "Create"}
        </button>
      </div>
    </div>
  );
}
