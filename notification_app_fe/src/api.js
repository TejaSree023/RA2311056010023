import { Log } from "../../logging_middleware/logMiddleware.js";

const NOTIFICATIONS_API_BASE = import.meta.env.VITE_NOTIFICATION_API_BASE_URL?.replace(/\/\/+$/, "") || "http://20.207.122.201";
const NOTIFICATIONS_API_TOKEN = import.meta.env.VITE_NOTIFICATION_API_TOKEN;
const LOG_SERVICE_TOKEN = import.meta.env.VITE_LOG_SERVICE_TOKEN;

export async function fetchNotificationData() {
  Log("frontend", "info", "api", "Fetching data");

  const url = `${NOTIFICATIONS_API_BASE}/evaluation-service/notifications?limit=5&page=1`;
  const headers = {
    "Content-Type": "application/json"
  };

  // Use notification API token if provided, otherwise fall back to log service token
  const token = NOTIFICATIONS_API_TOKEN || LOG_SERVICE_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetch failed");
  }

  return response.json();
}
