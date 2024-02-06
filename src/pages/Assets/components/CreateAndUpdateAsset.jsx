import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";

import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import {
  createDocument,
  getSingleDocument,
  uploadSingleDocumentFile,
} from "../../../apis/documents/documents";
import CustomLoading from "../../../components/CustomLoading";
import CustomSingleFileField from "../../../components/InputFields/CustomSingleFileField";
import {
  createAsset,
  getAllAssetsWithoutPerPage,
  getSingleAsset,
  updateSingleAsset,
} from "../../../apis/employee/asset";
import { uploadSingleAssetFile } from "../../../apis/employee/jobHistory";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../apis/userAndBusiness/user";
import { useAuth } from "../../../context/AuthContext";
import { getAllAssetTypesWithoutPerPage } from "../../../apis/settings/assetType/assetType";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import { assetsStatus } from "../../../constant/assetsStatus";

export default function CreateAndUpdateAsset({ id = null, handleClosePopup }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    user_id: null,
    name: "", // REQUIRED
    code: "", // REQUIRED
    serial_number: "", // REQUIRED
    type: "", // REQUIRED
    date: "", // REQUIRED
    note: "", // REQUIRED
    image: "",
    status: "",
    is_working: 0,
  });

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  // GET ALL DATA IF ON UPDATE
  const [isDataLoading, setIsDataLoading] = useState(id ? true : false);
  const getAllData = () => {
    setIsDataLoading(true);
    getSingleAsset(id)
      .then((res) => {
        setFormData({
          id: id,
          user_id: res?.user_id, // REQUIRED
          name: res?.name, // REQUIRED
          code: res?.code, // REQUIRED
          serial_number: res?.serial_number, // REQUIRED
          type: res?.type, // REQUIRED
          date: res?.date, // REQUIRED
          note: res?.note, // REQUIRED
          image: res?.image,
          status: res?.status,
          is_working: res?.is_working,
        });
        setIsDataLoading(false);
      })
      .catch((error) => {
        setIsDataLoading(false);
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
    if (id) {
      getAllData();
    }
  }, [id]);

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
        console.log({ res });
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

  // GET ASSET TYPE
  const [assetType, setAssetType] = useState([]);
  const [isLoadingAssetType, setIsLoadingAssetType] = useState(true);
  const getAllAssetTypeData = () => {
    setIsLoadingAssetType(true);
    // GETTING EMPLOYEES FUNC
    getAllAssetTypesWithoutPerPage()
      .then((res) => {
        console.log({ res });
        setAssetType(
          res.map((at) => ({
            id: at?.id,
            label: at?.name,
          }))
        );
        setIsLoadingAssetType(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingAssetType(false);
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
    getAllAssetTypeData();
  }, []);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // HANDLE FILE Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    // VALIDATE CODE
    if (!formData.code || formData.code.trim() === "") {
      newErrors.code = "Code is required";
    }
    // VALIDATE SERIAL NUMBER
    if (!formData.serial_number || formData.serial_number.trim() === "") {
      newErrors.serial_number = "Serial number is required";
    }

    // VALIDATE TYPE
    if (!formData.type || formData.type.trim() === "") {
      newErrors.type = "Type is required";
    }

    // VALIDATE DATE
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    // VALIDATE NOTE
    if (!formData.note || formData.note.trim() === "") {
      newErrors.note = "Note is required";
    }
    // VALIDATE STATUS
    if (!formData.status || formData.status.trim() === "") {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    if (file) {
      uploadSingleAssetFile(file)
        .then((res) => {
          const data = { ...formData, image: res?.full_location };
          createAsset(data)
            .then((res) => {
              setIsPendingSubmit(false);
              toast.custom((t) => (
                <CustomToaster
                  t={t}
                  type={"success"}
                  text={`Asset added successfully!`}
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
    } else {
      createAsset(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Asset added successfully!`}
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

  const updateFunction = () => {
    setIsPendingSubmit(true);
    if (file) {
      uploadSingleAssetFile(file)
        .then((res) => {
          const data = { ...formData, image: res?.full_location };
          updateSingleAsset(data)
            .then((res) => {
              setIsPendingSubmit(false);
              toast.custom((t) => (
                <CustomToaster
                  t={t}
                  type={"success"}
                  text={`Asset updated successfully!`}
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
    } else {
      updateSingleAsset(formData)
        .then((res) => {
          setIsPendingSubmit(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Asset updated successfully!`}
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

  const handleSubmit = () => {
    console.log("function called");
    if (validateForm()) {
      console.log("validation Done");
      if (id) {
        updateFunction();
      } else {
        createFunction();
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

  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          {/* EMPLOYEE & NAME  */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-5 w-full">
            <CustomMultiSelect
              error={errors?.user_id}
              loading={isLoadingEmployees}
              options={employees}
              label={"Select Employee"}
              singleSelect={true}
              defaultSelectedValues={employees.filter(
                (e) => e?.id === formData?.user_id
              )}
              onSelect={(e) => {
                setFormData({ ...formData, user_id: e[0]?.id });
              }}
            />
            <CustomField
              defaultValue={formData?.name}
              disable={false}
              error={errors?.name}
              fieldClassName={"w-full"}
              id={"name"}
              label={"Name"}
              name={"name"}
              onChange={handleFormChange}
              placeholder={"Name"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>

          {/* CODE & SERIAL NUMBER  */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-5 w-full">
            <CustomField
              defaultValue={formData?.code}
              disable={false}
              error={errors?.code}
              fieldClassName={"w-full"}
              id={"code"}
              label={"Code"}
              name={"code"}
              onChange={handleFormChange}
              placeholder={"Code"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
            <CustomField
              defaultValue={formData?.serial_number}
              disable={false}
              error={errors?.serial_number}
              fieldClassName={"w-full"}
              id={"serial_number"}
              label={"Serial Number"}
              name={"serial_number"}
              onChange={handleFormChange}
              placeholder={"Serial Number"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>

          {/* DATE & TYPE  */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-5 w-full">
            <CustomDatePicker
              value={formData?.date}
              disable={false}
              format="dd-MM-yyyy"
              error={errors?.date}
              fieldClassName={"w-full"}
              id={"date"}
              label={"Date"}
              name={"date"}
              onChange={(date) => {
                setFormData({ ...formData, date: date });
              }}
              placeholder={"Date"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={false}
            />
            <CustomMultiSelect
              error={errors?.type}
              loading={isLoadingAssetType}
              options={assetType}
              label={"Select Type"}
              singleSelect={true}
              defaultSelectedValues={assetType.filter(
                (e) => e?.label === formData?.type
              )}
              required={true}
              onSelect={(e) => {
                setFormData({ ...formData, type: e[0]?.label });
              }}
            />
          </div>

          {/* STATUS & IMAGE   */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-5 w-full">
            {/* STATUS  */}
            <div className={`w-full md:w-1/2`}>
              <CustomMultiSelect
                error={errors?.type}
                loading={false}
                options={assetsStatus}
                label={"Status"}
                singleSelect={true}
                defaultSelectedValues={assetsStatus.filter(
                  (e) => e?.value === formData?.status
                )}
                required={true}
                onSelect={(e) => {
                  setFormData({ ...formData, status: e[0]?.value });
                }}
              />
            </div>
            <CustomSingleFileField
              defaultValue={formData?.image}
              disable={false}
              error={errors?.image}
              fieldClassName={"w-full"}
              id={"image"}
              label={"Upload Image"}
              name={"image"}
              onChange={handleFileChange}
              placeholder={"Upload Image"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
            />
          </div>

          {/* IS_WORKING  */}
          <div className="w-full md:w-1/2">
            <div className="label">
              <span className="label-text text-md font-bold">Is Working</span>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row justify-start w-full gap-1 md:gap-5 ">
              {/* YES  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`is_working`}
                    onChange={handleFormChange}
                    value={1}
                    className="toggle toggle-primary"
                    checked={formData?.is_working?.toString() === "1"}
                  />
                  <span className="label-text">Yes</span>
                </label>
              </div>
              {/* NO  */}
              <div className="form-control flex justify-start items-center">
                <label className="label cursor-pointer flex items-center gap-5">
                  <input
                    type="radio"
                    name={`is_working`}
                    value={0}
                    onChange={handleFormChange}
                    className="toggle toggle-primary"
                    checked={formData?.is_working?.toString() === "0"}
                  />
                  <span className="label-text">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* NOTE  */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-5 w-full">
            <CustomTextareaField
              defaultValue={formData?.note}
              disable={false}
              error={errors?.note}
              fieldClassName={"w-full"}
              id={"note"}
              label={"Note"}
              name={"note"}
              onChange={handleFormChange}
              placeholder={"Note"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
          </div>
        </div>
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
            {isPendingSubmit ? <ButtonSpinner /> : `${id ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    );
  }
}
