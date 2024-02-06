import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function CustomPassWordInput({
  required = false,
  onChange,
  className,
  placeholder,
  defaultValue,
  name,
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
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
        className={className}
        required
        onChange={onChange}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        defaultValue={defaultValue}
        name={name}
      />
    </div>
  );
}
