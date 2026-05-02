const LOG_API_BASE = import.meta.env.VITE_LOG_API_BASE_URL?.replace(/\/\/+$/, "") || "http://20.207.122.201";
let authToken = "";

export function setLogAuthToken(token) {
  authToken = token?.trim();
}

export async function Log(stack, level, packageName, message) {
  const payload = {
    stack,
    level,
    package: packageName,
    message,
    timestamp: new Date().toISOString()
  };

  if (!authToken) {
    console.warn("[Log] missing access token; payload saved locally", payload);
    return;
  }

  const url = `${LOG_API_BASE}/evaluation-service/logs`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[Log] failed", response.status, body);
      throw new Error(`Log request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[Log] network error", error);
    throw error;
  }
}
