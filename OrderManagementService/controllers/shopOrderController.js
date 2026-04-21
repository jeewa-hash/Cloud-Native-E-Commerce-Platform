import Order from "../models/Order.js";
import { getAllowedNextStatuses } from "../utils/orderStatusFlow.js";
import { requestDeliveryAssignment } from "../services/deliveryClient.js";

export const updateShopOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const allowedNextStatuses = getAllowedNextStatuses(order.status);

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from '${order.status}' to '${status}'.`,
      });
    }

    order.status = status;
    order.timeline = [
      ...(order.timeline || []),
      {
        status,
        note: `Order status changed to ${status}`,
        at: new Date(),
      },
    ];

    let deliveryAssignment = null;

    if (status === "ready") {
      deliveryAssignment = await requestDeliveryAssignment(order);

      if (deliveryAssignment?.assigned) {
        order.deliveryAssignmentStatus = "ASSIGNED";
        order.timeline.push({
          status: "delivery-assigned",
          note: "Delivery person assigned successfully",
          at: new Date(),
        });
      } else {
        order.deliveryAssignmentStatus = "UNAVAILABLE";
        order.timeline.push({
          status: "delivery-unavailable",
          note:
            deliveryAssignment?.message ||
            "No delivery person available for this order",
          at: new Date(),
        });
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
      deliveryAssignment,
    });
  } catch (error) {
    console.error("Update shop order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};