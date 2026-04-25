import axios from "axios";
import { Platform } from "react-native";

const WEB_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_WEB;
const ANDROID_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID;
const DEVICE_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_DEVICE;

const API_BASE_URL =
  Platform.OS === "web"
    ? WEB_BASE
    : Platform.OS === "android"
      ? ANDROID_BASE || DEVICE_BASE
      : DEVICE_BASE || WEB_BASE;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});
let authToken = null;

export const setApiToken = (token) => {
  authToken = token || null;
};

api.interceptors.request.use((config) => {
  console.log("[API][REQ]", {
    platform: Platform.OS,
    baseURL: config.baseURL,
    url: config.url,
    method: config.method,
  });
  // #region agent log
  fetch("http://127.0.0.1:7577/ingest/8ac24eb4-5f94-4dbf-a6b4-b2fa5097aca3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "f8db7c",
    },
    body: JSON.stringify({
      sessionId: "f8db7c",
      runId: "initial",
      hypothesisId: "H1-H4",
      location: "services/api.js:request-interceptor",
      message: "Outgoing API request",
      data: {
        platform: Platform.OS,
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        hasAuthHeader: Boolean(config.headers?.Authorization),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("[API][RES]", {
      url: response.config?.url,
      method: response.config?.method,
      status: response.status,
    });
    // #region agent log
    fetch("http://127.0.0.1:7577/ingest/8ac24eb4-5f94-4dbf-a6b4-b2fa5097aca3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "f8db7c",
      },
      body: JSON.stringify({
        sessionId: "f8db7c",
        runId: "initial",
        hypothesisId: "H2-H4",
        location: "services/api.js:response-interceptor",
        message: "API response success",
        data: {
          url: response.config?.url,
          method: response.config?.method,
          status: response.status,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return response;
  },
  (error) => {
    console.error("[API][ERR]", {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status || null,
      message: error?.message || "unknown",
    });
    // #region agent log
    fetch("http://127.0.0.1:7577/ingest/8ac24eb4-5f94-4dbf-a6b4-b2fa5097aca3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "f8db7c",
      },
      body: JSON.stringify({
        sessionId: "f8db7c",
        runId: "initial",
        hypothesisId: "H1-H3-H4",
        location: "services/api.js:response-error",
        message: "API response error",
        data: {
          url: error?.config?.url,
          method: error?.config?.method,
          status: error?.response?.status || null,
          message: error?.message || "unknown",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
};

export const guestApi = {
  departments: () => api.get("/guest/departments"),
  news: () => api.get("/guest/news"),
  announcements: () => api.get("/guest/announcements"),
};

export const adminApi = {
  dashboardStats: () => api.get("/admin/dashboard-stats"),
  users: () => api.get("/admin/users"),
  students: () => api.get("/admin/students"),
  classes: () => api.get("/admin/classes"),
  assignStudentToClass: (payload) => api.post("/admin/enrollments", payload),
  createNews: (payload) => api.post("/admin/news", payload),
  updateNews: (id, payload) => api.patch(`/admin/news/${id}`, payload),
  deleteNews: (id) => api.delete(`/admin/news/${id}`),
};

export const lecturerApi = {
  classes: () => api.get("/lecturer/classes"),
  assignments: () => api.get("/lecturer/assignments"),
  createAssignment: (formData) =>
    api.post("/lecturer/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  gradeStudent: (payload) => api.post("/lecturer/grades", payload),
  assignStudent: (payload) => api.post("/lecturer/assign-student", payload),
  createAnnouncement: (formData) =>
    api.post("/lecturer/announcements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const studentApi = {
  classes: () => api.get("/student/classes"),
  assignments: () => api.get("/student/assignments"),
  grades: () => api.get("/student/grades"),
  profile: () => api.get("/student/profile"),
};

export default api;
