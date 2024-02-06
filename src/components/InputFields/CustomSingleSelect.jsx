import React from "react";

export default function CustomSingleSelect({
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
  options,
}) {
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
      <select
        id={id}
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`bg-base-300 focus:outline-primary input rounded-md input-bordered ${fieldClassName}`}
      >
        {options.map((opt, i) => (
          <option value={opt?.value}>{opt?.title}</option>
        ))}
      </select>
      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
