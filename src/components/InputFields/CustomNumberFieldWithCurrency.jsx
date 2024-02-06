import React from "react";

export default function CustomNumberFieldWithCurrency({
  id,
  label,
  required,
  name,
  type = "number",
  value,
  defaultValue,
  placeholder,
  onChange,
  error,
  min,
  max,
  wrapperClassName,
  fieldClassName,
  currency = "£",
}) {
  return (
    <div className={`${wrapperClassName} `}>
      {/* LABEL */}
      <label htmlFor={id} className="label">
        <span className="label-text text-md font-bold">
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>
      {/* FIELD  */}
      <div className="w-full flex justify-center items-center ">
        <span className="flex justify-center items-center h-[50px] w-[50px] bg-primary text-base-100 rounded-l-md">
          {currency}
        </span>
        <input
          id={id}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          type={type}
          name={name}
          min={min}
          max={max}
          placeholder={`${placeholder}${required ? "*" : ""}`}
          className={`bg-base-300  focus:outline-primary input rounded-r-md rounded-l-none focus:outline-none input-bordered ${fieldClassName}`}
        />
      </div>
      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
