# Notification System Design

## Log flow from UI → middleware → server

1. User interaction triggers a UI event in `notification_app_fe/src/App.jsx`.
2. The app calls the reusable `Log(...)` middleware exported from `logging_middleware/logMiddleware.js`.
3. `Log(...)` builds a payload with the required values:
   - `stack`: `frontend`
   - `level`: one of `debug`, `info`, `warn`, `error`, `fatal`
   - `package`: one of `api`, `component`, `hook`, `page`, `state`, `style`
   - `message`: event description
4. The middleware sends a `POST` request to `/evaluation-service/logs` with `Authorization: Bearer <token>`.
5. The evaluation server receives the log entry and persists or evaluates it for monitoring.

## Why logging is useful

- Provides traceability for user actions and API behavior.
- Helps identify failures quickly by capturing errors and context.
- Supports observability during development and testing.
- Separates logging logic from UI components, making the app easier to maintain.

## What this implementation includes

- `logging_middleware/logMiddleware.js`: reusable logger middleware for frontend code.
- `notification_app_fe/src/App.jsx`: button click logs and API call logs.
- `notification_app_fe/src/api.js`: logs `Fetching data` before making an API request to `/evaluation-service/notifications`.
- Error handling logs `Something failed` when the API call throws.

## Token setup

- Register on the test server to obtain `clientID` and `clientSecret`.
- Call `POST /evaluation-service/auth` to generate `access_token`.
- Add `VITE_LOG_SERVICE_TOKEN=<access_token>` to `notification_app_fe/.env`.
- Add `VITE_LOG_API_BASE_URL=http://20.207.122.201` and `VITE_NOTIFICATION_API_BASE_URL=http://20.207.122.201`.
- Start the app with `npm run dev` and verify logs in the browser Network tab.

## How logs flow

1. UI button click triggers `App.jsx`.
2. `App.jsx` calls `Log("frontend", "info", "component", "Button clicked")`.
3. `notification_app_fe/src/api.js` calls `Log("frontend", "info", "api", "Fetching data")` before hitting the notifications API.
4. `logging_middleware/logMiddleware.js` sends the payload to `/evaluation-service/logs` with `Authorization: Bearer <token>`.
5. The server receives logs for evaluation and returns log result status.
