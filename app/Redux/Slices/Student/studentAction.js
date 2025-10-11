import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStudentData = createAsyncThunk(
  "student/fetchStudentData",
  async (id) => {
    const res = await fetch(`https://api.example.com/students/${id}`);
    const data = await res.json();
    return data; // this becomes action.payload
  }
);
