"use client";
import { removeTask } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Task as TaskInterface, User } from "@/lib/interfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosMore } from "react-icons/io";
const Task = ({ task }: { task: TaskInterface }) => {
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const token = localStorage.getItem("coolcodeToken");

  const handleDelete = async () => {
    try {
      const res: any = await fetch(
        `http://localhost:5000/api/v1/tasks/${task._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 200) {
        toast.success("Task Deleted Successfully");
        dispatch(removeTask(task._id));

        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`shadow-md relative h-[210px] mb-4 p-6 rounded-[20px] bg-white cursor-pointer hover:scale-105 transition`}
    >
      <div className=" flex justify-between items-center mb-2 relative">
        <div className="flex items-center gap-2">
          <span
            style={{
              backgroundColor:
                "#" + Math.floor(Math.random() * 16777215).toString(16),
            }}
            className={`block w-2 h-2 rounded-full `}
          ></span>
          <p className=" text-[#707070] font-light text-xs">{task.category}</p>
        </div>

        <span onClick={() => setShowMenu(!showMenu)}>
          <IoIosMore className=" text-xl cursor-pointer" />
        </span>

        {showMenu && (
          <ul className=" shadow-xl z-30  bg-white px-5 py-3 rounded-md absolute top-3 right-0">
            <li className=" cursor-pointer mb-2" onClick={handleDelete}>
              Delete
            </li>
            <Link href={`tasks/${task._id}/edit`} className=" cursor-pointer">
              Edit
            </Link>
          </ul>
        )}
      </div>

      <div className="mb-4">
        <Link
          href={`/tasks/${task._id}`}
          className=" font-semibold mb-2 hover:text-gray-300"
        >
          {task.title}
        </Link>
        <p className=" text-sm">{task.description}</p>
      </div>

      {/* Members */}
      {task.members.length > 0 && (
        <div className=" absolute flex  bottom-10">
          {task.members.map((user: User): any => (
            <div
              key={user._id}
              style={{
                backgroundColor:
                  "#" + Math.floor(Math.random() * 16777215).toString(16),
              }}
              className={`rounded-full text-white  flex items-center justify-center border w-[35px] h-[35px]`}
            >
              {user && user.fullname[0].toUpperCase()}
              {user && user.fullname.split(" ")[1][0].toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;
