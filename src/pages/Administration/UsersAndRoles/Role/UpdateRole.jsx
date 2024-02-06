import React, { useEffect, useState } from "react";
import Headings from "../../../../components/Headings/Headings";
import CustomField from "../../../../components/InputFields/CustomField";
import { getAllPermissions } from "../../../../apis/roles/permissions";
import CustomToaster from "../../../../components/CustomToaster";
import toast from "react-hot-toast";
import ButtonSpinner from "../../../../components/Loaders/ButtonSpinner";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRole,
  getSingleRoles,
  updateSingleRole,
} from "../../../../apis/roles/roles";
import CustomLoading from "../../../../components/CustomLoading";

export default function UpdateRole() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(true);
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });
  const [allPermissions, setAllPermissions] = useState([]);
  const [errors, setErrors] = useState({});

  const getPermissions = () => {
    getAllPermissions()
      .then((res) => {
        setAllPermissions(res);
      })
      .catch((error) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00124 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  const getSingleRoleFunction = () => {
    setIsPending(true);
    getSingleRoles(id)
      .then((res) => {
        if (res.length > 0) {
          console.log(res);
          setFormData({
            id: res[0]?.id,
            name: res[0]?.name,
            permissions: res[0]?.permissions.map((p) => p?.name),
          });
          getPermissions();
          setIsPending(false);
        } else {
          setIsPending(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={`ID: #00124 - You are trying to edit an invalid role / your role id is invalid!`}
            />
          ));
          navigate("/role/all-role");
        }
      })
      .catch((error) => {
        setIsPending(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00124 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };
  useEffect(() => {
    getSingleRoleFunction();
  }, [id]);

  const handleChangeName = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleChangePermission = (e) => {
    const { checked, name, value } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData?.permissions, name],
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData?.permissions.filter((p) => p !== name),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Validate business name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Role name is required";
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "Role permission is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const updateRoleFunction = () => {
    setIsPendingSubmit(true);
    updateSingleRole(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        navigate("/role/all-role");
      })
      .catch((error) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`You are submitting invalid data`}
          />
        ));
      });
  };
  const handleSubmit = () => {
    if (validateForm()) {
      updateRoleFunction();
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
  return (
    <div>
      <Headings level={1}>Update Role</Headings>

      <>
        {isPending ? (
          <CustomLoading />
        ) : (
          <div>
            <CustomField
              id={"name"}
              label={"Role Name"}
              required={true}
              type={"text"}
              name={"name"}
              onChange={handleChangeName}
              value={formData?.name}
              placeholder={"Role Name"}
              error={errors?.name}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
            />

            <div className="mt-4">
              <Headings level={3}>
                Select Permissions
                <span className="text-error font-bold text-md">*</span>
              </Headings>
              {errors?.permissions && (
                <label className="label h-7">
                  <span className="label-text-alt text-error">
                    {errors?.permissions}
                  </span>
                </label>
              )}
              <hr className="my-3" />
              <>
                <div className="flex flex-col">
                  {allPermissions.map((permission, i) => (
                    <div key={i}>
                      <Headings level={3}>
                        PERMISSIONS FROM -{" "}
                        <span className="text-primary">
                          {" "}
                          {permission?.role.split("_").join(" ").toUpperCase()}
                        </span>
                      </Headings>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 my-5">
                        {permission?.permissions.map((p, j) => (
                          <div key={j} className="flex gap-2 items-start">
                            <input
                              type="checkbox"
                              className="toggle toggle-primary  toggle-sm"
                              name={p?.name}
                              id={`${p?.name}-${i}`}
                              defaultChecked={formData?.permissions.includes(
                                p?.name
                              )}
                              onClick={handleChangePermission}
                            />
                            <label
                              htmlFor={`${p?.name}-${i}`}
                              className="cursor-pointer"
                            >
                              <Headings level={4}>{p?.title}</Headings>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            </div>

            <div className="flex w-full justify-end items-center mt-5">
              <button
                disabled={isPendingSubmit}
                onClick={handleSubmit}
                className="btn btn-wide btn-primary"
              >
                {isPendingSubmit ? <ButtonSpinner /> : "Update"}
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
