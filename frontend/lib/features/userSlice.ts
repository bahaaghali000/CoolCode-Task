import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  token: string;
  user: any;
}

const initialState: UserState = {
  token: "",
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: any) => {
      state.user = action.payload;
    },
  },
});

export const { setToken, setUser } = userSlice.actions;

export default userSlice.reducer;
