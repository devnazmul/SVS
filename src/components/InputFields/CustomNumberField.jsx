import React, { useEffect, useRef } from "react";

export default function CustomNumberField({
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
  disable,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    };

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener("wheel", handleWheel, { passive: false });
      inputElement.addEventListener("keydown", handleKeyDown, {
        passive: false,
      });

      return () => {
        inputElement.removeEventListener("wheel", handleWheel);
        inputElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);
  return (
    <div className={`${wrapperClassName} `}>
      {/* LABEL */}
      <label htmlFor={id} className="label">
        <span className={`label-text text-md font-bold`}>
          {label}{" "}
          {required && <span className="text-error font-bold text-md">*</span>}
        </span>
      </label>
      {/* FIELD  */}
      <input
        disabled={disable}
        id={id}
        value={value}
        defaultValue={defaultValue}
        type={"number"}
        name={name}
        min={min}
        max={max}
        placeholder={`${placeholder}${required ? "*" : ""}`}
        className={`bg-base-300 ${
          disable && "px-1"
        } input focus:outline-primary input-bordered ${fieldClassName}`}
        onChange={onChange}
        ref={inputRef}
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
