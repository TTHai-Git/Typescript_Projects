import Notification from "../models/notification.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);

    // clear cache data of notifications
    await clearCacheByKeyword("notifications");

    return res
      .status(201)
      .json({ doc: notif, message: "Notification created successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 5;
  const page = parseInt(req.query.page) || 1;
  const userId = req.params.userId;
  console.log("userId", userId);

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const cacheKey = `GET:/v1/notifications/user/${userId}?page=${page}&limit=${perPage}`;

  try {
    const result = await getOrSetCachedData(cacheKey, async () => {
      // --- Fetch from MongoDB if cache miss ---
      const notifs = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);

      const count = await Notification.countDocuments({ user: userId });

      return {
        notifs,
        currentPage: page,
        totalPages: Math.ceil(count / perPage),
        total: count,
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Mark a notification as read
export const markANotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const checkNotif = await Notification.findById(notificationId);
    if (!checkNotif) {
      return res.status(404).json({ error: "Notificaiton not found" });
    }
    if (checkNotif.isRead) {
      return res
        .status(200)
        .json({ message: "Notification already marked as read" });
    }
    const notif = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    // clear cache data of notifications
    await clearCacheByKeyword("notifications");

    return res
      .status(200)
      .json({ message: "Notification marked as read", notif });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
