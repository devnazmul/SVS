import React, { useEffect, useState } from "react";
import { FaPassport } from "react-icons/fa";
import { IoDocumentAttach, IoDocumentText } from "react-icons/io5";
import { LuHeartHandshake } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { encryptID } from "../../../../../../utils/encryptAndDecryptID";

export default function ImmigrationDetailsMenu({ id, tab, subTab }) {
  const navigate = useNavigate();
  return (
    <div className="mb-5 w-full">
      {/* FOR DESKTOP  */}
      <div className="mt-1 w-full flex justify-center items-center gap-5">
        <button
          data-tip="COS Detail"
          className={`${
            subTab !== "cos"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-16 md:w-44 tooltip tooltip-bottom tooltip-primary flex items-center gap-2 justify-center`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=${tab}&sub_tab=cos`);
          }}
        >
          <LuHeartHandshake className={`text-xl md:text-lg`} />{" "}
          <span className={`hidden md:inline`}>COS Details</span>
        </button>
        <button
          data-tip="Passport Details"
          className={`${
            subTab !== "passport"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-16 md:w-44 tooltip tooltip-bottom tooltip-primary flex items-center gap-2 justify-center`}
          onClick={() => {
            navigate(
              `/employee/view/${encryptID(id)}?tab=${tab}&sub_tab=passport`
            );
          }}
        >
          <FaPassport className={`text-xl md:text-lg`} />{" "}
          <span className={`hidden md:inline`}>Passport Details</span>
        </button>

        <button
          data-tip="Visa Details"
          className={`${
            subTab !== "visa"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-16 md:w-44 tooltip tooltip-bottom tooltip-primary flex items-center gap-2 justify-center`}
          onClick={() => {
            navigate(`/employee/view/${encryptID(id)}?tab=${tab}&sub_tab=visa`);
          }}
        >
          <IoDocumentText className={`text-xl md:text-lg`} />{" "}
          <span className={`hidden md:inline`}>Visa Details</span>
        </button>
      </div>
    </div>
  );
}
