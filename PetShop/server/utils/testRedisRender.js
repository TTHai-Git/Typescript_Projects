import redis from "../config/redisRender.config.js";

export const testRedisRender = async () => {
  await redis.set("ping", "pong", "ex", 10);
  const value = await redis.get("ping");
  console.log("✅ Redis Render value init:", value);
  // await getRedisClient.quit();
};
