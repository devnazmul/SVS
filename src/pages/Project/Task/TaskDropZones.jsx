// App.js

import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Headings from "../../../components/Headings/Headings";
import { getAllTasksWithoutPerPageByProject } from "../../../apis/task/task";

const TaskDropZones = () => {
  const projectId = 1;
  const initialTasks = {
    draft: [],
    pending: [],
    in_progress: [],
    in_review: [],
    cancelled: [],
    rejected: [],
    approved: [],
  };

  const [tasks, setTasks] = useState(initialTasks);

  // GETTING TASKS
  useEffect(() => {
    getAllTasksWithoutPerPageByProject(projectId).then((res) => {
      // console.log({
      //   task: Object.entries(initialTasks).map((status, value) => {
      //     tasks[status] = res.some((task) => task?.status === status);
      //   }),
      // });
      setTasks({
        draft: [],
        pending: res,
        in_progress: [],
        in_review: [],
        cancelled: [],
        rejected: [],
        approved: [],
      });
    });
  }, [projectId]);

  const handleDrop = (task, status) => {
    const updatedTasks = { ...tasks };
    const currentStatus = Object.keys(tasks).find((key) =>
      tasks[key].includes(task)
    );

    // Remove task from its current status
    updatedTasks[currentStatus] = tasks[currentStatus].filter(
      (t) => t !== task
    );

    // Check if the task already exists in the new status
    const taskAlreadyExists = updatedTasks[status].includes(task);

    // Add task to the new status only if it doesn't already exist
    if (currentStatus !== status) {
      updatedTasks[status] = [...tasks[status], task];
      setTasks(updatedTasks);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Headings className={`my-5`} level={1}>
        Tasks
      </Headings>
      <div className={`relative`}>
        <div
          className={`absolute block w-20 h-full bg-gradient-to-r from-transparent to-base-200 right-0`}
        ></div>
        <div className="innerRightShadow flex scrollbar-none overflow-x-auto overflow-y-hidden pb-20 gap-5 ">
          {Object.keys(tasks).map((status) => (
            <TaskList
              key={status}
              status={status}
              tasks={tasks[status]}
              onDrop={(task) => handleDrop(task, status)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskDropZones;
