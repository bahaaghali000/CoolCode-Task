import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./features/userSlice";
import { tasksSlice } from "./features/tasksSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    tasks: tasksSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
