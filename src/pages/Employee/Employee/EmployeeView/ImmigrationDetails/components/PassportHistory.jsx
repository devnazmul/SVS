import { useState } from "react";
import CustomPopup from "../../../../../../components/CustomPopup";
import Headings from "../../../../../../components/Headings/Headings";
import NoDataFound from "../../../../../../components/NoDataFound";
import UpdatePassportHistory from "./CreateAndUpdatePassportHistory";
import { RiEdit2Fill } from "react-icons/ri";
import CreateAndUpdatePassportHistory from "./CreateAndUpdatePassportHistory";
import { FiPlus } from "react-icons/fi";
import moment from "moment";

export default function PassportHistory({ data, setIsUpdate, userId }) {
  console.log({ data });
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
      title: "Update Passport Details",
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
      title: "Add Passport Details",
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
              <CreateAndUpdatePassportHistory
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
              <CreateAndUpdatePassportHistory
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
        <h2 className="text-xl font-bold">Passport History</h2>
        <button
          data-tip="add new"
          className={`btn btn-primary btn-sm md:btn-md tooltip inline-flex gap-2`}
          onClick={() => handleAdd()}
        >
          <FiPlus className={`text-xl`} /> Add
        </button>
      </div>

      {data.length > 0 ? (
        <div className="">
          {data.filter((d) => !d?.is_manual)?.length > 0 && (
            <div>
              {/* CURRENT HISTORY AUTOMATICALLY ADDED  */}
              <h1 className={`font-semibold mt-5`}>Current History</h1>
              {data
                .filter((d) => !d?.is_manual)
                .map((d, i) => (
                  <div
                    key={i}
                    className="shadow shadow-primary-content px-5 pb-5 pt-1 rounded-xl border border-primary-content mt-5  bg-base-300"
                  >
                    <div>
                      <div className={`flex justify-between items-center`}>
                        <Headings
                          level={3}
                          className={`text-md flex gap-2 mt-5`}
                        >
                          <span className={`text-primary`}>
                            {moment(d?.from_date, "DD-MM-YYYY").format("LL")}
                          </span>
                          <span>to</span>
                          <span className={`text-primary`}>
                            {moment(d?.to_date, "DD-MM-YYYY").format("LL")}
                          </span>
                        </Headings>
                      </div>

                      <div className="flex flex-col gap-2 mt-5">
                        {/* CERTIFICATE NUMBER & CERTIFICATE STATUS  */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Passport Number{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.passport_number}</p>
                        </div>

                        <div className="w-full border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Place Of Issue{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.place_of_issue}</p>
                        </div>

                        {/* ISSUE DATE & EXPIRY DATE  */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Issue Date{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.passport_issue_date}</p>
                        </div>

                        <div className="w-full ">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Expiry{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.passport_expiry_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {data.filter((d) => d?.is_manual)?.length > 0 && (
            <div>
              {/* PREVIOUS HISTORY MANUALLY ADDED  */}
              <h1 className={`font-semibold mt-5`}>Previous History</h1>
              {data
                .filter((d) => d?.is_manual)
                .map((d, i) => (
                  <div
                    key={i}
                    className="shadow shadow-primary-content px-5 pb-5 pt-1 rounded-xl border border-primary-content mt-5 bg-base-300"
                  >
                    <div>
                      <div className={`flex justify-between items-center`}>
                        <Headings
                          level={3}
                          className={`text-md flex gap-2 mt-5`}
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

                      <div className="flex flex-col  gap-2  mt-5">
                        {/* CERTIFICATE NUMBER & CERTIFICATE STATUS  */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Passport Number{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.passport_number}</p>
                        </div>

                        <div className="w-full border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Place Of Issue{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.place_of_issue}</p>
                        </div>

                        {/* ISSUE DATE & EXPIRY DATE  */}
                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Issue Date{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.passport_issue_date}</p>
                        </div>

                        <div className="w-full">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Expiry{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.passport_expiry_date}</p>
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
            text={`No Passport History Found!`}
            backButton={false}
          />
        </div>
      )}
    </div>
  );
}
