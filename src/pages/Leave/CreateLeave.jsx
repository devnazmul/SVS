import React, { useEffect, useState } from "react";
import CustomUploadFiles from "../../components/InputFields/CustomUploadFiles";
import Headings from "../../components/Headings/Headings";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import CustomToaster from "../../components/CustomToaster";
import toast from "react-hot-toast";
import { getAllEmployeeStatusWithoutPerPage } from "../../apis/employeeStatus/employeeStatus";
import {
  getAllUsers,
  getAllUsersWIthoutPagination,
  getUsersLeaveDetails,
  uploadUserSingleFile,
} from "../../apis/userAndBusiness/user";
import { getAllDepartmentsWithoutPerPage } from "../../apis/department/department";
import {
  createLeave,
  getAllLeaveWithoutPagination,
  getSingleLeave,
  updateSingleLeave,
  uploadLeaveMultiFile,
} from "../../apis/leave/leaveStatus";
import { getAllLeaveTypesWithoutPerPage } from "../../apis/settings/leaveType/leaveType";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import CustomTimePicker from "../../components/InputFields/CustomTimePicker";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import CustomField from "../../components/InputFields/CustomField";
import CustomTextareaField from "../../components/InputFields/CustomTextareaField";
import CustomLoading from "../../components/CustomLoading";
import { convertTo24HourFormat } from "../../utils/convertTo24HourFormat";
import { getSingleWorkshiftForLeave } from "../../apis/workshift/workshift";
import CustomTimePicker24 from "../../components/InputFields/CustomTimePicker24";
import TimePicker from "../../components/InputFields/CustomTimePicker24";

