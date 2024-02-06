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
import { createWorkshift } from "../../../apis/workshift/workshift";
import { compareTimes } from "../../../utils/compareTimes";
import { compareDates } from "../../../utils/compareDates";
import CustomNumberField from "../../../components/InputFields/CustomNumberField";
import { getAllBusinessTimings } from "../../../apis/businessTiming/businessTiming";
import CustomLoading from "../../../components/CustomLoading";
import { smallestTime } from "../../../utils/smallestTime";
import { biggestTime } from "../../../utils/biggestTime";

export default function CreateWorkShift({ handleClosePopup, id = null }) {
  const { user } = useAuth();

  const defaultTiming = [
    {
      day: 0,
      start_at: "",
      end_at: "",
      is_weekend: 1,
    },
    {
      day: 1,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: 0,
    },
    {
      day: 2,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: 0,
    },
    {
      day: 3,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: 0,
    },
    {
      day: 4,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: 0,
    },
    {
      day: 5,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: 0,
    },
    {
      day: 6,
      start_at: "09:00:00",
      end_at: "18:00:00",
      is_weekend: 0,
    },
  ];

  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    type: "regular", // REQUIRED
    departments: [], // REQUIRED ( IF NO EMPLOYEE SELECTED )
    users: [], // REQUIRED ( IF NO DEPARTMENT SELECTED )
    details: user.business_id
      ? defaultTiming
      : [
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
    start_date: "", // REQUIRED
    end_date: "", // REQUIRED
    break_type: "paid",
    break_hours: 0, // REQUIRED
    description: "",
    is_personal: 0, // REQUIRED
  });

  // GETTING ALL DATA
  // GET ALL DEPARTMENTS
  const [businessTiming, setBusinessTiming] = useState(
    user.business_id ? [] : defaultTiming
  );

  const [lowestTime, setLowestTime] = useState(
    smallestTime(defaultTiming.map((bt) => (bt?.start_at ? bt?.start_at : "")))
  );
  const [highestTime, setHighestTime] = useState(
    biggestTime(defaultTiming.map((bt) => (bt?.end_at ? bt?.end_at : "")))
  );
  const [isLoadingBusinessTiming, setIsLoadingBusinessTiming] = useState(
    user.business_id ? true : false
  );
  // GETTING ALL BUSINESS TIMING,
  const getAllBusinessTiming = () => {
    setIsLoadingBusinessTiming(true);
    // GETTING DEPARTMENTS
    getAllBusinessTimings()
      .then((res) => {
        setBusinessTiming(res);
        setLowestTime(
          smallestTime(res.map((bt) => (bt?.start_at ? bt?.start_at : "")))
        );
        setHighestTime(
          biggestTime(res.map((bt) => (bt?.end_at ? bt?.end_at : "")))
        );
        console.log({ res });
        setIsLoadingBusinessTiming(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingBusinessTiming(false);
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
    user.business_id && getAllBusinessTiming();
  }, []);

  // CHANGING THE SCHEDULE DETAILS
  useEffect(() => {
    if (formData.type === "regular") {
      setFormData({
        ...formData,
        details: formData.details.map((d) => ({
          ...d,
          start_at: businessTiming?.find((bt) => bt?.day === d?.day)?.is_weekend
            ? ""
            : lowestTime || "",
          end_at: businessTiming?.find((bt) => bt?.day === d?.day)?.is_weekend
            ? ""
            : highestTime || "",
          is_weekend:
            businessTiming?.find((bt) => bt?.day === d?.day)?.is_weekend || 0,
        })),
      });
    }
    if (formData.type === "scheduled") {
      setFormData({
        ...formData,
        details: formData.details.map((d) => ({
          ...d,
          start_at:
            businessTiming?.find((bt) => bt?.day === d?.day)?.start_at || "",
          end_at:
            businessTiming?.find((bt) => bt?.day === d?.day)?.end_at || "",
          is_weekend:
            businessTiming?.find((bt) => bt?.day === d?.day)?.is_weekend || 0,
        })),
      });
    }
  }, [formData?.type, businessTiming]);

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
    user.business_id && getAllDepartmentsData();
  }, []);

  // GET EMPLOYEE
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const getAllEmployeesData = () => {
    setIsLoadingEmployees(true);
    // GETTING EMPLOYEES FUNC
    getAllUsersWithoutPaginationByRole([
      `business_employee#${user?.business_id}`,
      `business_admin#${user?.business_id}`,
      `business_manager#${user?.business_id}`,
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
    user.business_id && getAllEmployeesData();
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
    // BREAK TYPE
    if (!formData.break_type) {
      newErrors.break_type = "Break type is required";
    }

    // BREAK HOURS
    if (!formData.break_hours) {
      newErrors.break_hours = "Break hours is required";
    }

    // VALIDATE START DATE AND END DATE
    if (formData.start_date && formData.end_date) {
      if (compareDates(formData.start_date, formData.end_date) === -1) {
        newErrors.start_date = "Start date must be before the end date";
        newErrors.end_date = "End date must be after the start date";
      }
    }

    // VALIDATE START TIME AND END TIME
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
          formData.details.filter((d) => d.is_weekend === 0)[0]?.start_at,
          formData.details.filter((d) => d.is_weekend === 0)[0]?.end_at
        ) === 1 ||
        compareTimes(
          formData.details.filter((d) => d.is_weekend === 0)[0]?.start_at,
          formData.details.filter((d) => d.is_weekend === 0)[0]?.end_at
        ) === 0
      ) {
        newErrors.details = {
          start_at_error: "Start time must be before the end time",
          end_at_error: "End time must be after the start time",
        };
      }
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createWorkShiftFunction = () => {
    setIsPendingSubmit(true);
    createWorkshift({ ...formData, break_hours: formData?.break_hours / 60 })
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Work shift created successfully!`}
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
      createWorkShiftFunction();
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

  if (isLoadingBusinessTiming) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
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
          {user.business_id && (
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
                required={false}
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
                required={false}
              />
            </div>
          )}

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
                <label className="label mb-1">
                  <span className="label-text text-md font-bold">
                    Set Regular Week{" "}
                    {/* <span className="text-error font-bold text-md">*</span>{" "} */}
                    <span className="text-gray-400 text-xs font-normal">
                      (Set week with fixed time)
                    </span>
                  </span>
                </label>
                <div className="px-5 mb-2">
                  <div className="flex flex-col md:flex-row md:gap-5">
                    <CustomTimePicker
                      id={`start_at`}
                      label={`Pick Start Time`}
                      required
                      minTime={lowestTime}
                      maxTime={highestTime}
                      name={"start_at"}
                      placeholder="pick a time"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          details: formData.details.map((d) => ({
                            ...d,
                            start_at: convertTo24HourFormat(e),
                          })),
                        })
                      }
                      value={lowestTime}
                      error={errors?.details?.start_at_error}
                      disable={false}
                    />
                    <CustomTimePicker
                      id={`end_at`}
                      label={`Pick End Time`}
                      required
                      minTime={lowestTime}
                      maxTime={highestTime}
                      name={"end_at"}
                      placeholder="pick a time"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          details: formData.details.map((d) => ({
                            ...d,
                            end_at: convertTo24HourFormat(e),
                          })),
                        })
                      }
                      value={highestTime}
                      error={errors?.details?.end_at_error}
                      disable={false}
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
                        <div key={value} className="flex items-center gap-2">
                          <input
                            onChange={(e) => {
                              if (
                                !businessTiming.find(
                                  (bt) => bt?.day === day?.value
                                )?.is_weekend ||
                                !user.business_id
                              ) {
                                setFormData({
                                  ...formData,
                                  details: formData.details.map((d, index) => {
                                    if (day?.value === index) {
                                      if (e.target.checked) {
                                        return {
                                          ...d,
                                          is_weekend: 1,
                                        };
                                      } else {
                                        return {
                                          ...d,
                                          is_weekend: 0,
                                        };
                                      }
                                    } else {
                                      return {
                                        ...d,
                                      };
                                    }
                                  }),
                                });
                              }
                            }}
                            checked={
                              formData?.details?.find(
                                (d) => d?.day === day?.value
                              )?.is_weekend
                            }
                            type="checkbox"
                            id={`${day?.name}-${value}`}
                            className="checkbox checkbox-primary"
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
                <div className="grid grid-cols-1  gap-2 px-5 mb-4">
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
                        {formData?.details?.find((bt) => bt?.day === day?.value)
                          ?.is_weekend ? (
                          <span className="text-xs text-red-500">
                            (Weekend)
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                      <div className="flex sm:gap-2 flex-col sm:flex-row">
                        <CustomTimePicker
                          minTime={
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.start_at
                          }
                          maxTime={
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.end_at
                          }
                          disable={
                            user?.business_id &&
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.is_weekend
                          }
                          id={`start_at`}
                          required={
                            formData?.details.find((d) => d?.day === day?.value)
                              .end_at
                          }
                          value={
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.start_at
                          }
                          name={"start_at"}
                          placeholder="Start at"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              details: formData.details.map((d) => {
                                if (d?.day === day?.value) {
                                  return {
                                    ...d,
                                    start_at: convertTo24HourFormat(e),
                                    is_weekend:
                                      e === "" && d?.end_at === "" ? 1 : 0,
                                  };
                                } else {
                                  return { ...d };
                                }
                              }),
                            })
                          }
                          error={
                            errors?.details
                              ? errors?.details.length > 0
                                ? errors?.details[day?.value]
                                  ? errors?.details[day?.value]?.start_at_error
                                  : ""
                                : ""
                              : ""
                          }
                        />

                        <CustomTimePicker
                          minTime={
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.start_at
                          }
                          maxTime={
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.end_at
                          }
                          id={`end_at`}
                          required={
                            formData?.details.find((d) => d?.day === day?.value)
                              .start_at
                          }
                          value={
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.end_at
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
                          disable={
                            user?.business_id &&
                            businessTiming.find((bt) => bt?.day === day?.value)
                              ?.is_weekend
                          }
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
                      type="radio"
                      name={`break_type`}
                      onChange={handleFormChange}
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
                      name={`break_type`}
                      value={"unpaid"}
                      onChange={handleFormChange}
                      className="toggle toggle-primary"
                      defaultChecked={formData?.break_type === "unpaid"}
                    />
                    <span className="label-text">Unpaid</span>
                  </label>
                </div>
              </div>
            </div>

            {/*  BREAK HOURS */}
            <CustomNumberField
              id={"break_hours"}
              label={"Break minutes"}
              min={0}
              name={"break_hours"}
              onChange={handleFormChange}
              value={formData?.break_hours}
              placeholder={"Break minutes"}
              error={errors?.break_hours}
              required={true}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
            />
          </div>

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
            required={false}
            wrapperClassName={"w-full"}
          />

          {user?.business_id && (
            <CustomMultiSelect
              top
              error={errors?.departments}
              loading={isLoadingDepartments}
              options={departments}
              label={"Select Departments"}
              // required={true}
              singleSelect={false}
              onSelect={(e) => {
                setFormData({ ...formData, departments: e.map((i) => i?.id) });
              }}
            />
          )}

          {/*
          <CustomMultiSelect
            top
            error={errors?.users}
            loading={isLoadingEmployees}
            options={employees}
            label={"Select Employee"}
            // required={true}
            singleSelect={false}
            onSelect={(e) => {
              setFormData({ ...formData, users: e.map((i) => i?.id) });
            }}
          /> */}
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
