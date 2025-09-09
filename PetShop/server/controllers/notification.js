import Notification from "../models/notification.js";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res
      .status(201)
      .json({ doc: notif, message: "Notification created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 5;
  const page = parseInt(req.query.page) || 1;
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });
  const notifs = await Notification.find({ user: userId })
    .sort({
      createdAt: -1,
    })
    .skip(perPage * (page - 1))
    .limit(perPage);
  const count = await Notification.countDocuments({ user: userId });
  return res.status(200).json({
    notifs,
    currentPage: page,
    totalPages: Math.ceil(count / perPage),
    total: count,
  });
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
    return res
      .status(200)
      .json({ message: "Notification marked as read", notif });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
