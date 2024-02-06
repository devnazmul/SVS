import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  assignEmployeesToProject,
  getAllProjectsWithoutPerPage,
  getSingleProject,
} from "../../apis/project/project";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import CustomField from "../../components/InputFields/CustomField";
import CustomDatePicker from "../../components/InputFields/CustomDatePicker";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import CheckPermission from "../../CheckPermission";
import { PROJECT_UPDATE, PROJECT_VIEW } from "../../constant/permissions";
import { getAllDepartmentsWithoutPerPage } from "../../apis/department/department";
import { projectStatus } from "../../constant/projectStatus";
import TextEditor from "../../components/TextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { decryptID } from "../../utils/encryptAndDecryptID";
import { getAllEmployeeStatusWithoutPerPage } from "../../apis/employeeStatus/employeeStatus";
import {
  getAllUsers,
  getAllUsersWithoutPaginationByRole,
} from "../../apis/userAndBusiness/user";
import moment from "moment";
import GoBackButton from "../../components/GoBackButton";
import HTMLRenderer from "../../components/HTMLRenderer";
import ButtonLoading from "../../components/ButtonLoading";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import { FaRegClock, FaTasks, FaUsers } from "react-icons/fa";
import { MdCancel, MdDelete, MdOutlineLinkOff } from "react-icons/md";
import { formatRole } from "../../utils/formatRole";

