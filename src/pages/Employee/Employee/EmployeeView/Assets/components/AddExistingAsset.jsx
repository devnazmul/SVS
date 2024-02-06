import React, { useEffect, useState } from "react";
import ButtonSpinner from "../../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../../components/CustomToaster";
import {
  createDocument,
  getSingleDocument,
  uploadSingleDocumentFile,
} from "../../../../../../apis/documents/documents";
import CustomLoading from "../../../../../../components/CustomLoading";
import CustomSingleFileField from "../../../../../../components/InputFields/CustomSingleFileField";
import {
  addExistingAssetToUser,
  createAsset,
  getAllAssets,
  getAllAssetsWithoutPerPage,
  getSingleAsset,
  updateSingleAsset,
} from "../../../../../../apis/employee/asset";
import { uploadSingleAssetFile } from "../../../../../../apis/employee/jobHistory";
import CustomTextareaField from "../../../../../../components/InputFields/CustomTextareaField";
import CustomMultiSelect from "../../../../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../../../../apis/userAndBusiness/user";
import { useAuth } from "../../../../../../context/AuthContext";
import { getAllAssetTypesWithoutPerPage } from "../../../../../../apis/settings/assetType/assetType";
import CustomDatePicker from "../../../../../../components/InputFields/CustomDatePicker";
import CustomField from "../../../../../../components/InputFields/CustomField";

export default function AddExistingAsset({ userId = null, handleClosePopup }) {
  const [formData, setFormData] = useState({
    user_id: userId, // REQUIRED
    id: "",
  });

  // GET ASSET TYPE
  const [assets, setAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const getAllAssetData = () => {
    setIsLoadingAssets(true);
    // GETTING EMPLOYEES FUNC
    getAllAssetsWithoutPerPage()
      .then((res) => {
        console.log({ res });
        setAssets(
          res.map((at) => ({
            id: at?.id,
            label: `${at?.serial_number}-${at?.name}-${at?.code}`,
          }))
        );
        setIsLoadingAssets(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingAssets(false);
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
    getAllAssetData();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE USER ID
    if (!formData.user_id) {
      newErrors.user_id = "Employee is required";
    }

    // VALIDATE ASSET
    if (!formData.id) {
      newErrors.id = "Asset is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);

  const updateFunction = () => {
    setIsPendingSubmit(true);
    addExistingAssetToUser(formData)
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

  if (isLoadingAssets) {
    return <CustomLoading h="h-[250px]" />;
  } else {
    return (
      <div className="px-2 py-5 ">
        <div className="flex flex-col min-h-[200px]">
          {/* EMPLOYEE & NAME  */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-5 w-full">
            <CustomMultiSelect
              error={errors?.user_id}
              loading={isLoadingAssets}
              options={assets}
              label={"Select Asset"}
              singleSelect={true}
              defaultSelectedValues={assets.filter(
                (e) => e?.id === formData?.id
              )}
              required={true}
              onSelect={(e) => {
                setFormData({ ...formData, id: e[0]?.id });
              }}
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
            {isPendingSubmit ? <ButtonSpinner /> : `Add`}
          </button>
        </div>
      </div>
    );
  }
}
