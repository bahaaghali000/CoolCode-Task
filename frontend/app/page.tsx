"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Tasks from "./components/Tasks";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTasks, setToken, setUser } from "@/lib/features/userSlice";
import Loader from "./components/Loader";
import Link from "next/link";
import { IoIosAdd } from "react-icons/io";
import SearchInput from "./components/common/SearchInput";
import toast from "react-hot-toast";

const Home = () => {
  const [userTasks, setUserTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const [status, setStatus] = useState();
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useAppDispatch();

  const { token, user } = useAppSelector((state) => state.user);

  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      dispatch(setTasks(data));
      setUserTasks(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // debounce
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(async () => {
      if (search || status || category) {
        const res = await fetch(
          `http://localhost:5000/api/v1/tasks/?search=${search}${
            category ? "&category=" + category : ""
          }${status ? "&status=" + status : ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        dispatch(setTasks(data));
        setUserTasks(data);
        setLoading(false);
      } else {
        fetchTasks();
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search, status, category]);

  const handleLogout = () => {
    localStorage.removeItem("coolcodeToken");
    localStorage.removeItem("coolcodeUser");

    dispatch(setToken(""));
    dispatch(setUser(undefined));
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token]);

  return (
    <section className=" max-sm:py-1 py-4 min-h-screen px-5">
      <div className="max-sm:px-1 px-10 flex justify-between items-center">
        <SearchInput setSearch={setSearch} />

        <div className=" relative">
          <button
            className="overflow-hidden cursor-pointer active:scale-95 "
            onClick={() => setShowMenu(!showMenu)}
          >
            <Image
              src={user?.avatarUrl}
              alt={user?.fullname}
              className="rounded-full border border-blue-700 "
              width={40}
              height={40}
            />
          </button>
          {showMenu && (
            <div className=" absolute top-12 right-2 shadow-lg bg-white px-4 py-3 rounded-lg">
              <Link href="/profile" className=" hover:text-gray-500">
                Profile
              </Link>
              <h4
                className=" hover:text-gray-500 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </h4>
            </div>
          )}
        </div>
      </div>

      <div className=" max-sm:px-2 px-10 flex max-sm:flex-wrap justify-between items-center mt-5">
        <h2 className=" font-bold text-xl">DashBoard</h2>
        <div className="flex items-center gap-2">
          <select
            className="px-2 py-1 rounded-md focus:ring-2 outline-none  focus:ring-indigo-600 "
            onChange={(e: any) => setStatus(e.target.value)}
          >
            <option value="">none</option>
            <option value="DONE">Done</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>

          <select
            className="px-2 py-1 rounded-md focus:ring-2 outline-none  focus:ring-indigo-600 "
            onChange={(e: any) => setCategory(e.target.value)}
          >
            <option value="">all</option>
            <option value="work">work</option>
            <option value="personal">personal</option>
            <option value="shopping">shopping</option>
          </select>

          <Link href="/tasks/add">
            <IoIosAdd className="text-2xl  text-black" />
          </Link>
        </div>
      </div>

      <div className=" flex mt-7 justify-center gap-[24px]">
        {loading ? <Loader /> : <Tasks tasks={userTasks} />}
      </div>
    </section>
  );
};

export default Home;
