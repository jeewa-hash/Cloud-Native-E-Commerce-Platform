import Notification from "../models/notificationModel.js";

// ─── INTERNAL (used by RabbitMQ consumer) ────────────────────────────────────

export const createNotification = async (data) => {
  try {
    const notificationData = {
      ...data,
      relatedId: data.orderId || data.relatedId,
    };
    const notification = await Notification.create(notificationData);
    console.log("💾 Notification saved to DB:", notification._id);
    return notification;
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    return null;
  }
};

// ─── GET ─────────────────────────────────────────────────────────────────────

// GET /api/notifications/:recipientId
// Get all notifications for a user or shop, newest first
export const getUserNotifications = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications = await Notification.find({ recipientId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notifications/:recipientId/unread-count
// Returns just the unread number — used by the bell badge
export const getUnreadCount = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const count = await Notification.countDocuments({
      recipientId,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notifications/:recipientId/unread
// Get only unread notifications
export const getUnreadNotifications = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications = await Notification.find({
      recipientId,
      isRead: false,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notifications/:recipientId/type/:type
// Get notifications filtered by type e.g. ORDER_CREATED
export const getNotificationsByType = async (req, res) => {
  try {
    const { recipientId, type } = req.params;
    const notifications = await Notification.find({ recipientId, type })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PATCH ───────────────────────────────────────────────────────────────────

// PATCH /api/notifications/:notificationId/read
// Mark a single notification as read
export const markOneAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/notifications/:recipientId/read-all
// Mark all notifications as read for a recipient
export const markAllAsRead = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const result = await Notification.updateMany(
      { recipientId, isRead: false },
      { isRead: true }
    );
    res.json({
      message: "All notifications marked as read",
      updated: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

// DELETE /api/notifications/:notificationId
// Delete a single notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notifications/:recipientId/all
// Delete all notifications for a recipient
export const deleteAllNotifications = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const result = await Notification.deleteMany({ recipientId });
    res.json({
      message: "All notifications deleted",
      deleted: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};