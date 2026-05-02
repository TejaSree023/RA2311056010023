# Notification Logging App

This workspace contains a reusable frontend logging middleware and a simple React app built for the evaluation.

## Structure

- `logging_middleware/`
  - `logMiddleware.js`: reusable logging function that POSTs to `/evaluation-service/logs`
- `notification_app_fe/`
  - React + Vite frontend
  - logs button clicks, API calls, and errors
  - calls the notification API on button click
- `notification_system_design.md`
  - system design and log flow documentation

## Setup

### 1. Register on Test Server

Make a POST request to:
```
POST http://20.207.122.201/evaluation-service/register
```

**Request Body:**
```json
{
  "email": "your.email@srmist.edu.in",
  "name": "Your Full Name",
  "mobileNo": "9999999999",
  "githubUsername": "your_github_handle",
  "rollNo": "RA1911001010101",
  "accessCode": "QkbpxH"
}
```

**Response (save these values):**
```json
{
  "email": "your.email@srmist.edu.in",
  "name": "Your Full Name",
  "rollNo": "RA1911001010101",
  "accessCode": "QkbpxH",
  "clientID": "d5cbb699-6a27-44a5-8d59-8b1bef...",
  "clientSecret": "tVJaaaBSexCrXeM"
}
```

⚠️ **Important:** You can only register once. Save `clientID` and `clientSecret`—you cannot retrieve them again.

### 2. Add Credentials to `.env`

Copy `notification_app_fe/.env.example` to `notification_app_fe/.env`:

```dotenv
VITE_LOG_SERVICE_CLIENT_ID=d5cbb699-6a27-44a5-8d59-8b1bef...
VITE_LOG_SERVICE_CLIENT_SECRET=tVJaaaBSexCrXeM
VITE_LOG_SERVICE_TOKEN=
VITE_LOG_API_BASE_URL=http://20.207.122.201
VITE_NOTIFICATION_API_BASE_URL=http://20.207.122.201
```

### 3. Generate Access Token

From `notification_app_fe` folder, run:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
node.exe getAuthToken.js
```

This calls `POST /evaluation-service/auth` and prints your `access_token`. Copy it into `.env`:

```dotenv
VITE_LOG_SERVICE_TOKEN=eyJhbGc...long_token_string...
```

### 4. Install & Run

From `notification_app_fe` folder:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
npm.cmd install
npm.cmd run dev
```

Open: **http://localhost:5173**

### 5. Test the App

1. Click **Fetch Notifications** button
2. Open DevTools (F12) → Network tab
3. You should see:
   - ✅ `POST /evaluation-service/logs` (your logs)
   - ✅ `GET /evaluation-service/notifications` (API response)
   - Notification data displayed on the page

## Logging contract

Use `Log(stack, level, package, message)` with:

- `stack`: `frontend`
- `level`: `debug`, `info`, `warn`, `error`, `fatal`
- `package`: `api`, `component`, `hook`, `page`, `state`, `style`
- `message`: text message

## Demonstrated logs

- Button click: `Button clicked`
- API call: `Fetching data`
- Error: `Something failed`
- State startup: `Auth token loaded into middleware`
