import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";

export default function PathRight({
  data,
  handleUpdate = () => {},
  handleDelete = () => {},
}) {
  const [showingFullData, setShowingFullData] = useState(false);
  return (
    <div className="w-full px-2 md:px-5 py-2 relative">
      <div className={`absolute right-0 top-0 gap-4 flex items-center p-2`}>
        <button onClick={() => handleUpdate(data?.id)}>
          <RiEdit2Fill className={`text-xl text-primary`} />
        </button>
        <button onClick={() => handleDelete(data?.id)}>
          <MdDelete className={`text-xl text-red-500`} />
        </button>
      </div>
      <div>
        <h2 className="text-primary font-semibold">{data?.job_title}</h2>
        <address className="text-sm mb-2">
          {data?.company_name} ({data?.responsibilities})
        </address>

        {data?.company_name && (
          <p className="text-sm py-1">
            <span className="font-semibold">Company: </span>
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
            {data?.company_name}
          </p>
        )}

        {data?.responsibilities && (
          <p className="text-sm py-1">
            <span className="font-semibold">Designation:</span>
            &ensp;&ensp;&ensp;&ensp;
            {data?.responsibilities}
          </p>
        )}
        {showingFullData ? (
          <>
            {data?.salary && (
              <p className="text-sm py-1">
                <span className="font-semibold">Salary: </span>
                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; £{" "}
                {data?.salary}
              </p>
            )}
            {data?.supervisor_name && (
              <p className="text-sm py-1">
                <span className="font-semibold">Supervisor:</span>
                &ensp;&ensp;&ensp;&ensp;&ensp;
                {data?.supervisor_name}
              </p>
            )}
            {data?.achievements && (
              <p className="text-sm py-1">
                <span className="font-semibold">Achievements:</span>
                &ensp;&ensp;
                {data?.achievements}
              </p>
            )}
            {data?.contact_information && (
              <p className="text-sm py-1">
                <span className="font-semibold">Contact: </span>
                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                {data?.contact_information}
              </p>
            )}
            {data?.work_location && (
              <p className="text-sm py-1">
                <span className="font-semibold">Location:</span>
                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                {data?.work_location}
              </p>
            )}
          </>
        ) : (
          <></>
        )}
        {data?.salary ||
        data?.supervisor_name ||
        data?.achievements ||
        data?.contact_information ||
        data?.work_location ? (
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
