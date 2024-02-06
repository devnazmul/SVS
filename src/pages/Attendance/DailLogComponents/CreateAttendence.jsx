import React, { useEffect, useState } from "react";
import CustomLoading from "../../../components/CustomLoading";
import CustomField from "../../../components/InputFields/CustomField";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWIthoutPagination } from "../../../apis/userAndBusiness/user";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import CustomTimePicker from "../../../components/InputFields/CustomTimePicker";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import { convertTo24HourFormat } from "../../../utils/convertTo24HourFormat";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import {
  createAttendance,
  createMultiAttendance,
  getIndividualAttendance,
  getIndividualWorkShiftByEmployee,
} from "../../../apis/attendence/attendence";
import moment from "moment";
import dayjs from "dayjs";
import { getAllWorkLocationsWithoutPerPage } from "../../../apis/workLocation/workLocation";
import { getSingleWorkshiftForLeave } from "../../../apis/workshift/workshift";
import { getAllProjectsWithoutPerPage } from "../../../apis/project/project";

export default function CreateAttendence({
  handleClosePopup,
  getAllAttendence,
  popupOption,
}) {
  console.log(popupOption);
  // VALIDATION
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    note: "", // REQUIRED
    user_id: popupOption?.userId ? popupOption?.userId : null,
    in_time: null, // REQUIRED
    out_time: null, // REQUIRED
    in_date: null, // REQUIRED
    does_break_taken: false, // REQUIRED
    work_location_id: null, // REQUIRED
    leave_duration: "single_day",
    project_id: null,
  });
  const [multiFormData, setMultiFormData] = useState([]);

  const [multidays, setMultiDayes] = useState({
    start_date: null,
    end_date: null,
  });

  // GETTING ALL PROJECT
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const getAllProjectsData = () => {
    setIsLoadingProjects(true);
    // GETTING EMPLOYEE STATUS
    getAllProjectsWithoutPerPage()
      .then((res) => {
        setProjects(
          res.map((ws) => ({
            id: ws?.id,
            label: ws?.name,
          }))
        );
        setIsLoadingProjects(false);
      })
      .catch((error) => {
        console.log({ 188: error });
        setIsLoadingProjects(false);
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
    getAllProjectsData();
  }, []);

  // EMPLOYEE WORKSHIFT
  const [employeeWorkshift, setEmployeeWorkShift] = useState([]);

  // get workshift by employees
  const getEmployeeWorkshift = (id) => {
    getIndividualWorkShiftByEmployee(id)
      .then((res) => {
        setEmployeeWorkShift(res?.details);
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
    if (popupOption?.userId) {
      getEmployeeWorkshift(popupOption?.userId);
    }
  }, [popupOption]);

  const [allOffDays, setAllOffDays] = useState([]);
  const onSelectEmployee = (e) => {
    if (e[0]?.id) {
      setFormData({
        ...formData,
        user_id: e[0]?.id ? e[0]?.id : null,
      });
      getEmployeeWorkshift(e[0]?.id);

      getSingleWorkshiftForLeave(e[0]?.id)
        .then((res2) => {
          setAllOffDays(res2);
        })
        .catch((error) => {
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
  };

  // GET EMPLOYEE
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const getAllEmployeesData = () => {
    setIsLoadingEmployees(true);
    // GETTING EMPLOYEES FUNC
    getAllUsersWIthoutPagination()
      .then((res) => {
        setEmployees(
          res.map((des) => ({
            id: des?.id,
            label: `${des?.first_Name} ${
              des?.middle_Name ? des?.middle_Name : ""
            } ${des?.last_Name}`,
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

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.project_id) {
      newErrors.project_id = "Project is required";
    }
    // Check if required fields are filled
    const requiredFields = [
      "user_id",
      "in_time",
      "out_time",
      "in_date",
      "work_location_id",
      "note",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  const [multiFormErrors, setMultiFormErrors] = useState([]);
  const validateMultiForm = () => {
    const newErrors = [];

    // Validate each element in multiFormData
    multiFormData.forEach((data, index) => {
      const errors = {};

      // Check if required fields are filled for each day
      const requiredFields = [
        "in_time",
        "out_time",
        "work_location_id",
        "in_date",
        "note",
      ];
      requiredFields.forEach((field) => {
        if (!data[field]) {
          errors[field] = "This field is required";
        }
      });

      newErrors[index] = errors;
    });

    return newErrors;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);

  const createFunction = () => {
    if (validateForm()) {
      setIsPendingSubmit(true);
      createAttendance(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          getAllAttendence();
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Attendance create successfully`}
            />
          ));
          handleClosePopup();
        })
        .catch((error) => {
          console.log({ 188: error });
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
    }
  };

  const createMultiFunction = () => {
    // Validate multiFormData before submission
    const newErrors = validateMultiForm();

    // Check if there are any errors in the validation
    const hasErrors = newErrors.some(
      (errors) => Object.keys(errors).length > 0
    );

    if (!hasErrors) {
      setIsPendingSubmit(true);
      createMultiAttendance({
        user_id: formData?.user_id,
        attendance_details: multiFormData,
      })
        .then((res) => {
          setIsPendingSubmit(false);
          setMultiFormErrors([]);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Attendance created successfully`}
            />
          ));
          handleClosePopup();
        })
        .catch((error) => {
          setIsPendingSubmit(false);
          setMultiFormErrors([]);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={`ID: #00119 - ${error?.response?.data?.message}`}
              errors={error?.response?.data?.errors}
            />
          ));
        });
    } else {
      // Set errors in the state
      setMultiFormErrors(newErrors);
    }
  };

  const getDateArray = (start, end) => {
    const arr = [];
    let currentDate = moment(start);

    while (currentDate <= end) {
      arr.push(moment(currentDate));
      currentDate.add(1, "days");
    }

    return arr;
  };

  useEffect(() => {
    if (multidays.start_date && multidays.end_date) {
      const dateArray = getDateArray(
        moment(multidays?.start_date, "DD-MM-YYYY"),
        moment(multidays?.end_date, "DD-MM-YYYY")
      ).map((dt) => {
        const day_name = dt.format("dddd");
        const data = {
          day: dt.format("dddd"),
          day_no:
            day_name === "Sunday"
              ? 0
              : day_name === "Monday"
              ? 1
              : day_name === "Tuesday"
              ? 2
              : day_name == "Wednesday"
              ? 3
              : day_name === "Thursday"
              ? 4
              : day_name === "Friday"
              ? 5
              : 6,
          note: "", // REQUIRED
          in_time: null, // REQUIRED
          out_time: null, // REQUIRED
          in_date: dt.format("DD-MM-YYYY"), // REQUIRED
          does_break_taken: false, // REQUIRED
        };
        return data;
      });

      // Create a new array with updated values
      const resultArray = employeeWorkshift
        .map((item) => {
          const correspondingDay = dateArray.find(
            (dayItem) => dayItem.day_no === item.day
          );

          // Check if the day_no matches and is_weekend is 0
          if (correspondingDay && item.is_weekend === 0) {
            return {
              ...correspondingDay,
              in_time: item.start_at,
              out_time: item.end_at,
            };
          } else {
            return null; // Return null for non-matching entries
          }
        })
        .filter(Boolean);
      setMultiFormData(resultArray);
      // );
    }
  }, [multidays]);

  const handleMultiFormChange = (index, event) => {
    let inputFields = [...multiFormData];
    inputFields[index][event.target.name] = event.target.value;
    setMultiFormData(inputFields);
  };

  const handleSingleDateIn = (date) => {
    const momentDate = moment(date, "DD-MM-YYYY", true);

    if (momentDate.isValid()) {
      const selectedDay = momentDate.day();

      // Find the corresponding work shift for the selected day
      const matchingWorkshift = employeeWorkshift.find(
        (shift) => shift.day === selectedDay
      );

      if (matchingWorkshift) {
        const { start_at, end_at } = matchingWorkshift;

        // Set the form data with the selected date, in_time, and out_time
        setFormData({
          ...formData,
          in_date: date,
          in_time: start_at,
          out_time: end_at,
        });
      } else {
        console.error(`No work shift found for day ${selectedDay}`);
      }
    } else {
      console.error(`Invalid date format: ${date}`);
    }
  };

  if (dataLoading || isLoadingWorkLocations || isLoadingEmployees) {
    return <CustomLoading />;
  } else {
    return (
      <div className="w-full px-5 py-5">
        {/* Employee  */}
        <CustomMultiSelect
          error={errors?.user_id}
          loading={dataLoading || isLoadingEmployees}
          options={employees}
          label={"Employee"}
          required={!popupOption?.userId}
          singleSelect
          defaultSelectedValues={employees.filter(
            (e) => e?.id === formData?.user_id
          )}
          onSelect={(e) => onSelectEmployee(e)}
          disable={!!popupOption?.userId}
        />

        {/* Project  */}
        <div className="w-full">
          <CustomMultiSelect
            // addNewItemButton={true}
            // onClickAddNewItemButton={() => {
            //   setPopupOption({
            //     open: true,
            //     type: "createDesignation",
            //     title: "Create Designation",
            //     onClose: () => {
            //       setPopupOption({ ...popupOption, open: false });
            //     },
            //     id: null,
            //     closeOnDocumentClick: false,
            //   });
            // }}
            error={errors?.project_id}
            loading={isLoadingProjects}
            options={projects}
            label={"Project"}
            required={true}
            singleSelect
            defaultSelectedValues={projects.filter(
              (des) => des?.id === formData?.project_id
            )}
            onSelect={(e) => {
              setFormData({ ...formData, project_id: e[0]?.id || null });
            }}
          />
        </div>

        <div className="w-full md:w-1/2 -mt-1">
          <div className="label">
            <span className="label-text text-md font-bold">
              Attendance Type
              <span className="text-error font-bold text-md">*</span>
            </span>
          </div>

          <div className="flex items-start md:items-center flex-row justify-start  w-full gap-5 -mt-1">
            {/* SINGLE DAY  */}
            <div className="form-control flex justify-start items-center ">
              <label className="label cursor-pointer flex w-full items-center gap-5">
                <input
                  type="radio"
                  name={`leave_duration`}
                  onChange={(e) => {
                    e.target.checked &&
                      setFormData({
                        ...formData,
                        leave_duration: "single_day",
                      });
                  }}
                  value={"single_day"}
                  className="toggle toggle-primary"
                  checked={formData?.leave_duration === "single_day"}
                />
                <span className="label-text inline-block w-[80px]">
                  Single Day
                </span>
              </label>
            </div>

            {/* MULTI-DAY  */}
            <div className="form-control flex justify-start items-center ">
              <label className="label cursor-pointer flex w-full items-center gap-5">
                <input
                  type="radio"
                  name={`leave_duration`}
                  value={"multiple_day"}
                  onChange={(e) => {
                    e.target.checked &&
                      setFormData({
                        ...formData,
                        leave_duration: "multiple_day",
                      });
                  }}
                  className="toggle toggle-primary"
                  checked={formData?.leave_duration === "multiple_day"}
                />
                <span className="label-text inline-block w-[80px]">
                  Multi Day
                </span>
              </label>
            </div>
          </div>
        </div>
        {formData?.leave_duration === "single_day" ? (
          <div>
            <div className="w-full flex flex-col md:flex-row justify-center items-center md:gap-5">
              {/* LOCATION  */}
              <CustomMultiSelect
                error={errors?.work_location_id}
                loading={isLoadingWorkLocations}
                options={workLocations}
                defaultSelectedValues={workLocations.filter(
                  (d) => d?.is_default === 1 && d?.business_id !== null
                )}
                label={"Work Location"}
                singleSelect
                onSelect={(e) => {
                  setFormData({
                    ...formData,
                    work_location_id: e[0]?.id || null,
                  });
                }}
              />
              <CustomDatePicker
                disabledDates={allOffDays}
                right
                value={formData.in_date}
                disable={false}
                error={errors?.in_date}
                fieldClassName={"w-full"}
                id={"in_date"}
                label={"In Date"}
                name={"in_date"}
                onChange={(date) => {
                  console.log(formData?.user_id);
                  if (formData?.user_id) {
                    handleSingleDateIn(date);
                  } else {
                    toast.custom((t) => (
                      <CustomToaster
                        t={t}
                        type={"error"}
                        text={`Please select employee first`}
                      />
                    ));
                  }
                }}
                placeholder={"Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
            </div>
            <div className="">
              {/* TIME PICKER  */}
              <div className="w-full flex flex-col md:flex-row justify-center items-center md:gap-5">
                <CustomTimePicker
                  id={`in_time`}
                  label={`In Time`}
                  required
                  value={formData?.in_time}
                  name={"in_time"}
                  placeholder="pick a time"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      in_time: convertTo24HourFormat(e),
                    })
                  }
                  error={errors?.in_time}
                  disable={false}
                />
                <CustomTimePicker
                  id={`out_time`}
                  label={`Out Time`}
                  required
                  value={formData?.out_time}
                  name={"out_time"}
                  placeholder="pick a time"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      out_time: convertTo24HourFormat(e),
                    })
                  }
                  error={errors?.out_time}
                  disable={false}
                />
              </div>

              {/* NOTE  */}
              <CustomTextareaField
                id={"note"}
                label={"Note"}
                type={"text"}
                name={"note"}
                onChange={handleFormChange}
                value={formData?.note}
                placeholder={"Note"}
                required
                error={errors?.note}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />
            </div>
            {/* SUBMIT BUTTON  */}
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
                onClick={createFunction}
                className="btn w-full md:btn-wide btn-primary"
              >
                {isPendingSubmit ? <ButtonSpinner /> : "Create Attendence"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <CustomDatePicker
                disabledDates={allOffDays}
                value={multidays.start_date}
                disabled={!formData?.user_id}
                error={false}
                fieldClassName={"w-full"}
                id={"start_date"}
                label={"Start Date"}
                name={"start_date"}
                onChange={(date) => {
                  if (formData?.user_id) {
                    const inputDate = dayjs(date, "DD-MM-YYYY");
                    const endOfWeek = inputDate.add(7, "day");
                    setMultiDayes({
                      ...multidays,
                      start_date: inputDate.format("DD-MM-YYYY"),
                      end_date: endOfWeek.format("DD-MM-YYYY"),
                    });
                  } else {
                    toast.custom((t) => (
                      <CustomToaster
                        t={t}
                        type={"error"}
                        text={`Please select employee first`}
                      />
                    ));
                  }
                }}
                placeholder={"Start Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
              <CustomDatePicker
                disabledDates={allOffDays}
                right
                value={multidays.end_date}
                disabled={true}
                error={false}
                fieldClassName={"w-full"}
                id={"date"}
                label={"End Date"}
                name={"end_date"}
                placeholder={"End Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
              />
            </div>
            {multiFormData?.length > 0 ? (
              <div className="lg:flex items-center w-full  gap-5 py-3 font-semibold mt-10 hidden">
                <div className="w-[5%]">#</div>
                <div className="w-[10%]">Day</div>
                <div className="w-[10%]">Date</div>
                <div className="w-[20%]">
                  Work Location
                  <span className="text-error font-bold text-md">*</span>
                </div>

                <div className="w-[20%]">
                  In Time<span className="text-error font-bold text-md">*</span>
                </div>
                <div className="w-[20%]">
                  Out Time
                  <span className="text-error font-bold text-md">*</span>
                </div>
                <div className="w-[20%]">
                  Note<span className="text-error font-bold text-md">*</span>
                </div>
              </div>
            ) : (
              <div className="mb-20"></div>
            )}

            {/* FOR DESKTOP  */}
            {multiFormData?.map((res, i) => (
              <div
                key={i}
                className="lg:flex items-start w-full gap-5 my-2 hidden"
              >
                <div className="w-[5%]">{i + 1}</div>
                <div className="w-[10%]">{res?.day}</div>
                <div className="w-[10%]">{res?.in_date}</div>
                <div className="w-[20%]">
                  {/* LOCATION  */}
                  <CustomMultiSelect
                    required
                    error={multiFormErrors[i]?.work_location_id}
                    loading={isLoadingWorkLocations}
                    options={workLocations}
                    defaultSelectedValues={workLocations.filter(
                      (d) => d?.is_default === 1 && d?.business_id !== null
                    )}
                    // label={"Work Location"}
                    singleSelect
                    onSelect={(e) => {
                      let inputFields = [...multiFormData];
                      console.log({ e });
                      (inputFields[i]["work_location_id"] = e[0]?.id || null),
                        setMultiFormData(inputFields);
                    }}
                  />
                </div>

                <div className="w-[20%]">
                  <CustomTimePicker
                    id={`in_time`}
                    // label={i === 0 ? `In Time` : ""}
                    required
                    name={"in_time"}
                    value={res?.in_time}
                    placeholder="pick a time"
                    onChange={(e) => {
                      let inputFields = [...multiFormData];
                      inputFields[i]["in_time"] = convertTo24HourFormat(e);
                      setMultiFormData(inputFields);
                    }}
                    error={multiFormErrors[i]?.in_time}
                    disable={false}
                  />
                </div>
                <div className="w-[20%]">
                  <CustomTimePicker
                    id={`out_time`}
                    // label={i === 0 ? `Out Time` : ""}
                    required
                    value={res?.out_time}
                    name={"out_time"}
                    placeholder="pick a time"
                    onChange={(e) => {
                      let inputFields = [...multiFormData];
                      inputFields[i]["out_time"] = convertTo24HourFormat(e);
                      setMultiFormData(inputFields);
                    }}
                    error={multiFormErrors[i]?.out_time}
                    disable={false}
                  />
                </div>
                <div className="w-[20%]">
                  <CustomField
                    id={"note"}
                    // label={i === 0 ? `Note` : undefined}
                    type={"text"}
                    name={"note"}
                    onChange={(e) => handleMultiFormChange(i, e)}
                    value={res?.note}
                    placeholder={"Note"}
                    required
                    error={multiFormErrors[i]?.note}
                    wrapperClassName={`w-full`}
                    fieldClassName={`w-full`}
                  />
                </div>
              </div>
            ))}

            {/* FOR MOBILE  */}
            {multiFormData?.map((res, i) => (
              <div
                key={i}
                className="flex flex-col items-center w-full gap-2 my-2 lg:hidden border border-primary-content p-5 rounded-xl"
              >
                <div className="flex gap-2 items-center justify-start w-full">
                  {" "}
                  <div className="">{i + 1}.</div>
                  <div className="font-semibold">{res?.day}</div>
                </div>
                <div className="w-full">{res?.in_date}</div>
                <div className={`w-full`}>
                  <CustomMultiSelect
                    error={multiFormErrors[i]?.work_location_id}
                    loading={isLoadingWorkLocations}
                    options={workLocations}
                    defaultSelectedValues={workLocations.filter(
                      (d) => d?.is_default === 1 && d?.business_id !== null
                    )}
                    label={"Work Location"}
                    singleSelect
                    onSelect={(e) => {
                      let inputFields = [...multiFormData];
                      console.log({ e });
                      (inputFields[i]["work_location_id"] = e[0]?.id || null),
                        setMultiFormData(inputFields);
                    }}
                    required
                  />
                </div>
                <div className="w-full">
                  <CustomTimePicker
                    id={`in_time`}
                    label={`In Time`}
                    required
                    name={"in_time"}
                    value={res?.in_time}
                    placeholder="pick a time"
                    onChange={(e) => {
                      let inputFields = [...multiFormData];
                      inputFields[i]["in_time"] = convertTo24HourFormat(e);
                      setMultiFormData(inputFields);
                    }}
                    error={multiFormErrors[i]?.in_time}
                    disable={false}
                  />
                </div>
                <div className="w-full">
                  <CustomTimePicker
                    id={`out_time`}
                    label={`Out Time`}
                    required
                    value={res?.out_time}
                    name={"out_time"}
                    placeholder="pick a time"
                    onChange={(e) => {
                      let inputFields = [...multiFormData];
                      inputFields[i]["out_time"] = convertTo24HourFormat(e);
                      setMultiFormData(inputFields);
                    }}
                    error={multiFormErrors[i]?.out_time}
                    disable={false}
                  />
                </div>
                <div className="w-full">
                  <CustomField
                    id={"note"}
                    label={`Note`}
                    type={"text"}
                    name={"note"}
                    onChange={(e) => handleMultiFormChange(i, e)}
                    value={res?.note}
                    placeholder={"Note"}
                    required
                    error={multiFormErrors[i]?.note}
                    wrapperClassName={`w-full`}
                    fieldClassName={`w-full`}
                  />
                </div>
              </div>
            ))}

            {/* SUBMIT BUTTON  */}
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
                onClick={createMultiFunction}
                className="btn w-full md:btn-wide btn-primary"
              >
                {isPendingSubmit ? <ButtonSpinner /> : "Create Attendence"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
