import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import Datepicker from "react-tailwindcss-datepicker";

export default function CustomDatepickerField({
  id,
  label,
  required = false,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
  defaultValue,
  disable,
  wrapperClassName,
  fieldClassName,
}) {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      <label htmlFor={id} className="label">
        <span className="label-text text-md font-bold">
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>
      {/* FIELD  */}
      <ReactDatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        id={id}
        value={value}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`input bg-base-300  focus:outline-primary rounded-md input-bordered ${fieldClassName}`}
      />
      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
