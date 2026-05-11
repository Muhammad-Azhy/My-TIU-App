/**
 * Turns Axios/fetch-style errors into a single user-visible string.
 */
export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data.trim();
  if (data?.message) {
    const m = data.message;
    if (Array.isArray(m)) return m.filter(Boolean).join(" ");
    if (typeof m === "string") return m;
  }
  if (error.message === "Network Error") {
    return "Network error. Check that the API server is running and the base URL in .env matches your device (localhost vs LAN IP).";
  }
  if (error.code === "ECONNABORTED") {
    return "Request timed out. The server may be down or unreachable.";
  }
  return typeof error.message === "string" && error.message
    ? error.message
    : fallback;
}
