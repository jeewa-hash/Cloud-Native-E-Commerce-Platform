import Notification from "../models/notificationModel.js";

export const createNotification = async (data) => {
  try {
    // We map 'orderId' from RabbitMQ to 'relatedId' in the Schema
    const notificationData = {
      ...data,
      relatedId: data.orderId || data.relatedId 
    };

    const notification = await Notification.create(notificationData);
    console.log("💾 Notification saved to DB:", notification._id);
    
    return notification; // CRITICAL: This allows Socket.io to send the data!
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    return null; 
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications = await Notification.find({ recipientId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};