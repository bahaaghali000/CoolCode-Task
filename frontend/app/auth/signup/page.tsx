"use client";
import Loader from "@/app/components/Loader";
import { setToken, setUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SignupPage = () => {
  const [isShown1, setIsShown1] = useState<boolean>(false);
  const [isShown2, setIsShown2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName =
      formData.get("first-name") + " " + formData.get("last-name");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confrimPassword = formData.get("confrim-password");

    if (password !== confrimPassword) {
      return toast.error("password doesn't match");
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: fullName,
            username,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("coolcodeToken", data.token);
        localStorage.setItem("coolcodeUser", JSON.stringify(data.user));
        dispatch(setToken(data.token));
        dispatch(setUser(data.user));
        toast.success("Account created successfully");
        router.push("/");
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" min-h-screen fixed top-0 left-0 bg-gray-200  w-full flex flex-col gap-5 justify-center items-center">
      <div className=" p-5 max-sm:w-80 w-96 bg-white rounded shadow-2xl ">
        <h1 className=" text-2xl  text-center mb-10 text-gray-900 font-bold">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-6 max-sm:gap-y-1 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3 mb-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div>
                <input
                  type="text"
                  name="first-name"
                  required
                  id="first-name"
                  className="block w-full outline-none ltr px-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3 max-sm:mb-1">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div>
                <input
                  type="text"
                  name="last-name"
                  required
                  id="last-name"
                  className="block w-full outline-none ltr px-1.5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mb-2">
              <input
                type="text"
                id="username"
                required
                minLength={3}
                maxLength={20}
                name="username"
                className={`block w-full outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-2  ring-gray-300  focus:ring-2  focus:ring-indigo-600  sm:text-sm sm:leading-6 ltr`}
              />
            </div>
          </div>

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
                id="email"
                name="email"
                required
                className={`block w-full outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-2  ring-gray-300  focus:ring-2  focus:ring-indigo-600  sm:text-sm sm:leading-6 ltr`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label
              htmlFor="password"
              className="block mt-2 text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <input
              type={isShown1 ? "text" : "password"}
              id="password"
              name="password"
              required
              minLength={8}
              maxLength={40}
              className="block w-full outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ltr"
            />
            <span
              className=" absolute bottom-[10px] right-[10px] cursor-pointer text-gray-600"
              onClick={() => setIsShown1(!isShown1)}
            >
              {isShown1 ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label
              htmlFor="confrimPassword"
              className="block mt-2 text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password
            </label>
            <input
              type={isShown2 ? "text" : "password"}
              id="confrimPassword"
              required
              minLength={8}
              maxLength={40}
              name="confrim-password"
              className="block w-full outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ltr"
            />
            <span
              className=" absolute bottom-[10px] right-[10px] cursor-pointer text-gray-600"
              onClick={() => setIsShown2(!isShown2)}
            >
              {isShown2 ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
          <div className=" mt-2 text-sm flex items-center gap-1 font-medium leading-6 text-gray-900">
            Have An Account?
            <Link
              href="/auth/login"
              className=" text-sm underline font-medium leading-6 text-indigo-600"
            >
              Login
            </Link>
          </div>
          <button
            type="submit"
            className="text-center outline-none w-full p-2 mt-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95   ring-1 text-white font-semibold  rounded-md"
          >
            {loading ? <Loader /> : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
