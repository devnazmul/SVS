import React from "react";

export default function PathLeft({ data }) {
  console.log({ data });
  return (
    <div className="w-full px-2 md:px-5 py-2 ">
      <div>
        <h2 className="text-primary font-semibold">Created At:</h2>
        <p className="text-xs md:text-sm">{data?.created_at}</p>
        {data?.created_at !== data?.updated_at ? (
          <>
            <h2 className="text-primary font-semibold">Updated At:</h2>
            <p className="text-xs md:text-sm">{data?.updated_at}</p>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
