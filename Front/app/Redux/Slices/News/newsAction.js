import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch news by ID
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`https://api.example.com/news/${id}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Create a news item
export const createNews = createAsyncThunk(
  "news/createNews",
  async (newsData, thunkAPI) => {
    try {
      const res = await fetch(`https://api.example.com/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
      });

      if (!res.ok) throw new Error("Failed to create news");
      const data = await res.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
