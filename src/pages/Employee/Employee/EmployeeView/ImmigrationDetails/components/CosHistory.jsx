import { FiPlus } from "react-icons/fi";
import Headings from "../../../../../../components/Headings/Headings";
import NoDataFound from "../../../../../../components/NoDataFound";
import CustomPopup from "../../../../../../components/CustomPopup";
import CreateAndUpdateSponsorshipHistory from "./CreateAndUpdateSponsorshipHistory";
import { RiEdit2Fill } from "react-icons/ri";
import { useState } from "react";
import moment from "moment";

export default function CosHistory({ data, setIsUpdate, userId }) {
  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    userId: userId,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
      setIsUpdate(Math.random());
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  const handleUpdate = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Sponsorship Details",
      id: id,
      userId: userId,
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
        setIsUpdate(Math.random());
      },
      overlayStyle: { background: "red" },
      closeOnDocumentClick: false,
    });
  };

  const handleAdd = () => {
    setPopupOption({
      open: true,
      type: "add",
      title: "Add Sponsorship Details",
      id: null,
      userId: userId,
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
        setIsUpdate(Math.random());
      },
      overlayStyle: { background: "red" },
      closeOnDocumentClick: false,
    });
  };

  return (
    <div className={` h-auto`}>
      {/* POPUP  */}
      <CustomPopup
        popupClasses={`w-[70vw]`}
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        Component={
          <>
            {popupOption?.type === "add" && (
              <CreateAndUpdateSponsorshipHistory
                userId={popupOption?.userId}
                handleClosePopup={() => {
                  setPopupOption({
                    open: false,
                    type: "",
                    id: null,
                    onClose: () => {
                      setPopupOption({ ...popupOption, open: false });
                      setIsUpdate(Math.random());
                    },
                    overlayStyle: { background: "red" },
                    closeOnDocumentClick: false,
                  });
                }}
              />
            )}
            {popupOption?.type === "edit" && (
              <CreateAndUpdateSponsorshipHistory
                userId={popupOption?.userId}
                id={popupOption?.id}
                handleClosePopup={() => {
                  setPopupOption({
                    open: false,
                    type: "",
                    id: null,
                    onClose: () => {
                      setPopupOption({ ...popupOption, open: false });
                      setIsUpdate(Math.random());
                    },
                    overlayStyle: { background: "red" },
                    closeOnDocumentClick: false,
                  });
                }}
              />
            )}
          </>
        }
      />
      <div className={`flex justify-between items-center`}>
        <h2 className="text-xl font-bold">COS History</h2>
        <button
          data-tip="add new"
          className={`btn btn-primary btn-sm md:btn-md tooltip inline-flex gap-2`}
          onClick={() => handleAdd()}
        >
          <FiPlus className={`text-xl`} /> Add
        </button>
      </div>

      {data.length > 0 ? (
        <div>
          {data.filter((d) => !d?.is_manual)?.length > 0 && (
            <div className="">
              {/* CURRENT HISTORY AUTOMATICALLY ADDED  */}
              <h1 className={`font-semibold mt-5`}>Current History</h1>

              {data
                .filter((d) => !d?.is_manual)
                .map((d, i) => (
                  <div
                    key={i}
                    className="shadow shadow-primary-content px-5 pb-5 pt-1 rounded-xl border border-primary-content mt-5 bg-base-300"
                  >
                    <div>
                      <Headings level={3} className={`text-md flex gap-2 mt-5`}>
                        <span className={`text-primary`}>
                          {moment(d?.from_date, "DD-MM-YYYY").format("LL")}
                        </span>
                        <span>to</span>
                        <span className={`text-primary`}>
                          {moment(d?.to_date, "DD-MM-YYYY").format("LL")}
                        </span>
                      </Headings>

                      <div className="flex flex-col gap-2 mt-5">
                        {/* CERTIFICATE NUMBER */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Certificate Number{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.certificate_number}</p>
                        </div>

                        {/* CERTIFICATE STATUS */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Certificate Status{" "}
                            </span>
                          </label>
                          <p className="mx-1">
                            {d?.current_certificate_status}
                          </p>
                        </div>

                        {/* ASSIGN DAT */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Assigned Date{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.date_assigned}</p>
                        </div>

                        {/* EXPIRY DATE */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Expiry{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.expiry_date}</p>
                        </div>

                        {/* NOTE */}
                        <div className="w-full">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Note{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.note}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {data.filter((d) => d?.is_manual)?.length > 0 && (
            <div className="">
              {/* PREVIOUS HISTORY MANUALLY ADDED  */}
              <h1 className={`font-semibold mt-5`}>Previous History</h1>
              {data
                .filter((d) => d?.is_manual)
                .map((d, i) => (
                  <div
                    key={i}
                    className="shadow shadow-primary-content px-5 pb-5 pt-1 rounded-xl border border-primary-content mt-5  bg-base-300"
                  >
                    <div>
                      <div className={`flex justify-between items-center`}>
                        <Headings
                          level={3}
                          className={`text-md flex gap-2  mt-5`}
                        >
                          <span className={`text-primary`}>
                            {moment(d?.from_date, "DD-MM-YYYY").format("LL")}
                          </span>
                          <span>to</span>
                          <span className={`text-primary`}>
                            {moment(d?.to_date, "DD-MM-YYYY").format("LL")}
                          </span>
                        </Headings>

                        <button onClick={() => handleUpdate(d?.id)}>
                          <RiEdit2Fill className={`text-xl text-primary`} />
                        </button>
                      </div>

                      <div className="flex flex-col  gap-2 mt-5">
                        {/* CERTIFICATE NUMBER & CERTIFICATE STATUS  */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Certificate Number{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.certificate_number}</p>
                        </div>

                        <div className="w-full border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Certificate Status{" "}
                            </span>
                          </label>
                          <p className="mx-1">
                            {d?.current_certificate_status}
                          </p>
                        </div>

                        {/* ASSIGN DATE & EXPIRY DATE  */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Assigned Date{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.date_assigned}</p>
                        </div>

                        <div className="w-full border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Expiry{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.expiry_date}</p>
                        </div>

                        <div className="w-full">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Note{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.note}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full justify-center items-center">
          <NoDataFound
            h="h-[400px]"
            text={`No COS History Found!`}
            backButton={false}
          />
        </div>
      )}
    </div>
  );
}
