// ===========================================
// #00129
// ===========================================

import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { playAlartSound } from "../utils/playAlart";

export default function CustomToaster({
  t,
  type,
  text,
  errors = {},
  pageId = "",
}) {
  // useEffect(() => {
  //   playAlartSound();
  // }, []);

  return (
    <div
      className={`${
        type === "error" && "border-red-600 hover:border-red-500"
      } ${type === "success" && "border-green-600 hover:border-green-500"} ${
        type === "info" && "border-indigo-600 hover:border-indigo-500"
      } ${
        t.visible ? "animate-enter" : "animate-leave"
      } border max-w-md w-full bg-base-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            {type === "error" && (
              <p className="text-sm font-medium text-red-600">Oh! No</p>
            )}
            {type === "success" && (
              <p className="text-sm font-medium text-green-600">Done</p>
            )}
            {type === "info" && (
              <p className="text-sm font-medium text-indigo-600">Tips</p>
            )}
            <p className="mt-1 text-sm ">
              {type !== "error" ? (
                <>
                  {pageId} - {text}
                </>
              ) : (
                <>
                  {Object.keys(errors).length > 0 ? (
                    <>
                      <h5 className="font-semibold text-error">
                        {pageId} - There is some errors:
                      </h5>
                      <ul className="list-decimal ml-5 text-neutral">
                        {Object.keys(errors).map((field) =>
                          errors[field].map((errorMessage, index) => (
                            <li key={`${field}-${index}`}>{errorMessage}</li>
                          ))
                        )}
                      </ul>
                    </>
                  ) : (
                    <>
                      <h5 className="font-semibold text-error">
                        There is some errors:
                      </h5>
                      <ul className="list-decimal ml-5 text-neutral">{text}</ul>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <div
        className={`flex border-l ${
          type === "error" && "border-red-600 hover:border-red-500"
        } ${type === "success" && "border-green-600 hover:border-green-500"} ${
          type === "info" && "border-indigo-600 hover:border-indigo-500"
        }`}
      >
        <button
          onClick={() => toast.dismiss(t.id)}
          className={`w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium ${
            type === "error" && "text-red-600 hover:text-red-500"
          } ${type === "success" && "text-green-600 hover:text-green-500"} ${
            type === "info" && "text-indigo-600 hover:text-indigo-500"
          } focus:outline-none`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
