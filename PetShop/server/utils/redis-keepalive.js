import redis from "./redis.js";

setInterval(async () => {
  try {
    await redis.ping();
  } catch (e) {
    console.log("⚠️ Redis Ping Failed:", e.message);
  }
}, 10000);
