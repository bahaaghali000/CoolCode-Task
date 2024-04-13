"use client";
import { useRouter } from "next/navigation";
import Tasks from "./components/Tasks";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTasks } from "@/lib/features/userSlice";
import Loader from "./components/Loader";
import toast from "react-hot-toast";
import FilterTasks from "./components/FilterTasks";
import Header from "./components/Header";

const Home = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useAppDispatch();

  const { token, tasks } = useAppSelector((state) => state.user);

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
        setLoading(false);
      } else {
        fetchTasks();
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search, status, category]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token]);

  return (
    <section className=" max-sm:py-1 py-4 min-h-screen px-5">
      <Header
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setSearch={setSearch}
      />

      <FilterTasks setStatus={setStatus} setCategory={setCategory} />

      <div className=" flex mt-7 justify-center gap-[24px]">
        {loading ? <Loader /> : <Tasks tasks={tasks} />}
      </div>
    </section>
  );
};

export default Home;
