import React from "react";
import Headings from "../Headings/Headings";
import { IoIosAirplane } from "react-icons/io";
export default function DashboardCounterCard({
  iconContainerClass = "",
  iconClass = "",
  Ico = IoIosAirplane,
  amount = 0,
  title = "",
}) {
  return (
    <div className="px-5 py-5 rounded-xl flex  gap-2 items-center justify-start w-full bg-base-300 shadow-md">
      <div
        className={`w-16 h-16 rounded-full flex justify-center items-center ${iconContainerClass}`}
      >
        <Ico className={`text-2xl ${iconClass}`} />
      </div>
      <div className="flex flex-col  w-[calc(100%-4rem)]">
        <h1 level={1} className={`text-4xl font-medium`}>
          {amount}
        </h1>
        <p className={`sm:text-md lg:text-xl font-light`}>{title}</p>
      </div>
    </div>
  );
}
