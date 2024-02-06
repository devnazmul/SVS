import React, { useEffect, useState } from "react";
import CustomField from "../../../../../../components/InputFields/CustomField";
import ButtonSpinner from "../../../../../../components/Loaders/ButtonSpinner";
import toast from "react-hot-toast";
import CustomToaster from "../../../../../../components/CustomToaster";
import { useAuth } from "../../../../../../context/AuthContext";
import CustomLoading from "../../../../../../components/CustomLoading";
import {
  createPassportHistory,
  getSinglePassportHistory,
  updateSinglePassportHistory,
} from "../../../../../../apis/employee/History/passportHistory";
import CustomDatePicker from "../../../../../../components/InputFields/CustomDatePicker";
import {
  createSponsorshipHistory,
  getSingleSponsorshipHistory,
  updateSingleSponsorshipHistory,
} from "../../../../../../apis/employee/History/sponsorshipHistory";
import CustomMultiSelect from "../../../../../../components/InputFields/CustomMultiSelect";
import CustomTextareaField from "../../../../../../components/InputFields/CustomTextareaField";
import { sponsoredStatus } from "../../../../../../constant/sponsoredStatus";

export default function CreateAndUpdateSponsorshipHistory({
  handleClosePopup,
  id = null,
  userId,
}) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    user_id: userId,
    from_date: "",
    to_date: "",
    date_assigned: "",
    expiry_date: "",

    // status: "",
    note: "",
    certificate_number: "",
    current_certificate_status: "",
    is_sponsorship_withdrawn: 0,
  });

  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(id ? true : false);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleSponsorshipHistory(id)
        .then((res) => {
          console.log({ res });
          setFormData({
            id: res?.id,
            user_id: userId,
            from_date: res?.from_date || "",
            to_date: res?.to_date || "",
            date_assigned: res?.date_assigned || "",
            expiry_date: res?.expiry_date || "",
            // status: res?.status || "",

            certificate_number: res?.certificate_number || "",
            current_certificate_status: res?.current_certificate_status || "",
            is_sponsorship_withdrawn: res?.is_sponsorship_withdrawn || 0,
            note: res?.note || "",
          });
          setIsGettingData(false);
        })
        .catch((error) => {
          console.log({ 103: error });
          setIsGettingData(false);
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
  }, [id]);

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
    // 1. VALIDATE DATE ASSIGNED
    if (!formData?.date_assigned) {
      newErrors.date_assigned = "Date assigned is required";
    }
    // 2. VALIDATE DATE ASSIGNED
    if (!formData?.expiry_date) {
      newErrors.expiry_date = "Expiry date is required";
    }
    // 3. VALIDATE STATUS
    /* if (!formData?.status) {
      newErrors.status = "Status is required";
    } */
    // 4. VALIDATE NOTE
    if (!formData?.note) {
      newErrors.note = "Note is required";
    }
    // 5. VALIDATE CERTIFICATE NUMBER
    if (!formData?.certificate_number) {
      newErrors.certificate_number = "Certificate number is required";
    }
    // 6. VALIDATE CURRENT CERTIFICATE STATUS
    if (!formData?.current_certificate_status) {
      newErrors.current_certificate_status =
        "Current Certificate status is required";
    }

    // 7. VALIDATE EXPIRY DATE
    if (!formData.from_date) {
      newErrors.from_date = "From date is required";
    }

    // 8. VALIDATE EXPIRY DATE
    if (!formData.to_date) {
      newErrors.to_date = "To date is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createSponsorshipHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Sponsorship details created successfully!`}
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
  const updateFunction = () => {
    setIsPendingSubmit(true);
    updateSingleSponsorshipHistory(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Sponsorship details updated successfully!`}
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <div className="px-2 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          {/* FROM DATE  */}
          <CustomDatePicker
            value={formData?.from_date}
            disable={false}
            error={errors?.from_date}
            fieldClassName={"w-full"}
            id={"from_date"}
            label={"From"}
            name={"from_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                from_date: date,
              });
            }}
            placeholder={"From"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* TO DATE  */}
          <CustomDatePicker
            right
            value={formData?.to_date}
            disable={false}
            error={errors?.to_date}
            fieldClassName={"w-full"}
            id={"to_date"}
            label={"To"}
            name={"from_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                to_date: date,
              });
            }}
            placeholder={"To"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* DATE ASSIGNED  */}
          <CustomDatePicker
            value={formData?.date_assigned}
            disable={false}
            error={errors?.date_assigned}
            fieldClassName={"w-full"}
            id={"date_assigned"}
            label={"Date assigned"}
            name={"date_assigned"}
            onChange={(date) => {
              setFormData({
                ...formData,
                date_assigned: date,
              });
            }}
            placeholder={"Date assigned"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* EXPIRY DATE  */}
          <CustomDatePicker
            right
            value={formData?.expiry_date}
            disable={false}
            error={errors?.expiry_date}
            fieldClassName={"w-full"}
            id={"expiry_date"}
            label={"Expiry Date"}
            name={"expiry_date"}
            onChange={(date) => {
              setFormData({
                ...formData,
                expiry_date: date,
              });
            }}
            placeholder={"Expiry Date"}
            type={"text"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* STATUS  */}
          {/* <div className="w-full">
            <CustomMultiSelect
              error={errors?.status}
              loading={false}
              options={[
                { id: 1, label: "Pending", value: "pending" },
                { id: 2, label: "Approved", value: "approved" },
                { id: 3, label: "Denied", value: "denied" },
              ]}
              label={"Status"}
              singleSelect
              defaultSelectedValues={[
                { id: 1, label: "Pending", value: "pending" },
                { id: 2, label: "Approved", value: "approved" },
                { id: 3, label: "Denied", value: "denied" },
              ].filter((s, i) => s?.value === formData?.status)}
              required={true}
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  status: e[0]?.value,
                });
              }}
            />
          </div> */}

          {/* CERTIFICATE NUMBER */}
          <CustomField
            defaultValue={formData?.certificate_number}
            disable={false}
            error={errors?.certificate_number}
            fieldClassName={"w-full"}
            id={"certificate_number"}
            label={"Certificate Number"}
            name={"certificate_number"}
            onChange={handleFormChange}
            placeholder={"Certificate Number"}
            wrapperClassName={"w-full"}
            required={true}
          />
          {/* CERTIFICATE STATUS  */}
          <div className="w-full">
            <CustomMultiSelect
              error={errors?.current_certificate_status}
              loading={false}
              options={sponsoredStatus}
              label={"Certificate Status"}
              defaultSelectedValues={sponsoredStatus.filter(
                (s, i) => s?.value === formData?.current_certificate_status
              )}
              required={true}
              singleSelect
              onSelect={(e) => {
                setFormData({
                  ...formData,
                  current_certificate_status: e[0]?.value,
                });
              }}
            />
          </div>
        </div>

        <div>
          {/* NOTE */}
          <CustomTextareaField
            value={formData?.note}
            disable={false}
            error={errors?.note}
            fieldClassName={"w-full"}
            id={"note"}
            label={"Note"}
            name={"note"}
            onChange={handleFormChange}
            placeholder={"Note"}
            wrapperClassName={"w-full"}
            required={true}
          />
        </div>
        {/* IS SPONSORSHIP WITHDRAWN */}
        <div className="w-full">
          <div className="flex items-center justify-start gap-2 my-5">
            <input
              id="is_sponsorship_withdrawn"
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData?.is_sponsorship_withdrawn}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  is_sponsorship_withdrawn: e.target.checked ? 1 : 0,
                });
              }}
            />
            <label htmlFor="is_sponsorship_withdrawn">
              Is Sponsorship Withdrawn
            </label>
          </div>
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
            {isPendingSubmit ? <ButtonSpinner /> : id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    );
  }
}
