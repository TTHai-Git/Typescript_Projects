import express from "express";
import initMiddlewares from "./middleware/index.js";
import handleConnectToMongoDB from "./config/mongodb.init.js";
import routes from "./routes/index.js";
import "./config/dotenv.config.js"; // ✅ loads environment variables once


const app = express();
app.set("trust proxy", 1);

// Connect DB
handleConnectToMongoDB();

// Initialize middlewares
initMiddlewares(app);

// Mount routes
app.use("/", routes);


export default app;
