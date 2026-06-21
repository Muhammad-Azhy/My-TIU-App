import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile } from "./userAction.js";

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Merge enriched profile into existing data (preserves token)
          state.data = action.payload;
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        // Don't overwrite data on profile refresh failure
      });
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
