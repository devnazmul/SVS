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
  updateAttendance,
} from "../../../apis/attendence/attendence";
import { getAllProjectsWithoutPerPage } from "../../../apis/project/project";

export default function UpdateAttendence({
  handleClosePopup,
  getAllAttendence,
  popupOption,
}) {
  // VALIDATION
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    note: "", // REQUIRED
    user_id: null,
    in_time: null, // REQUIRED
    out_time: null, // REQUIRED
    in_date: null, // REQUIRED
    does_break_taken: false, // REQUIRED
    project_id: null,
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

    // project
    if (!formData?.project_id) {
      newErrors.project_id = "Project is required";
    }
    // Check if required fields are filled
    const requiredFields = [
      "user_id",
      "in_time",
      "out_time",
      "in_date",
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

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);

  const updateFunction = () => {
    if (validateForm()) {
      setIsPendingSubmit(true);
      updateAttendance(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          getAllAttendence();
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Attendance update successfully`}
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

  useEffect(() => {
    setDataLoading(true);
    if (popupOption?.id) {
      getIndividualAttendance(popupOption?.id).then((res) => {
        setFormData(res);
        setDataLoading(false);
      });
    }
  }, [popupOption?.id]);

  console.log(formData);
  if (dataLoading) {
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
          required={true}
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
              Attendence Type
              <span className="text-error font-bold text-md">*</span>
            </span>
          </div>
        </div>
        <div>
          <div className="">
            <CustomDatePicker
              value={formData.in_date}
              disable={false}
              error={errors?.in_date}
              fieldClassName={"w-full"}
              id={"date"}
              label={"In Date"}
              name={"in_date"}
              onChange={(date) => {
                setFormData({ ...formData, in_date: date });
              }}
              placeholder={"Date"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
            {/* TIME PICKER  */}
            <div className="w-full flex flex-col md:flex-row justify-center items-center md:gap-5">
              <CustomTimePicker
                id={`in_time`}
                label={`In Time`}
                required
                name={"in_time"}
                value={formData?.in_time}
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
                name={"out_time"}
                value={formData?.out_time}
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
              onClick={updateFunction}
              className="btn w-full md:btn-wide btn-primary"
            >
              {isPendingSubmit ? <ButtonSpinner /> : "Update Attendence"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
