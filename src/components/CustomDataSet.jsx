import React from "react";
import { CgMenuMotion } from "react-icons/cg";

export default function CustomDataSet({
  cols,
  setCols,
  top = false,
  bottom = true,
  left = false,
  right = false,
}) {
  const handleCheckChange = (event) => {
    const { name, checked } = event.target;

    setCols((prevCols) =>
      prevCols.map((col) =>
        col.name === name ? { ...col, show: checked } : col
      )
    );
  };
  return (
    <details
      data-tip="Dataset"
      className={`dropdown hidden md:block tooltip tooltip-primary ${
        bottom && "tooltip-bottom"
      } ${top && "tooltip-top"} ${right && "tooltip-right"} ${
        left && "tooltip-left"
      } w-10 mt-1`}
    >
      <summary className="bg-primary px-2 py-1 rounded-lg  tooltip tooltip-primary tooltip-bottom">
        {" "}
        <CgMenuMotion className="text-2xl text-base-300" />
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-200 rounded-box w-52">
        {cols.map((col, i) => (
          <li key={i}>
            <div className="flex justify-between">
              <span>{col.name.toUpperCase()}</span>
              <input
                onChange={handleCheckChange}
                type="checkbox"
                name={col?.name}
                disabled={
                  cols.filter((col) => col.show).length === 1 && col.show
                }
                className="toggle toggle-xs toggle-primary"
                defaultChecked={col?.show}
              />
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
