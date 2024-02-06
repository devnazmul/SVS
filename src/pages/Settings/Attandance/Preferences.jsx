// =====================================
// #00141
// =====================================

import React, { useEffect, useState } from "react";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllRolesWithoutPagination } from "../../../apis/roles/roles";
import CustomToaster from "../../../components/CustomToaster";
import { getAllUsersWIthoutPagination } from "../../../apis/userAndBusiness/user";
import toast from "react-hot-toast";
import CustomLoading from "../../../components/CustomLoading";
import { useAuth } from "../../../context/AuthContext";

const Preferences = ({
  formData,
  isPendingSubmit,
  setFormData,
  loadingFetchData,
}) => {
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

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
          const resR = res.filter(
            (r) => r?.name !== `business_employee#${user?.business_id}`
          );
          setRoles(
            resR.map((es) => {
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

  if (isLoadingRoles || isLoadingEmployees) {
    return <CustomLoading />;
  } else {
    return (
      <div className="w-full mx-auto my-10 border-b border-primary-content lg:border-b-0 lg:rounded-xl lg:shadow-xl p-5 lg:shadow-primary-content lg:border lg:border-gray-300">
        {/* auto approval */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-1">
            <p>Auto approval</p>
          </div>
          <div className="col-span-4">
            <div>
              <input
                type="checkbox"
                name={`auto_approval`}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    auto_approval: e.target.checked,
                  }))
                }
                checked={
                  formData?.auto_approval || formData?.auto_approval === 1
                }
                className="toggle block toggle-primary checked:bg-primary"
              />
            </div>
            {!formData?.auto_approval ? (
              <p className="mt-5">
                In the enabled state, all the attendance request would be
                approved automatically without any reviews. As default, the app
                considers all employee for approval. Note that its possible to
                manage employees for auto approval.
              </p>
            ) : (
              <p className="mt-5">
                In disabled state all attendance request would be reviewed by
                the responsible user. The user will get notification for any
                attendance request.
              </p>
            )}
          </div>
        </div>

        {/* manage audience */}
        {formData?.auto_approval ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-1">
              <p>Manage audience</p>
              <p className="italic text-gray-500 text-sm">
                Add role/user to whom you don't want review attendance request.
              </p>
            </div>
            <div className="col-span-4">
              {/* approve by role */}
              <div>
                <CustomMultiSelect
                  label={"By role"}
                  error={errors?.role}
                  loading={
                    loadingFetchData || isPendingSubmit || isLoadingRoles
                  }
                  options={roles}
                  required={false}
                  singleSelect={false}
                  defaultSelectedValues={roles.filter((d) =>
                    formData?.special_roles?.includes(d?.id)
                  )}
                  selectAllOption // YOU NEED TO ADD THIS ONLY FOR MULTI SELECT
                  onSelect={(e) => {
                    setFormData({
                      ...formData,
                      special_roles: e?.map((val) => {
                        const data = val?.id;
                        return data;
                      }),
                    });
                  }}
                />
              </div>

              {/* approve by role */}
              <div className="mt-5">
                <CustomMultiSelect
                  error={errors?.departments}
                  loading={
                    loadingFetchData || isPendingSubmit || isLoadingEmployees
                  }
                  options={employees}
                  label={"By user"}
                  required={false}
                  singleSelect
                  defaultSelectedValues={employees.filter((d) =>
                    formData?.special_users?.includes(d?.id)
                  )}
                  selectAllOption
                  onSelect={(e) => {
                    setFormData({
                      ...formData,
                      special_users: e?.map((val) => {
                        const data = val?.id;
                        return data;
                      }),
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
};

export default Preferences;
