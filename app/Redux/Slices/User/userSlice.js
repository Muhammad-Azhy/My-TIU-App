import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  role: null, // start as null so we show login first
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      console.log("USER ACTION: " + action.payload);
      state.role = action.payload;
    },
    clearUser: (state) => {
      state.role = null;
      state.data = null;
    },
  },
});

export const { setRole, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
