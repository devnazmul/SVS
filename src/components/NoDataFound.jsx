import React from "react";
import Headings from "./Headings/Headings";
import GoBackButton from "./GoBackButton";

export default function NoDataFound({
  h = "h-[70vh]",
  text,
  backButton = true,
}) {
  return (
    <div className={`${h}  w-full flex justify-center items-center`}>
      <div className="flex flex-col justify-center items-center gap-5">
        <img
          className="w-[250px]"
          src={`/assets/no_data_found.svg`}
          alt={text}
        />
        <Headings level={1} className="text-center">
          {text}
        </Headings>
        {backButton ? (
          <GoBackButton
            bgColorClass={`btn-primary`}
            textColorClass={`text-base-300`}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
