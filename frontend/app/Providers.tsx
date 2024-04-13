"use client";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import ProtectRoute from "./ProtectRoute";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ProtectRoute>{children}</ProtectRoute>
    </Provider>
  );
}
