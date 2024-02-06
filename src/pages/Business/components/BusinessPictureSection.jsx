import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import CustomToaster from "../../../components/CustomToaster";
import toast from "react-hot-toast";
import {
  toggleBusinessActiveDeactive,
  uploadBusinessImage,
} from "../../../apis/userAndBusiness/business";
import Swal from "sweetalert2";
import {
  updateSingleUserWithBusiness,
  uploadUserProfile,
} from "../../../apis/userAndBusiness/user";
import { getFullImageLink } from "../../../utils/getFullImageLink";

export default function BusinessPictureSection({
  formDataForBusiness,
  setFormDataForBusiness,
  formDataForUser,
  setFormDataForUser,
  formDataForBusinessTiming,
}) {
  const [errorsForUser, setErrorsForUser] = useState({});
  const [errorsForBusiness, setErrorsForBusiness] = useState({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCover, setIsLoadingCover] = useState(false);

  //   TOGGLE ACTIVE DE-ACTIVE
  const [isToggleLoading, setIsToggleLoading] = useState({
    id: null,
    status: false,
  });
  const toggleFunc = (id) => {
    Swal.fire({
      title: "Are you want to change the status?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        title: "text-primary",
        container: "",
        popup: "bg-base-300 shadow-xl rounded-xl border border-primary",
        icon: "text-red-500",
        cancelButton: "bg-green-500",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsToggleLoading({
          id: id,
          status: true,
        });
        toggleBusinessActiveDeactive(id)
          .then((res) => {
            if (formDataForBusiness?.is_active) {
              setFormDataForBusiness({ ...formDataForBusiness, is_active: 0 });
            } else {
              setFormDataForBusiness({ ...formDataForBusiness, is_active: 1 });
            }
            Swal.fire({
              title: "Done!",
              text: "Status changed successfully.",
              icon: "success",
            });
            setIsToggleLoading({
              id: null,
              status: true,
            });
          })
          .catch((error) => {
            console.log({ error });
            setIsToggleLoading({
              id: null,
              status: true,
            });
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
    });
  };

  const handleToggleActivation = (id) => {
    toggleFunc(id);
  };

  return (
    <div>
      <div className="w-full relative">
        {/* COVER PHOTO  */}
        {/* COVER PHOTO INPUT FIELD  */}
        <input
          className="hidden"
          id="business_cover"
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={(e) => {
            setIsLoadingCover(true);
            uploadBusinessImage(e.target.files[0])
              .then((res) => {
                updateSingleUserWithBusiness({
                  user: formDataForUser,
                  business: {
                    ...formDataForBusiness,
                    background_image: res?.full_location,
                  },
                  times: formDataForBusinessTiming,
                })
                  .then((res2) => {
                    console.log({ res2 });
                    setFormDataForBusiness(res2?.business);
                    setIsLoadingCover(false);
                  })
                  .catch((error) => {
                    console.log({ error });
                    toast.custom((t) => (
                      <CustomToaster
                        t={t}
                        type={"error"}
                        text={`ID: #00119 - ${error?.response?.data?.message}`}
                        errors={error?.response?.data?.errors}
                      />
                    ));
                    setIsLoadingCover(false);
                  });
              })
              .catch((error) => {
                setIsLoadingCover(false);
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
          }}
        />
        <label
          htmlFor="business_cover"
          className="rounded-xl overflow-hidden flex shadow-xl shadow-primary-content justify-center items-center h-[200px] md:h-[400px] cursor-pointer bg-base-300 border-primary"
        >
          {isLoadingCover ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading-spinner loading text-primary"></span>
            </div>
          ) : formDataForBusiness?.background_image ? (
            <img
              className="w-full h-full object-cover"
              src={getFullImageLink(formDataForBusiness?.background_image)}
              alt={formDataForBusiness?.name}
            />
          ) : (
            <FaCamera className="text-3xl text-primary" />
          )}
        </label>

        {/* PROFILE PIC  */}
        {/* PROFILE PIC INPUT FIELD  */}
        <input
          className="hidden"
          id="business_profile"
          type="file"
          accept="image/jpeg,image/png, image/jpg"
          onChange={(e) => {
            setIsLoadingProfile(true);
            uploadBusinessImage(e.target.files[0])
              .then((res) => {
                updateSingleUserWithBusiness({
                  user: formDataForUser,
                  business: {
                    ...formDataForBusiness,
                    logo: res?.full_location,
                  },
                  times: [
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 0,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 0,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 1,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 1,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 2,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 0,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 3,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 0,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 4,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 0,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 5,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 0,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                    {
                      business_id: 1,
                      created_at: "18-01-2024",
                      day: 6,
                      end_at: "18:00:00",
                      id: 1,
                      is_weekend: 0,
                      start_at: "09:00:00",
                      updated_at: "18-01-2024",
                    },
                  ],
                })
                  .then((res2) => {
                    console.log({ res2 });
                    setFormDataForBusiness(res2?.business);
                    setIsLoadingProfile(false);
                  })
                  .catch((error) => {
                    console.log({ error });
                    toast.custom((t) => (
                      <CustomToaster
                        t={t}
                        type={"error"}
                        text={`ID: #00119 - ${error?.response?.data?.message}`}
                        errors={error?.response?.data?.errors}
                      />
                    ));
                    setIsLoadingProfile(false);
                  });
                console.log({ res });
              })
              .catch((error) => {
                setIsLoadingProfile(false);
                toast.custom((t) => (
                  <CustomToaster
                    t={t}
                    type={"error"}
                    text={`ID: #00119 - ${error?.response?.data?.message}`}
                    errors={error?.response?.data?.errors}
                  />
                ));
                console.log({ error });
              });
          }}
        />
        <label
          htmlFor="business_profile"
          className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 shadow-xl shadow-primary-content bg-base-300 rounded-full cursor-pointer w-[120px] h-[120px] md:w-[180px] md:h-[180px] p-1 md:p-2 flex justify-center items-center border-2 md:border-4 border-primary"
        >
          {isLoadingProfile ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading-spinner loading text-primary"></span>
            </div>
          ) : formDataForBusiness?.logo ? (
            <img
              className="w-full h-full rounded-full overflow-hidden object-cover"
              src={getFullImageLink(formDataForBusiness?.logo)}
              alt={formDataForBusiness?.name}
            />
          ) : (
            <FaCamera className="text-3xl text-primary" />
          )}
        </label>
      </div>
      <div className="mt-20 md:mt-24 text-center">
        <h1 className="text-2xl font-medium">{formDataForBusiness?.name}</h1>

        {/* STATUS  */}
        <div className="mt-2">
          {parseInt(formDataForBusiness?.is_active) === 1 ? (
            <button
              onClick={() => handleToggleActivation(formDataForBusiness?.id)}
              disabled={
                isToggleLoading.status &&
                isToggleLoading.id === formDataForBusiness?.id
              }
              className="text-base-300 bg-success shadow-md shadow-success px-5 py-1 rounded-full"
            >
              {isToggleLoading.status &&
              isToggleLoading.id === formDataForBusiness?.id ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Active"
              )}
            </button>
          ) : (
            <button
              onClick={() => handleToggleActivation(formDataForBusiness?.id)}
              disabled={
                isToggleLoading.status &&
                isToggleLoading.id === formDataForBusiness?.id
              }
              className="text-base-300 bg-error shadow-md shadow-error  px-5 py-1 rounded-full"
            >
              {isToggleLoading.status &&
              isToggleLoading.id === formDataForBusiness?.id ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "De-active"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
