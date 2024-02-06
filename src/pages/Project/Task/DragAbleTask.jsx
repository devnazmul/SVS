import { useDrag } from "react-dnd";

export const DragAbleTask = ({ task, status }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-base-300 shadow-md border flex gap-2 items-center rounded ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className={`grid grid-cols-2 gap-[0.1rem] cursor-move`}>
        <span className={`w-1 h-1 rounded-full bg-base-100 block`}></span>
        <span className={`w-1 h-1 rounded-full bg-base-100 block`}></span>
        <span className={`w-1 h-1 rounded-full bg-base-100 block`}></span>
        <span className={`w-1 h-1 rounded-full bg-base-100 block`}></span>
        <span className={`w-1 h-1 rounded-full bg-base-100 block`}></span>
        <span className={`w-1 h-1 rounded-full bg-base-100 block`}></span>
      </div>
      <div className={`flex flex-col gap-2`}>
        <div className={``}>
          <span
            className={`text-xs px-2 py-[.1rem] rounded-full text-base-300 inline-block bg-info

            `}
          >
            {/* ${
              status === "pending"
                ? "bg-info"
                : status === "progress"
                ? "bg-warning"
                : status === "completed"
                ? "bg-success"
                : ""
            } */}
            {status}
          </span>
        </div>
        <div>{task?.name}</div>
      </div>
    </div>
  );
};
