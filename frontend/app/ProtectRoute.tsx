"use client";
import { setToken, setUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect } from "react";

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem("coolcodeToken") || "";
    const user: any = JSON.parse(localStorage.getItem("coolcodeUser")!) || {};

    if (token) dispatch(setToken(token));
    if (user) dispatch(setUser(user));
  }, []);

  return <>{children}</>;
};

export default ProtectRoute;
