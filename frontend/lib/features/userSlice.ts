import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, User } from "../interfaces";

export interface UserState {
  token: string;
  user: any;
  tasks: Task[];
}

const initialState: UserState = {
  token: "",
  user: {},
  tasks: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setUser: (state, action: any) => {
      state.user = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      // check if already exists
      const task = state.tasks.find((t) => t._id === action.payload._id);
      if (task) {
        return;
      }

      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      // check if already exists
      let task = state.tasks.find((t) => t._id === action.payload._id);
      if (!task) {
        return;
      }

      task = action.payload;
    },
    removeTask: (state, action) => {
      const index = state.tasks.indexOf(action.payload);

      state.tasks.splice(index, 1);
    },
  },
});

export const { setToken, setTasks, addTask, removeTask, updateTask, setUser } =
  userSlice.actions;

export default userSlice.reducer;
