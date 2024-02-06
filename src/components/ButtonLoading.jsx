import React from "react";

export default function ButtonLoading({ classNames }) {
  return (
    <span
      className={`loading loading-spinner text-primary loading-md ${classNames}`}
    ></span>
  );
}
