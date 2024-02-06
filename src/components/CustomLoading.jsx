// ===========================================
// #00137
// ===========================================
import React from "react";

export default function CustomLoading({ h = "h-[80vh]" }) {
  return (
    <div
      className={`${h} w-full flex justify-center items-center bg-transparent`}
    >
      <span className="loading loading-spinner text-primary loading-lg"></span>
    </div>
  );
}
