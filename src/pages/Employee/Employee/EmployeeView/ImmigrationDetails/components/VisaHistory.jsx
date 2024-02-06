import { tr } from "date-fns/locale";
import Headings from "../../../../../../components/Headings/Headings";
import NoDataFound from "../../../../../../components/NoDataFound";
import { IoDocumentTextOutline } from "react-icons/io5";
import { getFullImageLink } from "../../../../../../utils/getFullImageLink";
import CustomPopup from "../../../../../../components/CustomPopup";
import FileViewer from "../../../../../../components/FileViewer";
import { useState } from "react";
import CreateAndUpdateVisaHistory from "./CreateAndUpdateVisaHistory";
import { RiEdit2Fill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import moment from "moment";

export default function VisaHistory({ data, setIsUpdate, userId }) {
  console.log({ data, userId });

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

  // HANDLE VIEW FILES
  const handleViewFiles = (files) => {
    setPopupOption({
      open: true,
      type: "viewFiles",
      title: "View Files",
      files: files,
      onClose: () => {
        setPopupOption({ ...popupOption, open: false });
      },
      id: null,
      closeOnDocumentClick: false,
    });
  };

  // HANDLE UPDATE
  const handleUpdate = (id) => {
    setPopupOption({
      open: true,
      type: "edit",
      title: "Update Visa Details",
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

  // HANDLE ADD
  const handleAdd = () => {
    setPopupOption({
      open: true,
      type: "add",
      title: "Add Visa Details",
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
              <CreateAndUpdateVisaHistory
                userId={userId}
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
              <CreateAndUpdateVisaHistory
                userId={userId}
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

            {popupOption?.type === "viewFiles" && (
              <FileViewer
                files={popupOption?.files}
                handleClosePopup={() => {
                  setPopupOption({
                    open: false,
                    type: "",
                    id: null,
                    userId: null,
                    files: [],
                    onClose: () => {
                      setPopupOption({ ...popupOption, open: false });
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
        <h2 className="text-xl font-bold">Visa History</h2>
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
            <div>
              <h1 className={`font-semibold mt-5`}>Current History</h1>
              {/* CURRENT VISA  */}
              {data
                .filter((d) => !d?.is_manual)
                .map((d, i) => (
                  <div
                    key={i}
                    className="shadow shadow-primary-content px-5 pb-5 pt-1 rounded-xl border border-primary-content mt-5  bg-base-300"
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
                        {/* BRP NUMBER & PLACE OF ISSUE  */}

                        <div className="w-full border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              BRP Number{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.BRP_number}</p>
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
                        <div className="w-full  border-b pb-2 border-primary-content">
                          <label htmlFor="address_line_1" className="label">
                            <span className="label-text text-md font-bold">
                              Issue Date{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.visa_issue_date}</p>
                        </div>

                        <div className="w-full  border-b pb-2 border-primary-content">
                          <label className="label">
                            <span className="label-text text-md font-bold">
                              Expiry{" "}
                            </span>
                          </label>
                          <p className="mx-1">{d?.visa_expiry_date}</p>
                        </div>
                      </div>

                      <div>
                        {/* DOCS  */}
                        {d?.visa_docs.length > 0 && (
                          <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-5">
                            <div className="w-full">
                              <label htmlFor="address_line_1" className="label">
                                <span className="label-text text-md font-bold">
                                  Documents{" "}
                                </span>
                              </label>
                              <table className="table">
                                <thead
                                  className={`bg-base-100 text-primary text-md`}
                                >
                                  <tr
                                    className={`border-b border-primary-content`}
                                  >
                                    <th className={`w-[90%]`}>Description</th>
                                    <th className={`w-[10%]`}>Attachment</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {d?.visa_docs.length > 0 ? (
                                    d?.visa_docs.map((document, i) => (
                                      <tr
                                        key={i}
                                        className={`border-b border-primary-content`}
                                      >
                                        <td className={`w-[90%] text-xs`}>
                                          {document?.description}
                                        </td>
                                        <td className={`w-[10%]`}>
                                          <span className="w-full flex justify-center items-center">
                                            <IoDocumentTextOutline
                                              onClick={() =>
                                                handleViewFiles([
                                                  getFullImageLink(
                                                    document?.file_name
                                                  ),
                                                ])
                                              }
                                              className="text-primary text-xl cursor-pointer"
                                            />
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <div
                                      className={`w-full flex justify-center items-center py-5`}
                                    >
                                      No data found!
                                    </div>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {data.filter((d) => d?.is_manual)?.length > 0 && (
            <div>
              <h1 className={`font-semibold mt-5`}>Previous History</h1>
              {/* MANUAL VISA  */}
              {data
                .filter((d) => d?.is_manual)
                .map((d, index) => (
                  <div
                    key={index}
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

                        <button onClick={() => handleUpdate(d?.id)}>
                          <RiEdit2Fill className={`text-xl text-primary`} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 md:gap-5 mt-5">
                        {/* BRP NUMBER & PLACE OF ISSUE  */}
                        <div className="grid grid-cols-1">
                          <div className="w-full">
                            <label htmlFor="address_line_1" className="label">
                              <span className="label-text text-md font-bold">
                                BRP Number{" "}
                              </span>
                            </label>
                            <p className="mx-1">{d?.BRP_number}</p>
                          </div>

                          <div className="w-full">
                            <label className="label">
                              <span className="label-text text-md font-bold">
                                Place Of Issue{" "}
                              </span>
                            </label>
                            <p className="mx-1">{d?.place_of_issue}</p>
                          </div>

                          <div className="w-full">
                            <label htmlFor="address_line_1" className="label">
                              <span className="label-text text-md font-bold">
                                Issue Date{" "}
                              </span>
                            </label>
                            <p className="mx-1">{d?.visa_issue_date}</p>
                          </div>

                          <div className="w-full">
                            <label className="label">
                              <span className="label-text text-md font-bold">
                                Expiry{" "}
                              </span>
                            </label>
                            <p className="mx-1">{d?.visa_expiry_date}</p>
                          </div>
                        </div>

                        {/* DOCS  */}
                        {d?.visa_docs.length > 0 && (
                          <div className="flex flex-col justify-between items-start gap-2 md:gap-5">
                            <div className="w-full">
                              <label htmlFor="address_line_1" className="label">
                                <span className="label-text text-md font-bold">
                                  Documents{" "}
                                </span>
                              </label>
                              <table className="table">
                                <thead
                                  className={`bg-base-100 text-primary text-md`}
                                >
                                  <tr
                                    className={`border-b border-primary-content`}
                                  >
                                    <th className={`w-[90%]`}>Description</th>
                                    <th className={`w-[10%]`}>Attachment</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {d?.visa_docs.length > 0 ? (
                                    d?.visa_docs.map((document, i) => (
                                      <tr
                                        key={i}
                                        className={`border-b border-primary-content`}
                                      >
                                        {console.log(document)}
                                        <td className={`w-[90%] text-xs`}>
                                          {document?.description}
                                        </td>
                                        <td className={`w-[10%]`}>
                                          <span className="w-full flex justify-center items-center">
                                            <IoDocumentTextOutline
                                              onClick={() =>
                                                handleViewFiles([
                                                  getFullImageLink(
                                                    document?.file_name
                                                  ),
                                                ])
                                              }
                                              className="text-primary text-xl cursor-pointer"
                                            />
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <div
                                      className={`w-full flex justify-center items-center py-5`}
                                    >
                                      No data found!
                                    </div>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
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
            text={`No Visa History Found!`}
            backButton={false}
          />
        </div>
      )}
    </div>
  );
}
