import React, { useRef, useEffect, useState } from "react";

export const OutsideClickHandler = ({
  children,
  onOutsideClick,
  className,
  style,
  onClick,
}) => {
  const wrapperRef = useRef(null);
  const [isInside, setIsInside] = useState(true);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsInside(false);
      onOutsideClick();
    }
  };

  const handleInside = () => {
    setIsInside(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect will run once when the component mounts

  return (
    <div
      onClick={onClick}
      style={style}
      className={className}
      ref={wrapperRef}
      onMouseEnter={handleInside}
    >
      {children}
    </div>
  );
};
