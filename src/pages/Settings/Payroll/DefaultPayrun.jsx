import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getLeaveSetting,
  updateLeaveSetting,
} from "../../../apis/settings/leaveType/leaveSettings";
import CustomToaster from "../../../components/CustomToaster";
import toast from "react-hot-toast";
import { getAllUsersWIthoutPagination } from "../../../apis/userAndBusiness/user";
import { getAllRolesWithoutPagination } from "../../../apis/roles/roles";
import { formatRole } from "../../../utils/formatRole";
import { getAllEmployeeStatusWithoutPerPage } from "../../../apis/employeeStatus/employeeStatus";
import CustomLoading from "../../../components/CustomLoading";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import {
  createPayRunSettings,
  getPayRunSettings,
  updatePayRunSettings,
} from "../../../apis/settings/paayroll/payrun";

export default function DefaultPayrun() {
  const { user } = useAuth();
  // DATA FOR MULTI
  const [formData, setFormData] = useState({
    payrun_period: "monthly",
    consider_type: "hour",
    consider_overtime: true,
  });

  //   GETTING DATA
  const [isGettingData, setIsGettingData] = useState(true);
  useEffect(() => {
    setIsGettingData(true);
    getPayRunSettings()
      .then((res) => {
        console.log({ res });
        setFormData({
          payrun_period: res[0]?.payrun_period,
          consider_type: res[0]?.consider_type,
          consider_overtime: res[0]?.consider_overtime,
        });
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
    // PAYRUN PERIOD
    if (!formData?.payrun_period) {
      newErrors.payrun_period = "Payrun period is required";
    }
    // TYPE
    if (!formData?.consider_type) {
      newErrors.consider_type = "Payrun type is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    createPayRunSettings(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Payrun settings saved!`}
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

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 pb-10">
        <div className="w-full h-[450px] sm:w-full bg-base-300 lg:w-1/2 rounded-xl shadow-xl p-5 shadow-primary-content border-2 border-primary-content">
          <h1 className="text-center text-primary text-xl font-bold mb-5">
            Default Payrun
          </h1>
          <div className="w-full flex flex-col gap-5 items-start -mt-1">
            <CustomMultiSelect
              error={errors?.payrun_period}
              loading={false}
              options={[
                { id: 1, label: "Monthly", value: "monthly" },
                { id: 2, label: "Weekly", value: "weekly" },
              ]}
              label={"Payrun period"}
              required={true}
              defaultSelectedValues={[
                { id: 1, label: "Monthly", value: "monthly" },
                { id: 2, label: "Weekly", value: "weekly" },
              ].filter((s) => s?.value === formData?.payrun_period)}
              singleSelect
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  payrun_period: e[0]?.value || "",
                });
              }}
            />
            <CustomMultiSelect
              error={errors?.consider_type}
              loading={false}
              options={[
                { id: 1, label: "Hour", value: "hour" },
                { id: 2, label: "Daily Log", value: "daily_log" },
                { id: 3, label: "None", value: "none" },
              ]}
              label={"Consider type"}
              required={true}
              defaultSelectedValues={[
                { id: 1, label: "Hour", value: "hour" },
                { id: 2, label: "Daily Log", value: "daily_log" },
                { id: 3, label: "None", value: "none" },
              ].filter((s) => s?.value === formData?.consider_type)}
              singleSelect
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  consider_type: e[0]?.value || "",
                });
              }}
            />
            <div className="form-control flex justify-start items-center">
              <label className="label cursor-pointer flex w-[250px] items-start justify-start gap-2">
                <input
                  type="radio"
                  name={`consider_overtime`}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      consider_overtime: !!e?.target?.checked,
                    });
                  }}
                  value={"single"}
                  className="toggle toggle-primary"
                  checked={!!formData?.consider_overtime}
                />
                <span className="label-text">Consider Overtime</span>
              </label>
            </div>
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
