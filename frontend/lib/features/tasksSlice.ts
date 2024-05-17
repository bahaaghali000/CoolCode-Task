import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../interfaces";

export const fetchTasks = createAsyncThunk(
  "/tasks/fetch",
  async (token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return data;
  }
);
interface TasksSlice {
  tasks: Task[];
  loading: boolean;
  error: string | undefined | null;
}

const initialState: TasksSlice = {
  tasks: [],
  loading: false,
  error: null,
};
export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks = action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setTasks, addTask, removeTask, updateTask } = tasksSlice.actions;

export default tasksSlice.reducer;
