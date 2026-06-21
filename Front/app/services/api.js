import axios from "axios";
import {
  getApiConfigDebugInfo,
  resolveApiBaseUrl,
} from "../config/apiConfig";

export { getApiErrorMessage } from "../utils/apiErrors";
export { getUploadsBaseUrl, resolveApiBaseUrl } from "../config/apiConfig";

const api = axios.create({
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

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log("[API] baseURL resolved", getApiConfigDebugInfo());
}

api.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseUrl();

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[API][REQ]", {
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
        baseURL: error?.config?.baseURL,
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
  viewStats: (contentType, contentId) =>
    api.get(`/admin/view-stats/${contentType}/${contentId}`),
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
  viewStats: (contentType, contentId) =>
    api.get(`/lecturer/view-stats/${contentType}/${contentId}`),
};

export const studentApi = {
  classes: () => api.get("/student/classes"),
  assignments: () => api.get(`/student/assignments?_t=${Date.now()}`),
  grades: () => api.get("/student/grades"),
  profile: () => api.get("/student/profile"),
  recordView: (payload) => api.post("/student/views", payload),
};

export const notificationsApi = {
  list: () => api.get("/notifications"),
  unreadCount: () => api.get("/notifications/unread-count"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
  registerToken: (payload) => api.post("/notifications/device-token", payload),
  removeToken: (token) =>
    api.delete("/notifications/device-token", { data: { token } }),
  /**
   * Send a notification to a user or role group (Admin/Lecturer).
   * @param {{ type, title, body, userId?, targetRole?, entityType?, entityId? }} payload
   */
  send: (payload) => api.post("/notifications/send", payload),
};

export default api;
