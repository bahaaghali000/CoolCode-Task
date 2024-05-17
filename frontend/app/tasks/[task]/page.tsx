"use client";
import { useAppSelector } from "@/lib/hooks";
import { User } from "@/lib/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = ({ params }: { params: { task: string } }) => {
  const [task, setTask] = useState<any>({});

  const { token } = useAppSelector((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${params.task}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.status === 409) {
          toast.error(data.message);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
        setTask(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    };

    fetchTask();
  }, []);
  return (
    <section>
      <div className=" w-[500px] max-sm:w-[350px] mx-auto py-10">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base text-center font-semibold leading-7 text-gray-900">
              Task
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    readOnly
                    value={task.title}
                    id="title"
                    className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Task Title"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    required
                    readOnly
                    value={task.description}
                    rows={3}
                    className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about the task.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Date
                </label>
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    name="date"
                    readOnly
                    value={task.startDate}
                    id="date"
                    className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Date
                </label>
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    name="date"
                    readOnly
                    value={task.endDate}
                    id="end-date"
                    className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block outline-none text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    value={task.category}
                    className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value={task.category}>{task.category}</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="status"
                  className="block outline-none text-sm font-medium leading-6 text-gray-900"
                >
                  Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    name="status"
                    value={task.status}
                    className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value={task.status}>{task.status}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2>Members:</h2>
            <div>
              <div className={` bg-white px-4 py-2 mt-5 rounded-lg shadow`}>
                {task?.members?.length > 0 ? (
                  task.members.map((u: User) => (
                    <div
                      key={u._id}
                      className=" relative mt-4 flex gap-3 items-center"
                    >
                      <div>
                        <Image
                          src={u.avatarUrl}
                          alt={u.fullname}
                          className=" rounded-full"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <h2>{u.fullname}</h2>
                        <p className=" text-gray-600 text-sm">@{u.username}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h2>No Members</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Page;
