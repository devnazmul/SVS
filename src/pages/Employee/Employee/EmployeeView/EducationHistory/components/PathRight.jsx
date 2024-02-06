import moment from "moment";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";

export default function PathRight({
  data,
  handleUpdate = () => {},
  handleDelete = () => {},
}) {
  console.log({ data });
  const [showingFullData, setShowingFullData] = useState(false);
  return (
    <div className="w-full px-2 md:px-5 py-2 relative">
      {/* ACTIONS  */}
      <div className={`absolute right-0 top-0 gap-4 flex items-center p-2`}>
        <button onClick={() => handleUpdate(data?.id)}>
          <RiEdit2Fill className={`text-xl text-primary`} />
        </button>
        <button onClick={() => handleDelete(data?.id)}>
          <MdDelete className={`text-xl text-red-500`} />
        </button>
      </div>

      <div>
        <h2 className="text-primary font-semibold">{data?.degree}</h2>
        <address className="text-sm">In {data?.major}</address>
        <p className="text-sm">{data?.school_name}</p>
        <p className="text-sm mb-2 font-semibold">
          {data?.is_current
            ? "Running"
            : `Graduated on ${moment(
                data?.graduation_date,
                "DD-MM-YYYY"
              ).format("MMMM, YYYY")}`}
        </p>

        {data?.address && (
          <p className="text-sm py-1">
            <span className="font-semibold">Address:</span>
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
            {data?.address}
          </p>
        )}

        <>
          {showingFullData ? (
            <>
              {data?.country && (
                <p className="text-sm py-1">
                  <span className="font-semibold">Country: </span>
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                  {data?.country}
                </p>
              )}

              {data?.achievements && (
                <p className="text-sm py-1">
                  <span className="font-semibold">Achievements:</span>
                  &ensp;&ensp;&ensp;
                  {data?.achievements}
                </p>
              )}
              {data?.description && (
                <p className="text-sm py-1">
                  <span className="font-semibold">Description: </span>
                  &ensp;&ensp;&ensp;&ensp;&ensp;
                  {data?.description}
                </p>
              )}
            </>
          ) : (
            ""
          )}
        </>

        {data?.country || data?.achievements || data?.description ? (
          <button
            onClick={() => {
              setShowingFullData(!showingFullData);
            }}
            className="text-primary text-xs"
          >
            {showingFullData ? "Show Less" : "Show More"}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
