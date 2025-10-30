import Redis from "ioredis";
import "./dotenv.config.js"; // loads .env

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false, // required for Render Redis
  },
  keepAlive: 30000, // ping TCP mỗi 30s để tránh idle reset
  connectTimeout: 5000, // tránh treo kết nối
  maxRetriesPerRequest: 1, // tránh retry vô hạn gây timeout từ frontend

  retryStrategy(times) {
    return Math.min(times * 200, 2000); // reconnect mềm, không spam
  },
});

redis.on("connect", () => console.log("✅ Redis Server Render was connected"));
redis.on("error", (err) =>
  console.error("❌  Redis Server Render error:", err)
);

export default redis;
