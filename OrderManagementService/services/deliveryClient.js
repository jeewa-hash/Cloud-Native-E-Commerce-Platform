import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || "http://delivery-service-alb-1864288318.eu-north-1.elb.amazonaws.com/delivery";

export const requestDeliveryAssignment = async (order) => {
  try {
    const response = await axios.post(
      `${DELIVERY_SERVICE_URL}/delivery/internal/assign-order`,
      {
        orderId: order._id,
        zipCode: order.zipCode,
        address: order.address,
        phone: order.phone,
      },
      {
        headers: {
          "x-service-token": process.env.SERVICE_TO_SERVICE_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delivery assignment request failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      assigned: false,
      message:
        error.response?.data?.message ||
        "Failed to connect with Delivery Management Service.",
    };
  }
};