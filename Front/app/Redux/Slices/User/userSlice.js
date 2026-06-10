import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  role: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 🔹 replaces setUserRole
    setRole: (state, action) => {
      // console.log("SET ROLE:", action.payload);
      state.role = action.payload;
    },

    setUserData: (state, action) => {
      state.data = action.payload;
    },

    setUser: (state, action) => {
      state.data = action.payload?.user || null;
      state.role = action.payload?.user?.role?.toLowerCase() || null;
      state.token = action.payload?.token || null;
      state.error = null;
    },

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
    },

    // 🔹 replaces clearUser
    clearUser: (state) => {
      state.role = null;
      state.data = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRole,
  setUserData,
  setUser,
  setAuthLoading,
  setAuthError,
  clearUser,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
