"use client";
import { setToken } from "@/lib/features/userSlice";
import { setTasks } from "@/lib/features/tasksSlice";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Loader from "@/app/components/Loader";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("coolcodeToken", data.token);
        localStorage.setItem("coolcodeUser", JSON.stringify(data.user));
        dispatch(setToken(data.token));
        dispatch(setTasks(data.user.tasks));
        router.push("/");
      }
      toast.error(data.message);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" min-h-screen fixed top-0 left-0 bg-gray-200  w-full flex flex-col gap-5 justify-center items-center">
      <div className=" p-5 max-sm:w-80 w-96 bg-white rounded shadow-2xl ">
        <h1 className=" text-2xl  text-center mb-6 text-gray-900 font-bold">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                required
                id="email"
                className={`block w-full outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-2  ring-gray-300 focus:ring-2  focus:ring-indigo-600  sm:text-sm sm:leading-6`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label
              htmlFor="password"
              className="block mt-2 text-sm font-semibold leading-6 text-gray-900"
            >
              Password
            </label>
            <input
              type={isShown ? "text" : "password"}
              name="password"
              id="password"
              required
              minLength={8}
              className="block w-full outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <span
              className=" absolute bottom-[10px] right-[10px] cursor-pointer text-gray-600"
              onClick={() => setIsShown(!isShown)}
            >
              {isShown ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>

          <button
            type="submit"
            className="text-center outline-none w-full p-2 mt-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95   ring-1 text-white font-base  rounded-md"
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </form>
        <div className=" mt-2 text-sm flex items-center gap-1 font-medium leading-6 text-gray-900">
          Don't have account
          <Link
            href="/auth/signup"
            className=" text-sm underline font-medium leading-6 text-indigo-600 hover:text-indigo-400 "
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
