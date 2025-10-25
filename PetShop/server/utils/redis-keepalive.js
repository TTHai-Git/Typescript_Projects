import redis from "./redis.js";

setInterval(() => {
  redis.ping().catch(() => {});
}, 30000); // 30 seconds
