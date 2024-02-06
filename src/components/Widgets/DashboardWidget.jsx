// Widget.js

import React from "react";
import { useDrag } from "react-dnd";
import { formatRole } from "../../utils/formatRole";

const DashboardWidget = ({ id, content, item, onDrop, isDragAble = true }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { ...item, widget_order: item.widget_order }, // Include widget_order in the item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={isDragAble ? drag : null}
      className={`cursor-move h-[100px] bg-base-300 flex justify-center items-center font-bold rounded-xl border-primary-content border-2 p-5  ${
        isDragging ? "border-dashed opacity-70 border-primary" : ""
      }`}
      data-widget-id={id}
    >
      {formatRole(item?.widget_name)}
    </div>
  );
};

export default DashboardWidget;
