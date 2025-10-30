import { Router } from "express";
import { flushAll, flushDb } from "../controllers/redis.js";

const redisRouters = Router();
redisRouters.get("/flush-db", flushDb);
redisRouters.get("/flush-all", flushAll);

export default redisRouters;
