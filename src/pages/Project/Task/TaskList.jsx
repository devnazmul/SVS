// TaskList.js

import React from "react";
import { useDrop } from "react-dnd";
import { DragAbleTask } from "./DragAbleTask";

const TaskList = ({ status, tasks, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => onDrop(item.task),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div>
      {/* STATUS NAME  */}
      <div>
        <span
          className={`mb-4 inline-flex gap-5 px-5  py-1 rounded font-bold bg-info text-base-300`}
        >
          {/* ${
            status === "pending"
              ? "bg-info text-base-300"
              : status === "progress"
              ? "bg-warning text-base-300"
              : status === "completed"
              ? "bg-success text-base-300"
              : ""
          } */}
          {status?.toUpperCase()}{" "}
          <span className={`w-5 h-5 text-info rounded-full bg-base-300`}>
            {/* ${
              status === "pending"
                ? "text-info"
                : status === "progress"
                ? "text-warning"
                : status === "completed"
                ? "text-success"
                : ""
            } */}
            {tasks[status]?.length}
          </span>
        </span>
      </div>

      <div
        ref={drop}
        className={`p-4 rounded-xl h-full border-2 min-w-[300px] bg-base-300 ${
          isOver ? `border-info` : "border-gray-300"
        }`}
      >
        {/* ${
                status === "pending"
                  ? "border-info"
                  : status === "progress"
                  ? "border-warning"
                  : status === "completed"
                  ? "border-success"
                  : ""
              } */}
        {tasks.map((task, index) => (
          <DragAbleTask status={status} key={index} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
