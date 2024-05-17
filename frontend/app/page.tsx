"use client";
import { useRouter } from "next/navigation";
import Tasks from "./components/Tasks";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTasks } from "@/lib/features/tasksSlice";
import Loader from "./components/Loader";
import FilterTasks from "./components/FilterTasks";
import Header from "./components/Header";
import { fetchTasks } from "@/lib/features/tasksSlice";

const Home = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.user);
  const { tasks, loading: isLoading, error } = useAppSelector((state) => state.tasks);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchTasks(token));
  }, [token]);

  // debounce
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(async () => {
      if (search || status || category) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/?search=${search}&category=${category}&status=${status}`,
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
        dispatch(fetchTasks(token));
        setLoading(false);
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

      <div className=" flex mt-7 justify-center items-center gap-[24px]">
        {loading ? <Loader /> : <Tasks tasks={tasks} loading={isLoading} />}
      </div>
    </section>
  );
};

export default Home;
