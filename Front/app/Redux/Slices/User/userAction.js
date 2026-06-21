import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../../services/api.js";
import { getApiErrorMessage } from "../../../utils/apiErrors.js";

/**
 * Fetch the enriched user profile from /auth/me.
 * Returns the full user object including department, gpa, semester.
 */
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const res = await authApi.me();
      return res.data?.user || null;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to load profile"),
      );
    }
  },
);
