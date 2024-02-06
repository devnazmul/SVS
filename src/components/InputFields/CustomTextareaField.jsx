import React from "react";

export default function CustomTextareaField({
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
  rows = 8,
  wrapperClassName,
  fieldClassName,
  disable,
}) {
  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      <label htmlFor={id} className="label">
        <span className={`label-text text-md font-bold`}>
          {label} {required && <sup className="text-error font-bold">*</sup>}
        </span>
      </label>
      {/* FIELD  */}
      <textarea
        disabled={disable}
        rows={rows}
        id={id}
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`bg-base-300 ${
          disable && "px-1 py-0"
        } focus:outline-primary scrollbar-thin scrollbar-thumb-primary-content input input-bordered h-52 pt-3 ${fieldClassName}`}
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
