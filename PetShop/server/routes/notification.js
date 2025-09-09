import Route from "express";
import {
  createNotification,
  getNotifications,
  markANotificationAsRead,
} from "../controllers/notification.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const notificationRoutes = Route();

notificationRoutes.get("/", authMiddleware, getNotifications);
// notificationRoutes.get("/", getNotifications);
notificationRoutes.post("/", authMiddleware, isAdmin, createNotification);
// notificationRoutes.post("/", createNotification);
notificationRoutes.patch(
  "/:notificationId/update",
  authMiddleware,
  csrfMiddleware,
  markANotificationAsRead
);
// notificationRoutes.patch(
//   "/:notificationId/update",
//   // authMiddleware,
//   // csrfMiddleware,
//   markANotificationAsRead
// );

export default notificationRoutes;
