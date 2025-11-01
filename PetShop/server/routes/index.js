import express from "express";
import authRoutes from "./auth.js";
import roleRoutes from "./role.js";
import userRoutes from "./user.js";
import orderRoutes from "./order.js";
import orderDetailsRoutes from "./orderdetails.js";
import categoryRoutes from "./category.js";
import vendorRouter from "./vendor.js";
import brandRouter from "./brand.js";
import productRoutes from "./product.js";
import breedRoutes from "./breed.js";
import favoriteRoutes from "./favorite.js";
import commentRoutes from "./comment.js";
import commentDetailsRoutes from "./commentdetails.js";
import paymentRoutes from "./payment.js";
import VNPayRouter from "../services/vnPayPayment.js";
import payOSRouter from "../services/payOSPayment.js";
import shipmentRoutes from "./shipment.js";
import voucherRouter from "./voucher.js";
import chatBotRoutes from "./chatBot.js";
import notificationRoutes from "./notification.js";
import baseRoutes from "./base.js";
import swaggerDocs from "../config/swagger.config.js";
import swaggerUi from "swagger-ui-express";
import csrfRoutes from "./csrf.js";
import adminRouter from "./admin/index.js";
import "../config/dotenv.config.js"; // ✅ loads environment variables once
import authenticate_2fa_Router from "./2fa.js";
import oauth2Router from "./oauth2.js";
import redisRouters from "./redis.js";
import { ipRateCheck } from "../controllers/redis.js";

const router = express.Router();
// router.use("/", baseRoutes);
// router.use(
//   "/v1/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs, {
//     swaggerOptions: {
//       persistAuthorization: true, // 🔒 Keeps tokens after reload
//     },
//   })
// );
// router.use("/v1/csrf", csrfRoutes);
// router.use("/v1/auth", authRoutes);
// router.use("/v1/roles", roleRoutes);
// router.use("/v1/users", userRoutes);
// router.use("/v1/orders", orderRoutes);
// router.use("/v1/orderDetails", orderDetailsRoutes);
// router.use("/v1/categories", categoryRoutes);
// router.use("/v1/vendors", vendorRouter);
// router.use("/v1/brands", brandRouter);
// router.use("/v1/products", productRoutes);
// router.use("/v1/breeds", breedRoutes);
// router.use("/v1/favorites", favoriteRoutes);
// router.use("/v1/comments", commentRoutes);
// router.use("/v1/commentDetails", commentDetailsRoutes);
// router.use("/v1/payments", paymentRoutes);
// router.use(VNPayRouter);
// router.use(payOSRouter);
// router.use("/v1/shipments", shipmentRoutes);
// router.use("/v1/vouchers", voucherRouter);
// router.use("/v1/chat-bot-faq", chatBotRoutes);
// router.use("/v1/notifications", notificationRoutes);
// router.use("/v1/2fa", authenticate_2fa_Router);
// router.use("/v1/admin", adminRouter);
// router.use("/v1/oauth2", oauth2Router);
// router.use("/v1/redis", redisRouters);

/*
 * 🚀 Base route & API Docs
 */
router.use(
  "/",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  baseRoutes
);
router.use(
  "/v1/api-docs",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: { persistAuthorization: true },
  })
);

/*
 * 🧩 CSRF routes
 */
router.use(
  "/v1/csrf",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  csrfRoutes
);

/*
 * 🔐 Auth routes (login, register, verify, etc.)
 *  → dễ bị spam: limit thấp
 */
router.use(
  "/v1/auth",
  ipRateCheck({
    maxAttempts: 10, // 10 requests / minute
    windowSeconds: 60,
    blockSeconds: 60 * 10, // block 10 phút
  }),
  authRoutes
);

/*
 * 👥 User / Role routes (admin or private actions)
 *  → trung bình
 */
router.use(
  "/v1/users",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  userRoutes
);
router.use("/v1/roles", roleRoutes);

/*
 * 🛍️ Product, Category, Brand, Vendor → public: limit cao
 */
router.use(
  "/v1/products",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  productRoutes
);
router.use(
  "/v1/categories",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  categoryRoutes
);
router.use(
  "/v1/vendors",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  vendorRouter
);
router.use(
  "/v1/brands",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  brandRouter
);
router.use(
  "/v1/breeds",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  breedRoutes
);

/*
 * ❤️ Favorites & Comments → user interaction: giới hạn vừa phải
 */
router.use(
  "/v1/favorites",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 5,
  }),
  favoriteRoutes
);
router.use(
  "/v1/comments",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 5,
  }),
  commentRoutes
);
router.use("/v1/commentDetails", commentDetailsRoutes);

/*
 * 💳 Payments & Orders → cần bảo vệ kỹ
 */
router.use(
  "/v1/orders",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  orderRoutes
);
router.use(
  "/v1/orderDetails",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  orderDetailsRoutes
);
router.use(
  "/v1/payments",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  paymentRoutes
);
router.use(
  VNPayRouter,
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  })
);
router.use(
  payOSRouter,
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  })
);

/*
 * 🚚 Shipment & Voucher
 */
router.use(
  "/v1/shipments",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  shipmentRoutes
);
router.use(
  "/v1/vouchers",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  voucherRouter
);

/*
 * 🤖 Chatbot FAQ (public)
 */
router.use(
  "/v1/chat-bot-faq",
  ipRateCheck({
    maxAttempts: 100,
    windowSeconds: 60,
    blockSeconds: 60 * 5,
  }),
  chatBotRoutes
);

/*
 * 🔔 Notifications & 2FA
 */
router.use(
  "/v1/notifications",
  ipRateCheck({
    maxAttempts: 80,
    windowSeconds: 60,
    blockSeconds: 60 * 10,
  }),
  notificationRoutes
);
router.use(
  "/v1/2fa",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  authenticate_2fa_Router
);

/*
 * 🧑‍💻 Admin
 */
router.use(
  "/v1/admin",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 30, // block 30 phút
  }),
  adminRouter
);

/*
 * 🌐 OAuth2 & Redis test
 */
router.use(
  "/v1/oauth2",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  oauth2Router
);
router.use(
  "/v1/redis",
  ipRateCheck({
    maxAttempts: 50,
    windowSeconds: 60,
    blockSeconds: 60 * 15,
  }),
  redisRouters
);

export default router;
