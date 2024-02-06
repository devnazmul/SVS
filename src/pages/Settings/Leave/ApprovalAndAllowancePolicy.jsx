import React, { useEffect, useState } from "react";
import {
  updateLeaveSetting,
  getLeaveSetting,
} from "../../../apis/settings/leaveType/leaveSettings";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { useAuth } from "../../../context/AuthContext";
import CustomLoading from "../../../components/CustomLoading";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { types } from "../../../constant/types";
import { getAllUsersWIthoutPagination } from "../../../apis/userAndBusiness/user";
import { getAllRolesWithoutPagination } from "../../../apis/roles/roles";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import { month } from "../../../constant/month";
import { getAllEmployeeStatusWithoutPerPage } from "../../../apis/employeeStatus/employeeStatus";
import { formatRole } from "../../../utils/formatRole";

export default function ApprovalAndAllowancePolicy({ tabName }) {
  const { user } = useAuth();
  // DATA FOR MULTI
  const [formData, setFormData] = useState({
    start_month: 1,
    approval_level: "multiple",
    allow_bypass: 0,
    special_users: [],
    special_roles: [],
    paid_leave_employment_statuses: [],
    unpaid_leave_employment_statuses: [],
  });
  const [level, setLevel] = useState("single");
  // DATA FOR SINGLE
  const [formData2, setFormData2] = useState({
    start_month: 1,
    approval_level: "single",
    allow_bypass: 0,
    special_users: [],
    special_roles: [],
    paid_leave_employment_statuses: [],
    unpaid_leave_employment_statuses: [],
  });

  //   GETTING DATA
  const [isGettingData, setIsGettingData] = useState(true);
  useEffect(() => {
    console.log("object");
    setIsGettingData(true);
    getLeaveSetting()
      .then((res) => {
        console.log({ res });
        if (res?.approval_level === "single") {
          setLevel("single");
          setFormData2({
            start_month: res.start_month,
            approval_level: "single",
            allow_bypass: res.allow_bypass,
            special_users: res.special_users.map((i) => i?.id),
            special_roles: res.special_roles.map((i) => i?.id),
            paid_leave_employment_statuses:
              res?.paid_leave_employment_statuses.map((i) => i?.id),
            unpaid_leave_employment_statuses:
              res?.unpaid_leave_employment_statuses.map((i) => i?.id),
          });
        } else {
          setLevel("multiple");
          setFormData({
            start_month: res.start_month,
            approval_level: "multiple",
            allow_bypass: res.allow_bypass,
            special_users: res.special_users
              ? res.special_users.map((i) => i?.id)
              : [],
            special_roles: res.special_roles
              ? res.special_roles.map((i) => i?.id)
              : [],
            paid_leave_employment_statuses: res?.paid_leave_employment_statuses
              ? res?.paid_leave_employment_statuses.map((i) => i?.id)
              : [],
            unpaid_leave_employment_statuses:
              res?.unpaid_leave_employment_statuses
                ? res?.unpaid_leave_employment_statuses.map((i) => i?.id)
                : [],
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
  }, [tabName]);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // GETTING ALL USERS
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const getAllUsersData = () => {
    setIsLoadingUsers(true);
    // GETTING USERS
    getAllUsersWIthoutPagination()
      .then((res) => {
        setUsers(
          res.map((u) => ({
            id: u.id,
            label: `${u.first_Name} ${u?.middle_Name ? u.middle_Name : ""} ${
              u.last_Name
            }`,
          }))
        );
        setIsLoadingUsers(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingUsers(false);
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
    getAllUsersData();
  }, []);

  // GETTING ALL ROLES
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const getAllRolesData = () => {
    setIsLoadingRoles(true);
    // GETTING ROLE
    getAllRolesWithoutPagination()
      .then((res) => {
        setRoles(
          res.map((r) => ({
            id: r?.id,
            label: formatRole(r?.name),
            value: r?.name,
          }))
        );
        setIsLoadingRoles(false);
      })
      .catch((error) => {
        console.log({ 176: error });
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

  // GETTING ALL STATUS
  const [status, setStatus] = useState([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const getAllStatusData = () => {
    setIsLoadingStatus(true);
    // GETTING EMPLOYMENT STATUS
    getAllEmployeeStatusWithoutPerPage()
      .then((res) => {
        setStatus(
          res.map((r) => ({
            id: r?.id,
            label: r?.name,
          }))
        );
        setIsLoadingStatus(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingStatus(false);
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
    getAllStatusData();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateLeaveSetting(level === "multiple" ? formData : formData2)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Leave settings saved!`}
          />
        ));
      })
      .catch((error) => {
        console.log({ error });
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
      updateFunction();
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

  if (isGettingData || isLoadingRoles || isLoadingUsers) {
    return <CustomLoading />;
  } else {
    return (
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 pb-10">
        <div className="w-full h-[550px] border-b border-primary-content lg:border-b-0 sm:w-full lg:w-1/2 lg:rounded-xl lg:shadow-xl p-5 lg:shadow-primary-content lg:border lg:border-gray-300">
          <h1 className="text-center text-primary text-xl font-bold mb-5">
            Approval Settings
          </h1>
          <div className="w-full lg:w-1/2 -mt-1">
            <div className="label">
              <span className="label-text text-md font-bold">
                Request approval type
              </span>
            </div>

            <div className="flex items-start lg:items-center flex-col lg:flex-row justify-start w-full gap-5 -mt-1">
              {/* MULTI LEVEL  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex w-[150px] items-start justify-start gap-2">
                  <input
                    type="radio"
                    name={`approval_level`}
                    value={"multiple"}
                    onChange={(e) => {
                      setLevel("multiple");
                    }}
                    className="toggle toggle-primary"
                    checked={level === "multiple"}
                  />
                  <span className="label-text">Multi Level</span>
                </label>
              </div>

              {/* SINGLE LEVEL  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex w-[150px] items-start justify-start gap-2">
                  <input
                    type="radio"
                    name={`approval_level`}
                    onChange={(e) => {
                      setLevel("single");
                    }}
                    value={"single"}
                    className="toggle toggle-primary"
                    checked={level === "single"}
                  />
                  <span className="label-text">Single Level</span>
                </label>
              </div>
            </div>
          </div>

          {/* NOTE  */}
          <div
            className={`bg-primary-content w-full transition-all duration-300 rounded-xl overflow-hidden
           h-auto  p-5 pl-10 my-5
          `}
          >
            <p>
              <span className="font-medium"> Note: </span>
              <span>
                {level === "multi"
                  ? " Need multi approval by Department manager based on department hierarchy or single approval by Manager/App admin."
                  : "Only one approval needed by any Department manager to admin user."}
              </span>
            </p>
          </div>
          {/* BYPASS */}
          {level === "multiple" && (
            <div className="w-full lg:w-1/2 mt-5">
              <div className="label">
                <span className="label-text text-md font-bold">
                  Allow bypass
                </span>
              </div>
              <div className="flex items-start lg:items-center flex-col lg:flex-row justify-start w-full gap-5 -mt-1">
                <div className="form-control flex justify-start items-center">
                  <label className="label cursor-pointer flex flex-col items-start  gap-2">
                    <input
                      type="checkbox"
                      name={`approval_level`}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          allow_bypass: e.target.checked ? 1 : 0,
                        });
                      }}
                      className="toggle block toggle-primary checked:bg-primary"
                      checked={formData?.allow_bypass === 1}
                    />
                    <span className="label-text block">
                      In the enable state all managers can bypass the leave
                      request
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
          {level === "single" && (
            <div>
              {/* By User  */}
              <CustomMultiSelect
                error={errors?.special_users}
                options={users}
                label={"By User"}
                defaultSelectedValues={users.filter((item2) =>
                  formData2.special_users.some((item1) => item1 === item2.id)
                )}
                singleSelect={false}
                loading={isGettingData || isLoadingRoles || isLoadingUsers}
                onSelect={(e) => {
                  setFormData2({
                    ...formData2,
                    special_users: e.map((u) => u?.id) || [],
                  });
                }}
              />
              {/* By Role  */}
              <CustomMultiSelect
                error={errors?.special_roles}
                options={roles}
                label={"By Role"}
                top
                singleSelect={false}
                defaultSelectedValues={roles.filter((item2) =>
                  formData2.special_roles.some((item1) => item1 === item2.id)
                )}
                loading={isGettingData || isLoadingRoles || isLoadingUsers}
                onSelect={(e) => {
                  setFormData2({
                    ...formData2,
                    special_roles: e.map((r) => r?.id) || [],
                  });
                }}
              />
            </div>
          )}
          <div className="w-full flex justify-end">
            <button
              disabled={isPendingSubmit}
              onClick={handleSubmit}
              className="btn w-1/2 lg:btn-wide btn-primary mt-5"
            >
              {isPendingSubmit ? <ButtonSpinner /> : "Save"}
            </button>
          </div>
        </div>

        <div className="w-full h-[550px] sm:w-full lg:w-1/2 lg:rounded-xl lg:shadow-xl p-5 lg:shadow-primary-content lg:border lg:border-gray-300">
          <h1 className="text-center text-primary text-xl font-bold mb-5">
            Allowance Policy
          </h1>

          {/* NOTE  */}
          <div
            className={`bg-primary-content w-full transition-all duration-300 rounded-xl overflow-hidden
           h-auto  p-5 pl-10 my-5
          `}
          >
            <p>
              <span className="font-medium -ml-5"> Note: </span>
              <ul className="list-decimal">
                <li>Any type of change will be effective on the next day.</li>
                <li>
                  Remained leave will not carry forward to next leave year.
                </li>
              </ul>
            </p>
          </div>

          <div>
            {/* SELECT MONTH  */}
            <CustomMultiSelect
              error={errors?.start_month}
              options={month}
              label={"Leave will start from the month of"}
              defaultSelectedValues={
                level === "single"
                  ? month.filter((item) => item?.id === formData2?.start_month)
                  : month.filter((item) => item?.id === formData?.start_month)
              }
              singleSelect={true}
              onSelect={(e) => {
                level === "single"
                  ? setFormData2({
                      ...formData2,
                      start_month: e[0]?.id || null,
                    })
                  : setFormData({
                      ...formData,
                      start_month: e[0]?.id || null,
                    });
              }}
            />
            {/* FOR PAID LEAVE  */}
            <CustomMultiSelect
              error={errors?.special_users}
              options={status}
              label={"Paid Leave By Status"}
              required={true}
              defaultSelectedValues={status.filter((item2) =>
                formData2.paid_leave_employment_statuses.some(
                  (item1) => item1 === item2.id
                )
              )}
              singleSelect={false}
              loading={
                isGettingData ||
                isLoadingRoles ||
                isLoadingUsers ||
                isLoadingStatus
              }
              onSelect={(e) => {
                setFormData2({
                  ...formData2,
                  paid_leave_employment_statuses: e.map((u) => u?.id) || [],
                });
              }}
            />
            {/* FOR UNPAID LEAVE  */}
            <CustomMultiSelect
              error={errors?.special_users}
              options={status}
              top
              label={"Unpaid Leave By Status"}
              required={true}
              defaultSelectedValues={status.filter((item2) =>
                formData2.unpaid_leave_employment_statuses.some(
                  (item1) => item1 === item2.id
                )
              )}
              singleSelect={false}
              loading={
                isGettingData ||
                isLoadingRoles ||
                isLoadingUsers ||
                isLoadingStatus
              }
              onSelect={(e) => {
                setFormData2({
                  ...formData2,
                  unpaid_leave_employment_statuses: e.map((u) => u?.id) || [],
                });
              }}
            />
          </div>

          <div className="w-full flex justify-end">
            <button
              disabled={isPendingSubmit}
              onClick={handleSubmit}
              className="btn w-1/2 lg:btn-wide btn-primary mt-5"
            >
              {isPendingSubmit ? <ButtonSpinner /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