export default function CreateLeave({
  id = null,
  userId = null,
  selfId = null,
  handleClosePopup,
}) {
  const [formData, setFormData] = useState({
    leave_duration: "single_day", // REQUIRED
    day_type: "",
    leave_type_id: null, // REQUIRED
    user_id: selfId || userId || null, // REQUIRED
    date: "", // REQUIRED
    note: "", // REQUIRED
    start_date: "", // REQUIRED
    end_date: "", // REQUIRED
    start_time: "", // REQUIRED
    end_time: "", // REQUIRED
    attachments: [],
  });

  // GETTING SPECIFIC EMPLOYEE DATA
  const [files, setFiles] = useState([]);

  // GET EMPLOYEE
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [dataLoading, setDataLoading] = useState(id !== null ? true : false);

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

  const getAllData = () => {
    setDataLoading(true);
    // GETTING EMPLOYEES FUNC
    getSingleLeave(id)
      .then((res) => {
        setFormData({
          ...formData,
          id: res?.id, // REQUIRED
          leave_duration: res?.leave_duration, // REQUIRED
          day_type: res?.day_type,
          leave_type_id: res?.leave_type_id, // REQUIRED
          user_id: res?.user_id, // REQUIRED
          date: res?.date, // REQUIRED
          note: res?.note, // REQUIRED
          start_date: res?.start_date, // REQUIRED
          end_date: res?.end_date, // REQUIRED
          start_time: res?.start_time, // REQUIRED
          end_time: res?.end_time, // REQUIRED
          attachments: res?.attachments,
        });
        getAllEmployeesData();
        setDataLoading(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setDataLoading(false);
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
    // if (userId) {
    //   getAllEmployeesData();
    // } else {
    if (id) {
      getAllData();
    } else {
      getAllEmployeesData();
    }
  }, []);

  // GET LEAVE TYPE
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoadingLeaveTypes, setIsLoadingLeaveTypes] = useState(true);
  const getAllLeaveTypesData = () => {
    setIsLoadingLeaveTypes(true);
    // GETTING LEAVE TYPES FUNC
    getAllLeaveTypesWithoutPerPage()
      .then((res) => {
        setLeaveTypes(res.map((des) => ({ id: des?.id, label: des?.name })));
        setIsLoadingLeaveTypes(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingLeaveTypes(false);
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
    getAllLeaveTypesData();
  }, []);

  // GET LEAVE AVAILABILITY
  const [leaveAvailabilities, setLeaveAvailabilities] = useState([]);
  const [allOffDays, setAllOffDays] = useState([]);
  const [isLeaveAvailabilityLoading, setIsLeaveAvailabilityLoading] =
    useState(false);

  useEffect(() => {
    if (formData.user_id !== null && formData.user_id !== undefined) {
      setIsLeaveAvailabilityLoading(true);
      getUsersLeaveDetails(formData?.user_id)
        .then((res) => {
          getSingleWorkshiftForLeave(formData?.user_id)
            .then((res2) => {
              console.log({ res });
              setLeaveAvailabilities(res);
              setAllOffDays(res2);
              setIsLeaveAvailabilityLoading(false);
            })
            .catch((error) => {
              console.log({ 103: error });
              setIsLeaveAvailabilityLoading(false);
              toast.custom((t) => (
                <CustomToaster
                  t={t}
                  type={"error"}
                  text={`ID: #00119 - ${error?.response?.data?.message}`}
                  errors={error?.response?.data?.errors}
                />
              ));
            });
        })
        .catch((error) => {
          console.log({ 103: error });
          setIsLeaveAvailabilityLoading(false);
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
      setLeaveAvailabilities([]);
    }
  }, [formData?.user_id]);

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

  // SHOW HIDE LEAVE DETAILS
  const [isShowingLeave, setIsShowingLeave] = useState(false);

  // VALIDATION
  const validateForm = () => {
    // date: "", // REQUIRED
    // start_date: "", // REQUIRED
    // end_date: "", // REQUIRED
    // start_time: "", // REQUIRED
    // end_time: "", // REQUIRED
    // attachments: [],
    const newErrors = {};
    // Validate note
    if (!formData.note) {
      newErrors.note = "Note is required";
    }

    // Validate leave_duration
    if (!formData.leave_duration || formData.leave_duration.trim() === "") {
      newErrors.leave_duration = "Leave duration name is required";
    } else {
      if (formData.leave_duration === "single_day") {
        // Validate date
        if (!formData.date) {
          newErrors.date = "Date is required";
        }
      }

      if (formData.leave_duration === "multiple_day") {
        // Validate leave_type_id
        if (!formData.start_date) {
          newErrors.start_date = "Start date is required";
        }
        if (!formData.end_date) {
          newErrors.end_date = "End date is required";
        }
      }
      if (formData.leave_duration === "half_day") {
        // Validate leave_type_id
        if (!formData.date) {
          newErrors.date = "Date is required";
        }
        if (!formData.day_type) {
          newErrors.day_type = "Day type is required";
        }
      }
      if (formData.leave_duration === "hours") {
        // Validate leave_type_id
        if (!formData.date) {
          newErrors.date = "Date is required";
        }
        if (!formData.start_time) {
          newErrors.start_time = "Start time is required";
        }
        if (!formData.end_time) {
          newErrors.end_time = "End time is required";
        }
      }
    }

    // Validate leave_type_id
    if (!formData.leave_type_id) {
      newErrors.leave_type_id = "Leave type name is required";
    }
    // Validate user_id
    if (!formData.user_id) {
      newErrors.user_id = "Employe name is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const createFunction = (files = []) => {
    setIsPendingSubmit(true);
    createLeave({ ...formData, attachments: files })
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Leave assigned successfully`}
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
  };

  const updateFunction = (files = []) => {
    setIsPendingSubmit(true);

    updateSingleLeave({ ...formData, attachments: files })
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Leave assigned successfully`}
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
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const handleSubmit = () => {
    if (validateForm()) {
      const filePromises = files.map((file) => {
        setIsPendingSubmit(true);
        return uploadUserSingleFile(file)
          .then((result) => result?.full_location)
          .catch((error) => {
            console.log({ 188: error });
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"error"}
                text={`ID: #00119 - ${error?.response?.data?.message}`}
                errors={error?.response?.data?.errors}
              />
            ));
          });
      });

      Promise.all(filePromises)
        .then((fileLinks) => {
          // Now you have all fileLinks
          if (fileLinks.length > 0) {
            // Handle the case when there are file links

            if (id) {
              updateFunction(fileLinks);
            } else {
              createFunction(fileLinks);
            }
          } else {
            // Handle the case when there are no file links
            if (id) {
              updateFunction();
            } else {
              createFunction();
            }
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during file uploads
          console.error("Error in Promise.all:", error);
        });
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
  if (dataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="w-full px-5 py-5">
        <div className="flex flex-col gap-5">
          <>
            {/* Employee  */}
            <CustomMultiSelect
              error={errors?.user_id}
              loading={dataLoading || isLoadingEmployees}
              options={employees}
              label={"Employee"}
              required={!selfId}
              singleSelect
              defaultSelectedValues={employees.filter(
                (e) => e?.id === formData?.user_id
              )}
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  user_id: e[0]?.id ? e[0]?.id : null,
                });
              }}
              disable={selfId}
            />
          </>

          {/* LEAVE AVAILABILITY  */}
          <>
            {isLeaveAvailabilityLoading ? (
              <span className="loading loading-spinner loading-xs text-primary"></span>
            ) : (
              <>
                {leaveAvailabilities.length > 0 ? (
                  <>
                    <div className="flex gap-2">
                      <span>Leave availability</span>
                      <button
                        onClick={() => setIsShowingLeave(!isShowingLeave)}
                        className="text-primary"
                      >
                        {isShowingLeave ? "Hide" : "Show"}
                      </button>
                    </div>
                    {isShowingLeave && (
                      <div className="bg-primary-content border-2 border-primary p-5 rounded-xl">
                        <ul>
                          {leaveAvailabilities.map(
                            (leaveAvailability, index) => (
                              <li>
                                <h3>
                                  {leaveAvailability?.name}{" "}
                                  <span className="font-medium">
                                    ({leaveAvailability?.type})
                                  </span>{" "}
                                  :{" "}
                                  {(
                                    parseFloat(leaveAvailability?.amount) -
                                    parseFloat(
                                      leaveAvailability?.already_taken_hours
                                    )
                                  ).toFixed(2)}
                                </h3>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>

          {/* LEAVE TYPE  */}
          <CustomMultiSelect
            error={errors?.leave_type_id}
            loading={isLoadingLeaveTypes || dataLoading}
            options={leaveTypes}
            label={"Leave Type"}
            required={true}
            singleSelect
            defaultSelectedValues={leaveTypes.filter(
              (l) => l?.id === formData?.leave_type_id
            )}
            onSelect={(e) => {
              setFormData({
                ...formData,
                leave_type_id: e[0]?.id,
              });
            }}
          />

          {/* LEAVE DURATION  */}
          <div className="w-full -mt-1">
            <div className="label">
              <span className="label-text text-md font-bold">
                Leave Duration
                <span className="text-error font-bold text-md">*</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 -mt-1">
              {/* SINGLE DAY  */}
              <label className="label cursor-pointer flex w-full items-center justify-start gap-2">
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

              {/* MULTI-DAY  */}
              <label className="label cursor-pointer flex w-full items-center justify-start gap-2">
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

              {/* HALF DAY  */}
              <label className="label cursor-pointer flex w-full items-center justify-start gap-2">
                <input
                  type="radio"
                  name={`leave_duration`}
                  value={"half_day"}
                  onChange={(e) => {
                    e.target.checked &&
                      setFormData({
                        ...formData,
                        leave_duration: "half_day",
                      });
                  }}
                  className="toggle toggle-primary"
                  checked={formData?.leave_duration === "half_day"}
                />
                <span className="label-text inline-block w-[80px]">
                  Half Day
                </span>
              </label>

              {/* HOURS  */}
              <label className="label cursor-pointer inline-flex w-full items-center justify-start gap-2">
                <input
                  type="radio"
                  name={`leave_duration`}
                  value={"hours"}
                  onChange={(e) => {
                    e.target.checked &&
                      setFormData({ ...formData, leave_duration: "hours" });
                  }}
                  className="toggle toggle-primary"
                  checked={formData?.leave_duration === "hours"}
                />
                <span className="label-text inline-block w-[80px]">Hours</span>
              </label>
            </div>
          </div>

          <div className="w-full">
            {/* FOR SINGLE DAY LEAVE  */}
            {formData?.leave_duration === "single_day" && (
              <CustomDatePicker
                disabledDates={allOffDays}
                value={formData.date}
                disable={false}
                error={errors?.date}
                fieldClassName={"w-full"}
                id={"date"}
                label={"Date"}
                name={"date"}
                onChange={(date) => {
                  setFormData({ ...formData, date: date });
                }}
                placeholder={"Date"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={false}
              />
            )}

            {/* FOR MULTI DAY LEAVE  */}
            {formData?.leave_duration === "multiple_day" && (
              <div className="flex flex-col md:flex-row md:gap-5">
                <CustomDatePicker
                  value={formData.start_date}
                  disable={false}
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
                  wrapperClassName={"w-full"}
                  required={false}
                />

                <CustomDatePicker
                  right
                  value={formData.end_date}
                  disable={false}
                  error={errors?.end_date}
                  fieldClassName={"w-full"}
                  id={"end_date"}
                  label={"end_date"}
                  name={"End Date"}
                  onChange={(date) => {
                    setFormData({ ...formData, end_date: date });
                  }}
                  placeholder={"End Date"}
                  type={"text"}
                  wrapperClassName={"w-full"}
                  required={false}
                />
              </div>
            )}

            {/* FOR HALF DAY LEAVE  */}
            {formData?.leave_duration === "half_day" && (
              <>
                <CustomDatePicker
                  disabledDates={allOffDays}
                  value={formData.date}
                  disable={false}
                  error={errors?.date}
                  fieldClassName={"w-full"}
                  id={"date"}
                  label={"Date"}
                  name={"date"}
                  onChange={(date) => {
                    setFormData({ ...formData, date: date });
                  }}
                  placeholder={"Date"}
                  type={"text"}
                  wrapperClassName={"w-full"}
                  required={false}
                />
                <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-5 mt-1">
                  {/* FIRST HALF  */}
                  <div className="form-control flex justify-start items-center">
                    <label className="label cursor-pointer flex w-full items-center gap-5">
                      <input
                        type="radio"
                        name={`day_type`}
                        onChange={(e) => {
                          e.target.checked &&
                            setFormData({
                              ...formData,
                              day_type: "first_half",
                            });
                        }}
                        value={"first_half"}
                        className="toggle toggle-primary"
                        checked={formData?.day_type === "first_half"}
                      />

                      <span className="label-text inline-block w-[80px]">
                        First Half
                      </span>
                    </label>
                  </div>

                  {/* SECOND HALF  */}
                  <div className="form-control flex justify-start items-center">
                    <label className="label cursor-pointer flex w-full items-center gap-5">
                      <input
                        type="radio"
                        name={`day_type`}
                        onChange={(e) => {
                          e.target.checked &&
                            setFormData({
                              ...formData,
                              day_type: "last_half",
                            });
                        }}
                        value={"last_half"}
                        className="toggle toggle-primary"
                        checked={formData?.day_type === "last_half"}
                      />

                      <span className="label-text inline-block w-[80px]">
                        Last Half
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* FOR HOURLY LEAVE  */}
            {formData?.leave_duration === "hours" && (
              <>
                <CustomDatePicker
                  disabledDates={allOffDays}
                  value={formData.date}
                  disable={false}
                  error={errors?.date}
                  fieldClassName={"w-full"}
                  id={"date"}
                  label={"Date"}
                  name={"date"}
                  onChange={(date) => {
                    setFormData({ ...formData, date: date });
                  }}
                  placeholder={"Date"}
                  type={"text"}
                  wrapperClassName={"w-full"}
                  required={false}
                />
                {/* TIME PICKER  */}
                <div className="w-full flex flex-col md:flex-row justify-center items-center md:gap-5">
                  <CustomTimePicker
                    id={`start_time`}
                    label={`Start Time`}
                    maxTime={"08:00:00"}
                    minTime={"07:45:00"}
                    required
                    name={"start_time"}
                    placeholder="pick a time"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        start_time: convertTo24HourFormat(e),
                      })
                    }
                    error={errors?.start_time}
                    disable={false}
                  />
                  <CustomTimePicker
                    id={`end_time`}
                    label={`End Time`}
                    required
                    name={"end_time"}
                    placeholder="pick a time"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        end_time: convertTo24HourFormat(e),
                      })
                    }
                    error={errors?.end_time}
                    disable={false}
                  />
                </div>
              </>
            )}
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

          {/* FILE UPLOADER  */}
          <CustomUploadFiles
            files={files}
            setFiles={setFiles}
            details={`Only JPEG, JPG, PNG formats (Max file size 2MB)`}
          />

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
              onClick={handleSubmit}
              className="btn w-full md:btn-wide btn-primary"
            >
              {isPendingSubmit ? (
                <ButtonSpinner />
              ) : (
                `${id ? "Update Leave" : "Create Leave"}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
