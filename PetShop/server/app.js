import express from "express";
import initMiddlewares from "./middleware/index.js";
import handleConnectToMongoDB from "./config/mongodb.init.js";
import routes from "./routes/index.js";
import "./config/dotenv.config.js"; // ✅ loads environment variables once
import redis from "./utils/redis.js";

const app = express();
app.set("trust proxy", 1);

// Connect DB
handleConnectToMongoDB();

// Initialize middlewares
initMiddlewares(app);

// ✅ TEST Redis HERE
redis.set("testKey", "Hello Redis!");
redis.get("testKey").then((value) => {
  console.log("🔍 Redis test value:", value);
});

// Mount routes
app.use("/", routes);

export default app;
