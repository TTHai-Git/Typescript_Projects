import Redis from "ioredis";
import "../config/dotenv.config.js"; // loads .env

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false, // required for Render Redis
  },
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
