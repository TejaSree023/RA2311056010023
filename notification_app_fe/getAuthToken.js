import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
let env = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
}

const clientID = env.VITE_LOG_SERVICE_CLIENT_ID || process.env.VITE_LOG_SERVICE_CLIENT_ID;
const clientSecret = env.VITE_LOG_SERVICE_CLIENT_SECRET || process.env.VITE_LOG_SERVICE_CLIENT_SECRET;
const baseUrl = env.VITE_LOG_API_BASE_URL || process.env.VITE_LOG_API_BASE_URL || "http://20.207.122.201";

if (!clientID || !clientSecret) {
  console.error("\n❌ Missing credentials in .env file.\n");
  console.error("Add these to notification_app_fe/.env:");
  console.error("  VITE_LOG_SERVICE_CLIENT_ID=<your_client_id>");
  console.error("  VITE_LOG_SERVICE_CLIENT_SECRET=<your_client_secret>");
  console.error("\nYou get these from POST /evaluation-service/register\n");
  process.exit(1);
}

const url = `${baseUrl}/evaluation-service/auth`;

// Auth endpoint requires these fields based on docs
const payload = {
  email: "kk2856@srmist.edu.in",
  name: "tejasree",
  rollNo: "ra23110560023",
  accessCode: "QkbpxH",
  clientID,
  clientSecret
};

console.log(`\n📡 Requesting token from ${url}`);
console.log(`   Using clientID: ${clientID.substring(0, 8)}...\n`);

const responsePromise = fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

responsePromise
  .then(async (response) => {
    const body = await response.text();
    
    if (!response.ok) {
      console.error(`❌ Failed to get auth token (${response.status})`);
      console.error(`   Response: ${body}\n`);
      process.exit(1);
    }

    try {
      const json = JSON.parse(body);
      const token = json.access_token || json.token || json.accessToken;
      
      if (!token) {
        console.error("❌ Token response did not include access_token:");
        console.error(json);
        process.exit(1);
      }

      console.log("✅ Token generated successfully!\n");
      console.log("📝 Add this to notification_app_fe/.env:\n");
      console.log(`VITE_LOG_SERVICE_TOKEN=${token}\n`);
      console.log("Then refresh your browser to start logging.\n");
    } catch (parseError) {
      console.error("❌ Failed to parse response as JSON:", parseError.message);
      console.error(`   Response: ${body}\n`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Network error:", error.message);
    console.error(`   Make sure the test server is running at ${baseUrl}\n`);
    process.exit(1);
  });

