import axios from "axios";
import { Platform } from "react-native";

export { getApiErrorMessage } from "../utils/apiErrors";

const WEB_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_WEB;
const ANDROID_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID;
const DEVICE_BASE = process.env.EXPO_PUBLIC_API_BASE_URL_DEVICE;

/** Sensible default when env is missing (common in local dev). */
const DEFAULT_DEV_BASE = "http://localhost:3000/api";

function resolveBaseUrl() {
  if (Platform.OS === "web") {
    return WEB_BASE || DEFAULT_DEV_BASE;
  }
  if (Platform.OS === "android") {
    return ANDROID_BASE || DEVICE_BASE || WEB_BASE || DEFAULT_DEV_BASE;
  }
  return DEVICE_BASE || WEB_BASE || DEFAULT_DEV_BASE;
}

const API_BASE_URL = resolveBaseUrl();

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log("[API] baseURL resolved", { platform: Platform.OS, API_BASE_URL });
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let authToken = null;

export const setApiToken = (token) => {
  authToken = token || null;
};

api.interceptors.request.use((config) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[API][REQ]", {
      platform: Platform.OS,
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
    });
  }
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[API][RES]", {
        url: response.config?.url,
        status: response.status,
      });
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error("[API][ERR]", {
        url: error?.config?.url,
        status: error?.response?.status ?? null,
        message: error?.message,
      });
    }
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
  assignments: () => api.get(`/student/assignments?_t=${Date.now()}`),
  grades: () => api.get("/student/grades"),
  profile: () => api.get("/student/profile"),
};

export default api;
