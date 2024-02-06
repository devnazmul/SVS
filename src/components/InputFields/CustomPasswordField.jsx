import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function CustomPasswordField({
  id,
  label,
  required = false,
  name,
  value,
  placeholder,
  onChange,
  error,
  defaultValue,
  wrapperClassName,
  fieldClassName,
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className={`${wrapperClassName}`}>
      {/* LABEL */}
      <label htmlFor={id} className="label">
        <span className="label-text text-md font-bold">
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>
      <div className={`w-full relative`}>
        {isVisible ? (
          <AiOutlineEyeInvisible
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            className="absolute right-3 text-xl top-1/2 -translate-y-1/2"
          />
        ) : (
          <AiOutlineEye
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            className="absolute right-3 text-xl top-1/2 -translate-y-1/2"
          />
        )}
        <input
          id={id}
          required
          onChange={onChange}
          type={isVisible ? "text" : "password"}
          defaultValue={defaultValue}
          value={value}
          name={name}
          placeholder={`${placeholder}${required && "*"}`}
          className={`bg-base-300  focus:outline-primary input rounded-md input-bordered ${fieldClassName}`}
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
