import React from "react";

export default function CustomField({
  pattern = "",
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
  disable = false,
  wrapperClassName,
  fieldClassName,
  onBlur = () => {},
}) {
  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      {label && (
        <label htmlFor={id} className="label">
          <span className={`label-text text-md font-bold`}>
            {label}{" "}
            {label && required && !disable && (
              <span className="text-error font-bold text-md">*</span>
            )}
          </span>
        </label>
      )}

      {/* FIELD  */}
      <input
        pattern={pattern}
        disabled={disable}
        id={id}
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        onBlur={onBlur}
        defaultValue={defaultValue}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`input bg-base-300 ${
          disable && "px-1 py-0"
        }  focus:outline-primary rounded-md input-bordered ${fieldClassName}`}
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
