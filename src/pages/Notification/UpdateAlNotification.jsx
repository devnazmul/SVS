import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createReminder,
  getAllReminderEntityWithoutPerPage,
  getSingleReminder,
  updateSingleReminder,
} from "../../apis/reminders/reminder";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import CheckPermission from "../../CheckPermission";
import { REMINDER_CREATE, REMINDER_UPDATE } from "../../constant/permissions";
import CustomTextareaField from "../../components/InputFields/CustomTextareaField";
import ButtonSpinner from "../../components/Loaders/ButtonSpinner";
import CustomField from "../../components/InputFields/CustomField";
import CustomMultiSelect from "../../components/InputFields/CustomMultiSelect";
import { formatRole } from "../../utils/formatRole";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import toast from "react-hot-toast";
import { durationUnits } from "../../constant/durationUnits";
import { reminderSendTime } from "../../constant/reminderSendTime";

export default function UpdateAlNotification({
  handleClosePopup,
  id = null,
}) {
  const { user } = useAuth();
  // const [durationUnit, setDurationUnit] = useState([]);
  // const [sendTime, setSendTime] = useState([]);
  // useEffect(() => {
  //   setDurationUnit(
  //     durationUnits.map((du, i) => ({
  //       id: i,
  //       label: du,
  //       value: du,
  //     }))
  //   );
  //   setSendTime(['before_expiry', 'after_expiry']);
  // }, [])



  //FORM DATA
  const [formData, setFormData] = useState({
    title: "", // REQUIRED
    entity_name: "", // REQUIRED
    duration: "", // REQUIRED
    duration_unit: "",// REQUIRED
    send_time: "",// REQUIRED
    frequency_after_first_reminder: 0,// REQUIRED
    keep_sending_until_update: false,// REQUIRED
  });


  // GETTING ALL DATA
  const [isGettingData, setIsGettingData] = useState(!!id);
  useEffect(() => {
    if (id) {
      setIsGettingData(true);
      getSingleReminder(id)
        .then((res) => {
          setFormData({
            id: res?.id,
            title: res?.title, // REQUIRED
            entity_name: res?.entity_name || "",
            duration: res?.duration,
            duration_unit: res?.duration_unit,
            send_time: res?.send_time,
            frequency_after_first_reminder: res?.frequency_after_first_reminder,
            keep_sending_until_update: res?.keep_sending_until_update,
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

  // GETTING ALL ENTITY
  const [entity, setEntity] = useState([]);
  const [isLoadingEntity, setIsLoadingEntity] = useState(true);
  const getAllEntityData = () => {
    setIsLoadingEntity(true);
    // GETTING ENTITY LIST
    getAllReminderEntityWithoutPerPage()
      .then((res) => {
        setEntity(
          res
            .map((en, i) => ({
              id: i,
              label: formatRole(en),
              value: en,
            }))
        );
        setIsLoadingEntity(false);
      })
      .catch((error) => {
        console.log({ 188: error });
        setIsLoadingEntity(false);
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
    getAllEntityData();
  }, []);

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    // VALIDATE NAME
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    }
    if (!formData.entity_name || formData.entity_name.trim() === "") {
      newErrors.entity_name = "Entity name is required";
    }
    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    }
    if (!formData.duration_unit || formData.duration_unit.trim() === "") {
      newErrors.duration_unit = "Duration unit is required";
    }
    if (!formData.send_time || formData.send_time.trim() === "") {
      newErrors.send_time = "Send time is required";
    }
    if (!formData.frequency_after_first_reminder) {
      newErrors.frequency_after_first_reminder = "Frequency after first reminder is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // SUBMITTING FORM
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const createFunction = () => {
    setIsPendingSubmit(true);
    createReminder(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Reminder created successfully!`}
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
    updateSingleReminder(formData)
      .then((res) => {
        setIsPendingSubmit(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Reminder updated successfully!`}
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

  if (isGettingData) {
    return <CustomLoading />;
  } else {
    return (
      <CheckPermission permissionArray={[REMINDER_CREATE, REMINDER_UPDATE]}>
        <div className="px-2 py-5">
          <div className="flex flex-col">
            {/* TITLE  */}
            <CustomField
              defaultValue={formData?.title}
              disable={false}
              error={errors?.title}
              fieldClassName={"w-full"}
              id={"title"}
              label={"Title"}
              name={"title"}
              onChange={handleFormChange}
              placeholder={"Title"}
              type={"text"}
              wrapperClassName={"w-full"}
              required={true}
            />
            {/* ENTITY */}
            <CustomMultiSelect
              label={"Entity Name"}
              required={true}
              loading={isLoadingEntity}
              singleSelect
              options={entity}
              defaultSelectedValues={entity.filter(
                (r) => r?.value === formData?.entity_name
              )}
              error={errors?.entity_name}
              onSelect={(e) => setFormData({ ...formData, entity_name: e[0]?.value })}
            />
            {/* DURATION*/}
            <CustomNumberField
              id={"duration"}
              label={"Duration"}
              min={0}
              name={"duration"}
              onChange={handleFormChange}
              value={formData?.duration}
              placeholder={"Duration"}
              error={errors?.duration}
              required={true}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
            />

            {/* DURATION UNIT */}
            <CustomMultiSelect
              label={"Duration Unit"}
              required={true}
              loading={false}
              singleSelect
              options={durationUnits}
              defaultSelectedValues={durationUnits.filter(
                (r) => r?.value === formData?.duration_unit
              )}
              error={errors?.duration_unit}
              onSelect={(e) => setFormData({ ...formData, duration_unit: e[0]?.value })}
            />
            {/* SEND TIME */}
            <CustomMultiSelect
              label={"Send Time"}
              required={true}
              loading={false}
              singleSelect
              options={reminderSendTime}
              defaultSelectedValues={reminderSendTime.filter(
                (r) => r?.value === formData?.send_time
              )}
              error={errors?.send_time}
              onSelect={(e) => setFormData({ ...formData, send_time: e[0]?.value })}
            />

            {/* {FREQUENCY AFTER FIRST REMINDER } */}
            <CustomNumberField
              id={"frequency_after_first_reminder"}
              label={"Frequency After First Reminder"}
              min={0}
              name={"frequency_after_first_reminder"}
              onChange={handleFormChange}
              value={formData?.frequency_after_first_reminder}
              placeholder={"Frequency after first reminder"}
              error={errors?.frequency_after_first_reminder}
              required={true}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
            />

            {/* KEEP SENDING UPDATE  */}
            <div className="form-control flex w-full">
              <label className="label cursor-pointer flex items-center justify-start gap-2">
                <input
                  type="checkbox"
                  name={`keep_sending_until_update`}
                  value={formData?.keep_sending_until_update}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, keep_sending_until_update: true })
                    } else {
                      setFormData({ ...formData, keep_sending_until_update: false })
                    }
                  }}
                  className="toggle toggle-primary"
                  checked={
                    formData?.keep_sending_until_update
                  }
                />
                <span className="label-text ">Keep sending until update</span>
              </label>
              {/* VALIDATION MESSAGE  */}
              {errors?.keep_sending_until_update && (
                <label className="label h-7">
                  <span className="label-text-alt text-error">{errors?.keep_sending_until_update}</span>
                </label>
              )}
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
              {isPendingSubmit ? <ButtonSpinner /> : id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </CheckPermission>
    );
  }
}
