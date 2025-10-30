import getRedisClient from "../config/redisCloud.config.js";

export const flushDb = async (req, res) => {
  try {
    await getRedisClient.flushDb();
    return res
      .status(200)
      .json({ message: "Fush Db Of Redis Cloud success ! " });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Server Error:", error });
  }
};

export const flushAll = async (req, res) => {
  try {
    await getRedisClient.flushAll();
    return res
      .status(200)
      .json({ message: "Fush All Of Redis Cloud success ! " });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Server Error:", error });
  }
};

export const getOrSetCachedData = async (key, callback, ttl = 300) => {
  const cacheData = await getRedisClient.get(key);

  if (cacheData) {
    console.log("✅ Cache hit:", key);
    return JSON.parse(cacheData);
  }

  console.log(`💾 Cache miss: ${key} → fetching from DB`);
  const freshData = await callback(); // get data from DB or API

  await getRedisClient.set(key, JSON.stringify(freshData), { EX: ttl });
  return freshData;
};

export const clearCacheByKeyword = async (req, res) => {
  try {
    let cursor = "0";
    let deletedCount = 0;

    do {
      // Object destructuring for @redis/client
      const { cursor: nextCursor, keys } = await getRedisClient.scan(cursor, {
        MATCH: `*${keyword}*`,
        COUNT: 100,
      });

      if (keys.length > 0) {
        await getRedisClient.del(...keys);
        deletedCount += keys.length;
      }

      cursor = nextCursor;
    } while (cursor !== "0");

    console.log(
      `🧹 Cleared ${deletedCount} cache keys containing "${keyword}"`
    );
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};
