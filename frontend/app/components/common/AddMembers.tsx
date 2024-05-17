"use client";
import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import Loader from "../Loader";
import { User } from "@/lib/interfaces";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";

const AddMembers = ({ setFormData, formData }: any) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useAppSelector((state) => state.user);

  // debounce
  useEffect(() => {
    if (!search) {
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/?search=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setUsers(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const addOrRemoveMember = (userId: string) => {
    if (formData.members.includes(userId)) {
      // remove the member
      const members = formData.members.filter(
        (member: string) => member !== userId
      );

      setFormData((prev: any) => ({
        ...prev,
        members,
      }));
    } else {
      // add the member
      setFormData((prev: any) => ({
        ...prev,
        members: [...prev.members, userId],
      }));
    }
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="">Add Members:</h2>
      <div>
        <SearchInput setSearch={setSearch} />

        <div className={` bg-white px-4 py-2 mt-5 rounded-lg shadow`}>
          {loading && (
            <div className="flex mt-5 mb-4 justify-center items-center">
              <Loader />
            </div>
          )}

          {!loading && users.length > 0 ? (
            users.map((u: User) => (
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

                {/* add or remove action */}
                <div className=" absolute right-0 top-0">
                  <button
                    type="button"
                    onClick={() => addOrRemoveMember(u._id)}
                    className={`rounded-md ${
                      formData.members.includes(u._id)
                        ? " bg-gray-600 hover:bg-gray-500"
                        : "bg-indigo-600 hover:bg-indigo-500"
                    } px-2 py-1 text-sm font-base text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  >
                    {formData.members.includes(u._id) ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h2 className=" text-center font-semibold">No Users</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
