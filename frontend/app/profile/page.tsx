"use client";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Tasks from "../components/Tasks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Task } from "@/lib/interfaces";

const page = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [memberTasks, setMemberTasks] = useState([]);
  const [isMyTasks, setIsMyTasks] = useState(true);

  const router = useRouter();

  const { token, user } = useAppSelector((state) => state.user);

  if (!token) {
    router.push("/auth/login");
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        const mytasks = data.filter((task: Task) => task.author === user._id);
        const membertasks = data.filter(
          (task: Task) => task.author !== user._id
        );

        setMyTasks(mytasks);
        setMemberTasks(membertasks);
        // dispatch(setTasks(data));
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    };

    user && fetchTasks();
  }, [token]);

  const handleLinkedin = async () => {
    try {
      const res = await fetch("http://localhost:5000/linkedin/scrape", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    user && (
      <section className="min-h-screen flex flex-col  justify-center items-center py-5 px-10">
        <div className=" flex flex-wrap w-full gap-10 md:gap-40  justify-center">
          <div>
            <h2 className="mb-5 font-semibold">Profile Picture</h2>
            <Image
              src={user.avatarUrl}
              alt={user.fullname}
              className=" rounded-full"
              width={100}
              height={100}
            />

            <button
              onClick={handleLinkedin}
              className=" p-3 bg-indigo-500 mt-4 rounded-lg text-white font-semibold active:scale-95"
            >
              Linkedin{" "}
            </button>
          </div>

          <div>
            <div className=" mb-4">
              <label
                htmlFor="fullname"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullname"
                  readOnly
                  type="text"
                  value={user.fullname}
                  className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className=" mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  readOnly
                  type="text"
                  value={user.username}
                  className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className=" mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  readOnly
                  name="email"
                  type="email"
                  value={user.email}
                  className="block px-3 outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" border-t-4 border-gray-300 w-full">
          <div className="flex gap-4 p-3 justify-center">
            <button
              className={`${isMyTasks ? "font-semibold text-indigo-600" : ""} `}
              onClick={() => setIsMyTasks(true)}
            >
              Tasks
            </button>
            <button
              className={` ${
                !isMyTasks ? "font-semibold text-indigo-600" : ""
              } `}
              onClick={() => setIsMyTasks(false)}
            >
              Member in
            </button>
          </div>

          {isMyTasks ? (
            <Tasks tasks={myTasks} />
          ) : (
            <Tasks tasks={memberTasks} />
          )}
        </div>
      </section>
    )
  );
};

export default page;
