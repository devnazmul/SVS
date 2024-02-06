import React, { useEffect, useState } from "react";
import CustomField from "../../../components/InputFields/CustomField";
import CustomTextareaField from "../../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../components/CustomToaster";
import { getAllDepartmentsWithoutPerPage } from "../../../apis/department/department";
import CustomMultiSelect from "../../../components/InputFields/CustomMultiSelect";
import { getAllUsersWithoutPaginationByRole } from "../../../apis/userAndBusiness/user";
import { useAuth } from "../../../context/AuthContext";
import { getAllWorkshiftsWithoutPerPage } from "../../../apis/workshift/workshift";
import {
  createAnnouncement,
  getSingleAnnouncement,
  updateSingleAnnouncement,
} from "../../../apis/announcement/announcement";
import CustomDatePicker from "../../../components/InputFields/CustomDatePicker";
import ReactQuill from "react-quill";
import TextEditor from "../../../components/TextEditor";
import CustomLoading from "../../../components/CustomLoading";
import moment from "moment";

export default function UpdateAnnouncement({ handleClosePopup, id }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "", // REQUIRED
    start_date: "", // REQUIRED
    end_date: "", // REQUIRED
    description: "", // REQUIRED
    departments: [],
  });

  // GETTING ID
  const [isDataLoading, setIsDataLoading] = useState(true);
  const getData = () => {
    setIsDataLoading(true);
    getSingleAnnouncement(id)
      .then((res) => {
        console.log({ res });
        setFormData({
          id: res?.id, // REQUIRED
          name: res?.name, // REQUIRED
          start_date: res?.start_date, // REQUIRED
          end_date: res?.end_date, // REQUIRED
          description: res?.description, // REQUIRED
          departments: res?.departments || [],
        });
        setIsDataLoading(false);
      })
      .catch((error) => {
        console.log({ 103: error });
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
    getData();
  }, [id]);

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // GETTING ALL ESSANTIAL DATA

  // GETTING MANAGERS
  // const [managers, setManagers] = useState([]);
  // const [isLoadingManagers, setIsLoadingManagers] = useState(true);
  // // GETTING ALL DEPARTMENT,
  // const getAllManagersData = () => {
  //   setIsLoadingManagers(true);
  //   // GETTING DEPARTMENTS
  //   getAllUsersWithoutPaginationByRole(`business_admin#${user?.business_id}`)
  //     .then((res) => {
  //       console.log({ res });
  //       setManagers(
  //         res.map((m) => ({
  //           id: m?.id,
  //           label: `${m?.first_Name} ${m?.last_Name}`,
  //         }))
  //       );
  //       setIsLoadingManagers(false);
  //     })
  //     .catch((error) => {
  //       console.log({ 103: error });
  //       setIsLoadingManagers(true);
  //       toast.custom((t) => (
  //         <CustomToaster
  //           t={t}
  //           type={"error"}
  //           text={`ID: #00119 - ${error?.response?.data?.message}`}
  //           errors={error?.response?.data?.errors}
  //         />
  //       ));
  //     });
  // };
  // useEffect(() => {
  //   getAllManagersData();
  // }, []);

  // GETTING DEPARTMENTS
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  // GETTING ALL DEPARTMENT,
  const getAllDepartmentsData = () => {
    setIsLoadingDepartments(true);
    // GETTING DEPARTMENTS
    getAllDepartmentsWithoutPerPage()
      .then((res) => {
        setDepartments(res.map((d) => ({ id: d?.id, label: d?.name })));
        setIsLoadingDepartments(false);
      })
      .catch((error) => {
        console.log({ 103: error });
        setIsLoadingDepartments(false);
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

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE TITLE
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Title is required";
    }
    // VALIDATE START DATE
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    // VALIDATE END DATE
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    // VALIDATE DESCRIPTION
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleAnnouncement(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Announcement updated successfully!`}
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);
  if (isDataLoading) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="flex flex-col">
          {/* NAME  */}
          <CustomField
            defaultValue={formData?.name}
            disable={false}
            error={errors?.name}
            fieldClassName={"w-full"}
            id={"name"}
            label={"Title"}
            name={"name"}
            onChange={handleFormChange}
            placeholder={"Title"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />
          {/* START DATE AND END DATE  */}
          <div className="flex gap-5">
            {/* START DATE  */}
            <CustomDatePicker
              value={formData?.start_date}
              disable={false}
              error={errors?.start_date}
              fieldClassName={"w-full"}
              id={"start_date"}
              label={"Start Date"}
              name={"start_date"}
              onChange={(date) => {
                setFormData({ ...formData, start_date: date });
              }}
              placeholder={"Start Date"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />

            {/* END DATE  */}
            <CustomDatePicker
              right
              value={formData?.end_date}
              disable={false}
              error={errors?.end_date}
              fieldClassName={"w-full"}
              id={"end_date"}
              label={"End Date"}
              name={"end_date"}
              onChange={(date) => {
                setFormData({ ...formData, end_date: date });
              }}
              placeholder={"End Date"}
              type={"text"}
              wrapperClassName={"w-full md:w-1/2"}
              required={true}
            />
          </div>

          {/* DEPARTMENT  */}
          <CustomMultiSelect
            error={errors?.parent_id}
            loading={isLoadingDepartments}
            options={departments}
            label={"Department"}
            onSelect={(e) => {
              setFormData({
                ...formData,
                departments: e.length > 0 ? e.map((d) => d?.id) : [],
              });
            }}
          />

          <div>
            <label className="label">
              <span className="label-text text-md font-bold">
                {"Description"}{" "}
                <span className="text-error font-bold text-md">*</span>
              </span>
            </label>
            <TextEditor
              value={formData?.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e });
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
            className="btn w-full  md:btn-wide btn-primary"
          >
            {isPendingSubmit ? <ButtonSpinner /> : "Update"}
          </button>
        </div>
      </div>
    );
  }
}
