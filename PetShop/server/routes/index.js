import express from "express";
import limiter from "../middleware/limiter.js";
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

const router = express.Router();

router.use("/", limiter, baseRoutes);

router.use(
  "/v1/api-docs",
  limiter,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true, // 🔒 Keeps tokens after reload
    },
  })
);

router.use("/v1/csrf", limiter, csrfRoutes);

router.use("/v1/auth", limiter, authRoutes);
router.use("/v1/roles", limiter, roleRoutes);
router.use("/v1/users", limiter, userRoutes);
router.use("/v1/orders", limiter, orderRoutes);
router.use("/v1/orderDetails", limiter, orderDetailsRoutes);
router.use("/v1/categories", limiter, categoryRoutes);
router.use("/v1/vendors", limiter, vendorRouter);
router.use("/v1/brands", limiter, brandRouter);
router.use("/v1/products", limiter, productRoutes);
router.use("/v1/breeds", limiter, breedRoutes);
router.use("/v1/favorites", limiter, favoriteRoutes);
router.use("/v1/comments", limiter, commentRoutes);
router.use("/v1/commentDetails", limiter, commentDetailsRoutes);
router.use("/v1/payments", limiter, paymentRoutes);
router.use(VNPayRouter);
router.use(payOSRouter);
router.use("/v1/shipments", limiter, shipmentRoutes);
router.use("/v1/vouchers", limiter, voucherRouter);
router.use("/v1/chat-bot-faq", limiter, chatBotRoutes);
router.use("/v1/notifications", limiter, notificationRoutes);
router.use("/v1/2fa", limiter, authenticate_2fa_Router);
router.use("/v1/admin", adminRouter);

export default router;
