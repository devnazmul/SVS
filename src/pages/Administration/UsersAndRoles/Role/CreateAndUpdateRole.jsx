import React, { useEffect, useState } from "react";
import Headings from "../../../../components/Headings/Headings";
import CustomField from "../../../../components/InputFields/CustomField";
import { getAllPermissions } from "../../../../apis/roles/permissions";
import CustomToaster from "../../../../components/CustomToaster";
import toast from "react-hot-toast";
import ButtonSpinner from "../../../../components/Loaders/ButtonSpinner";
import { useNavigate } from "react-router-dom";
import {
  createRole,
  getSingleRoles,
  updateSingleRole,
} from "../../../../apis/roles/roles";
import CustomLoading from "../../../../components/CustomLoading";
import { useAuth } from "../../../../context/AuthContext";
import { formatRole } from "../../../../utils/formatRole";

export default function CreateAndUpdateRole({ id, handleClosePopup }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPending, setIsPending] = useState(true);
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
    is_default_for_business: 0,
  });

  // GETTING ALL PERMISSIONS
  const [allPermissions, setAllPermissions] = useState([]);
  const getPermissions = () => {
    setIsPending(true);
    getAllPermissions()
      .then((res) => {
        setAllPermissions(res);
        setIsPending(false);
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
    getPermissions();
  }, []);

  // GET ALL DATA
  const [isDeleteLoading, setIsGettingData] = useState(true);
  const getSingleRoleFunction = () => {
    setIsGettingData(true);
    getSingleRoles(id)
      .then((res) => {
        if (res.length > 0) {
          if (user?.business_id) {
            setFormData({
              id: res[0]?.id,
              name: res[0]?.name.split("_")[1].split("#")[0],
              permissions: res[0]?.permissions.map((p) => p?.name),
            });
          } else {
            setFormData({
              id: res[0]?.id,
              name: res[0]?.name,
              permissions: res[0]?.permissions.map((p) => p?.name),
            });
          }

          getPermissions();
          setIsGettingData(false);
        } else {
          setIsGettingData(false);
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
    if (id) {
      getSingleRoleFunction();
    } else {
      setIsGettingData(false);
    }
  }, [id]);

  // HANDLE Change ROLE NAME
  const handleChangeName = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  // HANDLE CHANGE PERMISSION
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

  // VALIDATION
  const [errors, setErrors] = useState({});
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

    console.log({ newErrors });
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const createRoleFunction = () => {
    setIsPendingSubmit(true);
    let data;
    if (user?.business_id) {
      data = {
        ...formData,
        name: `${formData?.name.replaceAll(" ", "_")}#${user?.business_id}`,
      };
    } else {
      data = {
        ...formData,
        name: `${formData?.name.replaceAll(" ", "_")}`,
      };
    }

    createRole(data)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Role created successfully`}
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
            text={`ID: #00124 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };
  const updateRoleFunction = () => {
    setIsPendingSubmit(true);
    let data;
    if (user?.business_id) {
      data = {
        ...formData,
        name: `${formData?.name}#${user?.business_id}`,
      };
    } else {
      data = {
        ...formData,
        name: `${formData?.name}`,
      };
    }

    updateSingleRole(data)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Role updated successfully`}
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
            text={`ID: #00124 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (id) {
        updateRoleFunction();
      } else {
        createRoleFunction();
      }
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

  if (isDeleteLoading || isPending) {
    return <CustomLoading />;
  } else {
    return (
      <div className="py-5 px-5">
        <div>
          {/* NAME  */}
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

          {/* PERMISSIONS  */}
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
              {isPending ? (
                <CustomLoading />
              ) : (
                <div className="w-full gap-2 flex flex-col">
                  {allPermissions.map((section, i) => (
                    <div
                      key={i}
                      className=" collapse collapse-arrow join-item border border-primary-content"
                    >
                      <input type="checkbox" name="my-accordion-4" />
                      <div className="collapse-title text-md font-medium flex items-center gap-3 ">
                        {/* <input
                          className="toggle toggle-primary toggle-sm"
                          type="checkbox"
                          name={section?.header}
                        />{" "} */}
                        {formatRole(section?.header)}
                      </div>
                      <div className="collapse-content border-t">
                        <div className="grid grid-cols-1 gap-4 mt-3">
                          {section?.permissions.map((p, j) => (
                            <div key={j} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                className="toggle toggle-primary  toggle-xs"
                                name={p?.name}
                                id={`${p?.name}-${i}`}
                                onClick={handleChangePermission}
                                defaultChecked={formData?.permissions.includes(
                                  p?.name
                                )}
                              />
                              <label
                                htmlFor={`${p?.name}-${i}`}
                                className="cursor-pointer"
                              >
                                <Headings level={4}>
                                  {formatRole(p?.title)}
                                </Headings>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          </div>

          {/* ACTION BUTTONS  */}
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
              onClick={handleSubmit}
              className="btn w-full md:btn-wide btn-primary"
            >
              {isPendingSubmit ? (
                <ButtonSpinner />
              ) : (
                `${id ? "Update" : "Create"}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
