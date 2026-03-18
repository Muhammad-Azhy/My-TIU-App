import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  role: null, // null = not logged in (guest)
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 🔹 replaces setUserRole
    setRole: (state, action) => {
      console.log("SET ROLE:", action.payload);
      state.role = action.payload;
    },

    setUserData: (state, action) => {
      state.data = action.payload;
    },

    setUser: (state, action) => {
      state.data = action.payload;
      state.role = action.payload?.role || "student";
    },

    // 🔹 replaces clearUser
    clearUser: (state) => {
      state.role = null;
      state.data = null;
    },
  },
});

export const { setRole, setUserData, setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
