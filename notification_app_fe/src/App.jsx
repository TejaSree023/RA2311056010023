import { useEffect, useState } from "react";
import { Log, setLogAuthToken } from "../../logging_middleware/logMiddleware.js";
import { fetchNotificationData } from "./api.js";
import "./styles.css";

function App() {
  const [message, setMessage] = useState("Click the button to fetch notifications");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const token = import.meta.env.VITE_LOG_SERVICE_TOKEN;
    if (token) {
      setLogAuthToken(token);
      Log("frontend", "debug", "state", "Auth token loaded into middleware");
    } else {
      console.warn("Missing VITE_LOG_SERVICE_TOKEN. Set it in .env.");
    }
  }, []);

  const handleClick = async () => {
    Log("frontend", "info", "component", "Button clicked");
    setStatus("loading");
    setMessage("Fetching notifications...");

    try {
      const data = await fetchNotificationData();
      const firstNotification = data.notifications?.[0];
      if (firstNotification) {
        setMessage(`Fetched notification: ${firstNotification.Message}`);
      } else {
        setMessage("Fetched notifications, but no records returned.");
      }
      setStatus("success");
    } catch (error) {
      Log("frontend", "error", "api", "Something failed");
      setMessage(`API failed: ${error.message}`);
      setStatus("error");
    }
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1>Notification App FE</h1>
        <p>Simple frontend with reusable logging middleware.</p>
        <button onClick={handleClick} className="action-button">
          Fetch Notifications
        </button>
        <div className={`status-box ${status}`}>{message}</div>
        <div className="hint">
          Logs are sent through middleware to the evaluation server.
        </div>
      </section>
    </main>
  );
}

export default App;
