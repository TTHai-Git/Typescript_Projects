import { Router } from "express";
import { flushAll, flushDb } from "../controllers/redis.js";

const redisRouters = Router();

if (process.env.REACT_APP_NODE_ENV === "development") {
  redisRouters.get("/flush-db", flushDb);
  redisRouters.get("/flush-all", flushAll);
}

export default redisRouters;
