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
//import auth from "../middleware/auth.js";

const router = express.Router();

// ── GET (specific routes FIRST) ──────────────────────
router.get("/:recipientId/unread-count",        getUnreadCount);
router.get("/:recipientId/unread",              getUnreadNotifications);
router.get("/:recipientId/type/:type",          getNotificationsByType);
router.get("/:recipientId",                     getUserNotifications); // wildcard LAST

// ── PATCH ─────────────────────────────────────────────
router.patch("/:notificationId/read",           markOneAsRead);
router.patch("/:recipientId/read-all",          markAllAsRead);

// ── DELETE ────────────────────────────────────────────
router.delete("/:recipientId/all",              deleteAllNotifications); // specific first
router.delete("/:notificationId",               deleteNotification);     // wildcard last

export default router;