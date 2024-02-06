import React from "react";

export default function CustomSingleFileField({
  id,
  label,
  required = false,
  name,
  value,
  placeholder,
  onChange,
  error,
  // defaultValue,
  disable,
  wrapperClassName,
  fieldClassName,
  accept,
}) {
  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      <label htmlFor={id} className="label">
        <span
          className={`label-text text-md font-bold ${
            disable && "text-gray-500"
          }`}
        >
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>
      {/* FIELD  */}
      <input
        disabled={disable}
        id={id}
        onChange={onChange}
        // value={value}
        type="file"
        accept={accept}
        name={name}
        // defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className="file-input file-input-bordered file-input-primary w-full ${fieldClassName}"
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
