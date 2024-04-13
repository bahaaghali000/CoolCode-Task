import Image from "next/image";
import React from "react";
import SearchInput from "./common/SearchInput";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setToken, setUser } from "@/lib/features/userSlice";
import Link from "next/link";
import Loader from "./Loader";

interface Props {
  showMenu: boolean;
  setShowMenu: (e: boolean) => void;
  setSearch: (e: string) => void;
}

const Header: React.FC<Props> = ({ showMenu, setShowMenu, setSearch }) => {
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("coolcodeToken");
    localStorage.removeItem("coolcodeUser");

    dispatch(setToken(""));
    dispatch(setUser(undefined));
  };
  return (
    <div className="max-sm:px-1 px-10 flex justify-between items-center">
      <SearchInput setSearch={setSearch} />

      <div className=" relative">
        {user.avatarUrl ? (
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
        ) : (
          <Loader />
        )}
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
  );
};

export default Header;
