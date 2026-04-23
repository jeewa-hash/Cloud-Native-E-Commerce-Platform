import { getChannel } from "../config/rabbitmqConfig.js";
import { createNotification } from "../controllers/notificationController.js";

export const listenOrderEvents = async (app) => {
  const channel = getChannel();
  const io = app.get('socketio'); 

  const exchange = "order_events";
  const queue = "notification_queue";

  try {
    await channel.assertExchange(exchange, "fanout", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "");

    console.log(`[*] Worker listening for RabbitMQ messages in ${queue}...`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const event = JSON.parse(msg.content.toString());
          console.log(" [x] Received Full Data:", event);

          const eventType = event.type || "ORDER_CREATED";
          const shopId = event.shopId || event.restaurantId;

          if (eventType === "ORDER_CREATED") {
            console.log(`Processing Order: ${event.orderId} for Shop: ${shopId}`);

            if (shopId) {
              const shopNotify = await createNotification({
                recipientId:   shopId,
                recipientType: "RESTAURANT",
                type:          "ORDER_CREATED",
                relatedId:     event.orderId,
                title:         "New Order Received!",
                message:       `New order #${String(event.orderId).slice(-6).toUpperCase()} · $${event.totalAmount}`,

                // rich fields
                totalAmount:     event.totalAmount,
                subtotal:        event.subtotal,
                shippingFee:     event.shippingFee,
                status:          event.status,
                paymentMethod:   event.paymentMethod,
                customerId:      event.customerId,
                shop:            event.shop,
                items:           event.items,
                deliveryAddress: event.deliveryAddress,
              });

              if (shopNotify) {
                io.to(shopId).emit('notification', shopNotify);
                console.log(" [v] Success: Notification saved and emitted.");
              }
            }

            channel.ack(msg);
          }
        } catch (err) {
          console.error("❌ Error processing notification:", err.message);
        }
      }
    });
  } catch (error) {
    console.error("RabbitMQ Consumer Error:", error);
  }
};