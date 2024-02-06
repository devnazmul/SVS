import React, { useEffect, useState } from "react";
import { getAllUsersWIthoutPagination } from "../../../../apis/userAndBusiness/user";
import CustomToaster from "../../../../components/CustomToaster";
import toast from "react-hot-toast";
import {
  assignRole,
  getAllRolesWithoutPagination,
} from "../../../../apis/roles/roles";
import CustomMultiSelect from "../../../../components/InputFields/CustomMultiSelect";
import ButtonSpinner from "../../../../components/Loaders/ButtonSpinner";

const AssignRoles = ({ handleClosePopup }) => {
  // ROLE
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // GETTING ALL ROLES
  const getAllRolesData = () => {
    setIsLoadingRoles(true);
    // GETTING EMPLOYEE STATUS
    getAllRolesWithoutPagination()
      .then((res) => {
        if (res.length > 0) {
          setRoles(
            res.map((es) => {
              if (es?.name.split("_").length > 1) {
                if (es?.name.split("_")[1].split("#")[0]) {
                  return {
                    id: es?.id,
                    label: `${es?.name
                      .split("_")[1]
                      .split("#")[0]
                      .toUpperCase()}`,
                    value: es?.name,
                  };
                }
              } else {
                return {
                  id: es?.id,
                  label: `${es?.name
                    .split("_")[0]
                    .split("#")[0]
                    .toUpperCase()}`,
                  value: es?.name,
                };
              }
            })
          );
        } else {
          setRoles([]);
        }
        setIsLoadingRoles(false);
      })
      .catch((error) => {
        console.log({ 131: error });
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

  // employess stata
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

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
    getAllRolesData();
    getAllEmployeesData();
  }, []);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    roles: [],
  });
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const validateForm = () => {
    const newErrors = {};

    // Check if required fields are filled

    if (formData.roles?.length < 1) {
      newErrors.roles = "This field is required";
    }
    if (!formData.id) {
      newErrors.id = "This field is required";
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsPendingSubmit(true);
      assignRole(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Role assign successfully!`}
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
    }
  };
  return (
    <div className="mb-10 mx-2">
      {/* SELECT ROLE */}
      <div className="mt-5">
        <CustomMultiSelect
          error={errors?.id}
          loading={isLoadingEmployees}
          options={employees}
          label={"User"}
          required={true}
          singleSelect
          onSelect={(e) => {
            if (e?.length > 0) {
              setFormData({
                ...formData,
                id: e[0]?.id,
              });
            }
          }}
        />
      </div>

      {/* ASSIGN USER */}
      <div>
        <CustomMultiSelect
          label={"Role"}
          error={errors?.roles}
          loading={isLoadingRoles}
          options={roles}
          required={true}
          // selectAllOption
          onSelect={(e) => {
            setFormData({
              ...formData,
              roles: e?.map((val) => {
                const data = val?.value;
                return data;
              }),
            });
          }}
        />
      </div>
      {/* SUBMIT BUTTON  */}
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-10 gap-2">
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
          {isPendingSubmit ? <ButtonSpinner /> : "Create Attendence"}
        </button>
      </div>
    </div>
  );
};

export default AssignRoles;
