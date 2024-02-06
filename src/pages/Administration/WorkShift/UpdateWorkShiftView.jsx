import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import { getAllUsersWithoutPaginationByRole } from "../../../apis/userAndBusiness/user";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import CustomTimePicker from "../../../components/InputFields/CustomTimePicker";
import { convertTo24HourFormat } from "../../../utils/convertTo24HourFormat";
import { useAuth } from "../../../context/AuthContext";
import {
  createWorkshift,
  getSingleWorkshift,
  updateSingleWorkshift,
} from "../../../apis/workshift/workshift";
import { compareTimes } from "../../../utils/compareTimes";
import { compareDates } from "../../../utils/compareDates";
import { useParams } from "react-router-dom";
import CustomLoading from "../../../components/CustomLoading";
import CustomNumberField from "../../../components/InputFields/CustomNumberField";

export default function UpdateWorkShiftView({ handleClosePopup, id }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    type: "regular", // REQUIRED
    departments: [], // REQUIRED ( IF NO EMPLOYEE SELECTED )
    users: [], // REQUIRED ( IF NO DEPARTMENT SELECTED )
    details: [
      {
        day: 0,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
      {
        day: 1,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
      {
        day: 2,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
      {
        day: 3,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
      {
        day: 4,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
      {
        day: 5,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
      {
        day: 6,
        start_at: "",
        end_at: "",
        is_weekend: 0,
      },
    ], // REQUIRED
    break_type: "paid",
    break_hours: "", // REQUIRED
    start_date: "", // REQUIRED
    end_date: "", // REQUIRED
    description: "",
    is_personal: 0, // REQUIRED
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(true);
  const getData = () => {
    setIsGettingData(true);
    getSingleWorkshift(id)
      .then((res) => {
        console.log({ res });
        setFormData({
          id: res?.id,
          name: res?.name, // REQUIRED
          type: res?.type, // REQUIRED
          departments: res?.departments ? res?.departments : [], // REQUIRED ( IF NO EMPLOYEE SELECTED )
          users: res?.users ? res?.users : [], // REQUIRED ( IF NO DEPARTMENT SELECTED )
          break_type: res?.break_type,
          break_hours: res?.break_hours, // REQUIRED
          details: res?.details, // REQUIRED
          start_date: res?.start_date, // REQUIRED
          end_date: res?.end_date, // REQUIRED
          description: res?.description ? res?.description : "",
          is_personal: res?.is_personal ? 1 : 0,
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
  useEffect(() => {
    getData();
  }, [id]);

  // CHANGING THE SCHEDULE DETAILS
  const [isInitial, setIsInitial] = useState(0);
  useEffect(() => {
    if (isInitial > 1) {
      if (formData.type === "regular") {
        setFormData({
          ...formData,
          details: formData.details.map((d) => ({
            ...d,
            start_at: "",
            end_at: "",
            is_weekend: 0,
          })),
        });
      }

      if (formData.type === "scheduled") {
        setFormData({
          ...formData,
          details: formData.details.map((d) => ({
            ...d,
            start_at: "",
            end_at: "",
            is_weekend: 1,
          })),
        });
      }
    } else {
      setIsInitial(isInitial + 1);
    }
  }, [formData?.type]);

  // GETTING ALL DATA
  // GET ALL DEPARTMENTS
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

  // GET EMPLOYEE
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const getAllEmployeesData = () => {
    setIsLoadingEmployees(true);
    // GETTING EMPLOYEES FUNC
    getAllUsersWithoutPaginationByRole([
      `business_employee#${user?.business_id}`,
      `business_manager#${user?.business_id}`,
      `business_admin#${user?.business_id}`,
    ])
      .then((res) => {
        console.log({ res });
        setEmployees(
          res.map((emp) => ({
            id: emp?.id,
            label: `${emp?.first_Name} ${
              emp?.middle_Name ? emp?.middle_Name : ""
            } ${emp?.last_Name}`,
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

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.start_date && formData.end_date) {
      if (compareDates(formData.start_date, formData.end_date) === -1) {
        newErrors.start_date = "Start date must be before the end date";
        newErrors.end_date = "End date must be after the start date";
      }
    } else {
      // VALIDATE START DATE
      if (!formData.start_date) {
        newErrors.start_date = "Start date is required";
      }
      // VALIDATE END DATE
      if (!formData.end_date) {
        newErrors.end_date = "End date is required";
      }
    }

    if (formData.type === "scheduled") {
      // VALIDATE DETAILS
      formData.details.forEach((detail, index) => {
        if (detail.start_at && detail.end_at) {
          console.log({ t: compareTimes(detail.start_at, detail.end_at) });
          if (
            compareTimes(detail.start_at, detail.end_at) === 1 ||
            compareTimes(detail.start_at, detail.end_at) === 0
          ) {
            newErrors.details = newErrors.details || [];
            newErrors.details.push({
              id: index,
              start_at_error: "Start time must be before the end time",
              end_at_error: "End time must be after the start time",
            });
          }
        } else {
          if (!detail.start_at && detail.is_weekend === 0) {
            newErrors.details = newErrors.details || [];
            newErrors.details.push({
              id: index,
              start_at_error: "Start time is required",
            });
          }

          if (!detail.end_at && detail.is_weekend === 0) {
            newErrors.details = newErrors.details || [];
            newErrors.details.push({
              id: index,
              end_at_error: "End time is required",
            });
          }
        }
      });
    } else {
      if (
        compareTimes(
          formData.details[0]?.start_at,
          formData.details[0]?.end_at
        ) === 1 ||
        compareTimes(
          formData.details[0]?.start_at,
          formData.details[0]?.end_at
        ) === 0
      ) {
        newErrors.details = {
          start_at_error: "Start time must be before the end time",
          end_at_error: "End time must be after the start time",
        };
      }
    }

    // BREAK TYPE
    if (!formData.break_type) {
      newErrors.break_type = "Break type is required";
    }

    // BREAK HOURS
    if (!formData.break_hours) {
      newErrors.break_hours = "Break hours is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunc = () => {
    setIsPendingSubmit(true);
    updateSingleWorkshift(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Work shift updated successfully!`}
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
      updateFunc();
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

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          <CustomField
            value={formData?.name}
            disable={true}
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
          <div className="flex flex-col md:flex-row  md:gap-5">
            {/* START DATE  */}
            <CustomDatePicker
              value={formData?.start_date}
              disable={true}
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
              required={false}
            />

            {/* END DATE  */}
            <CustomDatePicker
              value={formData?.end_date}
              disable={true}
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
              required={false}
            />
          </div>

          {/* SHIFT TYPE  */}
          <div className="w-full md:w-1/2 -mt-1">
            <div className="label">
              <span className="label-text text-md font-bold">
                Choose a working shift type
                <span className="text-error font-bold text-md">*</span>
              </span>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-1 md:gap-5 -mt-1">
              {/* REGULAR  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    disabled
                    type="radio"
                    name={`type`}
                    onChange={handleFormChange}
                    value={"regular"}
                    className="toggle toggle-primary"
                    defaultChecked={formData?.type === "regular"}
                  />
                  <span className="label-text">Regular</span>
                </label>
              </div>
              {/* SCHEDULE  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    disabled
                    type="radio"
                    name={`type`}
                    value={"scheduled"}
                    onChange={handleFormChange}
                    className="toggle toggle-primary"
                    defaultChecked={formData?.type === "scheduled"}
                  />
                  <span className="label-text">Scheduled</span>
                </label>
              </div>
            </div>
          </div>

          {/* SCHEDULE AND WEEKEND  */}
          <div className="border border-primary-content px-2 py-2 rounded-md">
            {/* IF TYPE IS REGULAR  */}
            {formData?.type === "regular" && (
              <div>
                {/* TITLE  */}
                <label className="label">
                  <span className="label-text text-md font-bold">
                    Set Regular Week{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Set week with fixed time)
                    </span>
                  </span>
                </label>
                <div className="px-5 mb-2">
                  <div className="flex flex-col md:flex-row md:gap-5">
                    <CustomTimePicker
                      // minTime={lowestTime}
                      // maxTime={highestTime}
                      id={`start_at`}
                      label={`Pick Start Time`}
                      required
                      name={"start_at"}
                      placeholder="pick a time"
                      value={formData.details[0]?.start_at}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          details: formData.details.map((d) => ({
                            ...d,
                            start_at: convertTo24HourFormat(e),
                          })),
                        })
                      }
                      error={errors?.details?.start_at_error}
                      disable={true}
                    />
                    <CustomTimePicker
                      // minTime={lowestTime}
                      // maxTime={highestTime}
                      id={`end_at`}
                      label={`Pick End Time`}
                      required
                      name={"end_at"}
                      placeholder="pick a time"
                      value={formData.details[0]?.end_at}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          details: formData.details.map((d) => ({
                            ...d,
                            end_at: convertTo24HourFormat(e),
                          })),
                        })
                      }
                      error={errors?.details?.end_at_error}
                      disable={true}
                    />
                  </div>
                  <div>
                    <span className="label-text text-md font-bold  my-2 block">
                      Select weekend day{" "}
                      <span className="text-red-500">(off days)</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 py-2">
                      {[
                        { name: "Monday", value: 1 },
                        { name: "Tuesday", value: 2 },
                        { name: "Wednesday", value: 3 },
                        { name: "Thursday", value: 4 },
                        { name: "Friday", value: 5 },
                        { name: "Saturday", value: 6 },
                        { name: "Sunday", value: 0 },
                      ].map((day, value) => (
                        <div className="flex items-center gap-2">
                          <input
                            checked={
                              formData.details.find((d) => d?.day === day.value)
                                .is_weekend
                            }
                            onChange={(e) => {}}
                            type="checkbox"
                            id={`${day?.name}-${value}`}
                            className="checkbox checkbox-primary"
                            disabled
                          />{" "}
                          <label htmlFor={`${day?.name}-${value}`}>
                            {day?.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* IF TYPE IS SCHEDULE */}
            {formData?.type === "scheduled" && (
              <div>
                {/* TITLE  */}
                <label className="label">
                  <span className="label-text text-md font-bold">
                    Set Scheduled Week{" "}
                    <span className="text-error font-bold text-md">*</span>{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Set week with customized time and without time it will be
                      weekend.)
                    </span>
                  </span>
                </label>
                <div className="grid grid-cols-1 gap-5 px-5 mb-2">
                  {[
                    { name: "Monday", value: 1 },
                    { name: "Tuesday", value: 2 },
                    { name: "Wednesday", value: 3 },
                    { name: "Thursday", value: 4 },
                    { name: "Friday", value: 5 },
                    { name: "Saturday", value: 6 },
                    { name: "Sunday", value: 0 },
                  ].map((day, value) => (
                    <div>
                      {/* DAY TITLE  */}
                      <span>
                        {day.name}{" "}
                        {formData.details.find((d) => d.day === day?.value)
                          .is_weekend ? (
                          <span className="text-xs text-red-500">
                            (Weekend)
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                      <div className="flex sm:gap-2 flex-col sm:flex-row">
                        <CustomTimePicker
                          // minTime={low}
                          // maxTime={highestTime}
                          id={`start_at`}
                          required={
                            formData?.details.find((d) => d?.day === day?.value)
                              .end_at
                          }
                          name={"start_at"}
                          placeholder="Start at"
                          onChange={(e) => {}}
                          error={
                            errors?.details
                              ? errors?.details.length > 0
                                ? errors?.details[day?.value]
                                  ? errors?.details[day?.value]?.start_at_error
                                  : ""
                                : ""
                              : ""
                          }
                          disable={true}
                        />
                        <CustomTimePicker
                          id={`end_at`}
                          required={
                            formData?.details.find((d) => d?.day === day?.value)
                              .start_at
                          }
                          name={"end_at"}
                          placeholder="End at"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              details: formData.details.map((d) => {
                                if (d?.day === day?.value) {
                                  return {
                                    ...d,
                                    end_at: convertTo24HourFormat(e),
                                    is_weekend:
                                      e === "" && d?.start_at === "" ? 1 : 0,
                                  };
                                } else {
                                  return { ...d };
                                }
                              }),
                            })
                          }
                          error={
                            errors?.details
                              ? errors?.details?.length > 0
                                ? errors?.details[day?.value]
                                  ? errors?.details[day?.value]?.end_at_error
                                  : ""
                                : ""
                              : ""
                          }
                          disable={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BREAK  */}
          <div className="flex flex-col">
            <div className="w-full md:w-1/2 mt-1">
              <div className="label">
                <span className="label-text text-md font-bold">
                  Break Type
                  <span className="text-error font-bold text-md">*</span>
                </span>
              </div>

              <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-1 md:gap-5 -mt-1">
                {/* PAID  */}
                <div className="form-control flex justify-start items-center">
                  <label className="label cursor-pointer flex items-center gap-5">
                    <input
                      disabled
                      type="radio"
                      name={`break_type`}
                      // onChange={handleFormChange}
                      value={"paid"}
                      className="toggle toggle-primary"
                      defaultChecked={formData?.break_type === "paid"}
                    />
                    <span className="label-text">Paid</span>
                  </label>
                </div>
                {/* UNPAID  */}
                <div className="form-control flex justify-start items-center">
                  <label className="label cursor-pointer flex items-center gap-5">
                    <input
                      type="radio"
                      disabled
                      name={`break_type`}
                      value={"unpaid"}
                      // onChange={handleFormChange}
                      className="toggle toggle-primaryradio checked:bg-primary"
                      defaultChecked={formData?.break_type === "unpaid"}
                    />
                    <span className="label-text">Unpaid</span>
                  </label>
                </div>
              </div>
            </div>
            {/*  BREAK HOURS */}
            <CustomNumberField
              disable={true}
              id={"break_hours"}
              label={"Break Hours"}
              min={0}
              name={"break_hours"}
              // onChange={handleFormChange}
              value={formData?.break_hours}
              placeholder={"Break Hours"}
              error={errors?.break_hours}
              required={true}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
            />
          </div>

          {/* DESCRIPTION  */}
          <CustomTextareaField
            defaultValue={formData?.description}
            disable={true}
            error={errors?.description}
            fieldClassName={"w-full"}
            id={"description"}
            label={"Description"}
            name={"description"}
            // onChange={handleFormChange}
            placeholder={"Description"}
            type={"text"}
            required={false}
            wrapperClassName={"w-full"}
          />

          <CustomMultiSelect
            top
            error={errors?.departments}
            loading={isLoadingDepartments}
            options={departments}
            label={"Select Departments"}
            // required={true}
            singleSelect={false}
            defaultSelectedValues={departments.filter((d) =>
              formData.departments.some((fd) => fd?.id === d.id)
            )}
            // onSelect={(e) => {
            //   setFormData({
            //     ...formData,
            //     departments:
            //       e.length > 0 ? e.map((department) => department?.id) : [],
            //   });
            // }}
            disable
          />
          <CustomMultiSelect
            top
            error={errors?.users}
            loading={isLoadingEmployees}
            options={employees}
            label={"Select Employee"}
            // required={true}
            singleSelect={false}
            onSelect={(e) => {
              setFormData({
                ...formData,
                users: e.length > 0 ? e.map((user) => user?.id) : [],
              });
            }}
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
