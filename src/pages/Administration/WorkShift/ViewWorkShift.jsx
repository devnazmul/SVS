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

export default function ViewWorkShift({ handleClosePopup, id }) {
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
        setFormData({
          id: res?.id,
          name: res?.name, // REQUIRED
          type: res?.type, // REQUIRED
          departments: res?.departments ? res?.departments : [], // REQUIRED ( IF NO EMPLOYEE SELECTED )
          users: res?.users ? res?.users : [], // REQUIRED ( IF NO DEPARTMENT SELECTED )
          break_type: res?.break_type,
          break_hours: res?.break_hours ? res?.break_hours * 60 : 0, // REQUIRED
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
    user.business_id && getAllDepartmentsData();
  }, []);

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          <CustomField
            value={formData?.name}
            disable={true}
            fieldClassName={"w-full"}
            id={"name"}
            label={"Name"}
            name={"name"}
            placeholder={"Name"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* START DATE AND END DATE  */}
          {user.business_id && (
            <div className="flex flex-col md:flex-row  md:gap-5">
              {/* START DATE  */}
              <CustomDatePicker
                value={formData?.start_date}
                disabled={true}
                format="dd-MM-yyyy"
                fieldClassName={"w-full"}
                id={"start_date"}
                label={"Start Date"}
                name={"start_date"}
                placeholder={"Start Date"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={false}
              />

              {/* END DATE  */}
              <CustomDatePicker
                value={formData?.end_date}
                disabled={true}
                fieldClassName={"w-full"}
                format="dd-MM-yyyy"
                id={"end_date"}
                label={"End Date"}
                name={"end_date"}
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
                Work shift type
              </span>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-1 md:gap-5 -mt-1">
              {/* REGULAR  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`type`}
                    disabled={formData?.type !== "regular"}
                    value={"regular"}
                    className="toggle toggle-primary"
                    checked={formData?.type === "regular"}
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
                    disabled={formData?.type !== "scheduled"}
                    className="toggle toggle-primary"
                    checked={formData?.type === "scheduled"}
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
                    Regular Week
                    <span className="text-gray-400 text-xs font-normal">
                      (week with fixed time)
                    </span>
                  </span>
                </label>
                <div className="px-5 mb-2">
                  <div className="flex flex-col md:flex-row md:gap-5">
                    <CustomTimePicker
                      disable={true}
                      id={`start_at`}
                      label={`Start Time`}
                      required
                      name={"start_at"}
                      placeholder="pick a time"
                      value={formData.details[0]?.start_at}
                    />
                    <CustomTimePicker
                      id={`end_at`}
                      label={`End Time`}
                      required
                      name={"end_at"}
                      placeholder="pick a time"
                      value={formData.details[0]?.end_at}
                      disable={true}
                    />
                  </div>
                  <div>
                    <span className="label-text text-md font-bold  my-2 block mt-5">
                      Weekend days{" "}
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
                            checked={
                              formData.details.find((d) => d?.day === day.value)
                                .is_weekend
                            }
                            disabled={
                              !formData.details.find(
                                (d) => d?.day === day.value
                              ).is_weekend
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
                          id={`start_at`}
                          required={
                            formData?.details.find((d) => d?.day === day?.value)
                              .end_at
                          }
                          name={"start_at"}
                          placeholder="Start at"
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
                          disable={true}
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
                <span className="label-text text-md font-bold">Break Type</span>
              </div>

              <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-1 md:gap-5 -mt-1">
                {/* PAID  */}
                <div className="form-control flex justify-start items-center">
                  <label className="label cursor-pointer flex items-center gap-5">
                    <input
                      type="radio"
                      name={`break_type`}
                      value={"paid"}
                      className="toggle toggle-primary"
                      checked={formData?.break_type === "paid"}
                      disabled={formData?.break_type !== "paid"}
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
                      className="toggle toggle-primary"
                      disabled={formData?.break_type !== "unpaid"}
                      checked={formData?.break_type === "unpaid"}
                    />
                    <span className="label-text">Unpaid</span>
                  </label>
                </div>
              </div>
            </div>
            {/*  BREAK HOURS */}
            <CustomNumberField
              id={"break_hours"}
              label={"Break Minutes"}
              min={0}
              name={"break_hours"}
              value={formData?.break_hours}
              placeholder={"Break Minutes"}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
              disable={true}
            />
          </div>

          {/* DESCRIPTION  */}
          {formData?.description && (
            <CustomTextareaField
              defaultValue={formData?.description}
              fieldClassName={"w-full"}
              id={"description"}
              label={"Description"}
              name={"description"}
              placeholder={"Description"}
              type={"text"}
              required={false}
              wrapperClassName={"w-full"}
              disable={true}
            />
          )}

          {user.business_id && (
            <CustomMultiSelect
              top
              loading={isLoadingDepartments}
              options={departments}
              label={"Departments"}
              singleSelect={false}
              defaultSelectedValues={departments.filter((d) =>
                formData.departments.some((fd) => fd?.id === d.id)
              )}
              disable={true}
            />
          )}
        </div>
        <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
          <button
            onClick={handleClosePopup}
            className="btn w-full md:btn-wide btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}
