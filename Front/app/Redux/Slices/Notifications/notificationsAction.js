import { createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsApi } from "../../../services/api.js";
import { getApiErrorMessage } from "../../../utils/apiErrors.js";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const res = await notificationsApi.list();
      return {
        notifications: Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : [],
        unreadCount: res.data?.unreadCount ?? 0,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to load notifications"),
      );
    }
  },
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, thunkAPI) => {
    try {
      const res = await notificationsApi.unreadCount();
      return res.data?.unreadCount ?? 0;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to load unread count"),
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, thunkAPI) => {
    try {
      const res = await notificationsApi.markRead(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to mark notification as read"),
      );
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, thunkAPI) => {
    try {
      await notificationsApi.markAllRead();
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getApiErrorMessage(err, "Failed to mark all as read"),
      );
    }
  },
);
