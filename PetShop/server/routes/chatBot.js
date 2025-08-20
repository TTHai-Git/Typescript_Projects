import { Router } from "express";
import { chatWithBotFAQ } from "../controllers/chatBot.js";
const chatBotRoutes = Router();
chatBotRoutes.post("/chat", chatWithBotFAQ);
export default chatBotRoutes;
