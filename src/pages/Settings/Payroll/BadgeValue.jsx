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

export default function BadgeValue({ tabName }) {
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
        <div className="w-full h-[550px] sm:w-full lg:w-1/2 lg:rounded-xl lg:shadow-xl p-5 lg:shadow-primary-content lg:border lg:border-gray-300">
          <h1 className="text-center text-primary text-xl font-bold mb-5">
            Badge Value
          </h1>

          {/* NOTE  */}
          <div
            className={`bg-primary-content w-full transition-all duration-300 rounded-xl overflow-hidden
           h-auto  p-5 pl-10 my-5
          `}
          >
            <p>
              <span className="font-medium -ml-5"> Note: How badge value work?</span>
              <ul className="list-decimal">
                <li>Create badge for allowance or deduction from Beneficiary badge module.</li>
                <li>
                Select badge and assign a value that will applicable for all employees (Except those are updated individually) while execute payrun.
                </li>
              </ul>
            </p>
          </div>

          <div>
            {/* FOR PAID LEAVE  */}
            <CustomMultiSelect
              error={errors?.special_users}
              options={status}
              label={"Allowance"}
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
              label={"Deduction"}
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
