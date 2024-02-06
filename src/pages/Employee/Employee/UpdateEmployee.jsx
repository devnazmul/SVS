import React, { useEffect, useState } from "react";
import Headings from "../../../components/Headings/Headings";
import CustomField from "../../../components/InputFields/CustomField";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRole,
  getAllRolesWithoutPagination,
} from "../../../apis/roles/roles";
import {
  checkEmployeeId,
  createUser,
  getEmployeeId,
  getSingleUsers,
  updateSingleUser,
} from "../../../apis/userAndBusiness/user";
import CustomNumberField from "../../../components/InputFields/CustomNumberField";
import CustomNumberFieldWithCurrency from "../../../components/InputFields/CustomNumberFieldWithCurrency";
import CustomDatepickerField from "../../../components/InputFields/CustomDatepickerField";
import ReactDatePicker from "react-datepicker";
import DatePicker from "../../../components/InputFields/CustomDatePicker";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import CustomSelect from "../../../components/CustomSelect";
import MultiSelect from "../../../components/MultiSelect";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import {
  getAllDesignations,
  getAllDesignationsWithoutPerPage,
} from "../../../apis/designation/designation";
import { getAllEmployeeStatusWithoutPerPage } from "../../../apis/employeeStatus/employeeStatus";
import CustomLoading from "../../../components/CustomLoading";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import CustomFieldWithGenerateID from "../../../components/InputFields/CustomFieldWithGenerateID";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import { useAuth } from "../../../context/AuthContext";
import moment from "moment";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import CheckPermission from "../../../CheckPermission";
import { EMPLOYEE_UPDATE } from "../../../constant/permissions";

