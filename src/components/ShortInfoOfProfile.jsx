import React from "react";

export default function ShortInfoOfProfile({
  Icon,
  title,
  subTitle,
  titleClass,
  subTitleClass,
  iconClass,
  IconBgClass,
}) {
  return (
    <div className="inline-flex items-center gap-3 w-full">
      {/* ICON  */}
      <div
        className={`w-10 h-10  rounded-xl flex justify-center items-center ${IconBgClass}`}
      >
        <Icon className={`text-xl md:text-2xl ${iconClass}`} />
      </div>
      {/* INFO  */}
      <div className="flex flex-col gap-0 w-[calc(100%-2.5rem)]">
        <span
          className={` my-0 text-sm  text-gray-600 font-medium ${subTitleClass}`}
        >
          {subTitle}
        </span>
        <h4
          className={` my-0 text-[1rem] md:text-[1.2rem] font-semibold ${titleClass}`}
        >
          {title}
        </h4>
      </div>
    </div>
  );
}
