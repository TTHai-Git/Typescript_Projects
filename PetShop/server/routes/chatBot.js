import { Router } from "express";
import { chatWithBotFAQ } from "../controllers/chatBot.js";
const chatBotRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Chat Bot FAQ
 *   description: API endpoints for managing Chat Bot FAQ
 */

/**
 * @swagger
 * /v1/chat-bot-faq/chat:
 *   post:
 *     summary: Chat With Bot FAQ
 *     tags: [Chat Bot FAQ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: test
 *     responses:
 *       201:
 *         description: Chat message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: string
 *                       example: Response message reply successfully
 *       400:
 *         description: Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.
 *       500:
 *         description: Internal server error
 */

chatBotRoutes.post("/chat", chatWithBotFAQ);
export default chatBotRoutes;
