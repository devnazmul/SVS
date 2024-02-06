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
        <h2 className="text-primary font-semibold">{data?.title}</h2>
        <p className="text-sm">{data?.description}</p>
        {data?.created_by && (
          <p className={`text-right`}>By {data?.created_by}</p>
        )}
      </div>
    </div>
  );
}
