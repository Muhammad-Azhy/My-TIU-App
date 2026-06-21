import { createAsyncThunk } from "@reduxjs/toolkit";
import { studentApi } from "../../../services/api.js";

export const fetchStudentData = createAsyncThunk(
  "student/fetchStudentData",
  async (_, thunkAPI) => {
    try {
      const res = await studentApi.profile();
      return res.data; // this becomes action.payload
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to load student data",
      );
    }
  },
);
