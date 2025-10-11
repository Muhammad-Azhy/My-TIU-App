import { createSlice } from "@reduxjs/toolkit";
import Types from "../../Types.json";

const initialState = {
  data: null,
  role: "guest",
};

const userSlice = createSlice({
  name: "user",

  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearUser: (state, action) => {
      state.role = "guest";
      state.data = null;
    },
  },
});

export const { setRole, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
