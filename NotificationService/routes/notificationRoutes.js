import express from "express";
import {
  getUserNotifications,
  getUnreadCount,
  getUnreadNotifications,
  getNotificationsByType,
  markOneAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// GET
router.get("/:recipientId",                       getUserNotifications);
router.get("/:recipientId/unread-count",          getUnreadCount);
router.get("/:recipientId/unread",                getUnreadNotifications);
router.get("/:recipientId/type/:type",            getNotificationsByType);

// PATCH
router.patch("/:notificationId/read",             markOneAsRead);
router.patch("/:recipientId/read-all",            markAllAsRead);

// DELETE
router.delete("/:notificationId",                 deleteNotification);
router.delete("/:recipientId/all",                deleteAllNotifications);

export default router;