export default function ViewProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { encId } = useParams();
  const id = decryptID(encId);
  const [isAssignEmployeeAction, setIsAssignEmployeeAction] = useState(false);
  const handleBack = () => {
    navigate(`/project/projects`);
  };

  // DIGITAL CLOCK
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(moment());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // DATA
  const [data, setData] = useState({});
  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    start_date: moment().startOf("month").format("DD-MM-YYYY"),
    end_date: moment().endOf("month").format("DD-MM-YYYY"),
    search_key: "",
    user_id: "",
    order_by: "DESC",
  });

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

  // GETTING ALL DATA
  const [isUpdated, setIsUpdated] = useState(Math.random());
  const [isGettingData, setIsGettingData] = useState(true);
  const getData = () => {
    setIsGettingData(true);
    getSingleProject(id)
      .then((res) => {
        setData({
          name: res?.name || "",
          description: res?.description || "",
          start_date: res?.start_date || "",
          end_date: res?.end_date || "",
          status: res?.status || "",
          department_id: res?.department_id || null,
          departments: res?.departments.length > 0 ? res?.departments : [],
          users: res?.users.length > 0 ? res?.users : [],
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
  }, [id, isUpdated]);

  // GETTING ALL DATA
  // GETTING DEPARTMENTS
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(true);
  // GETTING ALL DEPARTMENT,
  const getAllDepartmentsData = () => {
    setIsLoadingDepartment(true);
    // GETTING DEPARTMENTS
    getAllDepartmentsWithoutPerPage()
      .then((res) => {
        setDepartments(res.map((d) => ({ id: d?.id, label: d?.name })));
        setIsLoadingDepartment(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingDepartment(false);
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

  // ASSIGN EMPLOYEE FUNCTIONALITY
  const [formData, setFormData] = useState({
    id: id,
    users: [],
  });

  // HANDLE VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (formData?.users.length === 0) {
      newErrors.users = "Employee is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors)?.length === 0;
  };

  // CREATE FUNCTION
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    assignEmployeesToProject(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        setIsAssignEmployeeAction(false);
        setFormData({
          id: id,
          users: [],
        });
        setIsUpdated(Math.random());
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Employees assigned successfully!`}
          />
        ));
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

  // LIST TOGGLES
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[PROJECT_VIEW]}>
        <div className="justify-center items-center">
          <div className="px-2 py-5">
            <div className={`flex items-center justify-between`}>
              <span className="text-xl font-bold">Project Details</span>
              <GoBackButton></GoBackButton>
            </div>
            <div className="flex flex-col  mt-5">
              {/* TOP SECTION  */}
              <div className="relative top-0 left-0 w-full overflow-hidden rounded-xl min-h-[240px]">
                <img
                  className={`absolute w-full h-full object-cover`}
                  src="/assets/project-cover.jpg"
                  alt=""
                />
                <div
                  className={`flex bg-black text-white bg-opacity-30 w-full h-full justify-between items-end p-5 md:p-10 absolute`}
                >
                  <div
                    className={`flex flex-col absolute  font-medium top-5 md:top-10 left-5 md:left-10 max-w-[50%] `}
                  >
                    <span className={`text-xs`}>PROJECT NAME</span>
                    <h1 className={`text-lg md:text-2xl font-bold`}>
                      {data?.name}
                    </h1>
                  </div>

                  <div
                    className={`flex flex-col md:flex-row justify-between w-full gap-10`}
                  >
                    {/* START DATE AND DEADLINE  */}
                    <div
                      className={`flex gap-5 justify-between md:justify-start md:gap-10 items-end`}
                    >
                      <div className={`flex flex-col`}>
                        <span className={`md:font-bold text-xs md:text-lg`}>
                          START DATE
                        </span>
                        <h1
                          className={`font-bold md:font-normal text-xs md:text-lg`}
                        >
                          {moment(data?.start_date, "DD-MM-YYYY").format("ll")}
                        </h1>
                      </div>

                      <div className={`flex flex-col`}>
                        <span
                          className={`md:font-bold text-xs md:text-lg text-right md:text-left`}
                        >
                          DEADLINE
                        </span>
                        <h1
                          className={`font-bold md:font-normal text-xs md:text-lg text-right md:text-left`}
                        >
                          {moment(data?.end_date, "DD-MM-YYYY").format("ll")}
                        </h1>
                      </div>
                    </div>

                    {/* TASK AND EMPLOYEE  */}
                    <div
                      className={`flex gap-5 justify-between md:justify-start md:gap-10 items-end`}
                    >
                      <div className={`flex flex-col`}>
                        <span className={`md:font-bold text-xs md:text-lg`}>
                          TASKS
                        </span>
                        <h1
                          className={`font-bold md:font-normal md:text-right text-xs md:text-lg`}
                        >
                          0/100
                        </h1>
                      </div>
                      <div className={`flex flex-col`}>
                        <span
                          className={`md:font-bold text-right text-xs md:text-lg`}
                        >
                          TOTAL EMPLOYEE ASSIGNED
                        </span>
                        <h1
                          className={`font-bold md:font-normal text-xs md:text-lg text-right`}
                        >
                          {moment(data?.start_date, "DD-MM-YYYY").format("ll")}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex gap-2 absolute items-center font-medium top-5 md:top-10 right-5 md:right-10`}
                  >
                    <FaRegClock className={`text-xl md:text-4xl`} />
                    <div className={`flex flex-col`}>
                      <h1 className={`text-xs`}>{time.format("ll")}</h1>
                      <h1 className={`text-sm md:text-xl`}>
                        {time.format("h:mm:ss A")}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION & ASSIGN EMPLOYEES  */}
              <div
                className={`flex justify-between mt-10 gap-5 relative overflow-hidden`}
              >
                {/* DESCRIPTION  */}
                <div
                  className={`w-full bg-base-300 rounded-xl shadow-md shadow-primary-content border-2 border-primary-content p-5`}
                >
                  <div
                    className={`flex justify-between lg:justify-start items-center mb-5`}
                  >
                    <h3 className="text-xl font-bold text-primary">
                      Project Description
                    </h3>
                    <div className={`flex lg:hidden gap-5`}>
                      <button
                        data-tip="All Tasks"
                        className={`tooltip tooltip-left tooltip-primary`}
                        onClick={() => setIsTaskOpen(true)}
                      >
                        <FaTasks className={`text-2xl text-primary`} />
                      </button>
                      <button
                        data-tip="Assigned Employees"
                        className={`tooltip tooltip-left tooltip-primary`}
                        onClick={() => setIsEmployeeOpen(true)}
                      >
                        <FaUsers className={`text-3xl text-primary`} />
                      </button>
                    </div>
                  </div>

                  <div className="default-styles-container">
                    <HTMLRenderer htmlString={data?.description} />
                  </div>
                </div>
                {/* ASSIGNED EMPLOYEES  */}
                <div
                  className={`absolute ${
                    isEmployeeOpen ? "right-0" : "-right-[500px]"
                  }  h-full lg:static flex flex-col w-[300px] duration-300 lg:w-[500px] bg-base-300 rounded-r-xl lg:rounded-xl shadow-md shadow-primary-content border-2 border-primary-content lg:h-auto p-5`}
                >
                  <div
                    className={`flex  justify-between lg:justify-start items-center mb-5`}
                  >
                    <h3 className="text-xl font-bold text-primary">
                      Assigned Employees
                    </h3>
                    <div className={`flex lg:hidden justify-end items-center`}>
                      <button
                        data-tip="close"
                        className={`tooltip tooltip-left tooltip-primary`}
                        onClick={() => setIsEmployeeOpen(false)}
                      >
                        <MdCancel className={`text-3xl text-primary`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div>
                      {!isAssignEmployeeAction && (
                        <button
                          disabled={isPendingSubmit}
                          onClick={() =>
                            setIsAssignEmployeeAction(!isAssignEmployeeAction)
                          }
                          className="btn btn-primary w-full"
                        >
                          {isAssignEmployeeAction
                            ? "Cancel"
                            : "Assign Employee"}
                        </button>
                      )}
                    </div>

                    {isAssignEmployeeAction ? (
                      <div className={`flex flex-col gap-2`}>
                        <CustomMultiSelect
                          error={errors?.users}
                          loading={isLoadingEmployees}
                          options={employees}
                          label={"Employee"}
                          required={true}
                          singleSelect={false}
                          defaultSelectedValues={employees.filter((item1) =>
                            formData?.users.some((id) => id === item1?.id)
                          )}
                          onSelect={(e) => {
                            setFormData({
                              ...formData,
                              users: e.map((item) => item?.id),
                            });
                          }}
                        />
                        <button
                          disabled={isPendingSubmit}
                          onClick={handleSubmit}
                          className="btn btn-primary w-full"
                        >
                          {isPendingSubmit ? <ButtonSpinner /> : "Assign"}
                        </button>
                        <button
                          disabled={isPendingSubmit}
                          onClick={() =>
                            setIsAssignEmployeeAction(!isAssignEmployeeAction)
                          }
                          className="btn btn-outline btn-primary w-full"
                        >
                          {isAssignEmployeeAction
                            ? "Cancel"
                            : "Assign Employee"}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* EMPLOYEE LIST  */}
                  {data?.users?.length > 0 ? (
                    <div className="border-t border-primary-content mt-5 py-5">
                      <h1 className="text-lg font-bold">Employee List</h1>
                      <div className={`flex gap-3 flex-col mt-2`}>
                        {data?.users.map((employee, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between border border-primary-content shadow-md shadow-primary-content px-5 py-2 rounded-md`}
                          >
                            <h3>{`${formatRole(employee?.first_Name)} ${
                              employee?.middle_Name
                                ? formatRole(employee?.middle_Name)
                                : ""
                            } ${formatRole(employee?.last_Name)}`}</h3>
                            <button
                              data-tip="Unassign"
                              className={`cursor-pointer tooltip tooltip-bottom tooltip-primary`}
                            >
                              <MdOutlineLinkOff
                                className={`text-xl text-red-500`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CheckPermission>
    );
  }
}
