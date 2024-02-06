// Widget.js

import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { formatRole } from "../../utils/formatRole";
import Headings from "../Headings/Headings";

const DashboardWidgetWithContent = ({
  filter,
  id,
  content,
  item,
  onDrop,
  isDragAble = true,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { ...item, colIndex: item.colIndex }, // Include colIndex in the item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [colors, setColors] = useState({
    employees: "bg-[#4286f4]",
    employee_on_holiday: "bg-[#4286f4]",
    pending_approval_leaves: "bg-[#FF0099]",
    progress_leaves: "bg-[#8E2DE2]",
    approved_leaves: "bg-[#99f2c8]",
    rejected_leaves: "bg-[#f953c6]",
    open_roles: "bg-[#c31432]",
    upcoming_passport_expiries: "bg-[#f12711]",
    upcoming_visa_expiries: "bg-[#6be585]",
    upcoming_sponsorship_expiries: "bg-[#eaafc8]",
    unassigned_sponsorships: "bg-[#654ea3]",
    assigned_sponsorships: "bg-[#1E9600]",
    visa_applied_sponsorships: "bg-[#00B4DB]",
    visa_rejected_sponsorships: "bg-[#a17fe0]",
    visa_grantes_sponsorships: "bg-[#3c1053]",
    withdrawal_sponsorships: "bg-[#a8c0ff]",
  });

  return (
    <div
      ref={isDragAble ? drag : null}
      className={`h-full rounded-xl border-primary-content border-2 p-5 shadow ${
        isDragging
          ? "border-dashed opacity-50 border-primary"
          : "shadow-lg shadow-primary-content"
      }`}
      data-widget-id={id}
    >
      <div className={`flex justify-between items-center`}>
        <Headings className={`text-primary`} level={5}>
          {formatRole(item?.widget_name)}
        </Headings>
        <span className={`text-xs text-gray-500`}>
          Total <span>{item?.total_data_count || 0}</span>
        </span>
      </div>
      <div className={`mt-2`}>
        <div className={`flex flex-col`}>
          {filter === "today" && (
            <span className={`flex flex-col`}>
              <span className={``}>Today</span>
              <span className={`text-5xl`}>{item?.today_data_count || 0}</span>
            </span>
          )}
          {filter === "last_week" && (
            <span className={`flex flex-col`}>
              <span className={``}>Last Week</span>
              <span className={`text-5xl`}>
                {item?.previous_week_data_count || 0}
              </span>
            </span>
          )}
          {filter === "this_week" && (
            <span className={`flex flex-col`}>
              <span className={``}> This week</span>
              <span className={`text-5xl`}>
                {item?.this_week_data_count || 0}
              </span>
            </span>
          )}
          {filter === "next_week" && (
            <span className={`flex flex-col`}>
              <span className={``}> Next week</span>
              <span className={`text-5xl`}>
                {item?.next_week_data_count || 0}
              </span>
            </span>
          )}

          {filter === "last_month" && (
            <span className={`flex flex-col`}>
              <span className={``}>Last month</span>
              <span className={`text-5xl`}>
                {item?.previous_month_data_count || 0}
              </span>
            </span>
          )}
          {filter === "this_month" && (
            <span className={`flex flex-col`}>
              <span className={``}>This month</span>
              <span className={`text-5xl`}>
                {item?.this_month_data_count || 0}
              </span>
            </span>
          )}
          {filter === "next_month" && (
            <span className={`flex flex-col`}>
              <span className={``}>Next month</span>
              <span className={`text-5xl`}>
                {item?.next_month_data_count || 0}
              </span>
            </span>
          )}
        </div>
        {/* EXPIRED DATA  */}
        {item?.expires_in_15_days ||
        item?.expires_in_30_days ||
        item?.expires_in_60_days ? (
          <div className={`flex text-xs flex-col mt-5`}>
            <div>
              <span>Expired</span>
            </div>
            <div className={`grid grid-cols-3`}>
              <span className={`flex flex-col justify-center items-center`}>
                <span>In 15 Days</span>{" "}
                <span>{item?.expires_in_15_days || 0}</span>
              </span>
              <span className={`flex flex-col justify-center items-center`}>
                <span>In 30 Days</span>{" "}
                <span>{item?.expires_in_30_days || 0}</span>
              </span>
              <span className={`flex flex-col justify-center items-center`}>
                <span>In 60 Days</span>
                <span>{item?.expires_in_60_days || 0}</span>
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default DashboardWidgetWithContent;
