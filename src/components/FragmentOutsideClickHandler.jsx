import React, { useRef, useEffect, useState, Fragment } from "react";

export const FragmentOutsideClickHandler = ({
  children,
  onOutsideClick,
  className,
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
    <span className={className} ref={wrapperRef} onMouseEnter={handleInside}>
      {children}
    </span>
  );
};
