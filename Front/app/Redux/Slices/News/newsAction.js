import { createAsyncThunk } from "@reduxjs/toolkit";
import { guestApi, adminApi } from "../../../services/api.js";
import { getApiErrorMessage } from "../../../utils/apiErrors.js";

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (_, thunkAPI) => {
    try {
      const res = await guestApi.news();
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to fetch news"),
      );
    }
  },
);

export const createNews = createAsyncThunk(
  "news/createNews",
  async (newsData, thunkAPI) => {
    try {
      const res = await adminApi.createNews(newsData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to create news"),
      );
    }
  },
);