export default function UpdateEmployee() {
  const { user } = useAuth();
  const { id } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_Name: "", // REQUIRED
    middle_Name: "",
    last_Name: "", // REQUIRED
    email: "", // REQUIRED
    password: "12345678", // REQUIRED
    password_confirmation: "12345678", // REQUIRED
    phone: "", // REQUIRED
    address_line_1: "", // REQUIRED
    country: "", // REQUIRED
    city: "", // REQUIRED
    lat: "", // REQUIRED
    long: "", // REQUIRED
    role: "", // REQUIRED
    gender: "male", // REQUIRED
    user_id: "", // REQUIRED
    postcode: "", // REQUIRED
    is_in_employee: "1",

    designation_id: "",
    employment_status_id: "",

    salary_per_annum: "",
    joining_date: `${moment(new Date()).format("DD-MM-YYYY")}`,
    address_line_2: "",
    departments: [],

    emergency_contact_details: [], // AT LEAST ONE ELEMENT IS REQUIRED
  });

  const [emergencyContactOne, setEmergencyContactOne] = useState({});

  const [emergencyContactTwo, setEmergencyContactTwo] = useState({});
  const [isGettingData, setIsGettingData] = useState(true);
  // GETTING ALL DATA
  useEffect(() => {
    setIsGettingData(true);
    getSingleUsers(id)
      .then((res) => {
        console.log({ object: moment(res?.joining_date).format("DD-MM-YYYY") });
        setFormData({
          ...formData,
          id: res?.id,
          first_Name: res?.first_Name, // REQUIRED
          middle_Name: res?.middle_Name,
          last_Name: res?.last_Name, // REQUIRED
          email: res?.email, // REQUIRED
          phone: res?.phone, // REQUIRED
          address_line_1: res?.address_line_1, // REQUIRED
          country: res?.country, // REQUIRED
          city: res?.city, // REQUIRED
          lat: res?.lat, // REQUIRED
          long: res?.long, // REQUIRED
          role: res?.roles[0]?.name, // REQUIRED
          gender: res?.gender, // REQUIRED
          user_id: res?.user_id, // REQUIRED
          postcode: res?.postcode, // REQUIRED
          is_in_employee: res?.is_in_employee,

          designation_id: res?.designation_id,
          employment_status_id: res?.employment_status_id,

          salary_per_annum: res?.salary_per_annum,
          joining_date: moment(res?.joining_date).format("DD-MM-YYYY"),
          address_line_2: res?.address_line_2,

          emergency_contact_details: [],
        });
        setEmergencyContactOne({
          full_name: res?.emergency_contact_details[0]?.full_name,
          emergency_contact_name:
            res?.emergency_contact_details[0]?.emergency_contact_name,
          relationship_of_above_to_you:
            res?.emergency_contact_details[0]?.relationship_of_above_to_you,
          address_line_1: res?.emergency_contact_details[0]?.address_line_1,
          city: res?.emergency_contact_details[0]?.city,
          country: res?.emergency_contact_details[0]?.country,
          postcode: res?.emergency_contact_details[0]?.postcode,
          daytime_tel_number:
            res?.emergency_contact_details[0]?.daytime_tel_number,
          eveningtime_tel_number:
            res?.emergency_contact_details[0]?.eveningtime_tel_number,
          mobile_tel_number:
            res?.emergency_contact_details[0]?.mobile_tel_number,
        });
        if (res.emergency_contact_details.length > 1) {
          setEmergencyContactTwo({
            full_name: res?.emergency_contact_details[1]?.full_name,
            emergency_contact_name:
              res?.emergency_contact_details[1]?.emergency_contact_name,
            relationship_of_above_to_you:
              res?.emergency_contact_details[1]?.relationship_of_above_to_you,
            address_line_1: res?.emergency_contact_details[1]?.address_line_1,
            city: res?.emergency_contact_details[1]?.city,
            country: res?.emergency_contact_details[1]?.country,
            daytime_tel_number:
              res?.emergency_contact_details[1]?.daytime_tel_number,
            eveningtime_tel_number:
              res?.emergency_contact_details[1]?.eveningtime_tel_number,
            mobile_tel_number:
              res?.emergency_contact_details[1]?.mobile_tel_number,
          });
        }
        setIsGettingData(false);
      })
      .catch((error) => {
        setIsGettingData(false);
        console.log({ error });
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
  // DEP
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  // DESIG
  const [designations, setDesignations] = useState([]);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(true);

  // STATUS
  const [employeeStatuses, setEmployeeStatuses] = useState([]);
  const [isLoadingEmployeeStatuses, setIsLoadingEmployeeStatuses] =
    useState(true);

  // ROLE
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // GETTING ALL DEPARTMENT,
  const getAllDepartmentsData = () => {
    setIsLoadingDepartments(true);
    // GETTING DEPARTMENTS
    getAllDepartmentsWithoutPerPage()
      .then((res) => {
        setDepartments(res.map((d) => ({ id: d.id, label: d.name })));
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

  // GETTING ALL DESIGNATION
  const getAllDesignationsData = () => {
    setIsLoadingDesignations(true);
    // GETTING DESIGNATION
    getAllDesignationsWithoutPerPage()
      .then((res) => {
        setDesignations(res.map((des) => ({ id: des?.id, label: des?.name })));
        setIsLoadingDesignations(false);
      })
      .catch((error) => {
        console.log({ 110: error });
        setIsLoadingDesignations(false);
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
    getAllDesignationsData();
  }, []);

  // GETTING ALL EMPLOYEE STATUS
  const getAllEmployeeStatusesData = () => {
    setIsLoadingEmployeeStatuses(true);
    // GETTING EMPLOYEE STATUS
    getAllEmployeeStatusWithoutPerPage()
      .then((res) => {
        setEmployeeStatuses(res.map((es) => ({ id: es?.id, label: es?.name })));
        setIsLoadingEmployeeStatuses(false);
      })
      .catch((error) => {
        console.log({ 136: error });
        setIsLoadingEmployeeStatuses(false);
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
    getAllEmployeeStatusesData();
  }, []);

  // GETTING ALL EMPLOYEE STATUS
  const getAllRolesData = () => {
    setIsLoadingRoles(true);
    // GETTING EMPLOYEE STATUS
    getAllRolesWithoutPagination()
      .then((res) => {
        setRoles(
          res
            .filter((r) => r?.name !== `business_owner#${user?.business_id}`)
            .map((es) => ({
              id: es?.id,
              label: `${es?.name.split("_")[1].split("#")[0].toUpperCase()}`,
              value: es?.name,
            }))
        );
        setIsLoadingRoles(false);
      })
      .catch((error) => {
        console.log({ 188: error });
        setIsLoadingRoles(false);
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
    getAllRolesData();
  }, []);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmergencyContactFormOneChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContactOne({
      ...emergencyContactOne,
      [name]: value,
    });
  };

  const handleEmergencyContactFormTwoChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContactTwo({
      ...emergencyContactTwo,
      [name]: value,
    });
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const [emergencyContactOneErrors, setEmergencyContactOneErrors] = useState(
    {}
  );
  const [emergencyContactTwoErrors, setEmergencyContactTwoErrors] = useState(
    {}
  );

  const validateForm = () => {
    const newErrors = {};
    const newEM1Errors = {};
    const newEM2Errors = {};

    // Validate first name
    if (!formData.first_Name || formData.first_Name.trim() === "") {
      newErrors.first_Name = "First name is required";
    }
    // Validate last name
    if (!formData.last_Name || formData.last_Name.trim() === "") {
      newErrors.last_Name = "Last name is required";
    }
    // Validate email
    if (formData.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email.trim()
        )
      ) {
        newErrors.email = "Invalid email";
      }
    } else {
      newErrors.email = "Email is required";
    }
    if (formData.phone) {
      if (formData?.phone.toString().split("").length !== 11) {
        newErrors.phone = "Phone must be 11 digit";
      }
    } else {
      newErrors.phone = "Phone is required";
    }

    if (!formData.address_line_1 || formData.address_line_1.trim() === "") {
      newErrors.address_line_1 = "Address is required";
    }
    if (!formData.postcode || formData.postcode.trim() === "") {
      newErrors.postcode = "Postcode is required";
    }
    if (!formData.country || formData.country.trim() === "") {
      newErrors.country = "Country is required";
    }
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "City is required";
    }
    // if (!formData.lat) {
    //   newErrors.lat = "Latitude is required";
    // }
    // if (!formData.long) {
    //   newErrors.long = "Longitude is required";
    // }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    if (!formData.user_id) {
      newErrors.user_id = "Employee ID is required";
    } else {
      checkEmployeeId(formData?.user_id)
        .then((res) => {
          if (res?.employee_id_exists) {
            newErrors.user_id = "Employee ID is already exist";
          }
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
    setErrors(newErrors);

    // ------------------------------
    // EM-1
    // ------------------------------

    if (emergencyContactOne.mobile_tel_number) {
      if (
        emergencyContactOne?.mobile_tel_number.toString().split("").length !==
        11
      ) {
        newEM1Errors.mobile_tel_number = "Mobile number must be 11 digit";
      }
    } else {
      newEM1Errors.mobile_tel_number = "Mobile number is required";
    }

    if (emergencyContactOne.eveningtime_tel_number) {
      if (
        emergencyContactOne?.eveningtime_tel_number.toString().split("")
          .length !== 11
      ) {
        newEM1Errors.eveningtime_tel_number =
          "Eveningtime tel number must be 11 digit";
      }
    } else {
      newEM1Errors.eveningtime_tel_number =
        "Eveningtime tel number is required";
    }

    if (emergencyContactOne.daytime_tel_number) {
      if (
        emergencyContactOne?.daytime_tel_number.toString().split("").length !==
        11
      ) {
        newEM1Errors.daytime_tel_number = "Daytime tel number must be 11 digit";
      }
    } else {
      newEM1Errors.daytime_tel_number = "Daytime tel number is required";
    }

    // Validate first name
    if (
      !emergencyContactOne.full_name ||
      emergencyContactOne.full_name.trim() === ""
    ) {
      newEM1Errors.full_name = "Full name is required";
    }
    // Validate emergency_contact_name
    if (
      !emergencyContactOne.emergency_contact_name ||
      emergencyContactOne.emergency_contact_name.trim() === ""
    ) {
      newEM1Errors.emergency_contact_name =
        "Emergency contact name is required";
    }
    // Validate relationship_of_above_to_you
    if (
      !emergencyContactOne.relationship_of_above_to_you ||
      emergencyContactOne.relationship_of_above_to_you.trim() === ""
    ) {
      newEM1Errors.relationship_of_above_to_you =
        "Relationship of above to you is required";
    }
    // Validate address_line_1
    if (
      !emergencyContactOne.address_line_1 ||
      emergencyContactOne.address_line_1.trim() === ""
    ) {
      newEM1Errors.address_line_1 = "Address is required";
    }
    if (
      !emergencyContactOne.postcode ||
      emergencyContactOne.postcode.trim() === ""
    ) {
      newEM1Errors.postcode = "Postcode is required";
    }
    setEmergencyContactOneErrors(newEM1Errors);
    // Return true if there are no errors
    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(newEM1Errors).length === 0
    );
  };

  const updateEmployeeFunction = () => {
    setIsPendingSubmit(true);
    const emergencyContactDetails =
      Object.keys(emergencyContactOne).length > 0 &&
      Object.keys(emergencyContactTwo).length > 0
        ? [emergencyContactOne, emergencyContactTwo]
        : Object.keys(emergencyContactOne).length > 0
        ? [emergencyContactOne]
        : Object.keys(emergencyContactTwo).length > 0
        ? [emergencyContactTwo]
        : [];
    const data = {
      ...formData,

      emergency_contact_details: emergencyContactDetails,
    };
    updateSingleUser(data)
      .then((res) => {
        setIsPendingSubmit(false);
        navigate("/employee/all-employees");
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
      updateEmployeeFunction();
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
      <CheckPermission permissionArray={[EMPLOYEE_UPDATE]}>
        <div>
          <div className="border-b-2 border-primary-content py-6">
            <Headings level={1}>Update Employee</Headings>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomField
                defaultValue={formData?.first_Name}
                disable={false}
                error={errors?.first_Name}
                fieldClassName={"w-full"}
                id={"first_Name"}
                label={"First Name"}
                name={"first_Name"}
                onChange={handleFormChange}
                placeholder={"First Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />
              <CustomField
                defaultValue={formData?.middle_Name}
                disable={false}
                error={errors?.middle_Name}
                fieldClassName={"w-full"}
                id={"middle_Name"}
                label={"Middle Name"}
                name={"middle_Name"}
                onChange={handleFormChange}
                placeholder={"Middle Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomField
                defaultValue={formData?.last_Name}
                disable={false}
                error={errors?.last_Name}
                fieldClassName={"w-full"}
                id={"last_Name"}
                label={"Last Name"}
                name={"last_Name"}
                onChange={handleFormChange}
                placeholder={"Last Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />

              <CustomField
                defaultValue={formData?.email}
                disable={false}
                error={errors?.email}
                fieldClassName={"w-full"}
                id={"email"}
                label={"Email"}
                name={"email"}
                onChange={handleFormChange}
                placeholder={"Email"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-5">
              <CustomNumberField
                id={"phone"}
                label={"Phone"}
                min={0}
                name={"phone"}
                onChange={handleFormChange}
                value={formData?.phone}
                placeholder={"Phone"}
                error={errors?.phone}
                required={true}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
              <CustomFieldWithGenerateID
                formData={formData}
                initialCall={false}
                setFormData={setFormData}
                idGenerateFunc={getEmployeeId}
                onIdChange={(id) => {
                  setFormData({ ...formData, user_id: id });
                }}
                value={formData?.user_id}
                disable={false}
                error={errors?.user_id}
                fieldClassName={"w-[calc(100%-3rem)]"}
                id={"user_id"}
                label={"Employee ID"}
                idField={"user_id"}
                name={"user_id"}
                onChange={handleFormChange}
                placeholder={"Employee ID"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <div className="w-full md:w-1/2">
                {/* LABEL */}
                <label htmlFor="address_line_1" className="label">
                  <span className="label-text text-md font-bold">
                    Address{" "}
                    <span className="text-error font-bold text-md">*</span>
                  </span>
                </label>

                {/* FIELD  */}
                <CustomAutoComplete
                  className={`input input-bordered rounded-md w-full`}
                  placeholder="Address"
                  type="text"
                  name="address_line_1"
                  onChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  defaultValue={formData?.address_line_1}
                />

                {/* VALIDATION MESSAGE  */}
                {errors?.address_line_1 && (
                  <label className="label h-7">
                    <span className="label-text-alt text-error">
                      {errors?.address_line_1}
                    </span>
                  </label>
                )}
              </div>
              <CustomField
                id={"postcode"}
                label={"Postcode"}
                required={true}
                type={"text"}
                name={"postcode"}
                onChange={handleFormChange}
                value={formData?.postcode}
                placeholder={"Postcode"}
                error={errors?.postcode}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomDatePicker
                value={formData?.joining_date}
                disable={false}
                error={errors?.joining_date}
                fieldClassName={"w-full"}
                id={"joining_date"}
                label={"Joining Date"}
                name={"joining_date"}
                onChange={(date) => {
                  setFormData({ ...formData, joining_date: date });
                }}
                placeholder={"Joining Date"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={false}
              />
              <CustomNumberFieldWithCurrency
                currency="£"
                defaultValue={formData?.salary}
                disable={false}
                error={errors?.salary}
                fieldClassName={"w-full"}
                id={"salary"}
                label={"Salary"}
                name={"salary"}
                onChange={handleFormChange}
                placeholder={"Salary"}
                wrapperClassName={"w-full md:w-1/2"}
                required={false}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <div className="w-full md:w-1/2">
                <CustomMultiSelect
                  error={errors?.designation_id}
                  loading={isLoadingDesignations}
                  options={designations}
                  label={"Designation"}
                  // required={true}
                  singleSelect
                  defaultSelectedValues={designations.filter(
                    (d) => d?.id === formData?.designation_id
                  )}
                  onSelect={(e) => {
                    setFormData({ ...formData, designation_id: e[0]?.id });
                  }}
                />
              </div>

              <div className="w-full md:w-1/2 -mt-1">
                <div className="label">
                  <span className="label-text text-md font-bold">
                    Gender
                    <span className="text-error font-bold text-md">*</span>
                  </span>
                </div>

                <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-5 -mt-1">
                  {/* MALE  */}
                  <div className="form-control flex justify-start items-center">
                    <label className="label cursor-pointer flex items-center gap-5">
                      <input
                        type="radio"
                        name={`gender`}
                        onChange={handleFormChange}
                        value={"male"}
                        className="toggle toggle-primary"
                        defaultChecked={formData?.gender === "male"}
                      />
                      <span className="label-text">Male</span>
                    </label>
                  </div>
                  {/* FEMALE  */}
                  <div className="form-control flex justify-start items-center">
                    <label className="label cursor-pointer flex items-center gap-5">
                      <input
                        type="radio"
                        name={`gender`}
                        value={"female"}
                        onChange={handleFormChange}
                        className="toggle toggle-primary"
                        defaultChecked={formData?.gender === "female"}
                      />
                      <span className="label-text">Female</span>
                    </label>
                  </div>
                  <div className="form-control flex justify-start items-center">
                    <label className="label cursor-pointer flex items-center gap-5">
                      <input
                        type="radio"
                        name={`gender`}
                        value={"female"}
                        onChange={handleFormChange}
                        className="toggle toggle-primary"
                        defaultChecked={formData?.gender === "other"}
                      />
                      <span className="label-text">Other</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {!isLoadingRoles && !isGettingData && !isGettingData && (
              <div className="flex flex-col md:flex-row justify-between items-end gap-5">
                <CustomMultiSelect
                  error={errors?.employment_status_id}
                  loading={isLoadingEmployeeStatuses}
                  options={employeeStatuses}
                  label={"Employment Status"}
                  // required={true}
                  defaultSelectedValues={employeeStatuses.filter(
                    (d) => d?.id === formData?.employment_status_id
                  )}
                  singleSelect
                  onSelect={(e) =>
                    setFormData({ ...formData, employment_status_id: e[0]?.id })
                  }
                />

                <CustomMultiSelect
                  label={"Role"}
                  error={errors?.role}
                  loading={isLoadingRoles && isGettingData}
                  options={roles}
                  required
                  singleSelect
                  defaultSelectedValues={roles.filter(
                    (d) => d?.value === formData?.role
                  )}
                  onSelect={(e) => {
                    setFormData({ ...formData, role: e[0]?.value });
                  }}
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-end gap-5">
              <div className="w-full md:w-1/2">
                <CustomMultiSelect
                  error={errors?.departments}
                  loading={isLoadingDepartments}
                  options={departments}
                  label={"Department"}
                  // required={true}
                  defaultSelectedValues={designations.filter((item1) =>
                    formData?.departments.some((id) => id === item1.id)
                  )}
                  onSelect={(e) => {
                    setFormData({
                      ...formData,
                      departments: e.map((item) => item?.id),
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <hr className="text-base-100 my-10" />
          {/* EMERGENCY CONTACT 1  */}
          <div className="flex flex-col gap-5">
            <Headings level={2} className={`mb-5`}>
              Emergency Contact 1{" "}
              <span className="text-error text-sm">
                (This section is required)
              </span>{" "}
            </Headings>

            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomField
                defaultValue={emergencyContactOne?.full_name}
                disable={false}
                error={emergencyContactOneErrors?.full_name}
                fieldClassName={"w-full"}
                id={"full_name"}
                label={"Full Name"}
                name={"full_name"}
                onChange={handleEmergencyContactFormOneChange}
                placeholder={"Full Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />
              <CustomField
                defaultValue={emergencyContactOne?.emergency_contact_name}
                disable={false}
                error={emergencyContactOneErrors?.emergency_contact_name}
                fieldClassName={"w-full"}
                id={"emergency_contact_name"}
                label={"Emergency Contact Name"}
                name={"emergency_contact_name"}
                onChange={handleEmergencyContactFormOneChange}
                placeholder={"Emergency Contact Name"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomField
                defaultValue={emergencyContactOne?.relationship_of_above_to_you}
                disable={false}
                error={emergencyContactOneErrors?.relationship_of_above_to_you}
                fieldClassName={"w-full"}
                id={"relationship_of_above_to_you"}
                label={"Relationship Of Above To You"}
                name={"relationship_of_above_to_you"}
                onChange={handleEmergencyContactFormOneChange}
                placeholder={"Relationship Of Above To You"}
                type={"text"}
                wrapperClassName={"w-full md:w-1/2"}
                required={true}
              />

              {/* EC-1 ADDRESS  */}
              <div className="w-full md:w-1/2">
                {/* LABEL */}
                <label htmlFor="address_line_1" className="label">
                  <span className="label-text text-md font-bold">
                    Address{" "}
                    <span className="text-error font-bold text-md">*</span>
                  </span>
                </label>

                {/* FIELD  */}
                <CustomAutoComplete
                  className={`input input-bordered rounded-md w-full`}
                  placeholder="Address"
                  type="text"
                  name="address_line_1"
                  onChange={handleEmergencyContactFormOneChange}
                  formData={emergencyContactOne}
                  setFormData={setEmergencyContactOne}
                  defaultValue={emergencyContactOne?.address_line_1}
                />

                {/* VALIDATION MESSAGE  */}
                {emergencyContactOneErrors?.address_line_1 && (
                  <label className="label h-7">
                    <span className="label-text-alt text-error">
                      {emergencyContactOneErrors?.address_line_1}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomField
                id={"postcode"}
                label={"Postcode"}
                required={true}
                type={"text"}
                name={"postcode"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.postcode}
                placeholder={"Postcode"}
                error={emergencyContactOneErrors?.postcode}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
              <CustomNumberField
                id={"daytime_tel_number"}
                label={"Day Time Tel Number"}
                min={0}
                name={"daytime_tel_number"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.daytime_tel_number}
                placeholder={"Day Time Tel Number"}
                error={emergencyContactOneErrors?.daytime_tel_number}
                required={true}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
              <CustomNumberField
                id={"eveningtime_tel_number"}
                label={"Evening Time Tel Number"}
                min={0}
                name={"eveningtime_tel_number"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.eveningtime_tel_number}
                placeholder={"Evening Time Tel Number"}
                error={emergencyContactOneErrors?.eveningtime_tel_number}
                required={true}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
              <CustomNumberField
                id={"mobile_tel_number"}
                label={"Mobile Tel Number"}
                min={0}
                name={"mobile_tel_number"}
                onChange={handleEmergencyContactFormOneChange}
                value={emergencyContactOne?.mobile_tel_number}
                placeholder={"Mobile Tel Number"}
                error={emergencyContactOneErrors?.mobile_tel_number}
                required={true}
                wrapperClassName={`w-full md:w-1/2`}
                fieldClassName={`w-full`}
              />
            </div>
          </div>

          <hr className="text-base-100 my-10" />
          {/* EMERGENCY CONTACT 2  */}
          <div className="collapse collapse-plus bg-base-300 shadow-md">
            <input
              type="checkbox"
              name="my-accordion-3"
              defaultChecked={Object.keys(emergencyContactTwo).length > 0}
            />
            <div className="collapse-title text-xl font-medium ">
              <Headings level={2} className={`my-0`}>
                Emergency Contact 2{" "}
                <span className="text-gray-300 text-sm">
                  (This section is optional)
                </span>{" "}
              </Headings>
            </div>
            <div className="collapse-content">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  <CustomField
                    defaultValue={emergencyContactTwo?.full_name}
                    disable={false}
                    error={emergencyContactTwoErrors?.full_name}
                    fieldClassName={"w-full"}
                    id={"full_name"}
                    label={"Full Name"}
                    name={"full_name"}
                    onChange={handleEmergencyContactFormTwoChange}
                    placeholder={"Full Name"}
                    type={"text"}
                    wrapperClassName={"w-full md:w-1/2"}
                  />
                  <CustomField
                    defaultValue={emergencyContactTwo?.emergency_contact_name}
                    disable={false}
                    error={emergencyContactTwoErrors?.emergency_contact_name}
                    fieldClassName={"w-full"}
                    id={"emergency_contact_name"}
                    label={"Emergency Contact Name"}
                    name={"emergency_contact_name"}
                    onChange={handleEmergencyContactFormTwoChange}
                    placeholder={"Emergency Contact Name"}
                    type={"text"}
                    wrapperClassName={"w-full md:w-1/2"}
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  <CustomField
                    defaultValue={
                      emergencyContactTwo?.relationship_of_above_to_you
                    }
                    disable={false}
                    error={
                      emergencyContactTwoErrors?.relationship_of_above_to_you
                    }
                    fieldClassName={"w-full"}
                    id={"relationship_of_above_to_you"}
                    label={"Relationship Of Above To You"}
                    name={"relationship_of_above_to_you"}
                    onChange={handleEmergencyContactFormTwoChange}
                    placeholder={"Relationship Of Above To You"}
                    type={"text"}
                    wrapperClassName={"w-full md:w-1/2"}
                  />

                  {/* EC-1 ADDRESS  */}
                  <div className="w-full md:w-1/2">
                    {/* LABEL */}
                    <label htmlFor="address_line_1" className="label">
                      <span className="label-text text-md font-bold">
                        Address
                      </span>
                    </label>

                    {/* FIELD  */}
                    <CustomAutoComplete
                      className={`input input-bordered rounded-md w-full`}
                      placeholder="Address"
                      type="text"
                      name="address_line_1"
                      onChange={handleEmergencyContactFormTwoChange}
                      formData={emergencyContactOne}
                      setFormData={setEmergencyContactOne}
                      defaultValue={emergencyContactTwo?.address_line_1}
                    />

                    {/* VALIDATION MESSAGE  */}
                    {emergencyContactTwoErrors?.address_line_1 && (
                      <label className="label h-7">
                        <span className="label-text-alt text-error">
                          {emergencyContactTwoErrors?.address_line_1}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  <CustomField
                    id={"postcode"}
                    label={"Postcode"}
                    type={"text"}
                    name={"postcode"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.postcode}
                    placeholder={"Postcode"}
                    error={emergencyContactTwoErrors?.postcode}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />
                  <CustomNumberField
                    id={"daytime_tel_number"}
                    label={"Day Time Tel Number"}
                    min={0}
                    name={"daytime_tel_number"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.daytime_tel_number}
                    placeholder={"Day Time Tel Number"}
                    error={emergencyContactTwoErrors?.daytime_tel_number}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                  <CustomNumberField
                    id={"eveningtime_tel_number"}
                    label={"Evening Time Tel Number"}
                    min={0}
                    name={"eveningtime_tel_number"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.eveningtime_tel_number}
                    placeholder={"Evening Time Tel Number"}
                    error={emergencyContactTwoErrors?.eveningtime_tel_number}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />
                  <CustomNumberField
                    id={"mobile_tel_number"}
                    label={"Mobile Tel Number"}
                    min={0}
                    name={"mobile_tel_number"}
                    onChange={handleEmergencyContactFormTwoChange}
                    value={emergencyContactTwo?.mobile_tel_number}
                    placeholder={"Mobile Tel Number"}
                    error={emergencyContactTwoErrors?.mobile_tel_number}
                    wrapperClassName={`w-full md:w-1/2`}
                    fieldClassName={`w-full`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start md:justify-end my-5">
            <button
              disabled={isPendingSubmit}
              onClick={handleSubmit}
              className="btn md:btn-wide btn-primary w-full"
            >
              {isPendingSubmit ? <ButtonSpinner /> : "Update"}
            </button>
          </div>
        </div>
      </CheckPermission>
    );
  }
}
