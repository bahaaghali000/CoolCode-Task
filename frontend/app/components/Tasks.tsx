"use client";
import { Task as TaskInterface } from "@/lib/interfaces";
import Task from "./Task";
import Loader from "./Loader";

const Tasks = ({
  tasks,
  loading = false,
}: {
  tasks: TaskInterface[];
  loading?: boolean;
}) => {
  return (
    <div className="rounded-[10px]  relative w-full grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 grid-cols-4  gap-5 bg-[#EEF2F5] p-[24px]">
      {loading ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      ) : tasks.length > 0 ? (
        tasks.map((t: TaskInterface) => <Task key={t._id} task={t} />)
      ) : (
        <h2 className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-xl">
          No Tasks
        </h2>
      )}
    </div>
  );
};

export default Tasks;
